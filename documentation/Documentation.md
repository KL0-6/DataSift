# DataSift API Documentation 📚

Welcome to the DataSift API documentation. This document provides an overview of the available API endpoints for interacting with the DataSift service. Each endpoint is responsible for different actions related to dataset management and web scraping.

Example request:

```bash
## Request
user@user-MS-7D70:~/home$ curl -G 'localhost:3000/datasift-p2p-incomingAPI' --data-urlencode 'url_to_scrape=https://example.com/' --data-urlencode 'token=DataSift_mytokenhere' --data-urlencode 'shouldCategorize=true' --data-urlencode 'shouldSummarize=true'

## API Response

{
  "defaultDatasetId": "dataset_842ad858bef925d5a4a2e666a3b4e62ef80f3baf886dd6271155d6b7e62b2210",
  "html_content": "<!DOCTYPE html><html><head>\n    <title>Example Domain</title>\n\n    <meta charset=\"utf-8\">\n    <meta http-equiv=\"Content-type\" content=\"text/html; charset=utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <style type=\"text/css\">\n    body {\n        background-color: #f0f0f2;\n        margin: 0;\n        padding: 0;\n        font-family: -apple-system, system-ui, BlinkMacSystemFont, \"Segoe UI\", \"Open Sans\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n        \n    }\n    div {\n        width: 600px;\n        margin: 5em auto;\n        padding: 2em;\n        background-color: #fdfdff;\n        border-radius: 0.5em;\n        box-shadow: 2px 3px 7px 2px rgba(0,0,0,0.02);\n    }\n    a:link, a:visited {\n        color: #38488f;\n        text-decoration: none;\n    }\n    @media (max-width: 700px) {\n        div {\n            margin: 0 auto;\n            width: auto;\n        }\n    }\n    </style>    \n</head>\n\n<body>\n<div>\n    <h1>Example Domain</h1>\n    <p>This domain is for use in illustrative examples in documents. You may use this\n    domain in literature without prior coordination or asking for permission.</p>\n    <p><a href=\"https://www.iana.org/domains/example\">More information...</a></p>\n</div>\n\n\n</body></html>",
  "markdown_content": "    Example Domain\n                    \n    \n\n# Example Domain\n    \nThis domain is for use in illustrative examples in documents. You may use this    domain in literature without prior coordination or asking for permission.\n    \nMore information...\n",
  "text_content": "Example Domain\n\nThis domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.\n\nMore information...",
  "summary": "## Overview\n--------\nThis website is for example purposes only, providing a domain name used in illustrative examples in documents. The primary purpose of this website is to serve as an example for documentation and educational materials.\n\n## Main Features and Sections\n--------\nThe main features and sections of this website include:\n\n* A simple webpage with a title \"Example Domain\" and a brief description of the domain's use.\n* A paragraph explaining that the domain is available for use in literature without prior coordination or permission.\n* A link to learn more about the example domain at [https://www.iana.org/domains/example](https://www.iana.org/domains/example).\n\n## Prominent Links\n--------\nThe only prominent link on this website is:\n\n* [More information...](https://www.iana.org/domains/example) - This link directs users to a page providing more information about the example domain.\n\n## Keywords\n--------\nSome keywords found in the HTML include:\n\n* **Example Domain**: This is the primary keyword representing the purpose of the website.\n* **IANA** (Internet Assigned Numbers Authority): This keyword is linked to the [https://www.iana.org/domains/example](https://www.iana.org/domains/example) page, indicating a connection between the example domain and IANA.\n\n## Additional Relevant Information\n--------\nThere is no additional relevant information provided on this website about locations, departments, or subsidiaries. The website solely serves as an example for documentation purposes.",
  "category": "Education"
}
```

## Endpoints Overview 🌐

### 1. `/datasift-p2p-incomingAPI` (GET) 📥

This endpoint is used to scrape web data from a specified URL and return the processed content. It performs various tasks including web scraping, content conversion, and device spoofing. 

- **Functionality**: Scrapes a website, processes the content, and returns HTML, markdown, and text.
- **Required Parameters**: `url_to_scrape`, `token`
- **Optional Parameters**: `timeout`, `waitBeforeScraping`, `shouldCategorize`

[Detailed Documentation for `/datasift-p2p-incomingAPI`](./datasift-p2p-incomingAPI.md)

### 2. `/get-by-id` (GET) 📜

This endpoint retrieves a dataset by its unique identifier. It decompresses and decodes the stored content before returning it.

- **Functionality**: Retrieves a dataset from the database and returns its HTML, markdown, and text content.
- **Required Parameters**: `defaultDatasetId`, `token`

[Detailed Documentation for `/get-by-id`](./get-by-id.md)

### 3. `/delete-by-id` (DELETE) 🗑️

This endpoint deletes a dataset from the database using its unique identifier. It validates the request and performs the deletion if the dataset and token are valid.

- **Functionality**: Deletes a dataset from the database based on its ID.
- **Required Parameters**: `defaultDatasetId`, `token`

[Detailed Documentation for `/delete-by-id`](./delete-by-id.md)

## Common Response Format

Each endpoint returns a JSON response, with status codes and error messages for handling various scenarios. Please refer to the detailed documentation for each endpoint to understand the response formats and possible errors.

---

For further details, please refer to the linked documentation for each specific endpoint.
