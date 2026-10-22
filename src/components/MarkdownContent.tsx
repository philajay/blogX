import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  content: string;
  className?: string;
};

export function MarkdownContent({
  content,
  className,
}: MarkdownContentProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        components={{
          h1: ({ children }) => (
            <h1 className="mt-8 text-3xl font-black tracking-tight text-slate-950 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-7 text-2xl font-bold tracking-tight text-slate-950">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 text-xl font-bold tracking-tight text-slate-900">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-5 text-lg font-bold text-slate-900">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mt-4 text-base leading-7 text-slate-700 first:mt-0">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-700">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-7">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="mt-4 border-l-4 border-indigo-200 pl-4 italic text-slate-600">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-indigo-600 underline decoration-indigo-200 underline-offset-2 hover:text-indigo-800"
            >
              {children}
            </a>
          ),
          pre: ({ children }) => (
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100">
              {children}
            </pre>
          ),
          img: ({ src, alt }) => (
            <img
              src={typeof src === "string" ? src : undefined}
              alt={alt ?? ""}
              loading="lazy"
              className="mt-6 w-full rounded-2xl border border-slate-200 object-cover"
            />
          ),
          hr: () => <hr className="my-8 border-slate-200" />,
          table: ({ children }) => (
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-800">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-slate-100 px-3 py-2 text-slate-700">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
