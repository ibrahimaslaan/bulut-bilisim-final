import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import LoginS from '../src/screen/Login';
import SignUpS from '../src/screen/SignUp';
import ProfileS from '../src/screen/Profile';
import NewsS from '../src/screen/News';
import NewsDetailS from '../src/screen/NewsDetail';
import OneSignal from 'react-native-onesignal';
import NewsDetail from '../src/screen/NewsDetail';
import Color from '../constants/Color';
import {useSelector, useDispatch} from 'react-redux';
export default function App(children) {
    useEffect(() => {
        OneSignal.setAppId("13128a81-2fa0-4336-927b-2b6e5a448936");
        OneSignal.setLogLevel(6, 0);
      
        OneSignal.promptForPushNotificationsWithUserResponse(response => {
            this.OSLog("Prompt response:", response);
        });
    
    
       
      }, [])


  const Stack = createStackNavigator();

  const AuthCreate = () => {
    return (
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen
          options={{headerShown: false}}
          name="Login"
          component={LoginS}
        />

        <Stack.Screen
          options={{
            headerShown: true,
            title: '',
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: Color.primary,
            },
          }}
          name="SignUp"
          component={SignUpS}
        />
      </Stack.Navigator>
    );
  };
  const NewsCreate = () => {
    return (
      <Stack.Navigator initialRouteName="NewsCreate">
        <Stack.Screen
          options={{
            headerShown: true,
            title: '',
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: Color.primary,
            },
          }}
          name="NewsS"
          component={NewsS}
        />
        <Stack.Screen
         options={{
            headerShown: true,
            title: 'Haber Detayları',
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: Color.primary,
            },
          }}
        name="NewsDetail" component={NewsDetailS} />
        <Stack.Screen
         options={{
            headerShown: true,
            title: '',
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: Color.primary,
            },
          }}
        name="Profile" component={ProfileS} />
      </Stack.Navigator>
    );
  };
  const loginStatus = useSelector((state) => state.global.loginStatus);
  console.log(loginStatus);
  return (
    <NavigationContainer>
      {!loginStatus ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Giris"
            component={AuthCreate}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="News"
            component={NewsCreate}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
