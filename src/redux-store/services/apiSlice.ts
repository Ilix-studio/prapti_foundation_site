import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "../../constants/apiConfig";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Admin",
    "Editor",
    "Awards",
    "BlogPosts",
    "BlogPost",
    "Category",
    "ContactMessages",
    "ContactMessage",
    "CopyAward",
    "CopyPhoto",
    "TotalImpact",
    "ImpactStats",
    "Photo",
    "RescuePosts",
    "RescuePost",
    "Testimonials",
    "Testimonial",
    "TestimonialStats",
    "Video",
    "VideoCategory",
    "VisitorCount",
    "VisitorStats",
    "Volunteers",
    "Volunteer",
  ],
  endpoints: () => ({}),
});
