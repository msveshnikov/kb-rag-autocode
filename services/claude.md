# Claude Service Documentation

## Overview

The `Claude` class in `services/claude.js` provides an interface for interacting with the Claude AI model API. This service is part of a larger project that appears to be a financial institution's customer service AI assistant system. The Claude service is responsible for processing queries and generating responses based on relevant information and context.

## Class: Claude

### Constructor

```javascript
constructor()
```

Initializes a new instance of the Claude class. It sets up the API key and URL from environment variables.

- `this.apiKey`: Stores the Claude API key from the `CLAUDE_API_KEY` environment variable.
- `this.apiUrl`: Stores the Claude API URL from the `CLAUDE_API_URL` environment variable.

### Methods

#### process

```javascript
async process(query, relevantInfo, context)
```

Processes a query using the Claude API and returns the generated response.

Parameters:
- `query` (string): The user's query or question.
- `relevantInfo` (string): Additional relevant information to provide context for the query.
- `context` (string): The broader context in which the query is being asked.

Returns:
- Promise<string>: The generated response from the Claude API.

Throws:
- Error: If the API request fails.

#### buildPrompt

```javascript
buildPrompt(query, relevantInfo, context)
```

Constructs the prompt to be sent to the Claude API.

Parameters:
- `query` (string): The user's query or question.
- `relevantInfo` (string): Additional relevant information to provide context for the query.
- `context` (string): The broader context in which the query is being asked.

Returns:
- string: The constructed prompt for the Claude API.

## Usage Example

```javascript
import { Claude } from './services/claude.js';

const claude = new Claude();

const query = "What are the current interest rates for savings accounts?";
const relevantInfo = "Current savings account rates range from 0.5% to 2.5% APY.";
const context = "Customer is inquiring about savings account options.";

try {
  const response = await claude.process(query, relevantInfo, context);
  console.log("Claude's response:", response);
} catch (error) {
  console.error("Error processing query with Claude:", error);
}
```

## Notes

- This service relies on environment variables for API configuration. Ensure `CLAUDE_API_KEY` and `CLAUDE_API_URL` are properly set in the environment.
- The service uses the "claude-3.5" model with specific parameters for token limit and temperature. These can be adjusted if needed.
- The prompt is constructed to frame the AI as a financial institution's assistant, ensuring responses are professional and compliant with financial regulations.
- This service is part of a larger system that likely includes other components for analytics, confidence scoring, feedback, caching, and translation. It may be used in conjunction with these other services to provide a comprehensive customer service solution.

## Integration with Other Services

Given the project structure, the `Claude` service can be integrated with other services in the project:

- `analytics.js`: Might be used to track and analyze queries and responses.
- `confidenceScorer.js`: Could assess the confidence level of Claude's responses.
- `feedback.js`: May collect and process user feedback on Claude's responses.
- `promptCache.js`: Potentially caches prompts or responses for improved performance.
- `rag.js`: Might implement Retrieval-Augmented Generation to enhance Claude's responses with additional information.
- `translation.js`: Could be used to translate queries or responses if multilingual support is required.

When using the `Claude` service, consider how it fits into the overall workflow of the application and how it interacts with these other services to provide a comprehensive solution for customer service inquiries in a financial institution context.