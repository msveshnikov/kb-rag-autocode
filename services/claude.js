// services/claude.js

import fetch from "node-fetch";

export class Claude {
    constructor() {
        this.apiKey = process.env.CLAUDE_API_KEY;
        this.apiUrl = process.env.CLAUDE_API_URL;
    }

    async process(query, relevantInfo, context) {
        const prompt = this.buildPrompt(query, relevantInfo, context);

        const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                model: "claude-3.5",
                prompt: prompt,
                max_tokens_to_sample: 1000,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            throw new Error(`Claude API request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.completion;
    }

    buildPrompt(query, relevantInfo, context) {
        return `
You are an AI assistant for a large financial institution. Your task is to provide accurate and helpful information to customer service agents based on the following query, relevant information, and context. Please ensure your response is professional, compliant with financial regulations, and tailored to the specific query.

Query: ${query}

Relevant Information:
${relevantInfo}

Context:
${context}

Please provide a concise and accurate response to the query:`;
    }
}
