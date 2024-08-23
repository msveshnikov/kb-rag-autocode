import "dotenv/config";
import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import { Claude } from "./services/claude.js";
import { RAG } from "./services/rag.js";
import { PromptCache } from "./services/promptCache.js";
import Database from "./services/database.js";
import { TranslationService } from "./services/translation.js";
import { ConfidenceScorer } from "./services/confidenceScorer.js";
import { AnalyticsService } from "./services/analytics.js";
import { FeedbackService } from "./services/feedback.js";
import { validateQuery, validateFeedback } from "./middleware/validation.js";
import { authenticate } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

const claude = new Claude();
const rag = new RAG();
const promptCache = new PromptCache();
const db = new Database();
const translator = new TranslationService();
const confidenceScorer = new ConfidenceScorer();
const analytics = new AnalyticsService();
const feedback = new FeedbackService();

app.post("/query", authenticate, validateQuery, async (req, res, next) => {
    try {
        const { query, language, context } = req.body;

        let translatedQuery = query;
        if (language !== "en") {
            translatedQuery = await translator.translate(query, "en");
        }

        const cachedResponse = await promptCache.get(translatedQuery);
        if (cachedResponse) {
            await analytics.trackQuery(query, cachedResponse, "cache");
            return res.json({ response: cachedResponse, source: "cache" });
        }

        const relevantInfo = await rag.retrieve(translatedQuery);
        const aiResponse = await claude.process(translatedQuery, relevantInfo, context);
        const confidenceScore = confidenceScorer.score(aiResponse);

        if (confidenceScore < 0.7) {
            return res.json({
                response: "I'm not confident in providing an answer. Please consult a human expert.",
                confidence: confidenceScore,
            });
        }

        const finalResponse = language !== "en" ? await translator.translate(aiResponse, language) : aiResponse;

        await promptCache.set(translatedQuery, finalResponse);
        await analytics.trackQuery(query, finalResponse, "ai");

        res.json({ response: finalResponse, confidence: confidenceScore, source: "ai" });
    } catch (error) {
        next(error);
    }
});

app.post("/feedback", authenticate, validateFeedback, async (req, res, next) => {
    try {
        const { queryId, rating, comment } = req.body;
        await feedback.submit(queryId, rating, comment);
        res.json({ message: "Feedback submitted successfully" });
    } catch (error) {
        next(error);
    }
});

app.get("/analytics", authenticate, async (req, res, next) => {
    try {
        const report = await analytics.generateReport();
        res.json(report);
    } catch (error) {
        next(error);
    }
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`AI-Driven Knowledge Base server running on port ${port}`);
});

export default app;
