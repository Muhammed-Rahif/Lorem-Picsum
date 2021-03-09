import React from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import { useDimensions } from "@react-native-community/hooks";

import colors from "../config/colors";

function HeaderSection(props) {
  return (
    <View>
      <View
        style={[
          styles.section,
          { width: useDimensions().window.width, height: 200 },
        ]}
      >
        <Image
          width="100%"
          height="100%"
          source={require("../assets/images/icon.png")}
        />
        <Text style={styles.text}>Welcome to Lorem Picsum</Text>
        <Text style={[styles.text,{opacity:.45,fontSize:10}]}>Image-gallery</Text>
      </View>
      <View
        style={{
          borderBottomColor: colors.secondary,
          borderBottomWidth: 1,
          marginLeft:60,
          marginRight:60,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  text: {
    fontFamily: "monospace",
  },
});

export default HeaderSection;
