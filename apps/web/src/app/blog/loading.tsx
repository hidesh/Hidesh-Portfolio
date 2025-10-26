import React from 'react';

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-16">
          {/* Title skeleton */}
          <div className="h-12 bg-muted/50 rounded-lg w-48 mx-auto mb-6 animate-pulse"></div>
          {/* Description skeleton */}
          <div className="h-6 bg-muted/50 rounded-lg w-96 max-w-full mx-auto animate-pulse"></div>
        </div>

        {/* Blog post skeletons */}
        <div className="space-y-8">
          {[1, 2, 3].map((i) => (
            <article
              key={i}
              className="bg-card border border-border rounded-lg p-6"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Title */}
                    <div className="h-7 bg-muted/50 rounded-lg w-3/4 animate-pulse"></div>
                    
                    {/* Date */}
                    <div className="h-4 bg-muted/50 rounded-lg w-32 animate-pulse"></div>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <div className="h-4 bg-muted/50 rounded-lg w-full animate-pulse"></div>
                  <div className="h-4 bg-muted/50 rounded-lg w-5/6 animate-pulse"></div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((tag) => (
                    <div
                      key={tag}
                      className="h-6 bg-muted/50 rounded-full w-16 animate-pulse"
                    ></div>
                  ))}
                </div>

                {/* Read more button */}
                <div className="h-10 bg-muted/50 rounded-lg w-32 animate-pulse"></div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
