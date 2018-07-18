import React from 'react'
import { StyleSheet, Dimensions, AsyncStorage,View,Text, StatusBar, ToastAndroid, TouchableOpacity } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import Config from 'react-native-config';
import { Dialog } from 'react-native-simple-dialogs';
import { Container, Content, Footer,Button, Header, Left, Icon, Body, Title, Right } from 'native-base';
const { width, height } = Dimensions.get('window')

export default class Mapping extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      region: [],
      latitude: null,
      longitude: null,
      customer_lat: null,
      customer_long: null,
      error: null,
      flag: false,
      directionsResult: ''
    } 
    this.mapView = null;
  }
  
    _onRegionChange (region) {
      this.setState({
        region: region
      })
    }
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
            // this.setState({
            //   showDialog: true,
            //   flag: true,
            //   dialogMessage: 'Provider hasn\'t confirmed the schedule. Please check back'
            // })
            
            ToastAndroid.showWithGravity(
              'You have a pending schedule.',
              ToastAndroid.LONG,
              ToastAndroid.CENTER
          )
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
            showLoader: false,
          })
          if (res != 'empty') {
            this.setState({
              flag: true,
              latitude: res.provider_lat,
              longitude: res.provider_long,
              customer_lat: res.customer_lat,
              customer_long: res.customer_long,
            })
          } 
          // else {
          //   this.setState({
          //     flag: false,
          //     // showDialog: true,
          //     // dialogMessage: 'You have no pending schedule',
          //   })
          //   ToastAndroid.showWithGravity(
          //   'You have no pending schedule',
          //   ToastAndroid.SHORT,
          //   ToastAndroid.CENTER
          // )
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
  componentDidMount () {
    this._getProvLocation()
    //this._checkStatus();
    //this._getCurrentLocation()
  }
  showLocation(e) {
    this.mapView.fitToElements(true)
    }
    handleGetGoogleMapDirections = () => {
      const data = {
        destination: {
          latitude: this.state.customer_lat,
          longitude: this.state.customer_long
        },
          params: [
              {
                  key: "travelmode",
                  value: "driving"
              }
          ]
      };

      getDirections(data)
  };
  render () {
    const { navigation } = this.props
    return (
        <Container>
          
          <Content>
           {
             this.state.flag ? (
            <View style={styles.container}>
              {
                this.state.latitude != '' && this.state.longitude != '' ? (
                  <MapView 
                  provider="google"
                  mapType='standard'
					        toolbarEnabled={true}
                  showsUserLocation={true}
                  showsBuildings={true}
                  showsTraffic={true}
                  loadingEnabled={true}
                  showsMyLocationButton={true}
                  ref={c => this.mapView = c}
                  onRegionChange={this.onRegionChange}
                  onPress={(value) => this.showLocation(value)}
       style={ styles.mapcontainer }
       region={{
        latitude: parseFloat(this.state.latitude),
        longitude: parseFloat(this.state.longitude),
        latitudeDelta: Math.abs(this.state.latitude - this.state.customer_lat) + Math.abs(this.state.latitude - this.state.customer_lat) * .1,
        longitudeDelta: Math.abs(this.state.longitude - this.state.customer_long) + Math.abs(this.state.longitude - this.state.customer_long) * .1
      }}>

              <MapView.Marker
               coordinate={{
                 latitude: parseFloat(this.state.latitude),
         longitude: parseFloat(this.state.longitude),
               }}
              >
                <MapView.Callout>
                            <Text style={{fontFamily:'NunitoSans-Regular'}}>You are currently here</Text>
                        </MapView.Callout>
              </MapView.Marker>
              <MapView.Marker
               coordinate={{
                 latitude: parseFloat(this.state.customer_lat),
         longitude: parseFloat(this.state.customer_long),
               }}
               >
               <MapView.Callout onPress={this.handleGetGoogleMapDirections}>
                            <Text>Customer is here. Click to Get Direction details (Optional)</Text>
                        </MapView.Callout>
              </MapView.Marker>
 
              {
                this.state.customer_lat != 0 ? 
                (
   <MapViewDirections
              strokeWidth={5}
              strokeColor="#6c5ce7"
       origin={{
         latitude: parseFloat(this.state.latitude),
   longitude: parseFloat(this.state.longitude),
       }}
       destination={{
         latitude: parseFloat(this.state.customer_lat),
   longitude: parseFloat(this.state.customer_long),
       }}
       apikey={Config.GOOGLE_MAPS_API_KEY}
       onReady={(result) => {
         this.setState({ directionsResult: result})
         this.mapView.fitToCoordinates(result.coordinates, {
          edgePadding: {
            right: (width / 20),
            bottom: (height / 20),
            left: (width / 20),
            top: (height / 20),
          }
        });
       }}  
     />
                ): null
              }
     </MapView>
     
                ) : null
              }
               <View style={styles.button}>
             <Button light>
               <Text style={{fontFamily: 'NunitoSans-Regular'}}>
               Distance: {parseFloat(this.state.directionsResult.distance).toFixed(2)}
               </Text>
               <View style={{marginLeft:15}}></View>
               <Text style={{fontFamily: 'NunitoSans-Regular'}}>
               Duration: {parseFloat(this.state.directionsResult.duration).toFixed(2)}
               </Text>
             </Button>
           </View>
            </View>
             ) : <Text>Nothing to display</Text>
           }
          </Content>
        </Container>
    )
  }
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
mapcontainer: {
    width: width,
    height: height,
    zIndex: -1
  },
  button: {
    flex: 3,
    position: 'absolute',
    top: 350,
    marginLeft: 100, 
    marginTop: 100,
    zIndex: 10,
  }
})
