const { ParseHTML } = require("./Parser");

function charIsNum(char) 
{
    return char >= "0" && char <= "9";
}

// Would be better as AST but that’s ok
class HTMLToMarkdownFormatter 
{
    constructor() 
    {
        this.markdown = "";
    }

    traverseTree(element, indentCount) 
    {
        if (element.is_body) 
        {
            // No newlines or anything, this is raw text
            this.markdown += element.name;
        } 
        else 
        {
            const name = element.name;
            if (name === "Comment") 
            {
                // Maybe?, must have to not print anyways though due to lazy handling
                return;
            } 
            else if (name.length === 2 && name[0] === "h" && charIsNum(name[1])) 
            {
                for (const child of element.children) 
                {
                    this.markdown += "\n\n"; // Extra newline for spacing

                    for (let i = 0; i < name[1] - "0"; i++) 
                    {
                        this.markdown += "#";
                    }

                    this.markdown += " ";
                    this.traverseTree(child, indentCount + 1);
                    this.markdown += "\n";

                    return;
                }
            } 
            else if (name === "p") 
            {
                this.markdown += "\n";
            } 
            else if (name === "img") 
            {
                let source = "";
                let alt = "";

                for (const attribute of element.attributes) 
                {
                    console.log(`name: ${attribute.name}`);
                    if (attribute.name === "src") 
                    {
                        source = attribute.value;
                    } 
                    else if (attribute.name === "alt") 
                    {
                        alt = attribute.value;
                    }
                }

                if (source) 
                {
                    this.markdown += "Img: " + source;
                }

                if (source && alt) 
                {
                    this.markdown += "; ";
                }

                if (alt) 
                {
                    this.markdown += "Alt: " + alt;
                }

                console.log("\n");
            } 
            else if (name === "br") 
            {
                this.markdown += "\n";
            } 
            else if (name === "li") 
            {
                for (const child of element.children) 
                {
                    this.markdown += "- ";
                    this.traverseTree(child, indentCount + 1);
                }

                console.log("\n");

                return;
            }

            const previousSize = this.markdown.length;
            for (const child of element.children) 
            {
                this.traverseTree(child, indentCount + 1);
            }

            if (this.markdown.length && this.markdown.length !== previousSize && this.markdown[this.markdown.length - 1] !== "\n") 
            {
                this.markdown += "\n";
            }
        }
    }

    parse(root) 
    {
        for (const element of root.children) 
        {
            this.traverseTree(element, 0);
        }
        
        return this.markdown;
    }
}

function HTMLToMarkdown(input) 
{
    const htmlParser = new ParseHTML(input);
    htmlParser.parse();
    const root = htmlParser.getRoot();
    const markdownFormatter = new HTMLToMarkdownFormatter();
    return markdownFormatter.parse(root);
}

module.exports = { HTMLToMarkdown };
