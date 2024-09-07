import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { images } from "../constants";
import CustomButton from "./CustomButton";
import { router } from "expo-router";
const EmptyState = ({ title, subtitle }) => {
  return (
    <View className="flex justify-center items-center px-4">
      <View>
        <Image
          className="h-[215px] w-[270px]"
          resizeMode="contain"
          source={images.empty}
        />
      </View>

      <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>
      <Text className="text-2xl font-psemibold text-white">{title}</Text>
      <CustomButton
        title="Back to Explore"
        handlePress={() => router.push("/create")}
        containerStyle="w-full mt-5"
      />
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({});
