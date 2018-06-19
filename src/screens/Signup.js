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

export default class Signup extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super()
    this.state = {
      password: '',
      email: '',
      phone: '',
      full_name: '',
      showLoading: false,
      showDialog: false,
      dialogTitle: '',
      dialogMessage: ''
    }
    this._handleSignup = this._handleSignup.bind(this)
  }

  _handleSignup(){
      const { full_name, email, phone, password } = this.state;
    if (full_name != '' && email != '' && phone != '' && password != '') {
      this.setState({ showLoading: true })
      fetch(Config.API_URL+'/ProvApi/signup', {
        method: 'POST',
        body: JSON.stringify({
          full_name: this.state.full_name,
          password: this.state.password,
          email: this.state.email,
          phone: this.state.phone,
          password: this.state.password,
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
            //this.props.navigation.navigate('Login')
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
            <Text style={styles.title}>Provider Signup</Text>
          </View>
          <Form>
            <Item floatingLabel>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                Full Name
              </Label>
              <Input
                style={styles.input}
                returnKeyType='next'
                onSubmitEditing={() => this.emailInput.focus()}
                onChangeText={full_name => this.setState({ full_name })}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
              />
            </Item>
            <Item floatingLabel>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                Email
              </Label>
              <Input
                style={styles.input}
                returnKeyType='next'
                ref={input => (this.emailInput = input)}
                onSubmitEditing={() => this.phoneInput.focus()}
                onChangeText={email => this.setState({ email })}
                keyboardType='email-address'
                autoCapitalize='none'
                autoCorrect={false}
              />
            </Item>
            <Item floatingLabel>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                Phone
              </Label>
              <Input
                style={styles.input}
                returnKeyType='next'
                ref={input => (this.phoneInput = input)}
                onSubmitEditing={() => this.passwordInput.focus()}
                onChangeText={phone => this.setState({ phone })}
                keyboardType='phone-pad'
                autoCapitalize='none'
                autoCorrect={false}
              />
            </Item>
            <Item floatingLabel last>
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
              small
              bordered
              onPress={this._handleSignup}
              style={styles.signupButton}
            >
              <Text style={styles.loginText}>Signup</Text>
            </Button>
            <Button
              small
              onPress={() => navigate('Login')}
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>Login</Text>
            </Button>
          </Form>
          <ProgressDialog
            visible={this.state.showLoading}
            title='Signing you up'
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
                padding: 3,
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
    alignItems: 'center',
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
