"use client";

import * as React from "react";
import DOMPurify from "dompurify";
import { cn } from "@/lib/utils";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdown(text: string): string {
  let result = escapeHtml(text);
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>'
  );
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  result = result.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");
  return result;
}

function parseTable(lines: string[]): string {
  let html = '<div class="overflow-x-auto my-4"><table class="w-full text-left text-sm">';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes("|")) continue;
    const cells = line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c.length > 0 && !/^[-:]+$/.test(c));
    const isHeader = i === 0 || /^\|?[\s\-:|]+\|?$/.test(lines[i - 1] ?? "");
    html += isHeader
      ? `<thead><tr>${cells.map((c) => `<th class="px-4 py-2 font-display uppercase tracking-wide text-xs text-foreground border-b border-border">${inlineMarkdown(c)}</th>`).join("")}</tr></thead>`
      : `<tr>${cells.map((c) => `<td class="px-4 py-2 border-b border-border/50">${inlineMarkdown(c)}</td>`).join("")}</tr>`;
  }
  html += "</table></div>";
  return html;
}

function parseMarkdown(markdown: string): string {
  const lines = markdown.split("\n");
  let html = "";
  const listStack: string[] = [];
  let codeBlock: string[] | null = null;
  let tableBuffer: string[] | null = null;
  let paragraph: string[] = [];

  const closeParagraph = () => {
    if (paragraph.length) {
      html += `<p class="my-4 leading-relaxed text-muted-foreground">${inlineMarkdown(paragraph.join(" "))}</p>`;
      paragraph = [];
    }
  };

  const closeLists = () => {
    while (listStack.length) {
      html += `</${listStack.pop()}>`;
    }
  };

  const flushTable = () => {
    if (tableBuffer) {
      html += parseTable(tableBuffer);
      tableBuffer = null;
    }
  };

  for (const raw of lines) {
    if (codeBlock) {
      if (raw.trim().startsWith("```")) {
        html += `<pre class="my-4 overflow-x-auto rounded-xl border border-border bg-[#0a0a0a] p-4 text-sm leading-relaxed text-foreground/90"><code>${escapeHtml(codeBlock.join("\n"))}</code></pre>`;
        codeBlock = null;
      } else {
        codeBlock.push(raw);
      }
      continue;
    }

    if (raw.trim().startsWith("```")) {
      closeParagraph();
      closeLists();
      flushTable();
      codeBlock = [];
      continue;
    }

    const tableRow = raw.trim().match(/^\|.*\|$/);
    if (tableRow) {
      closeParagraph();
      closeLists();
      tableBuffer = tableBuffer ?? [];
      tableBuffer.push(raw);
      continue;
    } else if (tableBuffer) {
      flushTable();
    }

    const heading = raw.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      closeParagraph();
      closeLists();
      const level = heading[1].length;
      const tag = level === 1 ? "h2" : level === 2 ? "h3" : "h4";
      const size =
        level === 1
          ? "text-2xl font-display font-bold uppercase tracking-tight mt-10 mb-4 text-foreground"
          : level === 2
            ? "text-xl font-display font-semibold uppercase tracking-wide mt-8 mb-3 text-foreground"
            : "text-lg font-display font-semibold mt-6 mb-2 text-foreground";
      html += `<${tag} class="${size}">${inlineMarkdown(heading[2])}</${tag}>`;
      continue;
    }

    const blockquote = raw.match(/^>\s?(.*)$/);
    if (blockquote) {
      closeParagraph();
      closeLists();
      html += `<blockquote class="my-4 border-l-2 border-primary bg-primary/5 px-4 py-3 text-sm italic text-muted-foreground rounded-r-xl">${inlineMarkdown(blockquote[1])}</blockquote>`;
      continue;
    }

    if (/^\s*(-|\*)\s+/.test(raw)) {
      closeParagraph();
      if (listStack[listStack.length - 1] !== "ul") {
        closeLists();
        listStack.push("ul");
        html += '<ul class="my-4 list-disc space-y-2 pl-6 text-muted-foreground">';
      }
      html += `<li>${inlineMarkdown(raw.replace(/^\s*(-|\*)\s+/, ""))}</li>`;
      continue;
    }

    if (/^\s*\d+\.\s+/.test(raw)) {
      closeParagraph();
      if (listStack[listStack.length - 1] !== "ol") {
        closeLists();
        listStack.push("ol");
        html += '<ol class="my-4 list-decimal space-y-2 pl-6 text-muted-foreground">';
      }
      html += `<li>${inlineMarkdown(raw.replace(/^\s*\d+\.\s+/, ""))}</li>`;
      continue;
    }

    if (/^\s*---+\s*$/.test(raw)) {
      closeParagraph();
      closeLists();
      html += '<hr class="my-8 border-border" />';
      continue;
    }

    if (raw.trim() === "") {
      closeParagraph();
      closeLists();
      continue;
    }

    paragraph.push(raw);
  }

  closeParagraph();
  closeLists();
  flushTable();

  return html;
}

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className }: MarkdownProps) {
  const sanitized = React.useMemo(() => {
    if (typeof window === "undefined") return parseMarkdown(children);
    return DOMPurify.sanitize(parseMarkdown(children), {
      ADD_ATTR: ["target", "rel"],
    });
  }, [children]);

  return (
    <div
      className={cn("text-[15px] leading-relaxed", className)}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
