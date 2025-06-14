import express from 'express';
import openaiRouter from './openai.js';
import AuthRouter from './Auth.js';
import ChatRouter from './history.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config()




const app = express();


const allowedOrigins = [
    "http://localhost:3000",
    "https://oaichat.netlify.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true, // only if you're using cookies or Authorization headers
}));
app.use(cookieParser());

app.use(express.json());

app.use('/model', openaiRouter);

app.use('/auth', AuthRouter);

app.use('/', ChatRouter);


app.listen(3000, () => console.log('Server is running on port 3000'));