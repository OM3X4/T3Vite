import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
} , async (accessToken , refreshToken , profile , done) => {
    try {
        const email = profile.emails[0].value;
        if (!email) return done(null , false);

        let user = await prisma.user.findUnique({ where: { email }});

        if(!user) {
            user = await prisma.user.create({data: {email}})
        }

        done(null , user);
    }catch(err){
        done(err , false)
    }
}))

export default passport