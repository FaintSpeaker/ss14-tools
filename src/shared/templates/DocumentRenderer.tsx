import {HTMLAttributes, useEffect, useState} from "react";
import classNames from "classnames";

const defaultParameters : Record<string,string> = {
    "documentColor": "black"
}

async function fetchTemplateContent(url: string) {
    try {
        const response = await fetch(url);
        return await response.text();
    } catch {
        return `[bold]Failed to retrieve template content for URL ${url}[/bold]`;
    }
}

function applyTemplate(input:string, parameters: Record<string, string>) {
    // Template parameters are in the format %{parameter_name}
    // Get all from input

    // find all %{parameter_name} matches in input

    const matches = input.match(/%\{(.*?)}/ig);
    if (!matches) return input;

    // Replace each match with its corresponding value from parameters
    let content = input;

    matches.forEach(match => {
        // Default values are stored after a ":", so split.
        const [paramName, defaultValue] = match.slice(2, -1).split(":");

        // Find the param in the parameters object, case-insensitive.

        const matchedKey = Object.keys(parameters).find(key => key.toLowerCase() === paramName.toLowerCase());

        const value = matchedKey ? parameters[matchedKey] : defaultValue ?? "";

        content = content.replace(match, value);
    });

    content.replace(/\r\n/g, '\n');

    return content
}

function ss14RenderDoc(source: string){
    /* Supported Tags:
     * [head=N][/head]
     * [bold][/bold]
     * [italic][/italic]
     * [bolditalic][/bolditalic]
     * [color=COLOR][/color]
     */

    /* Unsupported Tags:
     * [bullet/]
     */

    const tagMap : Record<string,string> = {
        head: "is-ss14-head-",
        bold: "is-ss14-bold",
        italic: "is-ss14-italic",
        bolditalic: "is-ss14-bold is-ss14-italic",
    }

    let result = source;

    // We must skip tags if they're escaped with a backslash. Example: \[head]
    // This is done by replacing escaped brackets with HTML entities.
    result = result.replace(/\\\[/g, '&lbrack;').replace(/\\]/g, '&rbrack;');

    result = result.replace(/\[.*?]/gm, (match) => {
        console.log(match);
        if (match.includes("/")) {
            // We're going to ignore bullet points anyway.
            return `</span>`;
        } else {
            const tag = match.slice(1, match.length - 1);
            const parts = tag.split("=");
            const arg = tag.includes("=") ? parts[1] : undefined;
            const tagName = parts[0];
            let mappedCssClass = tagMap[tag] || "";

            // If the tag is color, we need to add a style attribute.
            const attributes = (arg && tagName === "color") ? ` style="color:${arg}"` : '';

            // If the tag is head, we need to map it to one of the head classes.
            if (tagName === "head") {
                let head = Number(arg);

                // If arg is not a number or is out of range, default to 1 just to be safe.
                if (!arg || isNaN(head)) {
                    head = 1;
                }

                head = Math.min(Math.max(head, 1), 3); // SS14 clamps to 1-3

                mappedCssClass = `is-ss14-head-${head}`;
            }

            return `<span class="${mappedCssClass}" ${attributes}>`;
        }
    });

    return result;
}

export default function DocumentRenderer({content, contentTemplate, headerTemplate, footerTemplate, parameters, type="viewer", className, id}:
{ content?: string, contentTemplate?: string, headerTemplate?: string, footerTemplate?: string, parameters?: Record<string, string>, type?:"editor"|"viewer" } & HTMLAttributes<HTMLDivElement>) {
    const [header, setHeader] = useState<string|undefined>(undefined);
    const [footer, setFooter] = useState<string|undefined>(undefined);
    const [body, setBody] = useState<string|undefined>(undefined);
    const [doc, setDoc] = useState<string>("")

    useEffect(() => {
        if (headerTemplate && !header) {
            fetchTemplateContent(headerTemplate).then(setHeader);
        }
        if (footerTemplate && !footer) {
            fetchTemplateContent(footerTemplate).then(setFooter);
        }
        if (contentTemplate && !body) {
            fetchTemplateContent(contentTemplate).then(setBody);
        }
        setDoc(applyTemplate(`${header ?? ""}\n${body ?? content ?? ""}\n${footer ?? ""}`, {...defaultParameters, ...parameters}));

    }, [headerTemplate, header, footerTemplate, footer, contentTemplate, body, content, parameters]);

    if (type === "viewer") {
        return (
            <div id={id} style={{width:"510px",height:"660px",padding:"16px"}} className={classNames("box is-unselectable is-ss14-document", className)}>
                <div style={{maxWidth:"600px", whiteSpace:"pre-wrap",overflowY:"scroll"}} className={"content"} dangerouslySetInnerHTML={{__html: ss14RenderDoc(doc)}}/>
            </div>
        )
    }

    return (
        <div id={id} style={{width:"510px",height:"660px",padding:"16px"}} className={classNames("box is-unselectable", className)}>
            <textarea style={{whiteSpace: "pre",height:"660px"}}
                      readOnly={true} className={"textarea"} aria-multiline={true} value={doc.replace('\r', '')}/>
        </div>
        )
    }