# RAG Service Documentation

## Overview

The `rag.js` file implements a Retrieval-Augmented Generation (RAG) service, which is a key component in the project's information retrieval and knowledge management system. This service integrates with an external embedding API and a local database to perform document retrieval, similarity search, and knowledge base management.

## Class: RAG

### Constructor

```javascript
constructor()
```

Initializes a new RAG instance, setting up the database connection and configuring the embedding API credentials.

### Methods

#### retrieve(query)

```javascript
async retrieve(query)
```

Retrieves relevant documents based on a given query.

- **Parameters:**
  - `query` (string): The search query
- **Returns:** A string containing the combined content of relevant documents
- **Process:**
  1. Obtains the embedding for the query
  2. Searches for similar documents in the database
  3. Combines and returns the content of retrieved documents

#### getEmbedding(text)

```javascript
async getEmbedding(text)
```

Fetches the embedding vector for a given text from the external API.

- **Parameters:**
  - `text` (string): The text to be embedded
- **Returns:** An embedding vector
- **Throws:** Error if the API request fails

#### combineDocuments(docs)

```javascript
combineDocuments(docs)
```

Combines the content of multiple documents into a single string.

- **Parameters:**
  - `docs` (array): An array of document objects
- **Returns:** A string containing the combined content of all documents

#### updateKnowledgeBase(newContent)

```javascript
async updateKnowledgeBase(newContent)
```

Adds new content to the knowledge base.

- **Parameters:**
  - `newContent` (string): The content to be added
- **Process:**
  1. Obtains the embedding for the new content
  2. Inserts the content and its embedding into the database

#### removeFromKnowledgeBase(contentId)

```javascript
async removeFromKnowledgeBase(contentId)
```

Removes content from the knowledge base.

- **Parameters:**
  - `contentId` (string): The ID of the content to be removed

#### getContentById(contentId)

```javascript
async getContentById(contentId)
```

Retrieves a specific piece of content from the knowledge base.

- **Parameters:**
  - `contentId` (string): The ID of the content to retrieve
- **Returns:** The requested document

#### listAllContent()

```javascript
async listAllContent()
```

Retrieves all content from the knowledge base.

- **Returns:** An array of all documents in the database

#### searchContent(query)

```javascript
async searchContent(query)
```

Performs a similarity search on the knowledge base.

- **Parameters:**
  - `query` (string): The search query
- **Returns:** An array of up to 10 similar documents
- **Process:**
  1. Obtains the embedding for the query
  2. Searches for similar documents in the database

## Usage Examples

```javascript
// Initialize the RAG service
const rag = new RAG();

// Retrieve relevant documents for a query
const relevantInfo = await rag.retrieve("What is machine learning?");

// Add new content to the knowledge base
await rag.updateKnowledgeBase("Machine learning is a subset of artificial intelligence...");

// Search for content
const searchResults = await rag.searchContent("neural networks");

// Remove content from the knowledge base
await rag.removeFromKnowledgeBase("document123");

// List all content in the knowledge base
const allContent = await rag.listAllContent();
```

## Project Context

The `rag.js` file is part of the `services` directory in the project structure. It works alongside other services like `analytics.js`, `claude.js`, and `translation.js` to provide a comprehensive information retrieval and processing system. The RAG service specifically handles the retrieval and management of knowledge, which can be utilized by other components of the project for tasks such as question answering, content generation, and information lookup.