import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

const rehypePrettyCodeOptions = {
  theme: "github-light",
  keepBackground: false,
};

async function renderMarkdown(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .use(rehypePrettyCode as any, rehypePrettyCodeOptions)
    .use(rehypeStringify)
    .process(content);

  return String(result);
}

export async function Markdown({ content }: { content: string }) {
  const html = await renderMarkdown(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
