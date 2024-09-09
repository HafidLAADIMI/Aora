import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";

// Create the context
const GlobalContext = createContext();

// Hook to use the context
export const UseGlobalContext = () => useContext(GlobalContext);

const GlobalContextProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false); // Manages the login status
  const [user, setUser] = useState(null); // Holds the user object
  const [loading, setLoading] = useState(true); // Tracks if data is being loaded

  useEffect(() => {
    // Fetch current user on component mount
    getCurrentUser()
      .then((resp) => {
        if (resp) {
          // If user is found, set login state to true and store user data
          setIsLogged(true);
          setUser(resp);
        } else {
          // If no user, reset login and user state
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        // Log the error for debugging instead of throwing
        console.error("Error fetching current user:", error.message);
      })
      .finally(() => {
        // Always set loading to false after the check
        setLoading(false);
      });
  }, []);

  // Provide state and setters to the context
  return (
    <GlobalContext.Provider
      value={{ isLogged, setIsLogged, user, setUser, loading, setLoading }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
