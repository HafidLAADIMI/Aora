import { useState,useEffect } from "react";
import { Alert } from "react-native";

const useAppwrite=(fn)=>{
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState([]);
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const reponse = await fn();
      setData(reponse);
    } catch (error) {
      Alert.alert("Error", error.message);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  const refresh=()=>fetchData();
 return {data,isLoading,refresh}
}
export default useAppwrite;