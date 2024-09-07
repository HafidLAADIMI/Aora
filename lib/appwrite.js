import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.hafid.aora",
  projectId: "66d065e600326ea73e04",
  databaseId: "66d0804700372fdd6ab4",
  usersCollectionId: "66d0808000138f29956b",
  videosCollectionId: "66d080c0001c27c4045e",
  storageId: "66d083460025da83d361",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId)
  .setPlatform(config.platform); // YOUR application ID

const account = new Account(client);
const avatar = new Avatars(client);
const database = new Databases(client);
const storage = new Storage(client);

// Register User
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw new Error("No user was registered");

    console.log("New Account ID: ", newAccount.$id); // Log specific property

    await singIn(email, password);

    const avatarUrl = avatar.getInitials(username);
    const newUser = await database.createDocument(
      config.databaseId,
      config.usersCollectionId,
      ID.unique(), // Make sure to call the function
      {
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    console.log("New User Document ID: ", newUser.$id); // Log specific property
    return newUser;
  } catch (error) {
    console.error("CreateUser Error: ", error.message); // Log only the error message
    throw new Error(error.message || "Failed to create user");
  }
};

export const singIn = async (email, password) => {
  try {
    const currentSession = await account.get().catch(() => null);

    // Check if the session has the necessary scope
    if (currentSession) {
      console.log("Already signed in with session ID:", currentSession.$id);
      return currentSession;
    } else {
      // If the session lacks the correct scope, create a new session
      // const session = await account.createEmailPasswordSession(email, password);

      const session = await account.createEmailSession(email, password);
      return session;
    }
  } catch (error) {
    console.error("SignIn Error: ", error.message);
    throw new Error(error.message || "Failed to sign in");
  }
};

export const getAccount = async () => {
  try {
    const currentAccount = await account.get();

    return currentAccount;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();
    
    if (!currentAccount) throw Error;

    const currentUser = await database.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      // [Query.equal("accountId", currentAccount.$id)]
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;
  
    return currentUser;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllPost = async () => {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videosCollectionId
    );
    if (!posts) throw new Error("there is no posts");
    return posts.documents;
  } catch (error) {
    throw new Error("Error", error.message);
  }
};
export const getLatestPosts = async () => {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );
    if (!posts) throw new Error("there is no posts");
    return posts.documents;
  } catch (error) {
    throw new Error("Error", error.message);
  }
};
export const searchPosts = async (query) => {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.search("title", query)]
    );
    if (!posts) throw new Error("there is no posts");
    return posts.documents;
  } catch (error) {
    throw new Error("Error", error.message);
  }
};
// get user posts
export const getUserPosts = async (userId) => {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.equal("users", userId)]
    );
    if (!posts || posts.documents.length === 0) return null;

    console.log(posts);
    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error("Error catched", error.message);
  }
};

export const signOut = async () => {
  try {
    const session = account.deleteSession("current");
    return session;
  } catch (error) {
    throw Error(error.message);
  }
};

// create a video post
export const createPost = async (form) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await database.createDocument(
      config.databaseId,
      config.videosCollectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        users: form.userId,
        saved:form.saved
      }
    );

    return newPost;
  } catch (error) {
    console.log(error)
    throw new Error("error", error.message);
  }
};

// save videos by updating the post
export const savePost = async (post,postId) => {
  try {

    const updatedPost = await database.updateDocument(
      config.databaseId,
      config.videosCollectionId,
      postId,
      {
        title: post.title,
        thumbnail: post.thumbnail,
        video: post.video,
        prompt: post.prompt,
        users: post.userId,
        saved:post.saved,
      }
    );
    console.log("update in appwrite"+updatedPost)
    return updatedPost;
  } catch (error) {
    console.log(error.message)
    throw new Error("error", error.message);
  }
};

// uploadFile function

export const uploadFile = async (file, type) => {
  if (!file) return;
  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };
  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.log(error)
    throw new Error("error", error.message);
  }
};

// getFilePreviw function
export const getFilePreview = async (fileId, type) => {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("error", error.message);
   
    }
    if (!fileUrl) throw new Error("There is no file url");
    return fileUrl;
  } catch (error) {
    console.log(error)
    throw new Error("error", error.message);
  }
};

// get saved posts
export const getSavedPosts = async () => {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.equal("saved", false)]
    );
    if (!posts || posts.documents.length === 0) return null;

    console.log(posts);
    return posts.documents;
  } catch (error) {
    console.log(error);
    throw new Error("Error catched", error.message);
  }
};

// search saved posts
export const searchSavedPosts = async (query) => {
  try {
    const posts = await database.listDocuments(
      config.databaseId,
      config.videosCollectionId,
      [Query.search("title", query),Query.equal("saved",false)]
    );
    if (!posts) throw new Error("there is no posts");
    return posts.documents;
  } catch (error) {
    throw new Error("Error", error.message);
  }
};