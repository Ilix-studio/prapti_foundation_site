// src/components/SEO.tsx
import { Helmet } from "react-helmet";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  keywords?: string[];
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
}

const SITE_NAME =
  "Prapti Foundation - Dog Rescue & Animal Welfare Golaghat, Assam";
const BASE_URL = "https://praptifoundation.in";
const DEFAULT_IMAGE = `${BASE_URL}/og-default.jpg`;

export const SEO = ({
  title,
  description,
  canonical,
  ogImage = DEFAULT_IMAGE,
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  author,
}: SEOProps) => {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = canonical ? `${BASE_URL}${canonical}` : BASE_URL;

  const defaultKeywords = [
    "Prapti Foundation Golaghat",
    "dog rescue Assam",
    "animal welfare Golaghat",
    "stray dog shelter Assam India",
    "dog adoption Golaghat",
    "animal NGO Northeast India",
  ];

  const allKeywords = [...new Set([...defaultKeywords, ...keywords])];

  return (
    <Helmet>
      {/* Primary Meta */}
      <title>{fullTitle}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={allKeywords.join(", ")} />
      <link rel='canonical' href={url} />

      {/* Open Graph */}
      <meta property='og:type' content={type} />
      <meta property='og:url' content={url} />
      <meta property='og:title' content={fullTitle} />
      <meta property='og:description' content={description} />
      <meta property='og:image' content={ogImage} />
      <meta property='og:site_name' content={SITE_NAME} />
      <meta property='og:locale' content='en_IN' />

      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={fullTitle} />
      <meta name='twitter:description' content={description} />
      <meta name='twitter:image' content={ogImage} />

      {/* Article specific */}
      {type === "article" && publishedTime && (
        <meta property='article:published_time' content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property='article:modified_time' content={modifiedTime} />
      )}
      {type === "article" && author && (
        <meta property='article:author' content={author} />
      )}

      {/* Geo targeting */}
      <meta name='geo.region' content='IN-AS' />
      <meta name='geo.placename' content='Golaghat, Assam' />
      <meta name='geo.position' content='26.7509;94.2037' />
      <meta name='ICBM' content='26.7509, 94.2037' />
    </Helmet>
  );
};
