import React from 'react'
import { StyleSheet, Dimensions, AsyncStorage,View,Text, StatusBar } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import Config from 'react-native-config';
import { Dialog } from 'react-native-simple-dialogs';
import { Container, Content, Footer,Button,Header,Left,Right,Title,Body,Icon } from 'native-base';
const { width, height } = Dimensions.get('window')

const LATITUDE_DELTA = 0.01
const LONGITUDE_DELTA = 0.01
export default class Mapping extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      region: {
        latitude: '',
        longitude: ''
      },
      latitude: null,
      longitude: null,
      provider_lat: '',
      provider_long: '',
      error: null,
      flag: false
    }
  }
  //   _onRegionChange (region) {
  //     this.setState({
  //       region: region
  //     })
  //   }
  _checkStatus = () => {
    AsyncStorage.getItem('jwt').then(token => {
      fetch(Config.API_URL+'/ProvApi/customer_provider_confirm', {
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
              flag: true,
              dialogMessage: 'Provider hasn\'t confirmed the schedule. Please check back'
            })
            setTimeout(() => {
              this.props.navigation.navigate("tabStack")
            }, 3000)
          }
          // else if (res == 'both_confirmed') {
          //   this.setState({
          //     showDialog: true,
          //     flag: true,
          //     dialogMessage: 'You have no active schedule.'
          //   })
          //   setTimeout(() => {
          //     this.props.navigation.navigate("drawerStack")
          //   }, 3000)
          // }
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
  _getProvLocation = () => {
    AsyncStorage.getItem('jwt').then(token => {
      fetch(Config.API_URL+'/ProvApi/get_latlng', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            showLoader: false
          })
          if (res != 'empty') {
            this.setState({
              latitude: res.customer_lat,
              longitude: res.customer_long,
              provider_latitude: res.provider_lat,
              provider_long: res.provider_long,
            })
          } else {
            this.setState({
              showDialog: true,
              dialogMessage: 'You have no pending schedule',
            })
          }
        })
        .catch(err => {
          this.setState({
            showDialog: true,
            dialogMessage: err.message + "lol here",
            showLoader: false
          })
        })
    })
  }
  _getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
          });
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
  );
  }
  componentWillMount () {
    this._getProvLocation()
   // this._checkStatus();
    //this._getCurrentLocation()
  }
  render () {
    const { goBack }  = this.props.navigation
    return (
        <Container>
        <Header style={{ backgroundColor: '#6c5ce7' }}>

          <Left>
            <Button transparent>
              <Icon
                onPress={() => navigation.goBack()}
                ios='ios-arrow-back'
                android='md-arrow-back'
              />
            </Button>
          </Left>
          <Body>
            <Title style={{ fontFamily: 'NunitoSans-Regular' }}>
              Mapping
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
           {
             this.state.flag ? (
              <MapView
        style={styles.map}
        initialRegion={{
          latitude: parseFloat(this.state.latitude),
          longitude: parseFloat(this.state.longitude),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
      >
    
      </MapView>
             ) : null
           }
          </Content>
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
        </Container>
    )
  }
}

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
})
