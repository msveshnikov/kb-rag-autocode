// services/rag.js

import Database from "./database.js";
import fetch from "node-fetch";

export class RAG {
    constructor() {
        this.db = new Database();
        this.embeddingEndpoint = process.env.EMBEDDING_API_ENDPOINT;
        this.embeddingApiKey = process.env.EMBEDDING_API_KEY;
    }

    async retrieve(query) {
        const queryEmbedding = await this.getEmbedding(query);
        const relevantDocs = await this.db.searchSimilarDocuments(queryEmbedding);
        return this.combineDocuments(relevantDocs);
    }

    async getEmbedding(text) {
        const response = await fetch(this.embeddingEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.embeddingApiKey}`,
            },
            body: JSON.stringify({ text }),
        });

        if (!response.ok) {
            throw new Error(`Failed to get embedding: ${response.statusText}`);
        }

        const data = await response.json();
        return data.embedding;
    }

    combineDocuments(docs) {
        return docs.map((doc) => doc.content).join("\n\n");
    }

    async updateKnowledgeBase(newContent) {
        const embedding = await this.getEmbedding(newContent);
        await this.db.insertDocument(newContent, embedding);
    }

    async removeFromKnowledgeBase(contentId) {
        await this.db.removeDocument(contentId);
    }

    async getContentById(contentId) {
        return await this.db.getDocumentById(contentId);
    }

    async listAllContent() {
        return await this.db.getAllDocuments();
    }

    async searchContent(query) {
        const queryEmbedding = await this.getEmbedding(query);
        return await this.db.searchSimilarDocuments(queryEmbedding, 10);
    }
}
