import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseAPI = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery(),
  endpoints: () => ({
    // Define your endpoints here
  }),
});
