/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from '@/store/store';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from '@/screens/ProfileScreen';
import GameChannelsScreen from '@/screens/GameChannelsScreen';
import ChatScreen from '@/screens/ChatScreen';
import LoginScreen from '@/screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@react-native-vector-icons/ionicons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function getTabBarIcon({ route, focused, color, size }: any) {
  let iconName: any;

  if (route.name === 'ChatStack') {
    iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
  } else if (route.name === 'ProfileStack') {
    iconName = focused ? 'person' : 'person-outline';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  if (!isLoggedIn) {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <LoginScreen onLogin={() => setIsLoggedIn(true)} />
        </SafeAreaProvider>
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#ffffff"
      />
      {/* <AppContent /> */}
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) =>
              getTabBarIcon({ route, focused, color, size }),
            tabBarActiveTintColor: '#00a6f4',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
              backgroundColor: '#f5f5f5',
              borderTopColor: '#e0e0e0',
            },
            headerShown: false,
          })}
        >
          <Tab.Screen
            name="ChatStack"
            component={ChatStackNavigator}
            options={{ title: 'Messages' }}
          />
          <Tab.Screen
            name="ProfileStack"
            component={ProfileStackNavigator}
            options={{ title: 'Profile' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    </Provider>
  );
}

function ChatStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GameChannels"
        component={GameChannelsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={() => ({
          title: 'Chat',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#00a6f4',
          headerTitleStyle: {
            fontWeight: '600',
          },
        })}
      />
    </Stack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#00a6f4',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
    </Stack.Navigator>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
