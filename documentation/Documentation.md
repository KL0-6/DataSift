# DataSift API Documentation 📚

Welcome to the DataSift API documentation. This document provides an overview of the available API endpoints for interacting with the DataSift service. Each endpoint is responsible for different actions related to dataset management and web scraping.

## Endpoints Overview 🌐

### 1. `/datasift-p2p-incomingAPI` (GET) 📥

This endpoint is used to scrape web data from a specified URL and return the processed content. It performs various tasks including web scraping, content conversion, and device spoofing. 

- **Functionality**: Scrapes a website, processes the content, and returns HTML, markdown, and text.
- **Required Parameters**: `url_to_scrape`, `token`
- **Optional Parameters**: `timeout`, `waitBeforeScraping`, `shouldCategorize`

[Detailed Documentation for `/datasift-p2p-incomingAPI`](./documentation/datasift-p2p-incomingAPI.md)

### 2. `/get-by-id` (GET) 📜

This endpoint retrieves a dataset by its unique identifier. It decompresses and decodes the stored content before returning it.

- **Functionality**: Retrieves a dataset from the database and returns its HTML, markdown, and text content.
- **Required Parameters**: `defaultDatasetId`, `token`

[Detailed Documentation for `/get-by-id`](./documentation/get-by-id.md)

### 3. `/delete-by-id` (DELETE) 🗑️

This endpoint deletes a dataset from the database using its unique identifier. It validates the request and performs the deletion if the dataset and token are valid.

- **Functionality**: Deletes a dataset from the database based on its ID.
- **Required Parameters**: `defaultDatasetId`, `token`

[Detailed Documentation for `/delete-by-id`](./documentation/delete-by-id.md)

## Common Response Format

Each endpoint returns a JSON response, with status codes and error messages for handling various scenarios. Please refer to the detailed documentation for each endpoint to understand the response formats and possible errors.

---

For further details, please refer to the linked documentation for each specific endpoint.
