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
import { getAllPost, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { UseGlobalContext } from "../../context/GlobalContext";
const Home = () => {
  
  const {data:posts,refresh}=useAppwrite(getAllPost);
  const {data:latestPosts}=useAppwrite(getLatestPosts);
  const [isRefresh, setIsRefresh] = useState(false);
  const { user } = UseGlobalContext();
  console.log(user);
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
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                 {user?.documents[0]?.username}
                 
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
            <SearchInput placholder="Search a video topic" />
            <View className="w-full flex-1 pb-8 pt-5">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Last videos
              </Text>
              <Trending posts={latestPosts ??[]} />
            </View>
          </View>
        )}
        renderItem={({ item }) => (
          <View>
            <VideoCard video={item} />
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

export default Home;
