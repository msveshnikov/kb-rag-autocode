import winston from 'winston';

class AnalyticsService {
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: 'analytics-service' },
      transports: [
        new winston.transports.File({ filename: 'analytics.log' }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(new winston.transports.Console({
        format: winston.format.simple(),
      }));
    }

    this.queryStats = {
      total: 0,
      aiGenerated: 0,
      cached: 0,
      byLanguage: {},
      commonQueries: {},
    };
  }

  trackQuery(query, response, source) {
    this.queryStats.total++;
    if (source === 'ai') {
      this.queryStats.aiGenerated++;
    } else if (source === 'cache') {
      this.queryStats.cached++;
    }

    const language = this.detectLanguage(query);
    this.queryStats.byLanguage[language] = (this.queryStats.byLanguage[language] || 0) + 1;

    const normalizedQuery = this.normalizeQuery(query);
    this.queryStats.commonQueries[normalizedQuery] = (this.queryStats.commonQueries[normalizedQuery] || 0) + 1;

    this.logger.info('Query tracked', {
      query,
      response,
      source,
      language,
    });
  }

  async generateReport() {
    const topQueries = Object.entries(this.queryStats.commonQueries)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([query, count]) => ({ query, count }));

    const report = {
      totalQueries: this.queryStats.total,
      aiGeneratedQueries: this.queryStats.aiGenerated,
      cachedQueries: this.queryStats.cached,
      queryDistributionByLanguage: this.queryStats.byLanguage,
      topQueries,
      cacheHitRate: (this.queryStats.cached / this.queryStats.total) * 100,
    };

    this.logger.info('Analytics report generated', report);
    return report;
  }

  detectLanguage(query) {
    // Simplified language detection (replace with a more robust solution in production)
    const languagePatterns = {
      en: /^[a-zA-Z\s]+$/,
      es: /^[a-záéíóúüñ\s]+$/i,
      fr: /^[a-zàâçéèêëîïôûùüÿæœ\s]+$/i,
    };

    for (const [lang, pattern] of Object.entries(languagePatterns)) {
      if (pattern.test(query)) {
        return lang;
      }
    }

    return 'unknown';
  }

  normalizeQuery(query) {
    return query.toLowerCase().trim();
  }
}

export { AnalyticsService };

