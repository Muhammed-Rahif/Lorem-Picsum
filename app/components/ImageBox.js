import { TouchableNativeFeedback } from "react-native-gesture-handler";
import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Linking,
  ToastAndroid,
  Alert
} from "react-native";
import { useDimensions } from "@react-native-community/hooks";
import Icon from "react-native-vector-icons/FontAwesome";
import PreLoading from "../components/PreLoading";

import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from "expo-file-system";
import * as Permissions from 'expo-permissions';


import colors from "../config/colors";

function ImageBox(props) {
  const showToast = (msg) => {
    ToastAndroid.showWithGravity(msg, ToastAndroid.SHORT,ToastAndroid.CENTER);
  };

  const [imageload, setImageLoad] = useState(0);
  return (
    <View style={[styles.container]}>
      <TouchableOpacity style={{ zIndex: 3 }}>
        <Image
          style={styles.image}
          source={{
            height: useDimensions().window.width - 60,
            uri: props.fileDetails.download_url,
          }}
          onLoadStart={() => {
            setImageLoad(true);
          }}
          onLoadEnd={() => {
            setImageLoad(false);
          }}
        />
        {imageload ? (
          <PreLoading st={{ color: colors.grey, top: -150 }} />
        ) : (
          <View style={{ display: "none" }} />
        )}
        <View style={styles.bottomSection}>
          <View style={styles.fileDetails}>
            <Text numberOfLines={1} style={styles.textDetails}>
              Author : {props.fileDetails.author}
            </Text>
            <Text numberOfLines={1} style={styles.textDetails}>
              Image Width : {props.fileDetails.width}
            </Text>
            <Text numberOfLines={1} style={styles.textDetails}>
              Image Height : {props.fileDetails.height}
            </Text>
            <Text numberOfLines={1} style={styles.textDetails}>
              Image Id : {props.fileDetails.id}
            </Text>
          </View>

          <View style={styles.buttonsArea}>
            <View style={styles.downloadButton}>
              <Icon.Button
                name="download"
                backgroundColor={colors.grey}
                onPress={() => {
                  downloadFile(
                    props.fileDetails.download_url,
                    props.fileDetails.url
                  );
                  showToast("Downloading in background..!")
                }}
              >
                Download
              </Icon.Button>
            </View>
            <View style={styles.webButton}>
              <Icon.Button
                name="chrome"
                backgroundColor={colors.grey}
                onPress={() => {
                  showToast("Opening in web..!")
                  Linking.openURL(props.fileDetails.url);
                }}
              >
                Open in web
              </Icon.Button>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}


function downloadFile(uri,secondUri){
  let n = secondUri.lastIndexOf("/");
  let imageName = secondUri.substring(n+1);
  let milliSeconds = new Date().getUTCMilliseconds();
  let fileUri = FileSystem.documentDirectory + milliSeconds + imageName + ".jpg";
  FileSystem.downloadAsync(uri, fileUri)
  .then(({ uri }) => {
      saveFile(uri,imageName);
    })
    .catch(error => {
      console.error(error);
    })
}

const saveFile = async (fileUri,imageName) => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(fileUri)
      await MediaLibrary.createAlbumAsync("Download", asset, false).then((res)=>{
        Alert.alert(`Downloader`,`Download completed, Saved in file://Download/${imageName}.jpg`,[{text:"Ok"}])
      })
  }
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.third,
    position: "relative",
    margin: 30,
    flex: 1,
    flexDirection: "column",
    borderRadius: 26,
  },
  image: {
    margin: 12,
    borderRadius: 26,
  },
  bottomSection: {
    width: "100%",
  },
  downloadButton: {
    zIndex: 5,
    right: 12,
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 26,
    alignSelf: "flex-end",
  },
  webButton: {
    zIndex: 5,
    left: 12,
    paddingTop: 18,
    paddingBottom: 18,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 26,
    alignSelf: "flex-start",
    position: "absolute",
  },
  fileDetails: {
    alignSelf: "flex-start",
    marginLeft: 25,
    color: colors.light,
  },
  textDetails: {
    fontFamily: "monospace",
    fontSize: 16,
  },
  buttonsArea: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ImageBox;
