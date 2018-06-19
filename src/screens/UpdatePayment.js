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
  Icon,
  Left,
  Title,
  Right,
  Body
} from 'native-base'
import Config from 'react-native-config'
import { NavigationActions } from 'react-navigation'
import { ProgressDialog, Dialog } from 'react-native-simple-dialogs'
import RNPaystack from 'react-native-paystack'

export default class UpdatePayment extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super()
    this.state = {
      cardNumber: '4123450131001381',
      email: 'femora@gmail.com',
      mm_yy: '',
      cvc: '883',
      expiryMonth: '10',
      expiryYear: '18',
      amount: 150000,
      showLoading: false,
      showDialog: false,
      dialogTitle: '',
      dialogMessage: ''
    }
  }
  break_month_year = value => {
    // if (value.length == 2) {
    //   this.setState({
    //     mm_yy: value + "/"
    //   })
    // }
    // let value1 = value
    // let value2 = value1.split('/')
    // this.setState({
    //   expiryMonth: value2[0],
    //   expiryYear: value2[1]
    // })
  }

  chargeCard = () => {
    this.setState({
      showLoading: true,
    })
    RNPaystack.chargeCard({
      // cardNumber: '4123450131001381',
      // expiryMonth: '10',
      // expiryYear: '17',
      // cvc: '883',
      // email: 'chargeIOS@master.dev',
      // amountInKobo: 150000,
      cardNumber: this.state.cardNumber,
      expiryMonth: this.state.expiryMonth,
      expiryYear: this.state.expiryYear,
      cvc: this.state.cvc,
      email: this.state.email,
      amountInKobo: this.state.amount
    }).then(response => {
      if (response.reference != '') {
        this.setState({
          showLoading: false,
          showDialog: false
        })
        this._handleUpdatePayment(response.reference)
      } else {
        this.setState({
          showDialog: true,
          showLoading: false,
          dialogMessage: 'Oops! An error occured while initiating payment from card. Please retry'
        })
      }
    })
  }
  _handleUpdatePayment = ref => {
    const { navigation } = this.props
    let selectedService = navigation.getParam('selectedService', null)
    let destLat = navigation.getParam('destLat', null)
    let destLong = navigation.getParam('destLong', null)
    let date = navigation.getParam('date', null)
    let address = navigation.getParam('address', null)
    let phone = navigation.getParam('phone', null)
    let provider_id = navigation.getParam('provider_id', null)
    const { cardNumber, cvc, mm_yy, amount } = this.state
    //if (cardNumber != '' && cvc != '' && mm_yy != '' && amount != '') {
      AsyncStorage.getItem('jwt').then(token => {
        fetch(Config.API_URL + '/api/save_ref', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            selectedService: selectedService,
            destLat: destLat,
            destLong: destLong,
            dateValue: date,
            address: address,
            phone: phone,
            ref: ref,
            provider_id: provider_id,
            amount: this.state.amount,
          })
        })
          .then(res => res.json())
          .then(res => {
            if (res == 'done') {
              this.setState({
                showDialog: true,
                showLoading: false,
                dialogMessage: 'Payment was successful.'
              })
            }
            else if (res == 'Not found') {
              this.setState({
                showDialog: true,
                dialogMessage: 'You are not authorized. Please sign in',
                showLoading: false
              })
            } else if (res == 'err') {
              this.setState({
                showDialog: true,
                showLoading: false,
                dialogMessage: 'Oops! An error occured, errr. Please retry'
              })
            } else {
              this.setState({
                showDialog: true,
                showLoading: false,
                dialogMessage: 'Oops! An error occured, default. Please retry'
              })
            }
          })
      })
    // } else {
    //   this.setState({
    //     showDialog: true,
    //     dialogMessage: 'All fields are required'
    //   })
    // }
  }

  render () {
    const { navigation } = this.props;
    return (
      <Container>
        <Header style={{ backgroundColor: '#6c5ce7' }}>

          <Left>
            <Button transparent>
              <Icon
                onPress={() => navigation.goBack()}
                ios='ios-arrow-dropleft-circle'
                android='md-arrow-dropleft-circle'
                style={{ color: 'white', fontSize: 25 }}
              />
            </Button>
          </Left>
          <Body style={{ flex: 2 }}>
            <Title style={{ fontFamily: 'NunitoSans-Regular' }}>
              Payment
            </Title>
          </Body>
          <Right />
        </Header>
        <StatusBar
          barStyle='light-content'
          backgroundColor='#6c5ce7'
          networkActivityIndicatorVisible
        />
        <Content style={{ padding: 10, flex: 1 }}>

          <View style={styles.logoContainer}>
            <Icon
              name='ios-card'
              style={{
                fontSize: 100,
                justifyContent: 'center',
                alignSelf: 'center'
              }}
            />
          </View>
          <Form>
            <Item stackedLabel>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                Card Number
              </Label>
              <Input
                style={styles.input}
                returnKeyType='next'
                onSubmitEditing={() => this.cardNumberInput.focus()}
                onChangeText={cardNumber => this.setState({ cardNumber })}
                keyboardType='phone-pad'
                value={this.state.cardNumber}
                autoCorrect={false}
              />
            </Item>
            <Item stackedLabel>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                Expiry Month
              </Label>
              <Input
                style={styles.input}
                returnKeyType='next'
                ref={input => (this.mmInput = input)}
                onSubmitEditing={() => this.yyInput.focus()}
                onChangeText={expiryMonth => this.break_month_year(expiryMonth)}
                keyboardType='phone-pad'
                value={this.state.expiryMonth}
                autoCorrect={false}
              />
            </Item>
            <Item stackedLabel>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                Expiry Year
              </Label>
              <Input
                style={styles.input}
                returnKeyType='next'
                ref={input => (this.yyInput = input)}
                onSubmitEditing={() => this.cvcInput.focus()}
                onChangeText={expiryYear => this.break_month_year(expiryYear)}
                keyboardType='phone-pad'
                value={this.state.expiryYear}
                autoCorrect={false}
              />
            </Item>
            <Item stackedLabel>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                CVC/CCV
              </Label>
              <Input
                style={styles.input}
                returnKeyType='next'
                ref={input => (this.cvcInput = input)}
                onSubmitEditing={() => this.emailInput.focus()}
                onChangeText={cvc => this.setState({ cvc })}
                keyboardType='phone-pad'
                autoCapitalize='none'
                value={this.state.cvc}
                autoCorrect={false}
              />
            </Item>
            <Item stackedLabel last>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                Email
              </Label>
              <Input
                style={styles.input}
                returnKeyType='go'
                ref={input => (this.emailInput = input)}
                onChangeText={email => this.setState({ email })}
                keyboardType='email-address'
                autoCapitalize='none'
                value={this.state.email}
                autoCorrect={false}
              />
            </Item>
            <Button
              small
              block
              onPress={() => this.chargeCard()}
              style={styles.signupButton}
            >
              <Text style={styles.loginText}>Pay</Text>
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
                padding: 4,
                backgroundColor: '#6c5ce7'
              }}
            >
              <Text style={{ color: '#fff', fontFamily: 'NunitoSans-Regular', padding: 4 }}>
                CLOSE
              </Text>
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
  signupButton: {
    // backgroundColor: '#6c5ce7',
    // borderRadius: 5,
    // padding: 5,
    marginTop: 15,
    alignSelf: 'center',
    alignItems: 'center',
    padding: 20
  },
  input: {
    fontFamily: 'NunitoSans-Regular'
  }
})
