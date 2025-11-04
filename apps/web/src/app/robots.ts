import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Clarity-Bot',
        allow: '/',
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/cms', '/login'],
      },
      {
        userAgent: ['Googlebot', 'Bingbot'],
        allow: '/',
        disallow: ['/api/', '/cms', '/login'],
      },
      {
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        disallow: '/',
      },
      {
        userAgent: ['AhrefsBot', 'MJ12bot', 'DotBot'],
        disallow: '/',
      },
    ],
    sitemap: 'https://www.hidesh.com/sitemap.xml',
    host: 'https://www.hidesh.com',
  }
}
