const chatNLP = async (prompt) => 
{
    try 
    {
        const response = await fetch('http://localhost:11434/api/generate', 
        {
            method: "POST",
            headers: 
            {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                max_tokens: 2048,
                model: "llama3.1",
                prompt: prompt,            
                stream: false
            })
        });
    
        if (response.ok) 
        {
            const data = await response.json();
            return data.response;
        }
    
        return "Error";
    } 
    catch (error) 
    {            
        return "Error";
    }
};

const categorizeWebsite = async(textContent) =>
{
    return chatNLP(`Here is the text extracted from a website:        
    "${textContent}"
                    
    You need to categorize the provided text into one of the following categories:
                    
    Health
    Tech
    Fitness
    Finance
    Education
    Entertainment
    Travel
    Food
    Sports
    Business
                    
    Instructions:
    - Analyze the text carefully.
    - Determine the most dominant theme present in the text.
    - **Respond with only the single word that represents the most appropriate category.**
    - **Do not include any additional words, explanations, or punctuation.** 
    - **Return ONE LINE ONLY**
    `);
}

const summarizeWebsite = async(HTML) =>
{
    return chatNLP(`Here is the HTML extracted from a website:        
    "${HTML}"
                        
    Based on the extracted HTML, your task is to provide a comprehensive summary of the website, making sure to include:
    
    - A detailed overview of what the website is about, including its primary purpose and the organization or entity it represents.
    - A thorough description of all main features, tools, services, and sections provided by the website. Highlight any unique aspects or important functionalities.
    - Mention all significant information found on the page, including any locations, departments, or subsidiaries mentioned, such as branches in different regions.
    - Any prominent links or sections that are crucial for understanding or accessing the website's main features.
    - Capture any additional relevant information, including related locations, departments, or other affiliated entities.
    - You are allowed to use the website's URL to give more information about the website.
    - Provide links to any feature or section you talked about, if applicable.
    - Make sure not to omit any significant information present on the website.
    - Ignore and exclude any advertising, tracking data, or irrelevant technical details from the summary.
    - Do not include any statements about the inability to determine content, missing information, or suggestions for alternative actions. Focus only on the tasks described.
    - Extract any keywords found in the HTML, and if possible, explain their purpose. 
    - Return data in MARKDOWN ONLY.

    FORMAT MARKDOWN LIKE THIS:

    ## Overview
    --------
    *Include the overview here.*

    ## Main Features and Sections
    --------
    *Include the main features and sections here.*

    ## Prominent Links
    --------
    *Include the prominent links here.*

    ## Keywords
    --------
    *Include the keywords here.*

    ## Additional Relevant Information
    --------
    *Include any additional relevant information here.*
    `);
}
    
module.exports = { categorizeWebsite, summarizeWebsite };
    