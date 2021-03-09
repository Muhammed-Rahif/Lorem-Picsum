import React,{Component} from "react";
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
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HeaderSection from "./app/components/HeaderSection";
import ImageBox from "./app/components/ImageBox";
import PreLoading from "./app/components/PreLoading";
import { useEffect } from "react/cjs/react.development";

import colors from "./app/config/colors";
import axios from "axios";

class HomeScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      images:[],
      preLoading:true
    }
  }

  componentDidMount(){
    axios
      .get("https://picsum.photos/v2/list?limit=2")
      .then((response) => {
        this.setState({images:response.data});
        this.setState({preLoading:false})
      })
      .catch((err) => {
        alert("Unable to connect server :" + err);
      });
  }

  
  fetchImages(){
    axios
    .get(`https://picsum.photos/v2/list?limit=${this.state.images.length+2}`)
    .then((response) => {
      this.setState({images:response.data});
      this.setState({preLoading:false})
    })
    .catch((err) => {
      alert("Unable to connect server :" + err);
    });
  }
  
  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  render(){
    
    return (
      <ScrollView
        style={{ backgroundColor: colors.primary }}
        showsVerticalScrollIndicator={false}
        onScroll={({nativeEvent}) => {
          if (this.isCloseToBottom(nativeEvent)) {
            this.setState({preLoading:true});
            this.fetchImages(this.state.images);
          }
        }}
        scrollEventThrottle={400}
      >
        <StatusBar backgroundColor={colors.third} />
        <HeaderSection />
        {
          this.state.images.map((itm,key) => { return <ImageBox fileDetails={itm} />})
        }
        { this.state.preLoading ? <PreLoading st={{color:colors.grey,margin:50}} /> : <View style={{display:"none"}} /> }
      </ScrollView>
    );
  }
}

function LogoTitle() {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Image
        style={{ width: 50, height: 50 }}
        source={require("./app/assets/images/icon.png")}
      />
      <Text
        style={{
          fontFamily: "monospace",
          fontWeight: "bold",
          fontSize: 18,
          paddingLeft: 8,
        }}
      >
        Lorem Picsum
      </Text>
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="home"
          options={{
            headerStyle: {
              backgroundColor: colors.third,
            },
            headerTitle: (props) => <LogoTitle />,
          }}
          component={HomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;