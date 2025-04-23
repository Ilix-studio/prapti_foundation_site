import Hemangini from "./../assets/B.jpeg";
import myDog from "./../assets/C.jpeg";
import indianDog from "./../assets/D.jpg";
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

export interface PopularPost {
  id: string;
  title: string;
  date: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "A-Little-Kindness",
    title:
      "A Little Kindness Can Change Their World: The Impact of Helping Dogs in Need",
    excerpt:
      "Follow the inspiring story of Max, a Labrador who was rescued from a neglectful situation and found his perfect family.",
    date: "June 15, 2023",
    category: "Adoption Stories",
    image: Hemangini,
  },
  {
    id: "5-essential-tips-for-new-dog-owners",
    title: "5 Essential Tips for New Dog Owners",
    excerpt:
      "Bringing a new dog home? Here are five crucial tips to help you and your furry friend adjust to your new life together.",
    date: "May 28, 2023",

    category: "Dog Care",
    image: myDog,
  },
  {
    id: "understanding-dog-body-language",
    title:
      "Understanding Dog Body Language: What Your Pup Is Trying to Tell You",
    excerpt:
      "Learn to decode your dog's body language and understand what they're communicating to become a better pet parent.",
    date: "May 10, 2023",

    category: "Training Tips",
    image: indianDog,
  },
  {
    id: "how-to-prepare-your-home-for-a-new-dog",
    title: "How to Prepare Your Home for a New Dog",
    excerpt:
      "Essential steps to take before bringing your new furry friend home to ensure a smooth transition for everyone.",
    date: "April 22, 2023",

    category: "Adoption Tips",
    image: myDog,
  },
  {
    id: "summer-safety-tips-for-dogs",
    title: "Summer Safety Tips for Dogs",
    excerpt:
      "Keep your dog safe and comfortable during the hot summer months with these essential tips.",
    date: "June 5, 2023",

    category: "Health & Wellness",
    image: indianDog,
  },
  {
    id: "benefits-of-adopting-senior-dogs",
    title: "The Unexpected Benefits of Adopting Senior Dogs",
    excerpt:
      "Discover why senior dogs make amazing companions and why you might want to consider adopting an older dog.",
    date: "March 18, 2023",

    category: "Adoption Stories",
    image: myDog,
  },
];

export const popularPosts: PopularPost[] = [
  {
    id: "how-to-prepare-your-home-for-a-new-dog",
    title: "How to Prepare Your Home for a New Dog",
    date: "April 22, 2023",
    image: myDog,
  },
  {
    id: "summer-safety-tips-for-dogs",
    title: "Summer Safety Tips for Dogs",
    date: "June 5, 2023",
    image: myDog,
  },
  {
    id: "benefits-of-adopting-senior-dogs",
    title: "The Unexpected Benefits of Adopting Senior Dogs",
    date: "March 18, 2023",
    image: myDog,
  },
];

export const relatedPosts: PopularPost[] = [
  {
    id: "how-to-prepare-your-home-for-a-new-dog",
    title: "How to Prepare Your Home for a New Dog",
    date: "April 22, 2023",
    image: myDog,
  },
  {
    id: "summer-safety-tips-for-dogs",
    title: "Summer Safety Tips for Dogs",
    date: "June 5, 2023",
    image: myDog,
  },
  {
    id: "benefits-of-adopting-senior-dogs",
    title: "The Unexpected Benefits of Adopting Senior Dogs",
    date: "March 18, 2023",
    image: myDog,
  },
];

// Get the latest 3 posts for the homepage section
export const getLatestPosts = (): BlogPost[] => {
  return [...blogPosts]
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, 3);
};
