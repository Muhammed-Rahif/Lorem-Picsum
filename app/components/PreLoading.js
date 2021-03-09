import React from 'react';
import { View,ActivityIndicator,StyleSheet } from "react-native";

import colors from "../config/colors";

function PreLoading(props) {
    return (
        <View style={styles.view}>
            <ActivityIndicator style={props.st} size="large" color={props.st.color}/>
        </View>
    );
}

const styles = StyleSheet.create({
  view:{
    justifyContent:"center",
    alignItems:"center",
    flex:1,
  }
})

export default PreLoading;