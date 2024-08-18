# DataSift

DataSift is a powerful web scraping tool built with Puppeteer, designed to extract and process data from websites efficiently. DataSift makes it easy to gather and utilize web data for various purposes.

[View our documentation](./documentation/Documentation.md)

## Features

- **Headless Browsing**: Leverages Puppeteer for headless browsing, allowing for efficient and fast data scraping.
- **Data Extraction**: Extract text, HTML, and other data types from targeted web pages.
- **Markdown Parsing**: Parses HTML to Markdown using our own in-house parser.
- **LLM Categorization**: Uses a language model to categorize and organize extracted website data.
- **Database Integration**: Stores scraped data in a MongoDB database for persistent and scalable storage.
- **Spoofing**: Spoofs user-agent, the `sec-ch-platform`, CPU Cores, WebGL & WebGL2 to make fingerprinting the browser harder.

## Prerequisites

- Node.js (>=14.x)
- Ollama
- Google Chrome

## Build (Linux)

### Frontend

#### Running frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

Our backend needs some prerequisites as well. We need to install Google Chrome, and setup ollama.

Install Google Chrome for Puppeteer.

```bash
# Chrome dependencies
sudo apt install -y wget gnupg

# Installing Chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb
sudo apt --fix-broken install -y
```

Install ollama

```
curl -fsSL https://ollama.com/install.sh | sh
ollama run llama3.1
```

#### Running backend

```bash
cd backend
npm install
npm run dev
```
