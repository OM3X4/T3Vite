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

            You're chatting with someone who prefers to be called "${user.inchatname}".

            They describe what they do as: "${user.job}".

            Here's something else they wanted you to know: "${user.moreinfo}".

            Use this information to understand the user's background, personality, or interests.
            Do **not** repeat or restate this info unless it fits naturally into the conversation.
            Focus on being helpful, friendly, and context-aware.
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
            // Save to DB
            await prisma.chat.update({
                where: { id: chatId },
                data: { title }
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
            res.status(402).json({ message: 'This response requires more credits than your current plan allows. Please buy more credit from openrouter.ai to continue chat , or you might try free models' });
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
        console.log("err she bad : ", err)
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
});



export default router