import React from 'react'
import { StyleSheet, Image, Alert, StatusBar, AsyncStorage } from 'react-native'
import {
  Container,
  Header,
  Content,
  Label,
  Text,
  Form,
  Item,
  Input,
  Button,
  View
} from 'native-base'
import Config from 'react-native-config'
import { NavigationActions } from 'react-navigation'
import { ProgressDialog, Dialog } from 'react-native-simple-dialogs'
import SplashScreen from 'react-native-splash-screen'

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
      dialogMessage: ''
    }
    this._handleLogin = this._handleLogin.bind(this)
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
  componentWillMount() {
    SplashScreen.hide();
   AsyncStorage.getItem('jwt').then(token => {
     if (token != null) {
         //SplashScreen.hide();
         this.props.navigation.replace('tabStack')
     }
     else {
        SplashScreen.hide();
     }
 }).done();
 AsyncStorage.getItem('seeWelcome').then(token => {
   if (token != 'yes') {
       SplashScreen.hide();
       this.props.navigation.replace('welcomeStack')
   }
   else {
      SplashScreen.hide();
   }
}).done();
 }

  render () {
    const { navigate } = this.props.navigation
    return (
      <Container>
        <Content style={{ padding: 10, flex: 1 }}>
          <StatusBar
            barStyle='light-content'
            backgroundColor='#6c5ce7'
            networkActivityIndicatorVisible
          />
           <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              resizeMode='contain'
              source={require('../assets/images/logo.png')}
            />
            <Text style={styles.title}>Provider Login</Text>
          </View>
          <Form>
            <Item stackedLabel>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                Username
              </Label>
              <Input
                style={styles.input}
                returnKeyType='next'
                onSubmitEditing={() => this.passwordInput.focus()}
                onChangeText={username => this.setState({ username })}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
              />
            </Item>
            <Item stackedLabel last>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                Password
              </Label>
              <Input
                style={styles.input}
                returnKeyType='go'
                ref={input => (this.passwordInput = input)}
                secureTextEntry
                onChangeText={password => this.setState({ password })}
              />
            </Item>
            <Button
              bordered
              small
              onPress={this._handleLogin}
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>Login</Text>
            </Button>
            <View style={{ flex: 3 }} />
            <Button
              onPress={() => navigate('Signup')}
              small
              style={styles.signupButton}
            >
              <Text style={styles.loginText}>Signup</Text>
            </Button>
          </Form>
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
              small
              light
              onPress={() => this.setState({ showDialog: false })}
              style={{
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 20,
                backgroundColor: '#6c5ce7'
              }}
            >
             <Text style={{fontFamily: 'NunitoSans-Regular', padding: 4, color: '#fff'}}>CLOSE</Text>
            </Button>
          </Dialog>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logo: {
    width: 250,
    height: 80
  },
  title: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 18,
    alignSelf: 'center',
    color: '#6c5ce7',
    textAlign: 'center',
    marginTop: 20
  },
  logoContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  loginText: {
    fontWeight: 'bold',
    fontFamily: 'NunitoSans-Regular'
  },
  loginButton: {
    marginTop: 15,
    alignSelf: 'center'
  },
  signupButton: {
    marginTop: 15,
    alignSelf: 'center'
  },
  input: {
    fontFamily: 'NunitoSans-Regular'
  }
})
