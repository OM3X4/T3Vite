import express from 'express'
import { PrismaClient } from '@prisma/client'
import authenticateJWT from './middleware/AuthenticateUser.js';
import { decrypt } from './utils/crypto.js';


const prisma = new PrismaClient();
const router = express.Router();


router.post('/new', authenticateJWT, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.user.email
            }
        })

        const chat = await prisma.chat.create({
            data: {
                userId: user.id
            }
        })

        res.status(200).json(chat.id)
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/chats', authenticateJWT, async (req, res) => {
    try {
        const user = req.user

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const chats = await prisma.chat.findMany({
            where: {
                userId: user.id
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        res.status(200).json(chats)
    } catch (e) {
        console.log(e)
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get("/chat/:chatId", authenticateJWT, async (req, res) => {
    try {
        const chatId = req.params.chatId
        const user = await prisma.user.findUnique({
            where: {
                email: req.user.email
            }
        })
        const userId = user.id
        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId
            }
        })

        if (chat.userId !== userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const messages = await prisma.message.findMany({
            where: {
                chatId: chat.id
            },
            orderBy: [
                { createdAt: 'asc' },
                { role: 'desc' }
            ]
        })

        res.status(200).json(messages)

    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }




})

router.get("/user", authenticateJWT, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            select: {
                name: true,
                imageUrl: true,
                email: true,
                createdAt: true,
                inchatname: true,
                moreinfo: true,
                job: true,
                apiKeyHash: true
            },
            where: {
                email: req.user.email
            }
        })

        // const responseOpenRouter = await fetch("https://openrouter.ai/api/v1/auth/key" , {
        //     headers: {
        //         "Authorization": `Bearer ${decrypt(user.apiKeyHash)}`,
        //         "Content-Type": "application/json"
        //     }
        // })
        // const result = await responseOpenRouter.json();

        const reponseCredit = await fetch("https://openrouter.ai/api/v1/credits", {
            headers: {
                "Authorization": `Bearer ${decrypt(user.apiKeyHash)}`,
                "Content-Type": "application/json"
            }
        })
        const resultCredit = await reponseCredit.json()
        if (resultCredit.data) {
            return res.status(200).json({
                name: user.name,
                imageUrl: user.imageUrl,
                inchatname: user.inchatname,
                email: user.email,
                createdAt: user.createdAt,
                job: user.job,
                moreinfo: user.moreinfo,
                openrouterdata: {
                    isfreetier: resultCredit.data.total_credits <= 0,
                    usage: resultCredit.data.total_usage,
                    credit: resultCredit.data.total_credits
                }
            })
        } else {
            return res.status(200).json({
                name: user.name,
                imageUrl: user.imageUrl,
                inchatname: user.inchatname,
                email: user.email,
                createdAt: user.createdAt,
                job: user.job,
                moreinfo: user.moreinfo,
                openrouterdata: {
                    isfreetier: 0,
                    usage: 0,
                    credit: 0
                }
            })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post("/user", authenticateJWT, async (req, res) => {

    if (!req.user?.email) return res.status(401).json({ error: "Unauthorized" });

    try {
        const user = await prisma.user.update({
            data: {
                inchatname: req.body.inchatname,
                moreinfo: req.body.moreinfo,
                job: req.body.job
            },
            where: {
                email: req.user.email
            }
        })
        res.status(201).json(user)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.post('/branch', authenticateJWT, async (req, res) => {
    try {
        const messageId = req.body.messageid;
        const message = await prisma.message.findUnique({
            where: {
                id: messageId
            },
            include: {
                chat: {
                    include: {
                        messages: true
                    }
                }
            }
        })

        const newChat = await prisma.chat.create({
            data: {
                isBranch: true,
                title: message.chat.title,
                userId: message.chat.userId,
                messages: {
                    createMany: {
                        data: message.chat.messages.filter(m => m.createdAt <= message.createdAt).map(m => ({ content: m.content, role: m.role, createdAt: m.createdAt }))

                    }
                }
            }
        })
        res.json({ chatid: newChat.id })

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.delete("/chat/:chatId", authenticateJWT, async (req, res) => {
    try {
        const chatId = req.params.chatId
        const user = req.user
        const userId = user.id
        const chat = await prisma.chat.findUnique({
            where: {
                id: chatId
            }
        })

        if (chat.userId !== userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        await prisma.chat.delete({
            where: {
                id: chatId
            }
        })
        res.status(200).json({ chatid: chatId });
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Internal server error' });
    }
})


export default router