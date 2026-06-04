import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../constants/apiConfig";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    // Admin / Auth
    "Admin",
    // Awards
    "Awards",
    // Blogs
    "BlogPosts",
    "BlogPost",
    // Categories
    "Category",
    // Cloudinary (no cache tags needed — mutations only)
    // Contact
    "ContactMessages",
    "ContactMessage",
    // Copy resources
    "CopyAward",
    "CopyPhoto",
    // Impact
    "TotalImpact",
    "ImpactStats",
    // Photos
    "Photo",
    // Rescue
    "RescuePosts",
    "RescuePost",
    // Testimonials
    "Testimonials",
    "Testimonial",
    "TestimonialStats",
    // Videos
    "Video",
    "VideoCategory",
    // Visitors
    "VisitorCount",
    "VisitorStats",
    // Volunteers
    "Volunteers",
    "Volunteer",
  ],
  endpoints: () => ({}),
});
