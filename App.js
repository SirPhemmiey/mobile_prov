import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation'
import Login from './src/screens/Login'
import Signup from './src/screens/Signup'
import Welcome from './src/screens/Welcome'
import Settings from './src/screens/Settings'
import Home from './src/screens/Home'
import { Icon } from 'native-base'
import ProviderDetails from './src/screens/ProviderDetails';
import ChangePassword from './src/screens/ChangePassword';
import ForgotPassword from './src/screens/ForgotPassword';
import Schedules from './src/screens/Schedules';
import Mapping from './src/screens/Mapping';
import EditProfile from './src/screens/EditProfile'



const tabStack = TabNavigator(
  {
     Home: {screen: Home},
    //Track: { screen: Mapping },
    //Schedules: { screen: Schedules},
    //Settings: { screen: Settings },
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName, routes } = navigation.state
      return {
        tabBarIcon: ({ focused, tintColor }) => {
          switch (routeName) {
            case 'Home':
              return <Icon name={focused ? 'ios-home' : 'ios-home-outline'} />
              break
            case 'Schedules':
              return (
                <Icon
                  name={focused ? 'ios-briefcase' : 'ios-briefcase-outline'}
                />
              )
              break
              case 'Track':
              return (
                <Icon
                  name={focused ? 'ios-locate' : 'ios-locate-outline'}
                />
              )
              break
            case 'Settings':
              return (
                <Icon
                  name={focused ? 'ios-settings' : 'ios-settings-outline'}
                />
              )
              break
          }
        }
      }
    },
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      showIcon: true,
      showLabel: true,
      activeTintColor: '#dfe6e9',
      inactiveTintColor: '#000',
      activeBackgroundColor: '#000',
      style: {
        height: 60,
        //paddingVertical: 5,
        backgroundColor: '#6c5ce7'
      },
      labelStyle: {
        fontSize: 9,
        //padding: 12,
        fontFamily: 'NunitoSans-Regular'
      },
    },
    headerMode: 'none',
    //initialRouteName: 'Home'
  }
)

const loginStack = StackNavigator(
  {
    Login: { screen: Login },
    Signup: { screen: Signup },
    forgotPassword: { screen: ForgotPassword},
    tabStack: { screen: tabStack },
    welcomeStack: { screen: Welcome}
  },
  {
    headerMode: 'none',
    initialRouteName: 'Login'
  }
)

const welcomeStack = StackNavigator(
  {
    welcome: { screen: Welcome },
    loginStack: { screen: loginStack}
    
  },
  {
    headerMode: 'none'
  }
)

const Application = StackNavigator(
  {
    loginStack: { screen: loginStack },
    welcomeStack: { screen: welcomeStack },
    tabStack: { screen: tabStack },
    providerDetails : { screen: ProviderDetails },
    changePassword: { screen: ChangePassword},
    forgotPassword: { screen: ForgotPassword},
    schedules : { screen: Schedules},
    settings: { screen: Settings },
    editProfile: { screen: EditProfile},
    mapping: { screen: Mapping }

  },
  {
    headerMode: 'none',
    // initialRouteName: 'loginStack'
    // initialRouteName: 'welcomeStack'
    initialRouteName: 'loginStack'
    //initialRouteName: 'editProfile'
    // initialRouteName: 'mapping'
     //initialRouteName: 'schedules'
  }
)

export default class App extends React.Component {
  render () {
    //console.disableYellowBox = true
    return <Application />
  }
}
