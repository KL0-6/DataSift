const categorizeWebsite = async (textContent) => 
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
                model: "gemma2:2b",
                prompt: `
                Here is the text extracted from a website:
                    
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
                `,
                    
                stream: false
            })
        });
    
        if (response.ok) 
        {
            const data = await response.json();
            const category = data.response;

            return category.replace(" ", "").split("\n")[0];
        }
    
        return "Error";
    } 
    catch (error) 
    {            
        return "Error";
    }
};
    
module.exports = { categorizeWebsite };
    