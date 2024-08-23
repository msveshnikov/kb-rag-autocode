import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class Database {
    constructor() {
        this.pool = new pg.Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        });
    }

    async query(text, params) {
        const client = await this.pool.connect();
        try {
            const result = await client.query(text, params);
            return result.rows;
        } finally {
            client.release();
        }
    }

    async getUser(username) {
        const query = "SELECT * FROM users WHERE username = $1";
        const result = await this.query(query, [username]);
        return result[0];
    }

    async createUser(username, password, role) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *";
        const result = await this.query(query, [username, hashedPassword, role]);
        return result[0];
    }

    async validateUser(username, password) {
        const user = await this.getUser(username);
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return { user, token };
        }
        return null;
    }

    async storeKnowledgeBase(content, language, category) {
        const query = "INSERT INTO knowledge_base (content, language, category) VALUES ($1, $2, $3) RETURNING *";
        const result = await this.query(query, [content, language, category]);
        return result[0];
    }

    async getKnowledgeBase(language, category) {
        const query = "SELECT * FROM knowledge_base WHERE language = $1 AND category = $2";
        return await this.query(query, [language, category]);
    }

    async updateKnowledgeBase(id, content) {
        const query = "UPDATE knowledge_base SET content = $1, updated_at = NOW() WHERE id = $2 RETURNING *";
        const result = await this.query(query, [content, id]);
        return result[0];
    }

    async storeQueryLog(query, response, source, user_id) {
        const queryText =
            "INSERT INTO query_logs (query, response, source, user_id) VALUES ($1, $2, $3, $4) RETURNING *";
        const result = await this.query(queryText, [query, response, source, user_id]);
        return result[0];
    }

    async getQueryLogs(startDate, endDate) {
        const query = "SELECT * FROM query_logs WHERE created_at BETWEEN $1 AND $2";
        return await this.query(query, [startDate, endDate]);
    }

    async storeFeedback(query_id, rating, comment) {
        const query = "INSERT INTO feedback (query_id, rating, comment) VALUES ($1, $2, $3) RETURNING *";
        const result = await this.query(query, [query_id, rating, comment]);
        return result[0];
    }

    async getFeedback(startDate, endDate) {
        const query = "SELECT * FROM feedback WHERE created_at BETWEEN $1 AND $2";
        return await this.query(query, [startDate, endDate]);
    }

    async close() {
        await this.pool.end();
    }
}

export default Database;
