import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import React, {  useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { images } from "../../constants";
import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import { getAllPost, getLatestPosts, getSavedPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { UseGlobalContext } from "../../context/GlobalContext";
const BookMark = () => {
  
  const {data:posts,refresh}=useAppwrite(getSavedPosts);
  console.log("saved videos "+posts)
  const [isRefresh, setIsRefresh] = useState(false);
  const { user } = UseGlobalContext();
  
  
  const onRefresh = async () => {
    setIsRefresh(true);
      await refresh();
    setIsRefresh(false);
  };
  

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <FlatList
        data={posts}

        keyExtractor={(item) => item.$id}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                
                <Text className="text-2xl font-psemibold text-white">
                  Saved Videos
                 
                </Text>
              </View>
              <View>
                <Image
                  className="h-10 w-9"
                  resizeMode="contain"
                  source={images.logoSmall}
                />
              </View>
            </View>
            <SearchInput placholder="Search your saved videos" />
  
          </View>
        )}
        renderItem={({ item }) => (
          <View>
            <VideoCard video={item}/>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos created yet"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefresh} onRefresh={onRefresh} />
        }
      />
       <StatusBar backgroundColor="#161622" style="light"/>
    </SafeAreaView>
  );
};



export default BookMark