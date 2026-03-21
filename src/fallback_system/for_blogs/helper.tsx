import { useEffect, useState } from "react";
import { MOCK_POSTS } from "./mock.data";

export interface BlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string | { _id: string; name: string; type: string };
  image: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Mock data (Prapti Foundation) ───────────────────────────────────────────

// ─── Mock hook ────────────────────────────────────────────────────────────────

export function useMockBlogPostsQuery() {
  const [state, setState] = useState<{
    data: BlogPost[] | undefined;
    isLoading: boolean;
    error: unknown;
  }>({ data: undefined, isLoading: true, error: undefined });

  useEffect(() => {
    const t = setTimeout(
      () => setState({ data: MOCK_POSTS, isLoading: false, error: undefined }),
      500,
    );
    return () => clearTimeout(t);
  }, []);

  return state;
}

// ─── Dynamic hook resolution ──────────────────────────────────────────────────

export let useGetBlogPostsQueryReal:
  | (() => { data?: BlogPost[]; isLoading: boolean; error: unknown })
  | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  useGetBlogPostsQueryReal =
    require("@/redux-store/services/blogApi").useGetBlogPostsQuery;
} catch {
  useGetBlogPostsQueryReal = null;
}
