export class ConfidenceScorer {
    constructor() {
        this.minConfidence = 0.5;
        this.maxConfidence = 1.0;
    }

    score(response) {
        const factors = [
            this.lengthFactor(response),
            this.keywordFactor(response),
            this.uncertaintyFactor(response),
            this.coherenceFactor(response),
        ];

        const averageScore = factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
        return Math.min(Math.max(averageScore, this.minConfidence), this.maxConfidence);
    }

    lengthFactor(response) {
        const words = response.split(/\s+/).length;
        if (words < 10) return 0.5;
        if (words > 100) return 1.0;
        return 0.5 + (words - 10) / 180;
    }

    keywordFactor(response) {
        const keywords = ["specifically", "according to", "research shows", "data indicates"];
        const keywordCount = keywords.filter((keyword) => response.toLowerCase().includes(keyword)).length;
        return 0.7 + keywordCount * 0.1;
    }

    uncertaintyFactor(response) {
        const uncertainPhrases = ["may", "might", "could", "possibly", "perhaps", "Im not sure"];
        const uncertainCount = uncertainPhrases.filter((phrase) => response.toLowerCase().includes(phrase)).length;
        return 1 - uncertainCount * 0.1;
    }

    coherenceFactor(response) {
        const sentences = response.split(/[.!?]+/);
        const averageSentenceLength =
            sentences.reduce((sum, sentence) => sum + sentence.split(/\s+/).length, 0) / sentences.length;
        return averageSentenceLength > 5 && averageSentenceLength < 20 ? 0.9 : 0.7;
    }
}
