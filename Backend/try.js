import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: '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', // User's OpenRouter key
    baseURL: 'https://openrouter.ai/api/v1', // Route requests to OpenRouter
})

const response = await openai.chat.completions.create({
    model: 'deepseek/deepseek-r1-0528-qwen3-8b:free', // or other models available via OpenRouter
    messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Which model are you' },
    ],
})

console.log(response.choices[0].message.content)