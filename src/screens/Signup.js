import React from 'react'
import { StyleSheet, StatusBar, AsyncStorage, ImageBackground, TouchableWithoutFeedback, Keyboard, TextInput, ScrollView, Picker } from 'react-native'
import {
  Content
} from 'native-base'
import Config from 'react-native-config'
import { Button } from 'react-native-elements';
import { Text, View, Image } from 'react-native-animatable';
import { ProgressDialog, Dialog } from 'react-native-simple-dialogs';
import PasswordInputText from '../components/PasswordInput';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

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
      address: '',
      latitude: '01',
      longitude: '02',
      account_name: '',
      account_number: '',
      profession: '',
      services: [],
      selectedService: 1,
      intro: '',
      bank_name: '',
      loadTitle: '',
      showLoading: false,
      showDialog: false,
      dialogTitle: '',
      dialogMessage: ''
    }
    this._handleSignup = this._handleSignup.bind(this);
    this._handleLogin = this._handleLogin.bind(this);
    this._checkLength = this._checkLength.bind(this);
    this._getServices = this._getServices.bind(this);
  }

  _getServices() {
    AsyncStorage.getItem('jwt').then(token => {
      fetch(Config.API_URL+'/ProvApi/get_services', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            showLoader: false,
            services: res,
            disableButton: false
          })
        })
        .catch(err => {
          this.setState({
            disableButton: true,
            showDialog: true,
            dialogMessage: "Could not load services. Please check your internet connection.",
            showLoader: false
          })
        })
    })
  }
  _updatePicker = value => {
    this.setState({
      selectedService: value
    })
  }
  _handleLocation(data, details) {
    this.setState({
      address: data.description,
      latitude: details.geometry['location'].lat,
      longitude: details.geometry['location'].lng
    })
  }

  _checkLength(val, len) {
    if (val.length < Number(len)) {
      return false;
    }
    else {
      return true;
    }
  }
  _handleSignup(){
      const { full_name, email, phone, password, confirm, address, latitude, longitude, bank_name, account_name, account_number, profession, selectedService, intro } = this.state;
    if (full_name != '' && email != '' && phone != '' && password != '' && confirm != '' && address != '' && latitude != '' && longitude != '' && bank_name != '' && account_name !=  '' && account_number != '' && profession != '' && intro != '') {
      if (password === confirm) {
        if (this._checkLength(full_name, 5)) {
          if (this._checkLength(phone, 10)) {
            this.setState({ showLoading: true })
            fetch(Config.API_URL+'/ProvApi/signup', {
              method: 'POST',
              body: JSON.stringify({
                full_name: full_name,
                password: password,
                email: email,
                phone: phone,
                address: address,
                latitude: latitude,
                longitude: longitude,
                bank_name: bank_name,
                account_name: account_name,
                account_number: account_number,
                profession: profession,
                intro: intro,
                selectedService: selectedService,
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
              dialogMessage: 'Phone number must be 10 or 11 characters'
            });
          }
        }
        else {
          this.setState({
            showDialog: true,
            dialogMessage: 'Full name must be more than 5 characters'
          });
        }
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
  componentDidMount() {
    this._getServices();
  }

  render () {
    const { navigate } = this.props.navigation
    return (
      <ImageBackground blurRadius={1} style={styles.bg} source={require('../assets/images/b1.jpg')}>
      <ScrollView style={styles.containerView}>
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
                onSubmitEditing={() => this.bank_name.focus()}
                />

                <GooglePlacesAutocomplete
      placeholder='Select location'
      minLength={1}
      listViewDisplayed={ false }
      enablePoweredByContainer={false}
      autoFocus={false}
      returnKeyType={'search'}
      fetchDetails={true}
      renderDescription={row => row.description} // custom description render
      onPress={(data, details = null) => {
        this._handleLocation(data, details)
      }}
      query={{
        key: Config.GOOGLE_MAPS_API_KEY,
        language: 'en',
        types:['address', 'establishment'],
      }}

      styles={{
        textInputContainer: {
          height: 43,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: '#eaeaea',
          backgroundColor: '#fafafa',
          paddingLeft: 10,
          marginLeft: 15,
          marginRight: 15,
          marginTop: 20,
          marginBottom: 5,
        },
        description: {
          // fontWeight: 'bold',
          fontSize: 15,
          height: 43,
          fontWeight: '200',
          fontFamily: 'NunitoSans-Regular',
          borderColor: '#eaeaea',
          backgroundColor: '#fafafa',
        },
        predefinedPlacesDescription: {
          color: '#1faadb'
        }
      }}
      nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GooglePlacesSearchQuery={{
        rankby: 'distance',
        types: 'street_address'
      }}
      filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']}
      debounce={200}
    />

                 <TextInput
                ref={(input) => this.bank_name = input}
                returnKeyType='next'
                style={styles.loginFormTextInput}
                onChangeText={bank_name => this.setState({ bank_name })}
                keyboardType='default'
                placeholder="Bank Name"
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.profession.focus()}
                />

                 <Picker
                itemStyle={{ fontFamily: 'NunitoSans-Regular'}}
                selectedValue={this.state.selectedService}
                style={{
                  paddingLeft: 10,
                  marginLeft: 15,
                  marginRight: 15,
                  marginTop: 0,
                  marginBottom: 0,
                  borderRadius: 5,
                  borderWidth: 1,
                  height: 43,
                  borderColor: '#eaeaea',
                  backgroundColor: '#fafafa',
                }}
                onValueChange={this._updatePicker}
              >
                {!this.state.showLoader
                  ? this.state.services.map((service, index) => {
                    return (
                      <Picker.Item
                        key={index}
                        label={service['Service']['name']}
                        value={service['Service']['id']}
                        />
                    )
                  })
                  : null}
              </Picker>

                  <TextInput
                  ref={(input) => this.profession = input}
                returnKeyType='next'
                style={styles.loginFormTextInput}
                onChangeText={profession => this.setState({ profession })}
                keyboardType='default'
                placeholder="Profession"
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.account_name.focus()}
                />

                 <TextInput
                ref={(input) => this.account_name = input}
                returnKeyType='next'
                style={styles.loginFormTextInput}
                onChangeText={account_name => this.setState({ account_name })}
                keyboardType='default'
                placeholder="Account Name"
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.account_number.focus()}
                />

                  <TextInput
                ref={(input) => this.account_number = input}
                returnKeyType='next'
                style={styles.loginFormTextInput}
                onChangeText={account_number => this.setState({ account_number })}
                keyboardType='numeric'
                placeholder="Account Number"
                underlineColorAndroid='transparent'
                />

                    <PasswordInputText
                    placeholder="Password"
                    iconStyle={styles.iconStyle}
                    returnKeyType='next'
                    style={styles.loginFormTextInput}
                    underlineColorAndroid='transparent'
                    onChangeText={password => this.setState({ password })}
                />

                    <PasswordInputText
                    iconStyle={styles.iconStyle}
                    placeholder="Confirm Password"
                    returnKeyType='go'
                    style={styles.loginFormTextInput}
                    underlineColorAndroid='transparent'
                    onChangeText={confirm => this.setState({ confirm })}
                />


                  <TextInput
                returnKeyType='next'
                style={styles.loginFormTextInputIntro}
                onChangeText={intro => this.setState({ intro })}
                keyboardType='default'
                placeholder="A short bio"
                rowSpan={5}
                multiline={true}
                underlineColorAndroid='transparent'
                />

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
      </ScrollView>
      </ImageBackground>
    )
  }
}
const styles = StyleSheet.create({

  iconStyle: {
    position: 'absolute',
    top: 27,
    right: 15,
  },
  separatorContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10
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
  loginFormTextInputIntro: {
    height: 80,
    borderRadius: 5,
    borderWidth: 1,
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
    marginBottom: 30
  },
})