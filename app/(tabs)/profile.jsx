import { View, FlatList, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "../../constants";
import EmptyState from "../../components/EmptyState";
import { getUserPosts, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { UseGlobalContext } from "../../context/GlobalContext";
import { router } from "expo-router";
import InofBox from "../../components/InofBox";
import { StatusBar } from "expo-status-bar";

const Profile = () => {
  const { user, setUser, setIsLogged } = UseGlobalContext();
  const { data: posts } = useAppwrite(() =>
    getUserPosts(user?.documents[0].$id)
  );

  const logOut = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/SignIn");
  };

  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        ListHeaderComponent={() => (
          <View className="flex w-full justify-center items-center mt-12 mb-6 px-4">
            <TouchableOpacity
              onPress={logOut}
              className="w-full flex items-end mb-12"
            >
              <Image
                source={icons.logout}
                className="h-6 w-6 "
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View className="flex justify-center items-center w-16 h-16 border border-secondary rounded-lg ">
              <Image
                source={{ uri: user?.documents[0].avatar }}
                className="h-[90%] w-[90%] rounded-lg"
                resizeMode="contain"
              />
            </View>
            <InofBox
              title={user.documents[0].username}
              containerStyles="mt-5"
              titleStyles="text-lg"
            />
            <View className="mt-5 flex flex-row">
              <InofBox
                title={posts?.length || 0}
                subtitle="Posts"
                titleStyles="text-xl"
                containerStyles="mr-10"
              />
              <InofBox
                title="1.2k"
                subtitle="Followers"
                titleStyles="text-xl"
              />
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
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Profile;
