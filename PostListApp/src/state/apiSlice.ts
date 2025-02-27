// src/state/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://gorest.co.in/public/v2/' }),
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => 'posts',
    }),
    getPostComments: builder.query<Comment[], number>({
      query: (postId) => `posts/${postId}/comments`,
    }),
  }),
});

export const { useGetPostsQuery, useGetPostCommentsQuery } = apiSlice;

interface Post {
  id: number;
  user_id: number;
  title: string;
  body: string;
}

interface Comment {
  id: number;
  post_id: number;
  name: string;
  email: string;
  body: string;
}