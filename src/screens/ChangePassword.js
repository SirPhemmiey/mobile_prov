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
  View,
  Left,
  Right,
  Icon,
  Body,
  Title
} from 'native-base'
import Config from 'react-native-config'
import { ProgressDialog, Dialog } from 'react-native-simple-dialogs'

export default class ChangePassword extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super()
    this.state = {
      oldPassword: '',
      newPassword: '',
      newPassword2: '',
      showLoading: false,
      showDialog: false,
      dialogTitle: '',
      dialogMessage: ''
    }
  }

  _handleChangePassword = () => {
      let {oldPassword, newPassword, newPassword2} = this.state;
    if (oldPassword != '' && newPassword != '' && newPassword2 != '') {
      this.setState({ showLoading: true })
      AsyncStorage.getItem('jwt').then(token => {
        fetch(Config.API_URL + '/provapi/change_password', {
        method: 'POST',
         headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: this.state.oldPassword,
          newPassword: this.state.newPassword,
          confirmPassword: this.state.newPassword2
        })
      })
        .then(res => res.json())
        .then(res => {
          this.setState({ showLoading: false })
          if (res == 'ok') {
            this.setState({
                showDialog: true,
                dialogMessage: "Password changed successfully. It will be active when next you want to login."
              })
          } else if (res == 'err') {
            this.setState({
              showDialog: true,
              dialogMessage: "Oops! An error occured. Please retry"
            })
          }
          else if (res == 'oldDiff') {
            this.setState({
                showDialog: true,
                dialogMessage: "Your old password does not match"
              })
          }
          else if (res == 'newPassDiff') {
            this.setState({
                showDialog: true,
                dialogMessage: "New passwords are different"
              })
          }
          
        })
        .catch(err => {
          this.setState({
            showLoading: false,
            showDialog: true,
            dialogMessage: err.message
          })
        })
      })
    } else {
      this.setState({
        showLoading: false,
        showDialog: true,
        dialogMessage: 'All fields are required'
      })
    }
  }

  render () {
    const { navigate, goBack } = this.props.navigation
    return (
      <Container>
        <Header style={{ backgroundColor: '#6c5ce7' }}>
         <Left>
         <Button transparent>
              <Icon
                onPress={() => goBack()}
                ios='ios-arrow-back'
                android='md-arrow-back'
              />
            </Button>
         </Left>
         <Body style={{flex:2}}>
             <Title style={{fontFamily: 'NunitoSans-Regular'}}>Change Password</Title>
         </Body>
         <Right />
        </Header>
         <StatusBar
          barStyle='light-content'
          backgroundColor='#6c5ce7'
          networkActivityIndicatorVisible
        />
        <Content style={{ padding: 10, flex: 1 }}>
          <Form>
            <Item stackedLabel>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                Old Password
              </Label>
              <Input
                style={styles.input}
                returnKeyType='next'
                onSubmitEditing={() => this.passwordInput.focus()}
                onChangeText={oldPassword => this.setState({ oldPassword })}
                secureTextEntry
              />
            </Item>
            <Item stackedLabel>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                New Password
              </Label>
              <Input
                style={styles.input}
                returnKeyType='next'
                ref={input => (this.passwordInput = input)}
                onSubmitEditing={() => this.password2Input.focus()}
                secureTextEntry
                onChangeText={newPassword => this.setState({ newPassword })}
              />
            </Item>
            <Item stackedLabel last>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                Confirm Password
              </Label>
              <Input
                style={styles.input}
                returnKeyType='go'
                ref={input => (this.password2Input = input)}
                secureTextEntry
                onChangeText={newPassword2 => this.setState({ newPassword2 })}
              />
            </Item>
            <Button
              bordered
              small
              onPress={this._handleChangePassword}
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>Change</Text>
            </Button>
          </Form>
          <ProgressDialog
            visible={this.state.showLoading}
            title='Changing'
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
