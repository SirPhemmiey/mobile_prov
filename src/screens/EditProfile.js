import React from 'react'
import {
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Picker,
  TextInput
} from 'react-native'
import Config from 'react-native-config'
import { View, Text } from 'react-native-animatable'
import { Button } from 'react-native-elements';
import {
  Title,
  Container,
  Content,
  Header,
  Left,
  Button as ButtonNative,
  Icon,
  Body,
  Right,
  Label,
  Textarea
} from 'native-base'
import { ProgressDialog, Dialog } from 'react-native-simple-dialogs'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const { width, height } = Dimensions.get('window')
export default class EditProfile extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super(props)
    this.state = {
      showLoader: true,
      showLoading: false,
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
      intro: ''
    }
    this.loadData = this.loadData.bind(this);
    this._getServices = this._getServices.bind(this);
    this._saveData = this._saveData.bind(this)
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
            showLoader: false,
            details: res
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

  _saveData() {
    this.setState({ showLoading: true })
    let { address, profession, intro } = this.state;
    if (address != '' && profession != '' && intro != '') {
      AsyncStorage.getItem('jwt').then(token => {
        fetch(Config.API_URL+'/ProvApi/update_profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            address: this.state.address,
            longitude: this.state.longitude,
            latitude: this.state.latitude,
            profession: this.state.profession,
            service_id: this.state.selectedService,
            intro: this.state.intro
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
    const { navigation } = this.props
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
        <Content>

          {!this.state.showLoader
            ? <View animation={'fadeInLeft'} delay={500} duration={400}>

                <View>

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
        // this._handleLocation(data,details)
        this.setState({
          address: data.description,
          latitude: details.geometry['location'].lat,
          longitude: details.geometry['location'].lng
        })
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
          fontSize: 14,
          fontFamily: 'NunitoSans-Regular',
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
              <View animation={'fadeInLeft'} delay={700} duration={400} style={{
                           flexDirection: 'row',
                           justifyContent: 'space-between'
                         }}>
              <Text style={styles.label}>Service</Text>
              <Picker
                itemStyle={{ fontFamily: 'NunitoSans-Regular', borderRadius: 5,
                borderWidth: 1,
                borderColor: '#eaeaea',
                backgroundColor: '#fafafa', }}
                selectedValue={this.state.selectedService}
                style={{
                  width: 200,
                  marginTop: 30
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
                  </View>

                  <View animation={'fadeInLeft'} delay={800} duration={400}>

                 <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                 <Label style={styles.label}>Profession</Label>
                 {/* <Input
                style={{
                  width: 100,
                  marginTop: 30
                }}
                underlineColorAndroid="#3897f1"
                returnKeyType='next'
                onChangeText={profession => this.setState({ profession })}
                autoCapitalize='none'
              /> */}
                <TextInput
                  placeholder="Profession"
                  returnKeyType='next'
                  onSubmitEditing={() => this.location.focus()}
                  style={styles.loginFormTextInput}
                  keyboardType="default"
                  underlineColorAndroid='transparent'
                  autoCapitalize='none'
                  autoCorrect={false}
                  onChangeText={profession => this.setState({ profession })}/>
                 </View>

                 <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                 <Label style={{marginLeft: 20, color: '#0000'}}>Bio</Label>
                 <View style={{marginBottom: 30}}></View>
               <Textarea onChangeText={(intro) => this.setState({intro})} ref={input => (this.bioInput = input)} rowSpan={5} style={{fontFamily:'NunitoSans-Regular', left:0, right:0,  marginRight:20, flex:1}} bordered placeholder="Write a short introduction about yourself and what you do..." />

                   {/* <TextInput
                  placeholder="Full Name"
                  returnKeyType='next'
                  multiline={true}
                  ref={input => this.bio = input}
                  style={styles.loginFormTextInput}
                  keyboardType="default"
                  underlineColorAndroid='transparent'
                  autoCapitalize='none'
                  autoCorrect={false}
                  onChangeText={(intro) => this.setState({intro})}/> */}
              </View>
                  </View>

                <View>

                </View>

              </View>
              {/* </Form> */}
              {/* <Button disabled={this.state.disableButton} onPress={this._saveData} small style={styles.hire}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'NunitoSans-Regular',
                    padding: 4
                  }}
                  >
                    Update
                  </Text>
              </Button> */}
              <Button disabled={this.state.disableButton} onPress={this._saveData}
                  buttonStyle={styles.loginButton}
                  title="Update"
                />
            </View>
            : null}
          <ActivityIndicator
            color='#3897f1'
            size='small'
            animating={this.state.showLoader}
          />
          <ProgressDialog
            visible={this.state.showLoading}
            title='Updating'
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
  input: {
    fontFamily: 'NunitoSans-Regular',
    fontSize:  12
  },
  label: {
    marginLeft: 20,
    marginTop: 45,
    fontFamily: 'NunitoSans-Regular',
    fontSize: 15,
    fontWeight: "bold",
  },
  button: {
    borderRadius: 8,
    marginTop: 35,
    marginLeft: 10,
    padding: 3
  },
  loginButton: {
    backgroundColor: '#3897f1',
    borderRadius: 5,
    height: 45,
    marginTop: 10,
  },
  hire: {
    width: '30%',
    marginTop: 10,
    backgroundColor: '#3897f1',
    justifyContent: 'center',
    marginLeft: 120
  },
  loginFormTextInput: {
    height: 43,
    width: 200,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#eaeaea',
    backgroundColor: '#fafafa',
    fontFamily: 'NunitoSans-Regular',
    paddingLeft: 10,
    // paddingRight: 40,
    marginLeft: 15,
    marginRight: 95,
    marginTop: 40,
    marginBottom: 5,
  },
  dialogButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 20,
    backgroundColor: '#3897f1',
    borderRadius: 5,
  },
})
