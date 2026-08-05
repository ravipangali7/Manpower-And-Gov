import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { ContentBlock } from "@/lib/public-api";

export function getBlock(blocks: ContentBlock[] | undefined, key: string) {
  return blocks?.find((b) => b.key === key);
}

export function blockMap(blocks?: ContentBlock[]) {
  const map: Record<string, ContentBlock> = {};
  for (const b of blocks || []) map[b.key] = b;
  return map;
}

/** Split CMS body into steps / list items (newline-separated). */
export function bodyLines(text?: string | null): string[] {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function inlineMarkdown(text: string, accentClass = "text-foreground"): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <strong key={`b-${key++}`} className={`font-semibold ${accentClass}`}>
        {match[1]}
      </strong>,
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export type CmsBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "li"; text: string }
  | { type: "p"; text: string };

/** Parse light markdown (## / ### / - lists / paragraphs) from CMS content. */
export function parseCmsContent(content: string): CmsBlock[] {
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  const blocks: CmsBlock[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    const text = paragraph.join(" ").trim();
    if (text) blocks.push({ type: "p", text });
    paragraph = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      flushParagraph();
      blocks.push({ type: "li", text: line.slice(2).trim() });
      continue;
    }
    paragraph.push(line);
  }
  flushParagraph();
  return blocks;
}

export function CmsRichText({
  content,
  className = "mt-8 space-y-5",
  accent = "default",
}: {
  content: string;
  className?: string;
  /** Use primary (brand red) for **bold** highlights — matches marketing pages. */
  accent?: "default" | "primary";
}) {
  const accentClass = accent === "primary" ? "text-primary" : "text-foreground";
  const blocks = parseCmsContent(content);
  const nodes: ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (!listItems.length) return;
    nodes.push(
      <ul key={key} className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-foreground">
        {listItems.map((item, i) => (
          <li key={i}>{inlineMarkdown(item, accentClass)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  blocks.forEach((block, i) => {
    if (block.type === "li") {
      listItems.push(block.text);
      return;
    }
    flushList(`ul-${i}`);
    if (block.type === "h2") {
      nodes.push(
        <h2 key={i} className="text-2xl font-bold text-brand-blue">
          {inlineMarkdown(block.text, accentClass)}
        </h2>,
      );
    } else if (block.type === "h3") {
      nodes.push(
        <h3 key={i} className="text-xl font-bold text-brand-blue">
          {inlineMarkdown(block.text, accentClass)}
        </h3>,
      );
    } else {
      nodes.push(
        <p key={i} className="whitespace-pre-wrap text-[15px] leading-7 text-foreground">
          {inlineMarkdown(block.text, accentClass)}
        </p>,
      );
    }
  });
  flushList("ul-end");

  return <div className={className}>{nodes}</div>;
}

export function CmsPathLink({
  path,
  className,
  children,
}: {
  path: string;
  className?: string;
  children: ReactNode;
}) {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return (
      <a href={path} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={path} className={className}>
      {children}
    </Link>
  );
}
