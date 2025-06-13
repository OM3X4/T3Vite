import express from 'express';
import openaiRouter from './openai.js';
import AuthRouter from './Auth.js';
import ChatRouter from './history.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config()




const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie']
}));
app.use(cookieParser());

app.use(express.json());

app.use('/model', openaiRouter);

app.use('/auth', AuthRouter);

app.use('/', ChatRouter);


app.listen(3000, () => console.log('Server is running on port 3000'));