import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ActivityIndicator,
  StatusBar,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Picker,
  TextInput
} from 'react-native'
import Config from 'react-native-config'
import { Card, Avatar } from 'react-native-elements'
import {
  Title,
  Container,
  Content,
  Header,
  Left,
  Button,
  Icon,
  Body,
  Input,
  Right,
  Textarea,
  Form,
  Label,
} from 'native-base'
import RNGooglePlaces from 'react-native-google-places'
import { ProgressDialog, Dialog } from 'react-native-simple-dialogs'

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
    this._openPlacePicker = this._openPlacePicker.bind(this);
    this._saveData = this._saveData.bind(this)
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
            dialogMessage: err.message + "Go back to the previous page",
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
  _openPlacePicker(){
    RNGooglePlaces.openPlacePickerModal()
      .then(place => {
        this.setState({
          address: place.name + ', ' + place.address,
          latitude: place.latitude,
          longitude: place.longitude
        })
      })
      .catch(error => {
        this.setState({
          showDialog: true,
          dialogMessage: error.message
        })
      })
  }
  _saveData() {
    // this.setState({
    //   showDialog: true,
    //   dialogMessage: 'This feature hasn\'t been activated. Please check back'
    // })
    this.setState({ showLoading: true })
    let { address, profession, intro } = this.state; 
    if (address != '' && profession != '' && intro != '') {
      // alert(this.state.address + "address");
      // alert(this.state.profession + "prof");
      // alert(this.state.selectedService + "service");
      // alert(this.state.intro + "intro");
      AsyncStorage.getItem('jwt').then(token => {
        fetch(Config.API_URL+'/ProvApi/update_profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: {
            
          }
        })
          .then(res => res.json())
          .then(res => {
            if (res == 'auth') {
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
            else {
              this.setState({
                showLoading: false,
                showDialog: true,
                dialogMessage: 'Your profile was successfully updated'
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
       <Header style={{ backgroundColor: '#6c5ce7' }}>
          <Left>
            <Button transparent iconLeft onPress={() => goBack()}>
              <Icon ios='ios-arrow-back'
                android='md-arrow-back' />
            </Button>
          </Left>
          <Body style={{flex: 1,}}>
            <Title style={styles.heading}>Edit Profile</Title>
          </Body>
          <Right />
        </Header>
        <StatusBar
          barStyle='light-content'
          backgroundColor='#6c5ce7'
          networkActivityIndicatorVisible
        />
        <Content>
          {!this.state.showLoader
            ? <View>

              <Form>
                <View>

              <View style={{
                           flexDirection: 'row',
                           justifyContent: 'space-between'
                         }}>
              <Text style={styles.label}>Service</Text>
              <Picker
                itemStyle={{ fontFamily: 'NunitoSans-Regular' }}
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

                  <View>
                    
                 <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                 <Label style={styles.label}>Profession</Label>
                 <Input
                style={{
                  width: 100,
                  marginTop: 30
                }}
                underlineColorAndroid="#6c5ce7"
                returnKeyType='next'
                onChangeText={profession => this.setState({ profession })}
                autoCapitalize='none'
              />
                 </View>

                 <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                 <Label style={styles.label}>Location</Label>
                 <View style={{flexDirection: 'column'}}>
                 <Input
                style={{
                  width: 300,
                  marginRight: 40,
                  marginTop: 30
                }}
                value={this.state.address}
                underlineColorAndroid="#6c5ce7"
              />
                 
              <TouchableOpacity onPress={this._openPlacePicker}>
                <Text
                  style={{
                    fontFamily: 'NunitoSans-Regular',
                    fontSize: 16,
                    color: '#6c5ce7',
                    marginLeft:50,
                    marginBottom: 25
                  }}
                >
                  Pick a Place
                </Text>
              </TouchableOpacity>
                 </View>
                 </View>
                 
                 <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                 <Label style={{marginLeft: 20, color: '#0000'}}>Bio</Label>
                 <View style={{marginBottom: 30}}></View>
               <Textarea onChangeText={(intro) => this.setState({intro})} ref={input => (this.bioInput = input)} rowSpan={5} style={{fontFamily:'NunitoSans-Regular', left:0, right:0,  marginRight:20, flex:1}} bordered placeholder="Write a short intro about yourself here..." />
              </View>
                  </View>
                
                <View>
                  
                </View>

              </View>
              </Form>
              <Text>Service id is {this.state.selectedService}</Text>
              <Text>Profession id is {this.state.profession}</Text>
              <Text>address id is {this.state.address}</Text>
              <Text>Intro is {this.state.intro}</Text>
              <Button disabled={this.state.disableButton} onPress={this._saveData} small style={styles.hire}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'NunitoSans-Regular',
                    padding: 4
                  }}
                  >
                    Update
                  </Text>
              </Button>
            </View>
            : null}
          <ActivityIndicator
            color='#6c5ce7'
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
 
  hire: {
    width: '30%',
    marginTop: 10,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    marginLeft: 120
  }
})
