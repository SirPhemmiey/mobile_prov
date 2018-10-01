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

export default class Login extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super()
    this.state = {
      phone: '',
      showLoading: false,
      showDialog: false,
      dialogTitle: '',
      dialogMessage: ''
    }
    this._handleForgot = this._handleForgot.bind(this);
  }

  navigateToLogin = () => {
    const toHome = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'tabStack' })]
    })
    this.props.navigation.dispatch(toHome)
  }

 _handleForgot() {
    if (this.state.phone != '') {
      this.setState({ showLoading: true })
      fetch(Config.API_URL + '/ProvApi/forgot_password', {
        method: 'POST',
        body: JSON.stringify({
          username: this.state.phone,
        })
      })
        .then(res => res.json())
        .then(res => {
          this.setState({ showLoading: false })
          if (res == 'sent') {
            this.setState({
              showDialog: true,
              dialogMessage: 'A new password has been sent to your email address registered with us. Please use it to login and change it after you\'re logged in.'
            })
          } else if (res == 'error') {
            this.setState({
              showDialog: true,
              dialogMessage: "An error occured. Please retry"
            })
          }
          else {
            this.setState({
              showDialog: true,
              dialogMessage: "No match for this phone number."
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
        dialogMessage: 'Phone number field is required'
      })
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
                returnKeyType='go'
                style={styles.loginFormTextInput}
                 onChangeText={phone => this.setState({ phone })}
                keyboardType='numeric'
                autoCapitalize='none'
                placeholder="Phone number"
                underlineColorAndroid='transparent'
                autoCorrect={false} />

                <Button
                  buttonStyle={styles.loginButton}
                  onPress={this._handleForgot}
                  title="Recover"
                />

          <View style={styles.separatorContainer} animation={'slideInLeft'} delay={700} duration={400}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorOr}>{'Or'}</Text>
          <View style={styles.separatorLine} />
          </View>
              <View animation={'slideInDown'} delay={800} duration={400}>
              <Button
                buttonStyle={styles.loginButton}
                onPress={() => navigate('Login')}
                title="Login"
              />
              </View>
            </View>
          <ProgressDialog
            visible={this.state.showLoading}
            title='Recovering your password'
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

