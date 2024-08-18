const { Lexer, LexType, LexRes } = require("./Lexer");

class Attribute 
{
    constructor(name, value) 
    {
        this.name = name;
        this.value = value;
    }
}

class HTMLElement 
{
    constructor() 
    {
        this.is_body = false;
        this.name = "";
        this.attributes = [];
        this.children = [];
    }
}

class ParseHTML 
{
    constructor(buffer) 
    {
        this.buff = buffer;
        this.buffer_size = buffer.length;
        this.pos = 0;
        this.root = new HTMLElement();
        this.stack_objects = [];
        this.lexer = new Lexer(buffer);
    }

    addElementToStack(element) 
    {
        if (this.stack_objects.length) 
        {
            this.stack_objects[this.stack_objects.length - 1].children.push(element);
        } 
        else 
        {
            this.root.children.push(element);
        }
    }

    readStatement() 
    {
        // return true = no end needed
        const element = new HTMLElement();
        this.addElementToStack(element);

        // Get the name of the object if it exists
        let result = this.lexer.readStatementHeaderEntry();
        if (result.type === LexType.Unknown) 
        {
            return true;
        }

        element.name = result.value;

        // Check for attributes, unknown = / or >
        result = this.lexer.readStatementHeaderEntry();

        // Attributes
        let attributeName = ""; // Cache name for equals
        let hadEquals = false;
        while (result.type !== LexType.Unknown) 
        {
            if (result.type === LexType.Equal) 
            {
                hadEquals = true;
            } 
            else 
            {
                if (!hadEquals) 
                {
                    // If a new name is found and equals is not present, push as is
                    if (attributeName) 
                    {
                        element.attributes.push(new Attribute(attributeName, ""));
                    }
                    attributeName = result.value;
                } 
                else 
                {
                    element.attributes.push(new Attribute(attributeName, result.value));
                    attributeName = "";
                }

                hadEquals = false;
            }

            result = this.lexer.readStatementHeaderEntry();
        }

        result = this.lexer.readNext(); // Read end

        // Handle statements that do not nest (Statement end can be ignored as it's properly handled)
        if (result.type === LexType.StatementEarlyEnd || result.type === LexType.StatementCloser) 
        {
            if (element.name === "br" || element.name === "img") 
            {
                return true;
            }
        }

        // Add to the stack
        if (result.type !== LexType.StatementEarlyEnd) 
        {
            this.stack_objects.push(element);
        }

        return result.type === LexType.StatementEarlyEnd;
    }

    readStatementEnd() 
    {
        // Read statement name, unknown means it ends in / or > with no name
        const result = this.lexer.readStatementHeaderEntry();
        if (result.type === LexType.Unknown) 
        {
            return;
        }

        const statementEndName = result.value;

        this.lexer.readNext(); // Removes >

        // Try to remove the element
        while (this.stack_objects.length) 
        {
            if (this.stack_objects[this.stack_objects.length - 1].name === statementEndName) 
            {
                this.stack_objects.pop();
                break;
            }

            this.stack_objects.pop();
        }
    }

    parseStatement() 
    {
        if (this.readStatement()) 
        {
            return true;
        }

        if (this.stack_objects.length && (this.stack_objects[this.stack_objects.length - 1].name === "style" || this.stack_objects[this.stack_objects.length - 1].name === "script")) 
        {
            // Read until </style> or </script> is found, ignoring comments of /* */
            this.lexer.readStyleOrScriptBody();
            return true;
        }

        while (true) 
        {
            // Read statements
            const body = this.lexer.readStatementBody();
            if (body.type === LexType.Unknown) 
            {
                const result = this.lexer.readNext();
                if (result.type === LexType.LEXER_END) 
                {
                    return false;
                }

                switch (result.type) 
                {
                    case LexType.StatementStart:
                        this.parseStatement();
                        break;
                    case LexType.StatementEnd:
                        this.readStatementEnd();
                        return true;
                    case LexType.Comment:
                        // Lazy fix to save memory
                        const element = new HTMLElement();
                        element.name = "Comment";

                        const child = new HTMLElement();
                        child.is_body = true;
                        child.name = result.value;

                        element.children.push(child);

                        this.addElementToStack(element);
                        break;
                    default:
                        break;
                }
            } 
            else 
            {
                const element = new HTMLElement();
                element.is_body = true;
                element.name = body.value;

                this.addElementToStack(element);
            }
        }

        return true;
    }

    parse() 
    {
        while (true) 
        {
            // Read statements but top level
            const result = this.lexer.readNext();
            if (result.type === LexType.LEXER_END) 
            {
                break;
            }

            if (result.type === LexType.StatementStart) 
            {
                if (!this.parseStatement()) 
                {
                    break;
                }
            } 
            else if (result.type === LexType.Comment) 
            {
                // Lazy fix to save memory
                const element = new HTMLElement();
                element.name = "Comment";

                const child = new HTMLElement();
                child.is_body = true;
                child.name = result.value;

                element.children.push(child);

                this.addElementToStack(element);
            }
        }
    }

    getRoot() 
    {
        return this.root;
    }
}

module.exports = { ParseHTML, HTMLElement };
