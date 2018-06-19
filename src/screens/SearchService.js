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
import { Card, SearchBar, Avatar } from 'react-native-elements'
import {
  Container,
  Content,
  Header,
  Button,
  Icon,
} from 'native-base'

export default class SearchService extends React.Component {
  static navigationOptions = {
      header: null
  };
  constructor(props) {
      super(props)
      this.state = {
          showLoader: true,
          providers: [],
          showDialog: '',
          dialogMessage: ''
      }
      this.allServices = [];
      this.loadData = this.loadData.bind(this);
      this._gotoProviderDetails = this._gotoProviderDetails.bind(this);
  }
  onChangeText = () => {
      const {
          services
      } = this.state
  }

  _gotoProviderDetails = (provider_id, provider_name) => () => {
    this.props.navigation.navigate('providerDetails', {
      provider_id: provider_id,
      provider_name: provider_name,
      shortcut: 'yes'
    })
  }

  loadData() {
      const {
          navigation
      } = this.props;
      let service_id = navigation.getParam('service_id', null);
      if (service_id != null) {
          //alert(new_service_id)
          AsyncStorage.getItem('jwt').then(token => {
              fetch(Config.API_URL + '/api/search_service_providers', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({
                          service_id: service_id
                      })
                  })
                  .then(res => res.json())
                  .then(res => {
                      this.setState({
                          showLoader: false
                      })
                      if (res != 'empty') {
                          this.setState({
                              providers: res
                          })
                      } else {
                          ToastAndroid.showWithGravity(
                              'No provider found in the category.',
                              ToastAndroid.LONG,
                              ToastAndroid.CENTER
                          )
                      }
                  })
                  .catch(err => {
                      ToastAndroid.showWithGravity(
                          'An error occured!',
                          ToastAndroid.LONG,
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
  componentWillMount() {
      this.loadData()
  }

  _searchText = () => {}

  render () {
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
        <Content>
          <Text style={styles.title}>Found {this.state.providers.length} provider(s)</Text>
          {!this.state.showLoader
            ? (
              this.state.providers.map((provider, index) => {
                return (
                  <TouchableOpacity key={index} onPress={this._gotoProviderDetails(provider['Provider']['id'], provider['Provider']['name'])}>
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
                            uri: Config.IMAGE_URL + provider['Provider']['pic']
                          }}
                          activeOpacity={0.7}
                          />
                        <Text style={{ fontFamily: 'NunitoSans-Regular' }}>
                          {provider['Provider']['name']}
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
        </Content>
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
