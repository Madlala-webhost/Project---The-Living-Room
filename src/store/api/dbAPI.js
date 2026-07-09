import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "../../services/firebase";
import { baseAPI } from "./baseAPI";

const toSerializableError = (error, fallbackMessage) => {
  if (!error || typeof error !== "object") {
    return { message: fallbackMessage };
  }

  return {
    code: error.code || "unknown",
    message: error.message || fallbackMessage,
    name: error.name || "Error",
  };
};

export const dbAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getdbSpecies: builder.query({
      async queryFn(_arg, api) {
        //api is the second argument, which gives access to getState and other methods like dispatch. _arg is not used here, but it's available if needed for more complex logic.
        const state = api?.getState?.();
        const authState = state?.auth;

        if (!authState?.user?.uid) {
          return { error: { message: "User not authenticated" } };
        }

        try {
          const q = query(
            collection(db, "species"),
            where("userId", "==", authState.user.uid),
          );
          const querySnapshot = await getDocs(q);
          const species = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          return { data: species };
        } catch (error) {
          return {
            error: toSerializableError(error, "Failed to load species"),
          };
        }
      },
      providesTags: ["Species"],
    }),

    adddbSpecies: builder.mutation({
      async queryFn(speciesData, api) {
        const state = api?.getState?.();
        const authState = state?.auth;

        if (!authState?.user?.uid) {
          return { error: { message: "User not authenticated" } };
        }

        //check if species already exists in the database
        try {
          const q = query(
            collection(db, "species"),
            where("userId", "==", authState.user.uid),
            where("taxonKey", "==", speciesData.taxonKey),
            orderBy("CreatedAt", "desc"),
          );
          const querySnapshot = await getDocs(q);
          const existingSpecies = querySnapshot.docs.find(
            (doc) => doc.data().taxonKey === speciesData.taxonKey,
          );
          if (existingSpecies) {
            return { error: { message: "Species already exists" } };
          }
        } catch (error) {
          return {
            error: toSerializableError(error, "Failed duplicate-check query"),
          };
        }

        try {
          const timestamp = new Date().toISOString();

          const docRef = await addDoc(collection(db, "species"), {
            taxonKey: speciesData.taxonKey,
            CreatedAt: timestamp,
            userId: authState.user.uid,
          });
          return {
            data: {
              id: docRef.id,
              ...speciesData,
              CreatedAt: timestamp,
              userId: authState.user.uid,
            },
          };
        } catch (error) {
          return {
            error: toSerializableError(error, "Failed to add species"),
          };
        }
      },
      invalidatesTags: ["Species"],
    }),
  }),
});

export const { useGetdbSpeciesQuery, useAdddbSpeciesMutation } = dbAPI;
