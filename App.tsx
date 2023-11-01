import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StackWithBottomNavigation from './screens/StackMainApp';
import StackFirstApp from './screens/StackFirstApp';

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen
          name="stackMainApp"
          component={StackWithBottomNavigation}
        />
        <Stack.Screen name="stackFirstApp" component={StackFirstApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
