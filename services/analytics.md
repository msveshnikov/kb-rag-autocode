# AnalyticsService Documentation

## Overview

The `AnalyticsService` class, defined in `services/analytics.js`, is responsible for tracking and analyzing query statistics in the application. It provides functionality to log query information, generate analytics reports, and perform basic language detection. This service is a crucial part of the project's analytics and monitoring system.

## Class: AnalyticsService

### Constructor

```javascript
constructor()
```

Initializes the AnalyticsService with a Winston logger and sets up initial query statistics.

- Creates a Winston logger that writes to 'analytics.log' file.
- Adds console logging in non-production environments.
- Initializes query statistics object.

### Methods

#### trackQuery

```javascript
trackQuery(query, response, source)
```

Tracks a query and updates the statistics.

Parameters:
- `query` (string): The user's query.
- `response` (any): The response provided to the query.
- `source` (string): The source of the response ('ai' or 'cache').

Functionality:
- Increments total query count.
- Updates AI-generated or cached query counts.
- Detects and tracks the query language.
- Normalizes and tracks common queries.
- Logs query information.

#### generateReport

```javascript
async generateReport()
```

Generates an analytics report based on the collected statistics.

Returns:
- An object containing:
  - `totalQueries`: Total number of queries.
  - `aiGeneratedQueries`: Number of AI-generated responses.
  - `cachedQueries`: Number of cached responses.
  - `queryDistributionByLanguage`: Distribution of queries by detected language.
  - `topQueries`: Top 10 most common queries.
  - `cacheHitRate`: Percentage of queries served from cache.

#### detectLanguage

```javascript
detectLanguage(query)
```

Detects the language of the given query using simple regex patterns.

Parameters:
- `query` (string): The query to analyze.

Returns:
- A string representing the detected language code ('en', 'es', 'fr') or 'unknown'.

Note: This is a simplified implementation and should be replaced with a more robust solution in production.

#### normalizeQuery

```javascript
normalizeQuery(query)
```

Normalizes a query by converting it to lowercase and trimming whitespace.

Parameters:
- `query` (string): The query to normalize.

Returns:
- A normalized version of the query.

## Usage Example

```javascript
import { AnalyticsService } from './services/analytics.js';

const analytics = new AnalyticsService();

// Track a query
analytics.trackQuery('What is the capital of France?', 'The capital of France is Paris.', 'ai');

// Generate a report
const report = await analytics.generateReport();
console.log(report);
```

## Project Context

The `AnalyticsService` is part of a larger project that appears to involve AI-generated responses, caching, and multi-language support. It works alongside other services like:

- `claude.js`: Likely an AI service integration.
- `confidenceScorer.js`: Possibly for assessing response confidence.
- `feedback.js`: Potentially for handling user feedback.
- `promptCache.js`: Likely manages caching of prompts or responses.
- `rag.js`: Possibly related to Retrieval-Augmented Generation.
- `translation.js`: Likely handles language translation.

The `AnalyticsService` plays a crucial role in monitoring system performance, tracking usage patterns, and providing insights that can be used to improve the overall service quality and efficiency.