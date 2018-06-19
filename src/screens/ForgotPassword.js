import React from 'react'
import { StyleSheet, Image, Alert, StatusBar, AsyncStorage, TouchableOpacity } from 'react-native'
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
  View,
  Footer
} from 'native-base'
import Config from 'react-native-config'
import { NavigationActions } from 'react-navigation'
import { ProgressDialog, Dialog } from 'react-native-simple-dialogs'

export default class ForgotPassword extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super()
    this.state = {
      username: '',
      showLoading: false,
      showDialog: false,
      dialogTitle: '',
      dialogMessage: ''
    }
    this._handleForgot = this._handleForgot.bind(this);
  }

  _handleForgot() {
    if (this.state.username != '') {
      this.setState({ showLoading: true })
      fetch(Config.API_URL + '/ProvApi/forgot_password', {
        method: 'POST',
        body: JSON.stringify({
          username: this.state.username,
        })
      })
        .then(res => res.json())
        .then(res => {
          this.setState({ showLoading: false })
          if (res == 'sent') {
            this.setState({
              showDialog: true,
              dialogMessage: 'A new password has been sent to your email. Please use it to login and change it after you\'re logged in'
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
              dialogMessage: "Looks like this email address does not exit. Please check again."
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
        dialogMessage: 'Email field is required'
      })
    }
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
            <Text style={styles.title}>Forgot Password</Text>
          </View>
          <Form>
            <Item floatingLabel>
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
            <Button
              bordered
              small
              onPress={this._handleForgot}
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>Next</Text>
            </Button>
            <View style={{ flex: 3 }} />
            <Button
              onPress={() => navigate('Login')}
              small
              style={styles.signupButton}
            >
              <Text style={styles.loginText}>Login</Text>
            </Button>
          </Form>
          <ProgressDialog
            visible={this.state.showLoading}
            title='Initiating'
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
        <Footer style={{ backgroundColor: '#6c5ce7' }}>
        </Footer>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logo: {
    width: 300,
    height: 100
  },
  title: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 18,
    alignSelf: 'center',
    color: '#6c5ce7',
    textAlign: 'center'
  },
  logoContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    flexGrow: 1
  },
  loginText: {
    fontWeight: 'bold',
    fontFamily: 'NunitoSans-Regular'
  },
  loginButton: {
    // backgroundColor: '#6c5ce7',
    // borderRadius: 5,
    // padding: 5,
    marginTop: 15,
    alignSelf: 'center'
  },
  signupButton: {
    // backgroundColor: '#6c5ce7',
    // borderRadius: 5,
    // padding: 5,
    marginTop: 15,
    alignSelf: 'center'
  },
  input: {
    fontFamily: 'NunitoSans-Regular'
  }
})
