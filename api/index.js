import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Health check endpoints
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Main rewrite endpoints
const handleRewrite = async (req, res) => {
    const { message, culture, tone } = req.body;

    if (!message || !culture || !tone) {
        return res.status(400).json({ error: 'Missing required fields: message, culture, tone' });
    }

    try {
        const systemPrompt = `You are a Cross-Cultural Communication Assistant. Rewrite messages to match the communication style of the target culture.

Adjust tone, politeness, directness, and formality.

Target culture: ${culture}
Tone: ${tone}

Instructions:
* Keep it professional and respectful
* Avoid stereotypes
* Be concise and practical

Output format:
Rewritten Message: [Your rewritten message]
Explanation: [Short explanation of why tone changed based on culture]
Etiquette Tip: [Short etiquette tip based on target culture]`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Rewrite the following message:\n\n${message}` }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_completion_tokens: 1024,
            top_p: 1,
            stream: false,
            stop: null
        });

        const outputText = chatCompletion.choices[0]?.message?.content || "";
        
        // Parse the response
        const rewrittenMatch = outputText.match(/Rewritten Message:\s*(.*?)(?=Explanation:|$)/is);
        const explanationMatch = outputText.match(/Explanation:\s*(.*?)(?=Etiquette Tip:|$)/is);
        const tipMatch = outputText.match(/Etiquette Tip:\s*(.*?)$/is);

        const responseData = {
            rewritten: rewrittenMatch ? rewrittenMatch[1].trim() : outputText,
            explanation: explanationMatch ? explanationMatch[1].trim() : "Explanation not provided by AI.",
            tip: tipMatch ? tipMatch[1].trim() : "Tip not provided by AI."
        };

        res.json(responseData);

    } catch (error) {
        console.error('Error in rewrite handler:', error);
        res.status(500).json({ error: 'Failed to rewrite message. Please try again.' });
    }
};

app.post('/api/rewrite', handleRewrite);
app.post('/rewrite', handleRewrite);

// For local development
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

export default app;
