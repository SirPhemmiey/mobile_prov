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
  Dimensions
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
  Footer
} from 'native-base'
import RNGooglePlaces from 'react-native-google-places'
import { Dialog } from 'react-native-simple-dialogs'

const { width, height } = Dimensions.get('window')
export default class Location extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super(props)
    this.state = {
      address: '',
      destLatitude: '',
      destLongitude: '',
      showDialog: false,
      dialogMessage: ''
    }
  }
  _openPlacePicker = () => {
    RNGooglePlaces.openPlacePickerModal()
      .then(place => {
        this.setState({
          address: place.name + ', ' + place.address,
          destLatitude: place.latitude,
          destLongitude: place.longitude
        })
      })
      .catch(error => {
        this.setState({
          showDialog: true,
          dialogMessage: error.message
        })
      })
  }
  _gotoRequestService = () => {
    const {
      navigation
    } = this.props;
    let provider_id = navigation.getParam('provider_id', null);
    let provider_name = navigation.getParam('provider_name', null);
    let shortcut = navigation.getParam('shortcut', null);
    if (this.state.address == '') {
      this.setState({
        showDialog: true,
        dialogMessage: 'Please select a location'
      })
    } else {
      // if (shortcut == 'yes') {
      //   //goto request service screen with positives
      //   this.props.navigation.navigate('requestService', {
      //     address: this.state.address,
      //     destLat: this.state.destLatitude,
      //     destLong: this.state.destLongitude,
      //     provider_id: provider_id,
      //     provider_name: provider_name
      //   })
      // } else {
      //   //goto normally to request service screen
      //   this.props.navigation.navigate('requestService', {
      //     address: this.state.address,
      //     destLat: this.state.destLatitude,
      //     destLong: this.state.destLongitude
      //   })
      // }
      this.props.navigation.navigate('requestService', {
        address: this.state.address,
        destLat: this.state.destLatitude,
        destLong: this.state.destLongitude
    });
  }
  }
  _checkStatus = () => {
    AsyncStorage.getItem('jwt').then(token => {
      fetch(Config.API_URL + '/api/check_booking', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            showLoader: false
          })
          if (res == 'pending') {
            this.setState({
              showDialog: true,
              dialogMessage: 'Provider hasn\'t confirmed the schedule. Please check back'
            })
            setTimeout(() => {
              this.props.navigation.navigate("drawerStack")
            }, 3000)
          }
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
  componentWillMount() {
    this._checkStatus()
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
          <Body>
            <Title style={{ fontFamily: 'NunitoSans-Regular' }}>
              Location
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
          <View>
            <View style={styles.buttonView}>
              <Input
              onKeyPress={this._openPlacePicker}
                value={this.state.address}
                underlineColorAndroid='#6c5ce7'
                style={styles.input}
              />
              <TouchableOpacity onPress={this._openPlacePicker}>
                <Text
                  style={{
                    fontFamily: 'NunitoSans-Regular',
                    fontSize: 16,
                    color: '#6c5ce7'
                  }}
                >
                  Pick a Place
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
                backgroundColor: '#6c5ce7',
                padding: 3
              }}
            >
              <Text
                style={{
                  fontFamily: 'NunitoSans-Regular',
                  color: '#fff',
                  padding: 4
                }}
              >
                CLOSE
              </Text>
            </Button>
          </Dialog>
        </Content>
        <Footer style={{ backgroundColor: '#6c5ce7' }}>
          <TouchableOpacity onPress={this._gotoRequestService}>
            <Text style={styles.next}>NEXT</Text>
          </TouchableOpacity>
        </Footer>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  buttonView: {
    flexDirection: 'column',
    justifyContent: 'space-evenly'
  },
  input: {
    fontFamily: 'NunitoSans-Regular',
    width: '100%'
  },
  next: {
    fontFamily: 'NunitoSans-SemiBold',
    marginTop: 6,
    fontSize: 18,
    letterSpacing: 0.5,
    color: '#fff',
    padding: 3
  },
  buttonView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    marginLeft: 15,
    marginTop: 50
  }
})
