'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

function stripRef(props: any): any {
  // react-markdown can pass a `ref` typed from a different React type instance (React 19 typings mismatch)
  // which blows up when we spread into intrinsic elements. We never need that ref here.
  if (!props) return props
  const { ref: _ref, ...rest } = props
  return rest
}

interface MarkdownViewerProps {
  content: string
  className?: string
}

export function MarkdownViewer({ content, className = '' }: MarkdownViewerProps) {
  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        // @ts-ignore - React 19 type compatibility issues with react-markdown
        components={{
          // Custom styling for markdown elements
          h1: ({ node, ...props }) => (
            <h1
              className="text-4xl font-bold mt-8 mb-4 text-foreground"
              {...((stripRef(props) as any))}
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              className="text-3xl font-bold mt-6 mb-3 text-foreground"
              {...((stripRef(props) as any))}
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              className="text-2xl font-semibold mt-4 mb-2 text-foreground"
              {...((stripRef(props) as any))}
            />
          ),
          p: ({ node, ...props }) => (
            <p className="text-foreground leading-relaxed mb-4" {...((stripRef(props) as any))} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-primary hover:text-primary/80 underline transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              {...((stripRef(props) as any))}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul
              className="list-disc list-inside mb-4 space-y-2 text-foreground"
              {...((stripRef(props) as any))}
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              className="list-decimal list-inside mb-4 space-y-2 text-foreground"
              {...((stripRef(props) as any))}
            />
          ),
          li: ({ node, ...props }) => <li className="text-foreground" {...((stripRef(props) as any))} />,
          code: ({ node, inline, ...props }: any) =>
            inline ? (
              <code
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary"
                {...((stripRef(props) as any))}
              />
            ) : (
              <code
                className="block bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono text-foreground"
                {...((stripRef(props) as any))}
              />
            ),
          pre: ({ node, ...props }) => (
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...((stripRef(props) as any))} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4"
              {...((stripRef(props) as any))}
            />
          ),
          img: ({ node, ...props }) => (
            <img
              className="rounded-lg my-4 max-w-full h-auto"
              {...((stripRef(props) as any))}
              alt={props.alt || ''}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-border" {...((stripRef(props) as any))} />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="border border-border bg-muted px-4 py-2 text-left font-semibold"
              {...((stripRef(props) as any))}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-border px-4 py-2" {...((stripRef(props) as any))} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
