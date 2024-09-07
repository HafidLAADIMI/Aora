import { View, Text, Image, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import FormFiled from "../../components/FormFiled";
import { Link, router } from "expo-router";
import { createUser } from "../../lib/appwrite";
import { UseGlobalContext } from "../../context/GlobalContext";
const SingUp = () => {
  const  {setUser ,setIsLogged}=UseGlobalContext();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isSubmit, setIsSubmit] = useState(false);
  const sumbit = async () => {
    if (!form.username || !form.password || !form.email) {
      Alert.alert("Error", "Provide the username, password, and email.");
      return; // This prevents further execution if validation fails
    }
    setIsSubmit(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);
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
              Sign up to Aora
            </Text>
            <FormFiled
              title="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles="mt-10"
              placholder=""
            />
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
              title="Sign Up"
              handlePress={sumbit}
              containerStyle="mt-7"
              isLoading={isSubmit}
            />
            <View className="flex flex-row justify-center pt-3 gap-2  ">
              <Text className="text-md text-gray-100 font-pregular">
                Have an account already ?
              </Text>
              <Link
                className="text-md text-secondary-100 font-pregular"
                href="/SignIn"
              >
                Sign in
              </Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SingUp;
