/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard Lol to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});


color=#6c5ce7

<Footer>
<FooterTab>
    <Button transparent>
        <Icon name='ios-call' />
    </Button>  
</FooterTab>
</Footer>

<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
    <!-- Customize your theme here. -->
    item name="android:datePickerDialogTheme">@style/Dialog.Theme</item>
    <item name="android:timePickerDialogTheme">@style/Dialog.Theme</item>
</style>

<style name="Dialog.Theme" parent="Theme.AppCompat.Light.Dialog">
    <item name="colorAccent">#FF0000</item>
    <item name="android:textColorPrimary">#0000FF</item>
</style>

COORDINATES
Bluebell
latitude => 7.8035593,
longitude => 6.6988698
Zone 8 Junction
latitude => 7.8058766,
longitude => 6.6915955
NNPC Station Ganaja Road
latitude => 7.733144,
longitude => 6.7409693
Ojodu Berger
latitude => 6.6470858,
longitude => 3.366462
