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
  Picker
} from 'react-native'
import Config from 'react-native-config'
import { Card, Avatar } from 'react-native-elements'
import { ProgressDialog, Dialog } from 'react-native-simple-dialogs'
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
  Item,
  Label,
  Right,
  Form,
} from 'native-base'
//import RNGooglePlaces from 'react-native-google-places'
const { width, height } = Dimensions.get('window')
export default class ProviderDetails extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super(props)
    this.state = {
      showLoader: false,
      details: [],
      //showLoading: false,
      services: [],
      showDialog: false,
      dialogMessage: '',
      selectedService: 1,
      profession: '',
      location: '',
      intro: '',
      address: '',
      latitude: '',
      longitude: ''
    }
  }
  loadData = () => {
    const { navigation } = this.props
    AsyncStorage.getItem('jwt').then(token => {
      fetch(Config.API_URL+'/ProvApi/pro_details', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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

        fetch(Config.API_URL+'/ProvApi/get_services', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            showLoader: false,
            services: res
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
  _save = () => {
    AsyncStorage.getItem('jwt').then(token => {
      this.setState({
        showLoading: true,
      })
        fetch(Config.API_URL+'/ProvApi/update_profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
              profession: this.state.profession,
              intro: this.state.intro,
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              service_id: this.state.selectedService,
              address: this.state.address
          })
        })
          .then(res => res.json())
          .then(res => {
            this.setState({
              showLoader: false,
              showDialog: true,
              dialogMessage: "Profile updated successfully"
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
  _updatePicker = value => {
    this.setState({
      selectedService: value
    })
  }
//   _openPlacePicker = () => {
//     RNGooglePlaces.openPlacePickerModal()
//       .then(place => {
//         this.setState({
//           address: place.name + ', ' + place.address,
//           destLatitude: place.latitude,
//           destLongitude: place.longitude
//         })
//       })
//       .catch(error => {
//         this.setState({
//           showDialog: true,
//           dialogMessage: error.message
//         })
//       })
//   }
  componentDidMount () {
    this.loadData()
  }

  render () {
    const { navigation } = this.props
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
          <Body style={{flex: 2}}>
            <Title style={{ fontFamily: 'NunitoSans-Regular' }}>
              Update Details
            </Title>
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
              <ImageBackground
                source={{
                  uri: this.state.details.pic == ''
                      ? Config.API_URL+'/app/webroot/customer_pic/hqdefault.jpg'
                      : this.state.details.pic
                }}
                resizeMode='cover'
                style={{ width: width, height: 300 }}
                >
                <View
                  style={{
                    flexDirection: 'column',
                    marginTop: 230,
                    marginLeft: 10
                  }}
                  >
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'NunitoSans_Regular',
                      fontSize: 20,
                      letterSpacing: 3
                    }}
                    >
                    {this.state.details.name}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'NunitoSans-Regular',
                      letterSpacing: 1
                    }}
                    >
                    {this.state.details.profession}
                  </Text>
                </View>
              </ImageBackground>
              <View>
                <Card containerStyle={styles.contactCard}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between'
                    }}
                    >
                    <Text
                      style={{
                        fontFamily: 'NunitoSans-Regular',
                        fontSize: 14,
                        color: '#000',
                        letterSpacing: 1
                      }}
                      >
                      {this.state.details.phone}
                    </Text>
                    <Icon
                      ios='ios-call'
                      android='md-call'
                      style={{ color: '#6c5ce7' }}
                      />
                  </View>
                  <Text
                    style={{
                      fontFamily: 'NunitoSans-Regular',
                      fontSize: 12
                    }}
                    >
                      Mobile Phone
                    </Text>

                </Card>
                <View
                  style={{ justifyContent: 'flex-start', marginLeft: 12 }}
                  >
                  <Form>
                  <Item>
              <Picker
                itemStyle={{ fontFamily: 'NunitoSans-Regular' }}
                selectedValue={this.state.selectedService}
                style={{
                  height: 50,
                  width: 360,
                  marginLeft: 15,
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
            </Item>

             <Item stackedLabel>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                Profession
              </Label>
              <Input
                style={styles.input}
                returnKeyType='next'
                onSubmitEditing={() => this.profInput.focus()}
                onChangeText={profession => this.setState({ profession })}
              />
            </Item>

            <Item stackedLabel>
              <Label style={{ fontFamily: 'NunitoSans-Regular' }}>
                Location
              </Label>
              <Input
              ref={input => this.profInput = input}
                style={styles.input}
                returnKeyType='next'
                onChangeText={location => this.setState({ location })}
                autoCapitalize='none'
              />
            </Item>

                  </Form>
                  <ProgressDialog
            visible={this.state.showLoader}
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
                backgroundColor: '#6c5ce7'
              }}
            >
             <Text style={{fontFamily: 'NunitoSans-Regular', padding: 4, color: '#fff'}}>CLOSE</Text>
            </Button>
          </Dialog>
                </View>
              </View>
              <Button onPress={this._save} small style={styles.hire}>
                <Text
                  style={{
                    color: '#fff',
                    fontFamily: 'NunitoSans-Regular',
                    padding: 4
                  }}
                  >
                    Save
                  </Text>
              </Button>
            </View>
            : null}
          <ActivityIndicator
            color='#6c5ce7'
            size='small'
            animating={this.state.showLoader}
          />
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  pcontactView: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  contactCard: {
    marginTop: 45,
    borderRadius: 10,
    width: '80%',
    marginLeft: 40
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
