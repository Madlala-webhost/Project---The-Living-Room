import { setDoc, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../services/firebase";
import { baseAPI } from "./baseAPI";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const createUserData = (user, role = "user") => {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || "",
    role: role,
    createdAt: new Date().toISOString(),
  };
};

export const authAPI = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      async queryFn({ email, password, displayName }) {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
          );
          const user = userCredential.user;
          await updateProfile(user, { displayName });
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName,
            role: "user",
            createdAt: new Date().toISOString(),
          };
          try {
            await setDoc(doc(db, "users", user.uid), userData);
          } catch (firestoreError) {
            try {
              await deleteUser(user);
            } catch {}
            throw firestoreError; // Rethrow the Firestore error to be caught by the outer catch block
          }
          return {
            data: {
              ...createUserData(user, "user"),
              displayName,
            },
          };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
    loginUser: builder.mutation({
      async queryFn({ email, password }) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
          );
          const user = userCredential.user;
          const userDoc = await getDoc(doc(db, "users", user.uid));
          const userData = userDoc.exists()
            ? userDoc.data()
            : createUserData(user, "user");
          return { data: userData };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),

    logOutUser: builder.mutation({
      async queryFn() {
        try {
          await signOut(auth);
          return { data: "User logged out successfully" };
        } catch (error) {
          return { error: error.message };
        }
      },
    }),
  }),
});
export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogOutUserMutation,
} = authAPI;
