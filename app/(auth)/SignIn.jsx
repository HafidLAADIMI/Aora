import { View, Text, Image, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormFiled from "../../components/FormFiled";
import { Link, router } from "expo-router";
import { getCurrentUser, singIn } from "../../lib/appwrite";
import { UseGlobalContext } from "../../context/GlobalContext";

const SingIn = () => {
  const  {setUser,setIsLogged}=UseGlobalContext();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
 
  const [isSubmit, setIsSubmit] = useState(false);
  const sumbit = async () => {
    if (!form.password || !form.email) {
      Alert.alert("Error", "Provide the username, password, and email.");
    }
    setIsSubmit(true);
    try {
       await singIn(form.email, form.password);
       const result=await getCurrentUser();
       setUser(result);
       setIsLogged(true)
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmit(false);
    }
  };
    return (
      <>
        <SafeAreaView className="h-full bg-primary ">
          <ScrollView>
            <View className="w-full h-full flex  justify-center px-4 my-6">
              <Image
                className="w-[115px] h-[80px]"
                resizeMode="contain"
                source={images.logo}
              />
              <Text className="text-2xl text-white font-semibold ">
                Log in to Aora
              </Text>
              <FormFiled
                title="Email"
                value={form.email}
                handleChangeText={(e) => setForm({ ...form, email: e })}
                otherStyles="mt-7"
                placholder=""
                keyBoardType="email-address"
              />
              <FormFiled
                title="Password"
                value={form.password}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                otherStyles="mt-7"
                placholder=""
              />
              <CustomButton
                title="Sign in"
                containerStyle="mt-7"
                handlePress={sumbit}
                isLoading={isSubmit}
              />
              <View className="flex flex-row justify-center pt-3 gap-2  ">
                <Text className="text-md text-gray-100 font-pregular">
                  Don't have an account ?
                </Text>
                <Link
                  className="text-md text-secondary-100 font-pregular"
                  href="/SignUp"
                >
                  Sign up
                </Link>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
};

export default SingIn;
