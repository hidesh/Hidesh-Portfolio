
-- Først tjek struktur
\d blog_posts;

-- Så indsæt test data
INSERT INTO blog_posts (title, slug, excerpt, content, tags, published) 
VALUES (
    'Test Blog Post', 
    'test-blog-post', 
    'This is a test excerpt',
    'This is test content for the blog post',
    ARRAY['test', 'blog'],
    false
);

-- Se resultatet
SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT 5;

