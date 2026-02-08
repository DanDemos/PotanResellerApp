/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme, View, Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import Toast from 'react-native-toast-message';

import { store, persistor, RootState } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';
import { useLogoutMutation } from '@/api/actions/auth/authApi';
import { colors } from '@/theme/colors';

import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import { GameChannelsScreen } from '@/screens/game-channels/GameChannelsScreen';
import { CoinHistoryScreen } from '@/screens/history/CoinHistoryScreen';
import { MoneyHistoryScreen } from '@/screens/history/MoneyHistoryScreen';
import { ChatScreen } from '@/screens/chat/ChatScreen';
import { LoginScreen } from '@/screens/login/LoginScreen';
import { SupportScreen } from '@/screens/support/SupportScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: any): React.ReactNode {
  const dispatch = useDispatch();
  const [logoutApi] = useLogoutMutation();
  const insets = useSafeAreaInsets();

  async function handleLogout() {
    try {
      await logoutApi().unwrap();
    } catch (err) {
      console.error('Logout API failed', err);
    } finally {
      dispatch(logout());
    }
  }

  const activeRoute = props.state.routeNames[props.state.index];

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: 0 }}
    >
      <View style={{ paddingTop: insets.top }} />
      <DrawerItem
        label="Home"
        focused={activeRoute === 'ChatStack'}
        icon={({ color, size }) => (
          <MaterialIcons name="home" size={size} color={color} />
        )}
        onPress={() => props.navigation.navigate('ChatStack')}
        activeTintColor={colors.white}
        activeBackgroundColor={colors.primary}
        labelStyle={{ fontWeight: '600' }}
        inactiveTintColor={colors.text}
      />
      <View style={{ flex: 1 }} />
      <DrawerItem
        label="Logout"
        icon={({ size }) => (
          <MaterialIcons name="logout" size={size} color="#ffffff" />
        )}
        onPress={handleLogout}
        labelStyle={{ color: '#ffffff', fontWeight: '700' }}
        style={{
          backgroundColor: '#ff4444',
          borderRadius: 8,
          marginHorizontal: 10,
          marginTop: 20,
        }}
      />
      <View style={{ padding: 20, alignItems: 'center', opacity: 0.5 }}>
        <Text style={{ fontSize: 12 }}>Version 0.0.1</Text>
      </View>
    </DrawerContentScrollView>
  );
}

function ChatStackNavigator(): React.ReactNode {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen
        name="GameChannels"
        component={GameChannelsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'Chat',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
    </Stack.Navigator>
  );
}

function MainDrawerNavigator(): React.ReactNode {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.primary,
        drawerStyle: {
          backgroundColor: '#ffffff',
          width: 280,
        },
        drawerLabelStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Drawer.Screen
        name="ChatStack"
        component={ChatStackNavigator}
        options={{ title: 'Home' }}
      />
    </Drawer.Navigator>
  );
}

const RootStack = createNativeStackNavigator();

function RootNavigator(): React.ReactNode {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <RootStack.Screen
        name="MainDrawer"
        component={MainDrawerNavigator}
        options={{ headerShown: false }}
      />
      <RootStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'My Profile',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      <RootStack.Screen
        name="CoinHistory"
        component={CoinHistoryScreen}
        options={{
          title: 'Coin History',
        }}
      />
      <RootStack.Screen
        name="MoneyHistory"
        component={MoneyHistoryScreen}
        options={{
          title: 'MMK History',
        }}
      />
      <RootStack.Screen
        name="Support"
        component={SupportScreen}
        options={{
          title: 'Help & Support',
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: colors.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
    </RootStack.Navigator>
  );
}

function AppContent(): React.ReactNode {
  const isLoggedIn = useSelector((state: RootState) => !!state.auth.token);
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="#ffffff"
      />
      {!isLoggedIn ? (
        <LoginScreen />
      ) : (
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      )}
      <Toast />
    </SafeAreaProvider>
  );
}

export function App(): React.ReactNode {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
