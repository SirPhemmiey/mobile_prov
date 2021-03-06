import React from 'react'
import { StyleSheet, TextInput, StatusBar, AsyncStorage } from 'react-native'
import {
  Container,
  Header,
  Content,
  Button as ButtonNative,
  Left,
  Right,
  Icon,
  Body,
  Title
} from 'native-base'
import { View, Text } from 'react-native-animatable'
import { Button } from 'react-native-elements';
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
        fetch(Config.API_URL + '/ProvApi/change_password', {
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
                dialogMessage: "Your old password is incorrect"
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
        <Header style={{ backgroundColor: '#3897f1' }}>
         <Left>
         <ButtonNative transparent iconLeft onPress={() => goBack()}>
            <Icon ios='ios-arrow-back'
                android='md-arrow-back' />
          </ButtonNative>
         </Left>
         <Body style={{flex:2}}>
             <Title style={{fontFamily: 'NunitoSans-Regular'}}>Change Password</Title>
         </Body>
         <Right />
        </Header>
         <StatusBar
          barStyle='light-content'
          backgroundColor='#3897f1'
          networkActivityIndicatorVisible
        />
        <Content style={{ padding: 10, flex: 1 }}>

        <View animation={'fadeInLeft'} delay={600} duration={400}>
        <TextInput
                  placeholder="Old Password"
                  returnKeyType='next'
                  style={styles.loginFormTextInput}
                  secureTextEntry
                  onSubmitEditing={() => this.password.focus()}
                  underlineColorAndroid='transparent'
                  onChangeText={oldPassword => this.setState({ oldPassword })}
                  />
        <TextInput
                  placeholder="New Password"
                  returnKeyType='next'
                  ref={(input) => this.password = input}
                  onSubmitEditing={() => this.confirm.focus()}
                  style={styles.loginFormTextInput}
                  secureTextEntry
                  underlineColorAndroid='transparent'
                  onChangeText={newPassword => this.setState({ newPassword })} />
         <TextInput
                  placeholder="Confirm Password"
                  returnKeyType='go'
                  ref={(input) => this.confirm = input}
                  style={styles.loginFormTextInput}
                  secureTextEntry
                  underlineColorAndroid='transparent'
                  onChangeText={newPassword2 => this.setState({ newPassword2 })} />
                <View animation={'fadeInLeft'} delay={700} duration={400}>
            <Button
                buttonStyle={styles.changeButton}
                onPress={this._handleChangePassword}
                title="Change"
                />
            </View>
        </View>
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
                  buttonStyle={styles.dialogButton}
                  onPress={() => this.setState({ showDialog: false })}
                  color="#fff"
                  title="Close"
            />
          </Dialog>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  dialogButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#3897f1',
    borderRadius: 5,
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
  changeButton: {
    backgroundColor: '#3897f1',
    //backgroundColor: '#3897f1',
    borderRadius: 5,
    height: 45,
    marginTop: 20,
  },
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
