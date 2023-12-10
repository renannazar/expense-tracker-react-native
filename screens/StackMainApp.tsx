import React, {useCallback} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  HomeScreen,
  ReportScreen,
  CategoryScreen,
  SettingScreen,
  AddScreen,
} from '.';
import {BlackColor, PrimaryColor} from '../utils/Color';
import {useTranslation} from 'react-i18next';

const Tab = createBottomTabNavigator();
const colorButton = BlackColor;
const activeButton = PrimaryColor;

export default function StackMainApp() {
  const {t} = useTranslation();
  const IconComponent = useCallback(
    (props: string, color: string = colorButton) => (
      <AntDesign name={props} size={25} color={color} />
    ),
    [],
  );

  return (
    <Tab.Navigator screenOptions={{tabBarHideOnKeyboard: true}}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: t('app_name'),
          tabBarLabel: t('home'),
          tabBarIcon: props => {
            return IconComponent(
              'home',
              props.focused ? activeButton : colorButton,
            );
          },
          tabBarLabelStyle: {fontSize: 12},
          tabBarActiveTintColor: activeButton,
        }}
      />
      <Tab.Screen
        name="CategoryScreen"
        component={CategoryScreen}
        options={{
          title: t('category'),
          tabBarLabel: t('category'),
          tabBarIcon: props => {
            return IconComponent(
              'inbox',
              props.focused ? activeButton : colorButton,
            );
          },
          tabBarLabelStyle: {fontSize: 12},
          tabBarActiveTintColor: activeButton,
        }}
      />
      <Tab.Screen
        name="AddScreen"
        component={AddScreen}
        options={{
          title: t('add_income_or_expense'),
          tabBarLabel: t('add'),
          tabBarIcon: props => {
            return IconComponent(
              'pluscircle',
              props.focused ? activeButton : colorButton,
            );
          },
          tabBarLabelStyle: {fontSize: 12},
          tabBarActiveTintColor: activeButton,
        }}
      />
      <Tab.Screen
        name="ReportScreen"
        component={ReportScreen}
        options={{
          title: t('money_report'),
          tabBarLabel: t('report'),
          tabBarIcon: props => {
            return IconComponent(
              'linechart',
              props.focused ? activeButton : colorButton,
            );
          },
          tabBarLabelStyle: {fontSize: 12},
          tabBarActiveTintColor: activeButton,
        }}
      />
      <Tab.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          title: t('setting'),
          tabBarLabel: t('setting'),
          tabBarIcon: props => {
            return IconComponent(
              'setting',
              props.focused ? activeButton : colorButton,
            );
          },
          tabBarLabelStyle: {fontSize: 12},
          tabBarActiveTintColor: activeButton,
        }}
      />
    </Tab.Navigator>
  );
}
