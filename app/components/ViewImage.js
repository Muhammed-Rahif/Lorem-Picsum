import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Image,
  ImageBackground,
  TouchableNativeFeedback,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Alert
} from "react-native";
import ImageBox from "./ImageBox";

import Icon from "react-native-vector-icons/FontAwesome";
import colors from "../config/colors";

import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";

function ViewImage({ route, navigation }) {
  const fileDetails = route.params;
  const [preload, setPreload] = useState(0);
  const showToast = (msg) => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT, ToastAndroid.CENTER);
  };
  return (
    <View>
      <ImageBackground
        resizeMode="cover"
        style={{ width: "100%", height: "100%" }}
        source={{ height: 100, width: 100, uri: fileDetails.download_url }}
        onLoadStart={() => {
          setPreload(true);
        }}
        onLoadEnd={() => {
          setPreload(false);
        }}
      >
        {preload ? (
          <View
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={colors.grey} />
          </View>
        ) : (
          <View style={{ display: "none" }} />
        )}
        <View style={styles.textView}>
          <Text
            numberOfLines={1}
            style={[
              styles.texts,
              { color: preload ? colors.dark : colors.light },
            ]}
          >
            Author : {fileDetails.author}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.texts,
              { color: preload ? colors.dark : colors.light },
            ]}
          >
            Width : {fileDetails.width}
          </Text>
          <Text
            numberOfLines={1}
            style={[
              styles.texts,
              { color: preload ? colors.dark : colors.light },
            ]}
          >
            Height : {fileDetails.height}
          </Text>
        </View>
        <View style={styles.downloadButtonView}>
          <TouchableOpacity style={styles.touchable}>
            <Icon
              size={40}
              name="download"
              color={preload ? colors.dark : colors.light}
              onPress={() => {
                downloadFile(fileDetails.download_url, fileDetails.url);
                showToast("Downloading in background..!");
              }}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

function downloadFile(uri, secondUri) {
  let n = secondUri.lastIndexOf("/");
  let imageName = secondUri.substring(n + 1);
  let milliSeconds = new Date().getUTCMilliseconds();
  let fileUri =
    FileSystem.documentDirectory + milliSeconds + imageName + ".jpg";
  FileSystem.downloadAsync(uri, fileUri)
    .then(({ uri }) => {
      saveFile(uri, imageName);
    })
    .catch((error) => {
      console.error(error);
    });
}

const saveFile = async (fileUri, imageName) => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === "granted") {
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    await MediaLibrary.createAlbumAsync("Download", asset, false)
      .then((res) => {
        Alert.alert(
          `Downloader`,
          `Download completed, Saved in file://Download/${imageName}.jpg`,
          [{ text: "Ok" }]
        );
      })
      .catch((err) => {
        Alert.alert(
          `Downloader`,
          `Can't download image : ${err}`,
          [{ text: "Ok" }]
        );
      });
  }
};

const styles = StyleSheet.create({
  downloadButtonView: {
    height: 100,
    width: 100,
  },
  touchable: {
    top: 575,
    left: 275,
    padding: 8,
  },
  textView: {
    position: "absolute",
    top: 500,
    left: 35,
    padding: 5,
    borderRadius: 8,
  },
  texts: {
    fontSize: 16,
    fontFamily: "monospace",
  },
});

export default ViewImage;
