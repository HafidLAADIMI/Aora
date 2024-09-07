import { View, Text, TextInput, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";
const SearchInput = ({
  title,
  value,
  placholder,
  otherStyles,
  handleChangeText,
  ...props
}) => {
  const [query, setQuery] = useState("");
  const pathname=usePathname();

  return (
    <View className="flex flex-row items-center space-x-4 w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 focus:border-secondary">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        placeholder={placholder}
        placeholderTextColor="#CDCDE0"
        onChangeText={(e)=>setQuery(e)}
      />

      <TouchableOpacity
        onPress={()=>{
          if(query===""){
           return Alert.alert("Missing query","please provide something to search...")
          }
          if(pathname.startsWith("/search")){
            router.setParams({query})
          }
          else{
            router.push(`/search/${query}`)
          }
        
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
