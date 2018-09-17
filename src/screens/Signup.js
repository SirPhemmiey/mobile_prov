import React from 'react'
import { StyleSheet, StatusBar, AsyncStorage, ImageBackground, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native'
import {
  Content
} from 'native-base'
import Config from 'react-native-config'
import { Button } from 'react-native-elements';
import { Text, View, Image } from 'react-native-animatable';
import { ProgressDialog, Dialog } from 'react-native-simple-dialogs'

export default class Signup extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super()
    this.state = {
      password: '',
      confirm: '',
      email: '',
      phone: '',
      full_name: '',
      loadTitle: '',
      showLoading: false,
      showDialog: false,
      dialogTitle: '',
      dialogMessage: ''
    }
    this._handleSignup = this._handleSignup.bind(this)
    this._handleLogin = this._handleLogin.bind(this);

  }

  _handleSignup(){
      const { full_name, email, phone, password, confirm } = this.state;
    if (full_name != '' && email != '' && phone != '' && password != '' && confirm != '') {
      if (password === confirm) {
        this.setState({ showLoading: true })
      fetch(Config.API_URL+'/ProvApi/signup', {
        method: 'POST',
        body: JSON.stringify({
          full_name: this.state.full_name,
          password: this.state.password,
          email: this.state.email,
          phone: this.state.phone,
          type: 'Provider'
        })
      })
        .then(res => res.json())
        .then(res => {
          this.setState({ showLoading: false })
          if (res.success) {
            this.setState({
              showDialog: true,
              dialogMessage: 'Success! You may now login.'
            })
            this._handleLogin(phone, password);
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
      }
      else {
        this.setState({
          showDialog: true,
          dialogMessage: 'Passwords do not match'
        })
      }
    } else {
      this.setState({
        showDialog: true,
        dialogMessage: 'All fields are required'
      })
    }
  }

  _handleLogin(phone, password) {
      this.setState({ showLoading: true, loadTitle: 'Signing you in' });
      fetch(Config.API_URL+'/ProvApi/login', {
        method: 'POST',
        body: JSON.stringify({
          username: phone,
          password: password
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
  }

  render () {
    const { navigate } = this.props.navigation
    return (
      <ImageBackground blurRadius={1} style={styles.bg} source={{uri: 'http://www.stylefit.ng/img/b1.jpg'}}>
      <Content style={styles.containerView}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View animation={'slideInDown'} delay={600} duration={400} style={styles.loginScreenContainer}>
          <StatusBar
            barStyle='light-content'
            backgroundColor='#3897f1'
            networkActivityIndicatorVisible
          />
            <View style={styles.loginFormView}>
              <Image
                  animation={'zoomIn'} delay={700} duration={400}
                  style={styles.logo}
                  resizeMode='contain'
                  source={require('../assets/images/logo_former.png')}
                />
                <TextInput
                ref="full_name"
                returnKeyType='next'
                style={styles.loginFormTextInput}
                onChangeText={full_name => this.setState({ full_name })}
                keyboardType='default'
                autoCapitalize='none'
                placeholder="Full name"
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.email.focus()}
                />

                <TextInput
                ref={(input) => this.email = input}
                returnKeyType='next'
                style={styles.loginFormTextInput}
                onChangeText={email => this.setState({ email })}
                keyboardType='email-address'
                autoCapitalize='none'
                placeholder="Email"
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.phone.focus()}
                />

                <TextInput
                ref={(input) => this.phone = input}
                returnKeyType='next'
                style={styles.loginFormTextInput}
                onChangeText={phone => this.setState({ phone })}
                keyboardType='numeric'
                placeholder="Phone"
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.password.focus()}
                />

                <TextInput
                  placeholder="Password"
                  returnKeyType='next'
                  ref={(input) => this.password = input}
                  style={styles.loginFormTextInput}
                  secureTextEntry
                  underlineColorAndroid='transparent'
                  onSubmitEditing={() => this.confirm.focus()}
                  onChangeText={password => this.setState({ password })} />

                  <TextInput
                  placeholder="Confirm Password"
                  returnKeyType='go'
                  ref={(input) => this.confirm= input}
                  style={styles.loginFormTextInput}
                  secureTextEntry
                  underlineColorAndroid='transparent'
                  onChangeText={confirm => this.setState({ confirm })} />

                <Button
                  buttonStyle={styles.loginButton}
                  onPress={this._handleSignup}
                  title="Sign up"
                />

                <View style={styles.separatorContainer} animation={'slideInLeft'} delay={700} duration={400}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorOr}>{'Or'}</Text>
                <View style={styles.separatorLine} />
                </View>

                <View animation={'slideInUp'} delay={800} duration={400}>
                 <Button
                buttonStyle={styles.loginButton}
                onPress={() => navigate('Login')}
                title="Login"
              />
                </View>
            </View>
            <ProgressDialog
            visible={this.state.showLoading}
            title={this.state.loadTitle}
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1
//   },
//   logo: {
//     width: 250,
//     height: 80
//   },
//   title: {
//     fontFamily: 'NunitoSans-Regular',
//     fontSize: 18,
//     alignSelf: 'center',
//     color: '#6c5ce7',
//     textAlign: 'center',
//     marginTop: 20
//   },
//   logoContainer: {
//     justifyContent: 'center',
//     alignContent: 'center',
//     alignItems: 'center',
//   },
//   loginText: {
//     fontWeight: 'bold',
//     fontFamily: 'NunitoSans-Regular'
//   },
//   loginButton: {
//     // backgroundColor: '#6c5ce7',
//     // borderRadius: 5,
//     // padding: 5,
//     marginTop: 15,
//     alignSelf: 'center'
//   },
//   signupButton: {
//     // backgroundColor: '#6c5ce7',
//     // borderRadius: 5,
//     // padding: 5,
//     marginTop: 15,
//     alignSelf: 'center'
//   },
//   input: {
//     fontFamily: 'NunitoSans-Regular'
//   }
// })

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
    marginTop: 20,
    marginBottom: 5,

  },
  loginButton: {
    backgroundColor: '#3897f1',
    borderRadius: 5,
    height: 45,
    marginTop: 10,
  },
  fbLoginButton: {
    height: 45,
    marginTop: 10,
    backgroundColor: 'transparent',
  },
})