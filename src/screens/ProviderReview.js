import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  ActivityIndicator,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';
import Config from 'react-native-config';
import { Card, Avatar } from 'react-native-elements';
import Timeago from 'react-native-timeago';
import {
  Title,
  Container,
  Content,
  Header,
  Left,
  Button,
  Icon,
  Body,
  Item,
  Input,
  InputGroup,
  Right,
} from 'native-base';
import PTRView from 'react-native-pull-to-refresh';

export default class ProviderReview extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      showLoader: true,
      reviewers: [],
      showDialog: '',
      dialogMessage: '',
    };
  }
  loadData = () => {
    const { navigation } = this.props;
    let provider_id = navigation.getParam('provider_id', null);
    AsyncStorage.getItem('jwt').then(token => {
      fetch(Config.API_URL + '/api/get_reviewers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          provider_id: provider_id,
        }),
      })
        .then(res => res.json())
        .then(res => {
          this.setState({
            showLoader: false,
            reviewers: res
          });
        })
        .catch(err => {
          this.setState({
            showDialog: true,
            dialogMessage: err.message,
            showLoader: false,
          });
        });
    });
  };
  _refresh = () => {
    this.loadData();
  };
  componentDidMount() {
    this.loadData();
  }

  render() {
    const { navigation } = this.props;
    let first_name = navigation.getParam('provider_name').split(" ");
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
              {first_name[0]}'s review
            </Title>
          </Body>
          <Right />
        </Header>
        <StatusBar
          barStyle="light-content"
          backgroundColor="#6c5ce7"
          networkActivityIndicatorVisible
        />
        <PTRView
          onRefresh={this._refresh}
          colors="#6c5ce7"
          progressBackgroundColor="#6c5ce7"
        >
          {!this.state.showLoader
            ? (
              this.state.reviewers ? 
              (
                this.state.reviewers.map((rev, index) => {
                  return (
                    <TouchableOpacity key={index}>
                      <Card>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                          }}
                        >
                          <Avatar
                            size="xlarge"
                            source={{
                              uri: Config.CUSTOMER_PIC + rev['Customer']['pic'],
                            }}
                            activeOpacity={0.7}
                          />
                          <View
                            style={{
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              width: 0,
                              flexGrow: 1,
                            }}
                          >
                            <Text style={{ marginLeft:10, fontFamily: 'NunitoSans-Regular' }}>
                              {rev['Review_provider']['comments']}
                            </Text>
                            
                            <Text style={{marginLeft:8, marginTop:15, fontFamily: 'NunitoSans-Regular', fontSize: 12 }}>
                            By {rev['Customer']['full_name']}
                          </Text>
                          </View>
                          
                          <View style={{ marginTop: 30 }} />
                          
                          
                          <Text style={{alignItems: 'flex-end'}}>
                            <Timeago
                              time={rev['Review_provider']['date_added']}
                            />
                          </Text>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  );
                })
              ): null
            )
            : null}
          <ActivityIndicator
            color="#6c5ce7"
            size="small"
            animating={this.state.showLoader}
          />
        </PTRView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  searchInput: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 16,
  },
  title: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 18,
    color: '#6c5ce7',
    textAlign: 'center',
    marginTop: 10,
  },
});
