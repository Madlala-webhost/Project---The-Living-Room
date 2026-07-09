import { BrowserRouter } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./router/Router";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth"; //This import statement brings in the onAuthStateChanged action from the authSlice file, which is responsible for handling changes in the user's authentication state. This action will be dispatched to update the Redux store whenever the authentication state changes, ensuring that the application reflects the current user's status (logged in or logged out) and their associated data.
import { auth, db } from "./services/firebase"; //This import statement brings in the auth and db objects from the firebaseConfig file, which are used to interact with Firebase Authentication and Firestore Database services, respectively. The auth object allows us to manage user authentication (e.g., sign in, sign out, and listen for authentication state changes), while the db object enables us to read from and write to the Firestore database, allowing us to store and retrieve user-related data as needed.
import { clearUser, setUser } from "./store/slice/authSlice"; //This import statement brings in the setUser action from the authSlice file, which is used to update the Redux store with the current user's information. When a user logs in or their authentication state changes, this action will be dispatched to store the user's data (such as their ID, email, and role) in the Redux state, allowing the application to access and display user-specific information throughout the app.
import { doc, getDoc } from "firebase/firestore"; //This import statement brings in the doc and getDoc functions from the firebase/firestore module, which are used to interact with Firestore documents. The doc function is used to create a reference to a specific document in a Firestore collection, while the getDoc function is used to retrieve the data from that document. In this context, these functions will be used to fetch user-related data from Firestore when the authentication state changes, allowing the application to access and display user-specific information based on their stored data.
import { useGetdbSpeciesQuery } from "./store/api/dbAPI"; //This import statement brings in the useGetdbSpeciesQuery hook from the dbAPI file, which is used to fetch species data from the Firestore database. This hook allows the application to retrieve a list of species associated with the current user, enabling features such as displaying the user's species count in the header and providing access to species-related functionality throughout the app.

function App() {
  const { data: dbSpeciesData, isLoading, isError } = useGetdbSpeciesQuery(); //This line uses the useGetdbSpeciesQuery hook to fetch species data from the Firestore database. The hook returns an object containing the fetched data (dbSpeciesData), a loading state (isLoading), and an error state (isError). This allows the application to manage the species data retrieval process, handle loading states, and display any errors that may occur during the fetch operation. The fetched species data can then be used to display the user's species count in the header and provide access to species-related functionality throughout the app.
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const baseUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          role: "user",
        };

        // Set auth state immediately to avoid "logged-out" flash while Firestore loads.
        dispatch(setUser(baseUser));

        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            dispatch(
              setUser({
                ...baseUser,
                ...userData,
                uid: user.uid,
                email: user.email,
                displayName: userData.displayName || user.displayName || "",
              }),
            );
          } else {
            dispatch(setUser(baseUser));
          }
        } catch (error) {
          dispatch(setUser(baseUser));
        }
      } else {
        dispatch(clearUser());
      }
    });
    return () => unsubscribe(); // Cleanup the listener when the component unmounts to prevent memory leaks and ensure that the application does not continue to listen for authentication state changes after the component is no longer in use.
  }, [dispatch]);
  const handleSpeciesCount = () => {
    if (dbSpeciesData && Array.isArray(dbSpeciesData)) {
      return dbSpeciesData.length;
    }
    return 0;
  };
  return (
    <BrowserRouter>
      <Header handleSpeciesCount={handleSpeciesCount} />
      <main className="flex-grow-1">
        <AppRoutes />
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  );
}

export default App;
