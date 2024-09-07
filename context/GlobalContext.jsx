import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const UseGlobalContext =()=> useContext(GlobalContext);
const GlobalContextProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((resp) => {
        if (resp) {
          setIsLogged(true);
          setUser(resp);
            
        } else {
          setIsLogged(false);
          setUser(null);
          console.log(resp);
        }
      })
      .catch((error) => {
        {
          throw new Error(error.message);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <GlobalContext.Provider
      value={{ isLogged, setIsLogged, user, setUser, loading, setLoading }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
