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
  ToastAndroid
} from 'react-native'
import Config from 'react-native-config'
import PTRView from 'react-native-pull-to-refresh'
import { Card, SearchBar, Avatar } from 'react-native-elements'
import {
  Container,
  Content,
  Header,
  Button,
  Icon,
} from 'native-base'

export default class Services extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor (props) {
    super(props)
    this.state = {
      showLoader: true,
      services: [],
      new_services: [],
      showDialog: '',
      dialogMessage: ''
    }
    this.allServices = [];
    this._refresh = this._refresh.bind(this);
    this.loadData = this.loadData.bind(this);
  }
  onChangeText = () => {
    const { services } = this.state
  }
  another = () => {
    const { navigation } = this.props;
    let new_service_id = navigation.getParam('service_id', null);
    if (new_service_id != null) {
      alert(new_service_id)
      AsyncStorage.getItem('jwt').then(token => {
        fetch(Config.API_URL + '/api/search_service_providers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            service_id: new_service_id
          })
        })
          .then(res => res.json())
          .then(res => {
            if (res != 'empty') {
              this.setState({
                new_services: res
              })
              console.warn(res);
            }
            else {
              this.setState({ new_services: [] });
            }
          })
          .catch(err => {
            ToastAndroid.showWithGravity(
              'An error occured!',
              ToastAndroid.CENTER
            )
            this.setState({
              showDialog: true,
              dialogMessage: err.message,
              showLoader: false
            })
          })
      })
    }
  }
  loadData(){
    AsyncStorage.getItem('jwt').then(token => {
      fetch(Config.API_URL + '/api/home', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            showLoader: false
          })
          this.setState({
            services: res
          })
          this.allServices = res
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
  //this will render specific list of services 
  
  _refresh() {
    this.loadData()
  }
  componentWillMount () {
    this.loadData()
    this.another
  }

  _searchText = () => {}

  render () {
    const services = this.state.services
    return (
      <Container>

        <Header style={{ backgroundColor: '#6c5ce7' }}>
          <Button transparent iconLeft onPress={() => this.props.navigation.navigate('DrawerOpen')}>
            <Icon name='menu' />
          </Button>
          <SearchBar
            lightTheme
            round
            placeholder='Search for services...'
            placeholderTextColor='#fff'
            inputStyle={{
              fontFamily: 'NunitoSans-Regular',
              fontSize: 15,
              color: '#fff'
            }}
            backgroundColor='red'
            containerStyle={{
              width: '95%',
              borderBottomColor: '#6c5ce7',
              borderTopColor: '#6c5ce7',
              backgroundColor: '#6c5ce7'
            }}
          />

        </Header>
        <StatusBar
            barStyle='light-content'
            backgroundColor='#6c5ce7'
            networkActivityIndicatorVisible
          />
        <PTRView
          onRefresh={this._refresh}
          colors='#6c5ce7'
          progressBackgroundColor='#6c5ce7'
        >
          

          <Text style={styles.title}>Find service providers near to you</Text>
          {!this.state.showLoader
            ? (
              this.state.services.map((service, index) => {
                return (
                  <TouchableOpacity key={index}>
                    <Card>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        }}
                        >
                        <Avatar
                          size='xlarge'
                          rounded
                          source={{
                            uri: Config.IMAGE_URL + service['Service']['pic']
                          }}
                          activeOpacity={0.7}
                          />
                        <Text style={{ fontFamily: 'NunitoSans-Regular' }}>
                          {service['Service']['name']}
                        </Text>
                        <Icon
                          ios='ios-arrow-dropright-circle'
                          android='md-arrow-dropright-circle'
                          style={{ fontSize: 30, color: '#6c5ce7' }}
                          />
                      </View>
                    </Card>
                  </TouchableOpacity>
                )
              })
            ) 
            : null}
          <ActivityIndicator
            color='#6c5ce7'
            size='small'
            animating={this.state.showLoader}
          />
        </PTRView>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  searchInput: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 16
  },
  title: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 18,
    color: '#6c5ce7',
    textAlign: 'center',
    marginTop: 10
  }
})
