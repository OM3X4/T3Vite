import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const authenticateJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Missing token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.upsert({
            where: { email: decoded.email },
            update: {
                name: decoded.user_metadata.name,
                imageUrl: decoded.user_metadata.picture
            },
            create: {
                email: decoded.email,
                name: decoded.user_metadata.name,
                imageUrl: decoded.user_metadata.picture
            }
        })
        req.user = user

        next();
    } catch (err) {
        console.log(err)
        return res.status(403).json({ message: err });
    }
};
export default authenticateJWT