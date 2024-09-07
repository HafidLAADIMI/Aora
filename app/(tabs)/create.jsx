import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormFiled from "../../components/FormFiled";
import { ResizeMode, Video } from "expo-av";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { StatusBar } from "expo-status-bar";
import * as DocumentPicker from "expo-document-picker";
import { createPost } from "../../lib/appwrite";
import { UseGlobalContext } from "../../context/GlobalContext";
import { router } from "expo-router";
const Create = () => {
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });
  const [uploading, setUploading] = useState(false);
  const { user } = UseGlobalContext();
  const openPicker = async (selectedType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type:
          selectedType === "image"
            ? ["image/jpeg", "image/png", "image/jpg"]
            : ["video/mp4", "video/gif"],
      });
      console.log({ result });
      if (!result.canceled) {
        if (selectedType === "image") {
          setForm({
            ...form,
            thumbnail: result.assets[0],
          });
        } else if (selectedType === "video") {
          setForm({
            ...form,
            video: result.assets[0],
          });
        } else throw new Error("invalid type");
      }
    } catch (error) {
      console.log(error.message);
      throw new Error("error", error.message);
    }
  };
  const submit = async () => {
    if (!form.prompt || !form.thumbnail || !form.title || !form.video) {
      Alert.alert("please fill all the fields");
    }
    setUploading(true);
    try {
      await createPost({ ...form, userId: user?.documents[0].$id });
      Alert.alert("Successful upload", "file uploaded successfuly");
      router.push("/home");
    } catch (error) {
      console.log(error);
      throw new Error("error", error.message);
    } finally {
      setUploading(false);
      setForm({ title: "", video: null, thumbnail: null, prompt: "" });
    }
  };
  console.log(form);
  return (
    <SafeAreaView className="bg-primary  h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-white text-2xl font-semibold ">
          Upload videos
        </Text>
        <FormFiled
          title="Video title"
          value={form.title}
          placholder="Give your video a cache title"
          otherStyles="mt-10"
          handleChangeText={(e) => setForm({ ...form, title: e })}
        />
        <View className="space-y-2 mt-7">
          <Text className="text-base font-pmedium text-gray-100">
            Upload videos
          </Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-60 rounded-2xl"
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className="w-full h-40 rounded-2xl bg-black-100 border border-secondary-200 flex justify-center items-center">
                <View className="w-14  h-14 border border-secondary-200 border-dashed flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    className=" w-1/2 h-1/2 "
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="space-y-2 mt-7">
          <Text className="text-base font-pmedium text-gray-100">
            Upload thumbnail
          </Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-60 rounded-2xl"
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className="w-full h-16 rounded-2xl bg-black-100 border border-secondary-200 flex justify-center items-center flex-row space-x-2">
                <View className="w-6  h-6 border border-secondary-200 border-dashed flex justify-center items-center">
                  <Image
                    source={icons.upload}
                    className=" w-1/2 h-1/2 "
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormFiled
          title="AI prompt"
          value={form.prompt}
          placholder="The AI prompt for your video"
          otherStyles="mt-10"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
        />
        <CustomButton
          title="Submit & Publish"
          containerStyle="mt-7"
          handlePress={submit}
          isLoading={uploading}
        />
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Create;
