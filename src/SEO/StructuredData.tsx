// src/components/StructuredData.tsx
import { Helmet } from "react-helmet";

interface OrganizationSchemaProps {
  page?: "home" | "about" | "contact";
}

export const OrganizationSchema = ({}: OrganizationSchemaProps) => {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": "https://praptifoundation.in/#organization",
    name: "Prapti Foundation",
    alternateName: "Prapti Foundation Golaghat",
    description:
      "Dog rescue and animal welfare organization based in Golaghat, Assam, India. Dedicated to rescuing, rehabilitating, and rehoming stray dogs.",
    url: "https://praptifoundation.in",
    logo: "https://praptifoundation.in/logo.png",
    image: "https://praptifoundation.in/og-default.jpg",
    foundingDate: "2020", // Update with actual date
    foundingLocation: {
      "@type": "Place",
      name: "Golaghat, Assam, India",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Golaghat",
        containedInPlace: {
          "@type": "State",
          name: "Assam",
          containedInPlace: {
            "@type": "Country",
            name: "India",
          },
        },
      },
      {
        "@type": "State",
        name: "Assam",
      },
    ],
    knowsAbout: [
      "Dog Rescue",
      "Animal Welfare",
      "Stray Dog Rehabilitation",
      "Pet Adoption",
      "Animal Rights",
    ],
    slogan: "Rescuing and rehabilitating stray dogs in Golaghat, Assam",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Golaghat",
      addressRegion: "Assam",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "General Inquiry",
      url: "https://praptifoundation.in/contact",
    },
    sameAs: [
      // Add social media URLs
      "https://facebook.com/praptifoundation",
      "https://instagram.com/praptifoundation",
    ],
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://praptifoundation.in/#website",
    url: "https://praptifoundation.in",
    name: "Prapti Foundation - Dog Rescue Golaghat Assam",
    description:
      "Official website of Prapti Foundation, a dog rescue and animal welfare NGO in Golaghat, Assam, India",
    publisher: {
      "@id": "https://praptifoundation.in/#organization",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://praptifoundation.in/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Helmet>
      <script type='application/ld+json'>
        {JSON.stringify(organizationData)}
      </script>
      <script type='application/ld+json'>{JSON.stringify(websiteData)}</script>
    </Helmet>
  );
};

// where to add this code

// // For blog posts
interface BlogPostSchemaProps {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedDate: string;
  modifiedDate?: string;
  author?: string;
}

export const BlogPostSchema = ({
  title,
  description,
  url,
  image,
  publishedDate,
  modifiedDate,
  author = "Prapti Foundation",
}: BlogPostSchemaProps) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image,
    url: `https://praptifoundation.in${url}`,
    datePublished: publishedDate,
    dateModified: modifiedDate || publishedDate,
    author: {
      "@type": "Organization",
      name: author,
      url: "https://praptifoundation.in",
    },
    publisher: {
      "@id": "https://praptifoundation.in/#organization",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://praptifoundation.in${url}`,
    },
  };

  return (
    <Helmet>
      <script type='application/ld+json'>{JSON.stringify(data)}</script>
    </Helmet>
  );
};

// For rescue stories
interface RescueStorySchemaProps {
  title: string;
  description: string;
  url: string;
  beforeImage: string;
  afterImage: string;
  rescueDate: string;
}

export const RescueStorySchema = ({
  title,
  description,
  url,
  beforeImage,
  afterImage,
  rescueDate,
}: RescueStorySchemaProps) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: [beforeImage, afterImage],
    url: `https://praptifoundation.in${url}`,
    datePublished: rescueDate,
    author: {
      "@id": "https://praptifoundation.in/#organization",
    },
    publisher: {
      "@id": "https://praptifoundation.in/#organization",
    },
    about: {
      "@type": "Thing",
      name: "Dog Rescue",
      description: "Animal rescue operation in Golaghat, Assam",
    },
  };

  return (
    <Helmet>
      <script type='application/ld+json'>{JSON.stringify(data)}</script>
    </Helmet>
  );
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

export const BreadcrumbSchema = ({ items }: { items: BreadcrumbItem[] }) => {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://praptifoundation.in${item.url}`,
    })),
  };

  return (
    <Helmet>
      <script type='application/ld+json'>{JSON.stringify(data)}</script>
    </Helmet>
  );
};
