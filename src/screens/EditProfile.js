import React from 'react'
import {
  StyleSheet,
  AsyncStorage,
  StatusBar,
  Picker,
  TextInput,
  ScrollView
} from 'react-native'
import Config from 'react-native-config'
import { View, Text } from 'react-native-animatable'
import { Button } from 'react-native-elements';
import {
  Title,
  Container,
  Header,
  Left,
  Button as ButtonNative,
  Icon,
  Body,
  Right,
} from 'native-base'
import { ProgressDialog, Dialog } from 'react-native-simple-dialogs'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default class EditProfile extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super(props)
    this.state = {
      full_name: '',
      showLoading: true,
      details: [],
      services: [],
      selectedService: 1,
      showDialog: false,
      dialogMessage: '',
      address: '',
      latitude: '',
      profession: '',
      disableButton: true,
      longitude: '',
      intro: '',
      account_name: '',
      account_number: '',
      bank_name: '',
      bank_id: ''
    }
    this.loadData = this.loadData.bind(this);
    this._getServices = this._getServices.bind(this);
    this._handleUpdate = this._handleUpdate.bind(this)
    this._handleLocation = this._handleLocation.bind(this)
  }

  loadData() {
    const { navigation } = this.props
    AsyncStorage.getItem('jwt').then(token => {
      fetch(Config.API_URL+'/ProvApi/profile', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            showLoading: false,
            details: res,
            full_name: res[0].Provider.name,
            selectedService: res[0].Provider.service_id,
            profession: res[0].Provider.profession,
            intro: res[0].Provider.intro,
            latitude: res[0].Provider.latitude,
            longitude: res[0].Provider.longitude,
            address: res[0].Provider.address,
            bank_name: res[0].Bank_detail.bank_name,
            account_number: res[0].Bank_detail.account_number,
            account_name: res[0].Bank_detail.account_name,
            bank_id: res[0].Bank_detail.id
          })
        })
        .catch(err => {
          this.setState({
            showDialog: true,
            dialogMessage: err.message,
            showLoader: false
          })
        })
    })
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
            dialogMessage: err.message + ". Go back to the previous page",
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

  _handleUpdate() {
    this.setState({ showLoading: true })
    let { address, profession, intro, longitude, latitude, account_name, account_number, bank_name, full_name, bank_id, selectedService } = this.state;
    if (address != '' && profession != '' && intro != '' && longitude != '' && latitude != '' && account_name != '' && account_number != '' && bank_name != '' && full_name != '') {
      AsyncStorage.getItem('jwt').then(token => {
        fetch(Config.API_URL+'/ProvApi/update_profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            address: address,
            longitude: longitude,
            latitude: latitude,
            profession: profession,
            service_id: selectedService,
            intro: intro,
            account_name: account_name,
            account_number: account_number,
            bank_name: bank_name,
            full_name: full_name,
            bank_id: bank_id
          })
        })
          .then(res => res.json())
          .then(res => {
            if (res == 'done') {
              this.setState({
                showLoading: false,
                showDialog: true,
                dialogMessage: 'Your profile was successfully updated'
              })
            }
            else if (res == 'auth') {
              this.setState({
                showLoading: false,
                showDialog: true,
                dialogMessage: 'You are not authorized'
              })
            }
            else if (res == 'error') {
              this.setState({
                showLoading: false,
                showDialog: true,
                dialogMessage: 'Oops! An error occured while updating your profile. Please try again'
              })
            }
            else if (res == 'before') {
              this.setState({
                showLoading: false,
                showDialog: true,
                dialogMessage: 'You cannot update your profile while you have a pending schedule. Please retry when the schedule is completed.'
              })
            }
          })
          .catch(err => {
            this.setState({
              showDialog: true,
              dialogMessage: err.message + ". Please retry",
              showLoading: false
            })
          })
      })
    }
    else {
      this.setState({
        showDialog: true,
        dialogMessage: "Fields cannot be empty",
        showLoading: false
      })
    }
  }

  componentDidMount () {
    this.loadData();
    this._getServices();
  }

  render () {
    const { navigation } = this.props;
    const { details} = this.state;
    return (
       <Container>
         <Header style={{ backgroundColor: '#3897f1' }}>
          <Left>
            <ButtonNative transparent iconLeft onPress={() => navigation.goBack()}>
            <Icon ios='ios-arrow-back'
                android='md-arrow-back' />
          </ButtonNative>
          </Left>
          <Body style={{flex: 1,}}>
            <Title style={styles.heading}>Update Profile</Title>
          </Body>
          <Right />
        </Header>
        <StatusBar
          barStyle='light-content'
          backgroundColor='#3897f1'
          networkActivityIndicatorVisible
      />
      <ScrollView style={styles.containerView}>
        <View animation={'slideInDown'} delay={600} duration={400} style={styles.loginScreenContainer}>
          <StatusBar
            barStyle='light-content'
            backgroundColor='#3897f1'
            networkActivityIndicatorVisible
          />
            <View style={styles.loginFormView}>

            {
              details.map(info => {
                return (
                  <View key={info.Provider.id}>
                   <TextInput
                returnKeyType='next'
                style={styles.loginFormTextInput}
                onChangeText={full_name => this.setState({ full_name })}
                keyboardType='default'
                autoCapitalize='none'
                placeholder="Full Name"
                defaultValue={info.Provider.name ? info.Provider.name : null}
                underlineColorAndroid='transparent'
                />

                <GooglePlacesAutocomplete
                placeholder='Select a new location'
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
                returnKeyType='next'
                style={styles.loginFormTextInput}
                onChangeText={bank_name => this.setState({ bank_name })}
                defaultValue={info.Bank_detail.bank_name ? info.Bank_detail.bank_name : null}
                keyboardType='default'
                underlineColorAndroid='transparent'
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
                returnKeyType='next'
                style={styles.loginFormTextInput}
                onChangeText={profession => this.setState({ profession })}
                defaultValue={info.Provider.profession ? info.Provider.profession : null}
                keyboardType='default'
                placeholder="Profession"
                underlineColorAndroid='transparent'
                />

                 <TextInput
                returnKeyType='next'
                style={styles.loginFormTextInput}
                onChangeText={account_name => this.setState({ account_name })}
                defaultValue={info.Bank_detail.account_name ? info.Bank_detail.account_name : null}
                keyboardType='default'
                placeholder="Account Name"
                underlineColorAndroid='transparent'
                />

                  <TextInput
                returnKeyType='next'
                style={styles.loginFormTextInput}
                onChangeText={account_number => this.setState({ account_number })}
                defaultValue={info.Bank_detail.account_number ? info.Bank_detail.account_number : null}
                keyboardType='numeric'
                placeholder="Account Number"
                underlineColorAndroid='transparent'
                />

                  <TextInput
                returnKeyType='next'
                style={styles.loginFormTextInputIntro}
                onChangeText={intro => this.setState({ intro })}
                defaultValue={info.Provider.intro ? info.Provider.intro : null}
                keyboardType='default'
                placeholder="A short bio"
                rowSpan={5}
                multiline={true}
                underlineColorAndroid='transparent'
                />
                  </View>
                );
              })
            }

                <Button
                  buttonStyle={styles.loginButton}
                  onPress={this._handleUpdate}
                  title="Update"
                />

            </View>
            <ProgressDialog
            visible={this.state.showLoading}
            title="Fetching details"
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
      </ScrollView>
       </Container>
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
