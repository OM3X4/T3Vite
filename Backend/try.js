// import OpenAI from 'openai'

// const openai = new OpenAI({
//     apiKey: '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', // User's OpenRouter key
//     baseURL: 'https://openrouter.ai/api/v1', // Route requests to OpenRouter
// })

// const response = await openai.chat.completions.create({
//     model: 'deepseek/deepseek-r1-0528-qwen3-8b:free', // or other models available via OpenRouter
//     messages: [
//         { role: 'system', content: 'You are a helpful assistant.' },
//         { role: 'user', content: 'Which model are you' },
//     ],
// })

// console.log(response.choices[0].message.content)

// const apiKey = "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"
// const apiKey = "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"
// const apiKey = "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"

// const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
//     headers: {
//         "Authorization": `Bearer ${apiKey}`,
//         'Content-Type': 'application/json'
//     }
// })

// if (!response.ok) {
//     const text = await response.text(); // Print the raw HTML for debugging
//     throw new Error(`Failed: ${response.status} - ${text}`);
// }

// const res = await response.json();
// console.log(res)

import { decrypt } from "./src/utils/crypto.js";
console.log(decrypt("4cfac39300d083a12924ea8899e7cee7:062f2b722f3ab8c7868d808d769a3aa6"))