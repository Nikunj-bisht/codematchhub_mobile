/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './src/modules/home/home';
import TopicListing from './src/modules/home/components/topicListing';
import Login from './src/modules/login/login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QuizRoom from './src/modules/quizRoom/quizRoom';
import QuizResult from './src/modules/quizRoom/quizResult';
import 'react-native-gesture-handler'
import MyTabs from './src/modules/home/home';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const Stack = createStackNavigator();

function App(): JSX.Element {
  
  const isDarkMode = useColorScheme() === 'dark';
  const [userData, setUserData] = useState(false);
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };
  async function getUserData(){
   let isUserDataAvai = await AsyncStorage.getItem('userData');
   console.log(isUserDataAvai,'isss')
   if(isUserDataAvai){
    setUserData(true)
   }
  }
  useEffect(() => {
    getUserData()
    SplashScreen.show();
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);
  
  return (
    <SafeAreaView style={backgroundStyle}>
      <NavigationContainer>
        {!userData ? (
          <Stack.Navigator>
            
            <Stack.Screen name="login" options={{headerShown: false}}>
              {props => <Login setUserData={setUserData} {...props} />}
            </Stack.Screen>
          </Stack.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen name="home" options={{headerShown: false}}>
              {props => <MyTabs {...props}></MyTabs>}
            </Stack.Screen>
            <Stack.Screen name="listing" options={{headerShown: false}}>
              {props => <TopicListing {...props}></TopicListing>}
            </Stack.Screen>

            <Stack.Screen name="quizRoom" options={{headerShown: false}}>
              {props => <QuizRoom {...props}></QuizRoom>}
            </Stack.Screen>
            <Stack.Screen name="result" options={{headerShown: false}}>
              {props => <QuizResult {...props}/>}
            </Stack.Screen>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
