import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StackWithBottomNavigation from './screens/StackMainApp';
import StackFirstApp from './screens/StackFirstApp';
import {MMKV} from 'react-native-mmkv';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  const storage = new MMKV();

  var isFirstOpen = storage.getBoolean('app_first_open');
  var appLang = storage.getString('app_lang');
  var appCurrency = storage.getString('app_currency');
  if (
    isFirstOpen === undefined ||
    appLang === undefined ||
    appCurrency === undefined
  ) {
    isFirstOpen = true;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={isFirstOpen ? 'stackFirstApp' : 'stackMainApp'}>
        <Stack.Screen name="stackFirstApp" component={StackFirstApp} />
        <Stack.Screen
          name="stackMainApp"
          component={StackWithBottomNavigation}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
