import express from 'express';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { decrypt } from './utils/crypto.js';
import authenticateJWT from './middleware/AuthenticateUser.js';

const prisma = new PrismaClient();
const router = express.Router();



router.post("/", authenticateJWT, async (req, res) => {
    if (!req.query.provider || !req.query.model || !req.query.chatid) {
        return res.status(400).json({ error: 'Missing required query params.' });
    }

    const user = await prisma.user.findUnique(
        { where: { email: req.user.email } }
    )
    const NO_API_KEY_ERROR_CODE = 499


    if (!user?.apiKeyHash) {
        return res.status(NO_API_KEY_ERROR_CODE).json({ error: 'Missing encrypted API key for user.' });
    }

    const apiKey = decrypt(user.apiKeyHash)

    const model = `${req.query.provider}/${req.query.model}`
    const chatId = req.query.chatid

    const openai = new OpenAI({
        apiKey: apiKey, // User's OpenRouter key
        baseURL: 'https://openrouter.ai/api/v1', // Route requests to OpenRouter
    })

    const systemPrompt = `
            You are a helpful, conversational AI assistant called "oAI".

            ${typeof user.job == "string" ? `You're chatting with someone who prefers to be called "${user.inchatname}".` : ""}

            ${typeof user.job == "string" ? `They describe what they do as: "${user.job}".` : ""}

            ${typeof user.job == "string" ? `Here's something else they wanted you to know: "${user.moreinfo}".` : ""}

            ### Instructions:
                - Respond in clear, natural language.
                - Format replies using **Markdown** where appropriate:
                - Use \`inline code\` and fenced code blocks (\`\`\`) for technical content.
                - Use **bold**, _italics_, bullet points, and headings when helpful.
                - Keep replies visually clean and easy to read in a chat UI.
                - Never repeat the background info unless it fits **naturally**.
                - Avoid generic phrases or filler (e.g. “As an AI…”).
            `;

    const userMessages = req.body.messages

    userMessages.unshift({ role: 'system', content: systemPrompt })

    try {
        const response = await openai.chat.completions.create({
            model: model,
            messages: userMessages,
        })


        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId
            }
        })

        const systemPrompt = `You are a multilingual assistant that generates concise, relevant titles (3–7 words) for chat conversations.
        You only see the first user message.
        ⚠️ Do **not** include quotation marks, periods, or any punctuation — just the raw title text.
        Respond with the title **only**, no explanation, no extra characters.
        The title must be in the same language as the input.
        `


        if (!chat.title) {
            const firstUserMessage = userMessages.find(m => m.role === 'user')?.content;

            const titleResponse = await openai.chat.completions.create({
                model: 'mistralai/mistral-nemo:free',
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    },
                    {
                        role: 'user',
                        content: firstUserMessage,
                    },
                ],
            });

            const title = titleResponse.choices[0].message.content.trim();
            const cleanTitle = title
                .replace(/^["']|["']$/g, '')       // remove surrounding quotes
                .replace(/[.,!?;:"“”‘’]+$/g, '')   // remove trailing punctuation
                .trim();                           // remove leading/trailing spaces
            // Save to DB
            await prisma.chat.update({
                where: { id: chatId },
                data: { title: cleanTitle }
            });
        }

        const userMessage = await prisma.message.create({
            data: {
                content: userMessages.at(-1).content || '',
                role: "user",
                chatId: chatId,
            },
        });

        const assistantMessage = await prisma.message.create({
            data: {
                content: response.choices[0].message.content,
                role: "assistant",
                chatId: chatId,
            },
        });

        res.json({ message: response.choices[0].message.content , id: assistantMessage.id })
    } catch (error) {
        console.log("error : ", error)
        // Check OpenAI/OpenRouter style auth errors
        if (error.status === 401 || error.code === 401 || error.message?.includes('No auth credentials')) {
            return res.status(499).json({ error: 'Missing or invalid user API key (unauthorized)' })
        }

        if (error.status == 402) {
            return res.status(402).json({ message: 'This response requires more credits than your current plan allows. Please buy more credit from openrouter.ai to continue chat , or you might try free models' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
})


router.get("/new", authenticateJWT, async (req, res) => {
    try {
        const chat = await prisma.chat.create({
            data: {
                user: {
                    connect: {
                        email: req.user.email,
                    },
                },
            },
        });

        res.json({ chatid: chat.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});


router.post("/memorize", authenticateJWT, async (req, res) => {
    console.log("memorzing")
    try {
        const messageContent = req.body.messagecontent;


        if (!messageContent) {
            return res.status(404).json({ error: "Message not found." });
        }

        // 2. Decrypt user's OpenRouter API key
        const user = req.user;
        if (!user?.apiKeyHash) {
            return res.status(499).json({ error: "No API key found for this user." });
        }

        const apiKey = decrypt(user.apiKeyHash);

        // 3. Initialize OpenAI client
        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: "https://openrouter.ai/api/v1",
        });


        const systemPrompt = `
        You are an AI assistant tasked with maintaining a user's profile. Your job is to extract and summarize ONLY what the user has clearly stated, without making any assumptions, guesses, or inferences. Focus on extracting directly mentioned facts only.

        **Existing User Information (for context, do not repeat or contradict this):**
        ${user.moreinfo}

        ${typeof user.inchatname == "string" && user.inchatname != "" ? `The user's name is: "${user.inchatname}".` : ""}

        **Instructions:**
        From the new message, extract clear, factual details. Do not try to guess implied meanings or deduce information from context. Ignore anything that is vague, ambiguous, or merely hinted at.

        **Include only the following types of explicitly stated info:**
        - Personal Details: (e.g., "My name is Omar", "I'm 17 years old")
        - Preferences: (e.g., "I like JavaScript", "I prefer dark mode")
        - Current Context: (e.g., "I'm building a typing website")

        **DO NOT:**
        - Infer emotions or motivations unless clearly stated
        - Summarize beyond what’s written
        - Add opinions or speculative data
        - Rephrase or beautify the user's original points

        **Output Format:**
        Write a concise paragraph summarizing the clear facts from the message for storing in the user’s profile.
        `;



        const response = await openai.chat.completions.create({
            model: "deepseek/deepseek-r1-0528-qwen3-8b:free", // Default to a free model if not specified
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: messageContent
                }
            ],
            temperature: 0.1, // Using a low temperature for more predictable, factual output
        });


        const summary = response.choices?.[0]?.message?.content;
        if (!summary) {
            return res.status(500).json({ error: "LLM did not return a valid summary." });
        }

        // 5. Save the summary to `moreinfo`
        await prisma.user.update({
            where: { email: user.email },
            data: { moreinfo: `${user.moreinfo}${summary}` },
        });

        res.status(200).json({ message: "Message memorized successfully.", summary });
    } catch (err) {
        console.error("Memorize error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});



export default router