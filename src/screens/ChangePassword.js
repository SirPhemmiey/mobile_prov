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

  navigateToLogin = () => {
    // this.props.navigation.dispatch(
    //   NavigationActions.reset({
    //     index: 0,
    //     actions: [NavigationActions.navigate({ routeName: 'drawerStack' })]
    //   })
    // )
    const toHome = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'drawerStack' })]
    })
    this.props.navigation.dispatch(toHome)
  }

  _handleChangePassword = () => {
      const {oldPassword, newPassword, newPassword2} = this.state;
    if (oldPassword != '' && newPassword != '' && newPassword2 != '') {
      this.setState({ showLoading: true })
      fetch('http://192.168.56.1/stylefit/provapi/changePassword', {
        method: 'POST',
        body: JSON.stringify({
          oldPassword: this.state.password,
          newPassword: this.state.newPassword,
          confirmPassword: this.state.newPassword2
        })
      })
        .then(res => res.json())
        .then(res => {
          this.setState({ showLoading: false })
          if (res.ok) {
            this.setState({
                showDialog: true,
                dialogMessage: "Password changed successfully. It will be active when next you want to login."
              })
          } else if (res.err) {
            this.setState({
              showDialog: true,
              dialogMessage: "Oops! An error occured. Please retry"
            })
          }
          else if (res.oldDiff) {
            this.setState({
                showDialog: true,
                dialogMessage: "Old not"
              })
          }
          else if (res.newPassDiff) {
            this.setState({
                showDialog: true,
                dialogMessage: "New password is diff"
              })
          }
          console.warn(res)
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
            
            <Text style={styles.title}>Change Password</Text>
          </View>
          <Form>
            <Item floatingLabel>
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
            <Item floatingLabel>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                New Password
              </Label>
              <Input
                style={styles.input}
                returnKeyType='go'
                ref={input => (this.passwordInput = input)}
                onSubmitEditing={() => this.password2Input.focus()}
                secureTextEntry
                onChangeText={newPassword => this.setState({ newPassword })}
              />
            </Item>
            <Item floatingLabel last>
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
