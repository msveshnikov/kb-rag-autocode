# PromptCache Service

## Overview

The `promptCache.js` file defines a `PromptCache` class that provides a caching mechanism using Redis for storing and retrieving prompts. This service is part of a larger project structure and is located in the `services` directory.

The PromptCache service is designed to improve performance and reduce redundant API calls by caching frequently used prompts or responses. It utilizes Redis as the underlying cache storage system.

## Class: PromptCache

### Constructor

```javascript
constructor()
```

Initializes a new instance of the PromptCache class.

- Creates a Redis client using the `REDIS_URL` environment variable.
- Sets up error handling for the Redis client.
- Promisifies Redis methods for asynchronous operations.

### Methods

#### connect()

```javascript
async connect()
```

Establishes a connection to the Redis server.

**Returns:** A Promise that resolves when the connection is established.

#### get(key)

```javascript
async get(key)
```

Retrieves a value from the cache using the provided key.

**Parameters:**
- `key` (string): The key to look up in the cache.

**Returns:** A Promise that resolves with the cached value, or `null` if not found or an error occurs.

#### set(key, value, expirationInSeconds)

```javascript
async set(key, value, expirationInSeconds = 3600)
```

Stores a value in the cache with the specified key and expiration time.

**Parameters:**
- `key` (string): The key under which to store the value.
- `value` (string): The value to be stored.
- `expirationInSeconds` (number, optional): The time-to-live for the cached item in seconds. Defaults to 1 hour (3600 seconds).

**Returns:** A Promise that resolves when the value is successfully cached.

#### close()

```javascript
async close()
```

Closes the connection to the Redis server.

**Returns:** A Promise that resolves when the connection is closed.

## Usage Example

```javascript
import { PromptCache } from './services/promptCache.js';

async function main() {
  const cache = new PromptCache();
  
  try {
    await cache.connect();

    // Set a value in the cache
    await cache.set('greeting', 'Hello, World!');

    // Retrieve the value from the cache
    const cachedGreeting = await cache.get('greeting');
    console.log(cachedGreeting); // Output: Hello, World!

    // Close the connection when done
    await cache.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

## Notes

- This service relies on the `redis` npm package for Redis client functionality.
- The `REDIS_URL` environment variable must be set with the appropriate Redis server URL.
- Error handling is implemented for Redis client errors and cache operations.
- The default expiration time for cached items is 1 hour, but this can be customized when calling the `set` method.

## Integration with Project

As part of the `services` directory, the PromptCache service can be used by other components of the project to efficiently cache and retrieve data. It can be particularly useful in conjunction with services like `claude.js`, `rag.js`, or any other service that may benefit from caching responses or intermediate results to improve performance and reduce external API calls.