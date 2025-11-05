/**
 * SEO Configuration & Metadata
 * Centralized SEO constants and metadata generators
 */

export const siteConfig = {
  name: 'Hidesh Kumar',
  title: 'Hidesh Kumar - Software Engineer & Full-Stack Developer',
  description: 'Software Engineer specializing in full-stack development, e-commerce solutions, AI automation, and cloud architecture. Expert in React, Next.js, TypeScript, Node.js, and modern web technologies.',
  url: 'https://www.hidesh.com',
  author: 'Hidesh Kumar',
  keywords: [
    // Personal branding
    'Hidesh Kumar',
    'Hidesh',
    'hidesh software engineer',
    'hidesh developer',
    'hidesh portfolio',
    
    // Role & expertise
    'software engineer',
    'full-stack developer',
    'frontend developer',
    'backend developer',
    'web developer',
    
    // E-commerce specialization
    'e-commerce developer',
    'ecom developer',
    'shopify developer',
    'online store developer',
    'webshop developer',
    
    // Technologies - Frontend
    'react developer',
    'next.js developer',
    'typescript developer',
    'vue.js developer',
    'angular developer',
    'tailwind css developer',
    
    // Technologies - Backend
    'node.js developer',
    'express developer',
    'php developer',
    'laravel developer',
    'c# developer',
    '.net developer',
    
    // AI & Automation
    'ai automation',
    'machine learning engineer',
    'rag developer',
    'langchain developer',
    'ai integration',
    'chatbot developer',
    
    // Cloud & Infrastructure
    'cloud architect',
    'aws developer',
    'google cloud developer',
    'azure developer',
    'supabase developer',
    'firebase developer',
    'vercel deployment',
    
    // Database
    'postgresql developer',
    'mysql developer',
    'mongodb developer',
    'database architect',
    
    // Skills & Services
    'web application development',
    'api development',
    'rest api developer',
    'graphql developer',
    'microservices architecture',
    'pwa developer',
    'progressive web app',
    
    // Danish market
    'software udvikler',
    'webudvikler',
    'full-stack udvikler',
    'frontend udvikler',
    'backend udvikler',
  ],
  locale: 'en-US',
  type: 'website',
  email: 'hideshk@gmail.com',
  github: 'https://github.com/hidesh',
  linkedin: 'https://www.linkedin.com/in/hidesh-kumar/',
}

/**
 * JSON-LD Structured Data for Person Schema
 * Helps Google understand who you are and your expertise
 */
export function getPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    jobTitle: 'Software Engineer',
    description: siteConfig.description,
    sameAs: [
      siteConfig.github,
      siteConfig.linkedin,
    ],
    knowsAbout: [
      'Software Development',
      'Full-Stack Development',
      'E-commerce Development',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'AI Automation',
      'Cloud Architecture',
      'Web Development',
    ],
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'Mercantec',
    },
    workLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'DK',
      },
    },
  }
}

/**
 * JSON-LD Structured Data for Website Schema with Sitelinks Search Box
 */
export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.title,
    url: siteConfig.url,
    description: siteConfig.description,
    author: {
      '@type': 'Person',
      name: siteConfig.name,
    },
    inLanguage: 'en-US',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/?s={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * JSON-LD for WebPage with BreadcrumbList for subpages
 */
export function getWebPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: siteConfig.title,
    url: siteConfig.url,
    description: siteConfig.description,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'SiteNavigationElement',
          position: 1,
          name: 'About Me',
          description: 'Learn about Hidesh Kumar - Software Engineer',
          url: `${siteConfig.url}/#about`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 2,
          name: 'Education',
          description: 'Educational background and qualifications',
          url: `${siteConfig.url}/#education`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 3,
          name: 'Work Experience',
          description: 'Professional work experience and roles',
          url: `${siteConfig.url}/#experience`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 4,
          name: 'Projects',
          description: 'Featured software development projects',
          url: `${siteConfig.url}/#projects`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 5,
          name: 'Skills',
          description: 'Technical skills and technologies',
          url: `${siteConfig.url}/#skills`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 6,
          name: 'Contact',
          description: 'Get in touch with Hidesh Kumar',
          url: `${siteConfig.url}/#contact`,
        },
        {
          '@type': 'SiteNavigationElement',
          position: 7,
          name: 'Blog',
          description: 'Software development insights and tutorials',
          url: `${siteConfig.url}/blog`,
        },
      ],
    },
  }
}

/**
 * JSON-LD Structured Data for Professional Service
 */
export function getProfessionalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: siteConfig.name,
    description: 'Professional software development and web development services',
    url: siteConfig.url,
    email: siteConfig.email,
    areaServed: 'Worldwide',
    serviceType: [
      'Web Development',
      'Software Development',
      'E-commerce Development',
      'Full-Stack Development',
      'AI Integration',
      'Cloud Solutions',
    ],
  }
}

/**
 * Generate Open Graph metadata
 */
export function getOpenGraphMetadata(params?: {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
}) {
  return {
    title: params?.title || siteConfig.title,
    description: params?.description || siteConfig.description,
    url: params?.url || siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: params?.image || `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: params?.title || siteConfig.title,
      },
    ],
    locale: siteConfig.locale,
    type: params?.type || 'website',
  }
}

/**
 * Generate Twitter Card metadata
 */
export function getTwitterMetadata(params?: {
  title?: string
  description?: string
  image?: string
}) {
  return {
    card: 'summary_large_image',
    title: params?.title || siteConfig.title,
    description: params?.description || siteConfig.description,
    images: [params?.image || `${siteConfig.url}/og-image.png`],
    creator: '@hideshkumar', // Update with your actual Twitter handle if you have one
  }
}

/**
 * Generate metadata for blog posts
 */
export function getBlogPostMetadata(params: {
  title: string
  description: string
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
  image?: string
}) {
  return {
    title: `${params.title} | ${siteConfig.name}`,
    description: params.description,
    keywords: [...siteConfig.keywords, ...(params.tags || [])],
    authors: params.authors?.map(name => ({ name })) || [{ name: siteConfig.author }],
    openGraph: {
      ...getOpenGraphMetadata({
        title: params.title,
        description: params.description,
        image: params.image,
        type: 'article',
      }),
      publishedTime: params.publishedTime,
      modifiedTime: params.modifiedTime,
      authors: params.authors || [siteConfig.author],
      tags: params.tags,
    },
    twitter: getTwitterMetadata({
      title: params.title,
      description: params.description,
      image: params.image,
    }),
  }
}
