import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config()

const ENCRYPTION_KEY = Buffer.from(process.env.KEY_HASH_SECRET, 'base64');// Must be 32 bytes (256 bits)
const IV = crypto.randomBytes(16); // Initialization vector

export function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${IV.toString('hex')}:${encrypted}`;
}

export function decrypt(encrypted) {
    const [ivHex, encryptedText] = encrypted.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
