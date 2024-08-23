// services/feedback.js
import Database from "./database.js";
import { AnalyticsService } from "./analytics.js";

export class FeedbackService {
    constructor() {
        this.db = new Database();
        this.analytics = new AnalyticsService();
    }

    async submit(queryId, rating, comment) {
        try {
            await this.db.query("INSERT INTO feedback (query_id, rating, comment) VALUES ($1, $2, $3)", [
                queryId,
                rating,
                comment,
            ]);

            await this.analytics.trackFeedback(queryId, rating);

            if (rating < 3) {
                await this.flagForReview(queryId);
            }

            return true;
        } catch (error) {
            console.error("Error submitting feedback:", error);
            throw error;
        }
    }

    async flagForReview(queryId) {
        try {
            await this.db.query("UPDATE queries SET needs_review = true WHERE id = $1", [queryId]);
        } catch (error) {
            console.error("Error flagging query for review:", error);
            throw error;
        }
    }

    async getFeedbackStats() {
        try {
            const result = await this.db.query(`
        SELECT 
          AVG(rating) as average_rating,
          COUNT(*) as total_feedback,
          COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_feedback,
          COUNT(CASE WHEN rating < 3 THEN 1 END) as negative_feedback
        FROM feedback
      `);
            return result.rows[0];
        } catch (error) {
            console.error("Error getting feedback stats:", error);
            throw error;
        }
    }

    async getRecentFeedback(limit = 10) {
        try {
            const result = await this.db.query("SELECT * FROM feedback ORDER BY created_at DESC LIMIT $1", [limit]);
            return result.rows;
        } catch (error) {
            console.error("Error getting recent feedback:", error);
            throw error;
        }
    }

    async updateFeedback(feedbackId, newRating, newComment) {
        try {
            await this.db.query("UPDATE feedback SET rating = $1, comment = $2 WHERE id = $3", [
                newRating,
                newComment,
                feedbackId,
            ]);
            return true;
        } catch (error) {
            console.error("Error updating feedback:", error);
            throw error;
        }
    }

    async deleteFeedback(feedbackId) {
        try {
            await this.db.query("DELETE FROM feedback WHERE id = $1", [feedbackId]);
            return true;
        } catch (error) {
            console.error("Error deleting feedback:", error);
            throw error;
        }
    }
}
