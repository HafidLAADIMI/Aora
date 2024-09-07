import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";
import { UseGlobalContext } from "../context/GlobalContext";
import { savePost } from "../lib/appwrite";

const VideoCard = ({
  video: {
    title,
    thumbnail,
    username,
    $id,
    video,
    prompt,
    users: { avatar },
  }
}) => {
  const [play, setPlay] = useState(false);
  const id=$id;
  const { user } = UseGlobalContext();
  const [isClicked, setIsClicked] = useState(false);
  const [saved, setSaved] = useState(false);
  const updatedPost ={
    title:title ,
    video:video ,
    thumbnail:thumbnail ,
    prompt:prompt ,
    saved:saved,
    userId: user?.documents[0].$id
  };
  const [uploading, setUploading] = useState(false);
  const submit = async () => {
    setSaved(true);
    if (!updatedPost) {
      Alert.alert("there was an error in saving the post");
    }
    setUploading(true);
    try {
      await savePost(updatedPost,id);
      Alert.alert("Successful save", "video saved successfuly");
    } catch (error) {
      console.log(error);
      throw new Error("error", error.message);
    } finally {
      setUploading(false);
    }
  };
  

  return (
    <View className="flex flex-col items-center px-4 mb-14">
      <View className="flex flex-row items-start gap-3 relative">
        <View className="flex flex-row flex-1 justify-center items-center">
          <View className="w-[46px] h-[46px] rounded-lg border border-secondary flex items-center justify-center">
            <Image
              source={{ uri: avatar }}
              className="h-full w-full rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="flex flex-1 gap-y-1 justify-center ml-3">
            <Text
              className=" font-psemibold text-white text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="font-pregular text-gray-100 text-xs"
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={()=>setIsClicked(!isClicked)} className="pt-2">
          <Image source={icons.menu} className="h-5 w-5" resizeMode="contain" />
        </TouchableOpacity >
        <TouchableOpacity onPress={submit} className={`${isClicked?"flex":"hidden"}  items-center justify-center h-8 w-16 rounded-lg shadow-sm bg-whites shadow-black-100 absolute right-6 bg-white `}>
          <Text className="text-black-100 font-psemibold text-xs text-center">
            save
          </Text>
        </TouchableOpacity>
      </View>
      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-60 items-center rounded-md bg-black/10 "
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            console.log("playing", status.error);
            if (status.error) {
              Alert.alert("Error", "An error occurred when playing the video");
              setPlay(false);
            }
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          onPress={() => setPlay(true)}
          activeOpacity={0.7}
          className="w-full relative h-60 rounded-xl flex items-center justify-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="h-full w-full rounded-xl mt-3"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="h-12 w-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;

const styles = StyleSheet.create({});
