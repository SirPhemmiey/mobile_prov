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
import { ProgressDialog, Dialog } from 'react-native-simple-dialogs'

export default class AddReview extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super()
    this.state = {
        comment: '',
      showLoading: false,
      showDialog: false,
      dialogTitle: '',
      dialogMessage: ''
    }
  }

  navigateToLogin = () => {
   
    const toHome = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'drawerStack' })]
    })
    this.props.navigation.dispatch(toHome)
  }

  _handleAddReview = () => {
    if (this.state.comment != '') {
      this.setState({ showLoading: true })
      fetch(Config.API_URL + '/api/add_review', {
        method: 'POST',
        body: JSON.stringify({
          comment: this.state.comment,
        })
      })
        .then(res => res.json())
        .then(res => {
          this.setState({ showLoading: false })
          if (res == 'done') {
            this.setState({
                showDialog: true,
                dialogMessage: "Your review has been added successfully"
              })
        } else if (res.error) {
            this.setState({
              showDialog: true,
              dialogMessage: "Oops! An error occured"
            })
          }
        })
        .catch(err => {
          this.setState({ showLoading: false })
          // alert(err.message);
          this.setState({
            showDialog: true,
            dialogMessage: err.message
          })
        })
    } else {
      // Alert.alert('Notice', 'All fields are required.');
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
            <Text style={styles.title}>Add Review</Text>
          </View>
          <Form>
            <Item floatingLabel>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                Username
              </Label>
              <Input
                style={styles.input}
                returnKeyType='next'
                onChangeText={comment => this.setState({ comment })}
                multiline={true}
                autoCapitalize='none'
                autoCorrect={false}
              />
            </Item>
            <Button
              bordered
              small
              onPress={this._handleAddReview}
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>Add</Text>
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
              <Text>
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
                marginTop: 20
              }}
            >
              <Text>CLOSE</Text>
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
      fontFamily: 'NunitoSans-Regular',
      height: 70,
      backgroundColor: '#ffffff',
      paddingLeft: 15,
      paddingRight: 15,
      borderLeftWidth: 4,
      borderRightWidth: 4,
  }
})
