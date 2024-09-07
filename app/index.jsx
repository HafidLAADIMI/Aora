import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import { router, Redirect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { UseGlobalContext } from "../context/GlobalContext";
export default function App() {
  const { isLogged, loading } = UseGlobalContext();
  if (!loading && isLogged) {
    return <Redirect href="/home" />;
  }else
  return (
    <SafeAreaView className=" w-full h-full py-10  bg-primary">
      <ScrollView className="">
        <View className="flex items-center justify-center  px-4 w-full">
          <Image
            source={images.logo}
            className="h-[84px] w-[130px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="h-[298px] max-w-[380px] w-full"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold">
              Discover Endless{"\n"}
              Possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm text-gray-100 font-pregular text-center mt-7">
            Where Creativity Meets Innovation: Embark on a Journey of Limitless
            Exploration with Aora
          </Text>
          <CustomButton
            title="continue with email"
            containerStyle="w-full mt-7"
            handlePress={() => router.push("/SignIn")}
          />
        </View>
        <StatusBar backgroundColor="#161622" style="light" />
      </ScrollView>
    </SafeAreaView>
  );
}
