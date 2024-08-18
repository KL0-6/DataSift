const LexType = 
{
    StatementStart: "StatementStart",
    StatementEnd: "StatementEnd",
    StatementEarlyEnd: "StatementEarlyEnd",
    StatementName: "StatementName",
    StatementAttribute: "StatementAttribute",
    Comment: "Comment",
    Slash: "Slash",
    Equal: "Equal",
    DocType: "DocType",
    Identifier: "Identifier",
    Unknown: "Unknown",
    StringType: "StringType",
    StatementBody: "StatementBody",
    StatementCloser: "StatementCloser",
    LEXER_END: "LEXER_END"
};

class LexRes 
{
    constructor(value, type) 
    {
        this.value = value;
        this.type = type;
    }
}

class Lexer 
{
    constructor(buffer) 
    {
        this.buff = buffer;
        this.buffer_size = buffer.length;
        this.pos = 0;
    }

    peek(offset = 0) 
    {
        return this.pos + offset < this.buffer_size ? this.buff[this.pos + offset] : null;
    }

    consume() 
    {
        this.pos++;
    }

    isWhitespace() 
    {
        const char = this.peek();
        return char === " " || char === "\r" || char === "\n" || char === "\t";
    }

    pruneWhitespace(newlines = false) 
    {
        while (this.peek() === " " || (newlines && ["\r", "\n", "\t"].includes(this.peek()))) 
        {
            this.consume();
        }
    }

    peekWithoutWhitespace() 
    {
        // Hacky
        const tempPos = this.pos;
        this.pruneWhitespace(true);
        const res = this.peek();
        this.pos = tempPos;
        return res;
    }

    readDocType() 
    {
        this.pruneWhitespace(true);

        let docType = "";
        while (this.pos < this.buffer_size) 
        {
            const current = this.peek();
            if (current === ">") 
            {
                this.consume();
                break;
            }
            docType += current;
            this.consume();
        }

        return new LexRes(docType, LexType.DocType);
    }

    readString() 
    {
        let result = "";
        const endChar = this.peek(); // " or '

        this.consume();
        while (this.pos < this.buffer_size) 
        {
            const current = this.peek();
            if (current === "\\" && this.peek(1) === endChar) 
            {
                result += current + this.peek(1);
                this.consume();
                this.consume();
            } 
            else if (current === endChar) 
            {
                this.consume();
                break;
            } 
            else 
            {
                result += current;
                this.consume();
            }
        }

        return new LexRes(result, LexType.StringType);
    }

    readComment() 
    {
        this.pruneWhitespace(true);

        let comment = "";
        let temp = ""; // Hold whitespace characters

        while (this.pos < this.buffer_size) 
        {
            const current = this.peek();
            if (current === "-" && this.peek(1) === "-" && this.peek(2) === ">") 
            {
                this.consume();
                this.consume();
                this.consume();
                break;
            }

            if (this.isWhitespace()) 
            {
                temp += current;
            } 
            else 
            {
                comment += temp;
                temp = "";
                comment += current;
            }

            this.consume();
        }

        return new LexRes(comment, LexType.Comment);
    }

    readAlphaNumericAndSome() 
    {
        let chain = "";
        while (this.pos < this.buffer_size) 
        {
            const current = this.peek();
            if (!/^[a-zA-Z0-9_]$/.test(current)) 
            {
                break;
            }
            chain += current;
            this.consume();
        }
        return new LexRes(chain, LexType.Identifier);
    }

    readStatementHeaderEntry() 
    {
        this.pruneWhitespace(true);

        // Values inside of the header
        if (this.peek() === "\"" || this.peek() === "'") 
        {
            return this.readString();
        }

        if (this.peek() === "=") 
        {
            this.consume();
            return new LexRes("=", LexType.Equal);
        }

        let headerValue = "";
        while (this.pos < this.buffer_size) 
        {
            const current = this.peek();

            // Really only want alphanumeric and _, not sure if that’s all that is allowed though
            if (!["\"", "'", "=", "/", ">"].includes(current) && !this.isWhitespace()) 
            {
                headerValue += current;
            } 
            else 
            {
                break;
            }
            this.consume();
        }

        if (!headerValue.length) 
        {
            return new LexRes(null, LexType.Unknown);
        }

        return new LexRes(headerValue, LexType.Identifier);
    }

    readStatementBody() 
    {
        // Do not prune spaces
        let body = "";

        while (this.pos < this.buffer_size) 
        {
            const current = this.peek();
            if (current === "<") 
            {
                break;
            }

            // However ignore newlines and tabs
            if (!this.isWhitespace() || current === " ") 
            {
                body += current;
            }

            this.consume();
        }

        if (!body.length) 
        {
            return new LexRes(null, LexType.Unknown);
        }

        return new LexRes(body, LexType.StatementBody);
    }

    // Will be //, multiline is handled in the css section
    readJavascriptComment() 
    {
        while (this.pos < this.buffer_size) 
        {
            const current = this.peek();
            if (current === "\r" || current === "\n") 
            {
                this.consume();
                break;
            }
            this.consume();
        }
    }

    // This will handle multiline /* */ style comments
    readCSSComment() 
    {
        while (this.pos < this.buffer_size) 
        {
            const current = this.peek();
            if (current === "\\" && this.peek(1) === "*") 
            {
                this.consume();
                this.consume();
            } 
            else if (current === "*" && this.peek(1) === "/") 
            {
                this.consume();
                this.consume();
                break;
            } 
            else 
            {
                this.consume();
            }
        }
    }

    readStyleOrScriptBody() 
    {
        while (this.pos < this.buffer_size) 
        {
            const current = this.peek();
            if (current === "/" && this.peek(1) === "//") 
            {
                this.readJavascriptComment();
            } 
            else if (current === "/" && this.peek(1) === "*") 
            {
                this.readCSSComment();
            } 
            else if (current === "\"" || current === "'") 
            {
                this.readString();
            } 
            else 
            {
                if (current === "<") 
                {
                    this.consume();
                    this.pruneWhitespace(true);
                    if (this.peek() === "/") 
                    {
                        this.consume();
                        this.pruneWhitespace(true);

                        const res = this.readAlphaNumericAndSome();
                        if ((res.value === "style" || res.value === "script") && this.peek() === ">") 
                        {
                            this.consume();
                            return; // Finally the end
                        }
                    }
                } 
                else 
                {
                    this.consume();
                }
            }
        }
    }

    readNext() 
    {
        this.pruneWhitespace(true);

        if (this.pos >= this.buffer_size) 
        {
            return new LexRes(null, LexType.LEXER_END);
        }

        const current = this.peek();
        switch (current) 
        {
            case "<":
                this.consume();
                if (this.peek() === "!") // Comment or doc type
                {
                    this.consume();
                    if (this.peek() === "-" && this.peek(1) === "-") 
                    {
                        this.consume();
                        this.consume();
                        return this.readComment();
                    } 
                    else 
                    {
                        return this.readDocType();
                    }
                } 
                else if (this.peekWithoutWhitespace() === "/") // End of a statement
                {
                    this.pruneWhitespace(true);
                    this.consume();
                    return new LexRes("</", LexType.StatementEnd);
                }
                return new LexRes(current, LexType.StatementStart);
            case ">":
                this.consume();
                return new LexRes(current, LexType.StatementCloser);
            case "/":
                this.consume();
                if (this.peekWithoutWhitespace() === ">") 
                {
                    this.pruneWhitespace(true);
                    this.consume();
                    return new LexRes("/>", LexType.StatementEarlyEnd);
                }
                return new LexRes(current, LexType.Slash);
            default:
                this.consume();
                return new LexRes(current, LexType.Unknown);
        }
    }
}

module.exports = { Lexer, LexType, LexRes };
