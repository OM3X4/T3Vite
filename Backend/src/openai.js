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
            The platform you work inside is made by Omar Emad.

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


        if (!chat.title) {
            const firstUserMessage = userMessages.find(m => m.role === 'user')?.content;

            const titleResponse = await openai.chat.completions.create({
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a title generator. Given the user\'s first message in a chat with an AI assistant, return a short and relevant title. Only return the title. No quotes, no punctuation, no explanation.',
                    },
                    {
                        role: 'user',
                        content: `First message: "${firstUserMessage}"`,
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


        await prisma.message.createMany({
            data: [
                {
                    content: userMessages.at(-1).content || '',
                    role: "user",
                    chatId: chatId,
                },
                {
                    content: response.choices[0].message.content,
                    role: "assistant",
                    chatId: chatId,
                }
            ]
        })

        res.json({ message: response.choices[0].message.content })
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

        // 4. Get summary from LLM
        const response = await openai.chat.completions.create({
            model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
            messages: [
                { role: "system", content: "Summarize the following message in 1–2 sentences, focusing on any personal details, preferences, or context about the user that may be useful for future interactions. This summary will be stored as a reference note for remembering the user." },
                { role: "user", content: messageContent },
            ],
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