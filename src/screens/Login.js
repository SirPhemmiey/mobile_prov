import React from 'react'
import { StyleSheet, Image, StatusBar, AsyncStorage, ImageBackground, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import {
  Content,
} from 'native-base'
import { Text, View } from 'react-native-animatable';
import { Button } from 'react-native-elements';
import Config from 'react-native-config'
import { NavigationActions } from 'react-navigation'
import { ProgressDialog, Dialog } from 'react-native-simple-dialogs'
import SplashScreen from 'react-native-splash-screen'
import PasswordInputText from '../components/PasswordInput';

export default class Login extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super()
    this.state = {
      password: '',
      username: '',
      showLoading: false,
      showDialog: false,
      dialogTitle: '',
      dialogMessage: '',
    }
    this._handleLogin = this._handleLogin.bind(this)
    this._gotoForgotPassword = this._gotoForgotPassword.bind(this);
    //SplashScreen.show()

  }

  navigateToLogin = () => {
    const toHome = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'tabStack' })]
    })
    this.props.navigation.dispatch(toHome)
  }

  _handleLogin() {
    if (this.state.username != '' && this.state.password != '') {
      this.setState({ showLoading: true })
      fetch(Config.API_URL+'/ProvApi/login', {
        method: 'POST',
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      })
        .then(res => res.json())
        .then(res => {
          this.setState({ showLoading: false })
          if (res.success) {
            AsyncStorage.setItem('jwt', res.token)
            AsyncStorage.setItem('loggedIn', 'yes')
            AsyncStorage.setItem('seeWelcome', 'yes')
            AsyncStorage.setItem('phone', res.phone)
            // AsyncStorage.multiSet([
            //   ['jwt', res.token],
            //   ['loggedIn', 'yes'],
            //   ['seeWelcome', 'yes'],
            //   ['phone', res.phone]
            // ])
            this.props.navigation.replace('tabStack')
          } else if (res.error) {
            this.setState({
              showDialog: true,
              dialogMessage: res.error
            })
          }
        })
        .catch(err => {
          this.setState({ showLoading: false })
          this.setState({
            showDialog: true,
            dialogMessage: err.message
          })
        })
    } else {
      this.setState({
        showDialog: true,
        dialogMessage: 'All fields are required'
      })
    }
  }
  _gotoForgotPassword() {

  }
//   componentWillMount() {
//     SplashScreen.hide();
//    AsyncStorage.getItem('jwt').then(token => {
//      if (token != null) {
//          //SplashScreen.hide();
//          this.props.navigation.replace('tabStack')
//      }
//      else {
//         SplashScreen.hide();
//      }
//  }).done();
//  AsyncStorage.getItem('seeWelcome').then(token => {
//    if (token != 'yes') {
//        SplashScreen.hide();
//        this.props.navigation.replace('welcomeStack')
//    }
//    else {
//       SplashScreen.hide();
//    }
// }).done();
//  }

async componentWillMount() {
  //SplashScreen.show();
  const jwt = await AsyncStorage.getItem('jwt');
  if (jwt !== null) {
    SplashScreen.hide();
    this.props.navigation.replace('tabStack');
  }
  else {
    SplashScreen.hide();
    const seeWelcome = await AsyncStorage.getItem('seeWelcome');
    if (seeWelcome !== 'yes') {
      SplashScreen.hide();
      this.props.navigation.replace('welcomeStack')
    }
    else {
      SplashScreen.hide();
      this.props.navigation.navigate('loginStack');
    }
  }
}

  render () {
    const { navigate } = this.props.navigation
    return (
      <ImageBackground blurRadius={1} style={styles.bg} source={require('../assets/images/b1.jpg')}>
      <Content style={styles.containerView}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View animation={'slideInUp'} delay={600} duration={400} style={styles.loginScreenContainer}>
          <StatusBar
            barStyle='light-content'
            backgroundColor='#3897f1'
            networkActivityIndicatorVisible
          />
            <View style={styles.loginFormView}>
              <View style={styles.logoContainer}>
                <Image animation={'zoomIn'} delay={700} duration={400}
                  style={styles.logo}
                  resizeMode='contain'
                  source={require('../assets/images/logo_former.png')}
                />
              </View>
                <TextInput
                ref="phone"
                returnKeyType='next'
                style={styles.loginFormTextInput}
                onChangeText={username => this.setState({ username })}
                keyboardType='numeric'
                autoCapitalize='none'
                placeholder="Phone Number"
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.password.focus()}
                autoCorrect={false} />

                    <PasswordInputText
                    placeholder="Password"
                    returnKeyType='go'
                    ref={(input) => this.password = input}
                    style={styles.loginFormTextInput}
                    underlineColorAndroid='transparent'
                    onChangeText={password => this.setState({ password })}
                />

                <Button
                  buttonStyle={styles.loginButton}
                  onPress={this._handleLogin}
                  title="Login"
                />

                <TouchableOpacity onPress={() => navigate('forgotPassword')} style={{ marginLeft: 20, marginTop:10}}>
                  <Text>Forgot Password?</Text>
                </TouchableOpacity>

          <View style={styles.separatorContainer} animation={'slideInLeft'} delay={700} duration={400}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorOr}>{'Or'}</Text>
          <View style={styles.separatorLine} />
          </View>
              <View animation={'slideInDown'} delay={800} duration={400}>
              <Button
                buttonStyle={styles.loginButton}
                onPress={() => navigate('Signup')}
                title="Register"
              />
              </View>
            </View>
          <ProgressDialog
            visible={this.state.showLoading}
            title='Logging in'
            message='Please wait...'
          />
          <Dialog
            visible={this.state.showDialog}
            onTouchOutside={() => this.setState({ showDialog: false })}
            contentStyle={{ justifyContent: 'center', alignItems: 'center' }}
            animationType='fade'
          >
            <View>
              <Text style={{fontFamily: 'NunitoSans-Regular'}}>
                {this.state.dialogMessage}
              </Text>
            </View>
            <Button
                buttonStyle={styles.dialogButton}
                onPress={() => this.setState({ showDialog: false })}
                color="#fff"
                title="Close"
                />
          </Dialog>
        </View>
        </TouchableWithoutFeedback>
      </Content>
      </ImageBackground>
    )
  }
}


const styles = StyleSheet.create({

  separatorContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 20
  },
  separatorLine: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    height: StyleSheet.hairlineWidth,
    borderColor: '#9B9FA4'
  },
  separatorOr: {
    color: '#9B9FA4',
    marginHorizontal: 8
  },
  dialogButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#3897f1',
    borderRadius: 5,
  },
  bg: {
    flex: 1,
    width: null,
    height: null,
  },
  logo: {
    // width: 80,
    // height: 80,
    alignItems: 'center',
    alignSelf: 'center'
  },
  containerView: {
    flex: 1,
  },
  loginScreenContainer: {
    flex: 1,
  },
  logoLoginText: {
    fontSize: 30,
    fontWeight: "200",
    textAlign: 'center',
    fontFamily: 'NunitoSans-Regular'
  },
  logoContainer: {
    marginTop: 150,
    marginBottom: 30,
  },
  loginFormView: {
    flex: 1
  },
  loginFormTextInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    fontFamily: 'NunitoSans-Regular',
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,

  },
  loginButton: {
    backgroundColor: '#3897f1',
    //backgroundColor: '#3897f1',
    borderRadius: 5,
    height: 45,
    marginTop: 10,
  },
})

