import { Router } from "express";
import authenticateJWT from './middleware/AuthenticateUser.js';
import { encrypt } from "./utils/crypto.js";
import { PrismaClient } from "@prisma/client";


const router = Router();
const prisma = new PrismaClient();


router.post("/key", authenticateJWT, async (req, res) => {
    try {
        console.log(req.body.key)

        const user = req.user;
        const apiKey = encrypt(req.body.key);
        const result = await prisma.user.update({
            where: {
                email: user.email
            },
            data: {
                apiKeyHash: apiKey
            }
        })
        res.status(200).json({ message: "API key updated successfully." });
    } catch (err) {
        console.log(err, '\n')
        res.status(500).json({ error: 'Internal server error' });
    }
})

export default router;