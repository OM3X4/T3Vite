import { Router } from "express";
import passport from "./auth/google.js";
import { generateToken } from "./utils/jwt.js";
import authenticateJWT from './middleware/AuthenticateUser.js';
import { encrypt } from "./utils/crypto.js";
import { PrismaClient } from "@prisma/client";


const router = Router();
const prisma = new PrismaClient();

// router.get('/google', passport.authenticate('google', {
//     scope: ['profile', 'email'],
// }));

// router.get('/google/callback',
//     passport.authenticate('google', { session: false }),
//     (req, res) => {
//         const user = req.user;
//         const token = generateToken({ id: user.id, email: user.email });

//         const isProd = process.env.NODE_ENV === 'production';

//         res.cookie('token', token, {
//             httpOnly: false,
//             secure: true,
//             sameSite: "none",
//             maxAge: 7 * 24 * 60 * 60 * 1000,
//         });

//         // Optional: Redirect to your frontend (e.g. dashboard)
//         res.redirect(`${process.env.CLIENT_URL}/`);
//     }
// );


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