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
  ToastAndroid,
  NetInfo
} from 'react-native';
import OneSignal from 'react-native-onesignal';
import Config from 'react-native-config';
import {
  ProgressDialog,
  Dialog,
  ConfirmDialog,
} from 'react-native-simple-dialogs';
import { Card } from 'react-native-elements';
import {
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
  Title,
} from 'native-base';
import PTRView from 'react-native-pull-to-refresh';
import SplashScreen from 'react-native-splash-screen'

export default class Home extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      showLoading: true,
      customers: [],
      showDialog: false,
      dialogMessage: '',
      dialogVisibleAccept: false,
      dialogVisibleReject: false,
    };
    //this.loadData = this.loadData.bind();
    //this._refresh = this._refresh.bind();
    //this._handleComplete = this._handleComplete.bind();
  }

  loadData = () => {
    AsyncStorage.getItem('jwt').then(token => {
      fetch(Config.API_URL + '/ProvApi/home', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(res => {
          if (res == 'empty') {
            this.setState({
              //showDialog: true,
              //dialogMessage: "You have no schedule yet.",
              showLoading: false,
            });
            ToastAndroid.showWithGravity(
              'You have no schedule yet.',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            )
          } else if (res == 'auth') {
            this.setState({
              showDialog: true,
              dialogMessage: "You are unauthorized",
              showLoading: false,
            });
          } else if (res == 'user') {
            this.setState({
              showDialog: true,
              dialogMessage: "User not found",
              showLoading: false,
            });
          } else {
            this.setState({
              showLoading: false,
              customers: res,
            });
          }
        })
        .catch(err => {
          this.setState({
            showDialog: true,
            dialogMessage: err.message + "lol here",
            showLoader: false,
            showLoading: false,
          })
        })
    })
  }
  _refresh = () =>  {
    this.loadData();
  };
  _sendRequest = (type, schedule_id, tracking_id) => {
    this.setState({
      showLoading: true,
    });
    AsyncStorage.getItem('jwt').then(token => {
      fetch(Config.API_URL + '/ProvApi/confirm_request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: type,
            schedule_id: schedule_id,
            tracking_id: tracking_id
          })
        })
        .then(res => res.json())
        .then(res => {
          this.setState({
            showLoading: false,
          });
          if (res == 'done') {
            this.setState({
              showDialog: true,
              dialogMessage: "Success! Your selection has been confirmed. You can now track the customer by navigating to the Track tab.",
            });
            this.loadData();
          } else if (res == 'error') {
            this.setState({
              showDialog: true,
              dialogMessage: "Oops! An error occured.",
            });
          } else {
            this.setState({
              showDialog: true,
              dialogMessage: "Oops! An error occured.",
            });
          }
        })
        .catch(err => {
          this.setState({
            showDialog: true,
            dialogMessage: err.message,
            showLoading: false,
          });
        });
    });
  }
  // _handleComplete = (schedule_id) =>  {
  //   AsyncStorage.getItem('jwt').then(token => {
  //   //this.setState({ showLoading: true})
  //   fetch(Config.API_URL + '/ProvApi/confirm_schedule', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${token}`
  //       },
  //       body: JSON.stringify({
  //         schedule_id: schedule_id
  //       })
  //     })
  //     .then(res => res.json())
  //     .then(res => {
  //       if (res == 'done') {
  //         this.setState({
  //           showDialog: true,
  //           showLoading: false,
  //           dialogMessage: "Provider has been confirmed successfully",
  //         })
  //         this.loadData()
  //       } else {
  //         this.setState({
  //           showLoading: false,
  //           showDialog: true,
  //           dialogMessage: "An error occured during confirmation",
  //         })
  //       }
  //     })
  //     .catch(err => {
  //       this.setState({
  //         showDialog: true,
  //         showLoading: false,
  //         dialogMessage: err.message,
  //       })
  //     })
  // })
  // }
  // _accept = () => {
  //   this._sendRequest('accept');
  //   this.setState({
  //     dialogVisibleAccept: false,
  //   });
  // };
  // _confirm = () => {
  //   // if (type == 'accept') {

  //   // }
  //   // if (type == 'reject') {

  //   // }
  //   this.setState({
  //     dialogVisibleAccept: true,
  //   });
  // };
  componentWillMount() {
    OneSignal.setLogLevel(7, 0);
    OneSignal.init("d699f2ff-1a2e-4d43-8c64-2da4f6a61a27", {
      kOSSettingsKeyAutoPrompt: true
    });
    OneSignal.setLocationShared(true);
    OneSignal.inFocusDisplaying(2)
    //this.loadData()
    NetInfo.isConnected.fetch().done(isConnected => {
      if (isConnected) {
        this.loadData();
      }
      // else {
      //   alert("no connected")
      // }
    })
    // this.onReceived = this.onReceived.bind(this);
    // this.onOpened = this.onOpened.bind(this);

    // OneSignal.addEventListener('received', this.onReceived);
    // OneSignal.addEventListener('opened', this.onOpened);
    //OneSignal.configure();  // <-- add this line
  }
  componentDidMount() {
    //SplashScreen.hide()
    //this.loadData();
  }

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: '#6c5ce7' }}>
         <Left>
         <Button transparent iconLeft onPress={() => goBack()}>
            <Icon ios='logo-buffer'
                android='logo-buffer' />
          </Button>
         </Left>
         <Body>
             <Title style={{fontFamily: 'NunitoSans-Regular'}}>Home</Title>
         </Body>
         <Right />
        </Header>
        <StatusBar
          barStyle='light-content'
          backgroundColor='#6c5ce7'
          networkActivityIndicatorVisible
        />

        <PTRView
          onRefresh={this._refresh}
          colors="#6c5ce7"
          progressBackgroundColor="#6c5ce7"
        >
          <Text style={styles.title}>Pending Schedules</Text>
          {!this.state.showLoading
            ? (
              this.state.customers ? (
                this.state.customers.map((customer, index) => {
                  return (
                    <Card title={`Schedule ${index+1}`} key={index}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: 10,
                        }}
                      >
                        <Text style={styles.label}>Name</Text>
                        <Text style={styles.child}>
                          {customer['Customer']['full_name']}
                        </Text>
                      </View>
  
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: 10,
                        }}
                      >
                        <Text style={styles.label}>Service</Text>
                        <Text style={styles.child}>
                          {customer['Service']['name']}
                        </Text>
                      </View>
  
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: 10,
                        }}
                      >
                        <Text style={styles.label}>Date and Time</Text>
                        <Text style={styles.child}>
                          {customer['Schedule']['datetime']}
                        </Text>
                      </View>
  
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          padding: 10,
                        }}
                      >
                        <Text style={styles.label}>Phone</Text>
                        <Text style={styles.child}>
                          {customer['Schedule']['phone']}
                        </Text>
                      </View>
  
                      <Text style={styles.address}>Address</Text>
                      <View style={{ alignContent: 'center', padding: 10 }}>
                        <Text style={styles.child}>
                          {customer['Schedule']['address']}
                        </Text>
                      </View>
  
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-around',
                        }}
                      >
                        <Button style={{ padding: 6 }}
                        onPress={() => this._sendRequest('decline', customer['Schedule']['id'], customer['Tracking']['id'])} danger>
                          <Text style={styles.button}>Reject</Text>
                        </Button>
                        <Button
                          style={{ padding: 6 }}
                          onPress={() => this._sendRequest('accept', customer['Schedule']['id'],customer['Tracking']['id'])}
                          primary
                        >
                          <Text style={styles.button}>Accept</Text>
                        </Button>
                        {
        customer['Schedule']['provider_confirm'] == 'yes' ? 
        <Button small disabled success style={styles.button}>
         <Text style={styles.buttonText}>Schedule Accepted</Text>
       </Button> :
       null
      }
                      </View>
                     
                    </Card>
                  );
                })
              ): 
              <View style={{ 
              top: 0, left: 0, 
              right: 0, bottom: 0, 
              justifyContent: 'center', 
              alignItems: 'center'}}>
                <Text style={styles.title}>No Schedule yet</Text>
              </View>
            )
            : null}
          <ConfirmDialog
            title="Confirm Dialog"
            message="Are you sure about that?"
            visible={this.state.dialogVisibleAccept}
            onTouchOutside={() => this.setState({ dialogVisibleAccept: false })}
            positiveButton={{
              title: 'YES',
              onPress: () => this._accept(),
            }}
            negativeButton={{
              title: 'NO',
              onPress: () => alert('No touched!'),
            }}
          />
          <ConfirmDialog
            title="Confirm Dialog"
            message="Are you sure about that?"
            visible={this.state.dialogVisibleReject}
            onTouchOutside={() => this.setState({ dialogVisibleReject: false })}
            positiveButton={{
              title: 'YES',
              onPress: () => alert('Yes touched!'),
            }}
            negativeButton={{
              title: 'NO',
              onPress: () => alert('No touched!'),
            }}
          />
          <ProgressDialog
            visible={this.state.showLoading}
            title='Loading data'
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
        </PTRView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 18,
    color: '#6c5ce7',
    textAlign: 'center',
    marginTop: 10,
  },
  label: {
    fontWeight: 'bold',
    fontFamily: 'NunitoSans-Regular',
    fontSize: 15,
  },
  child: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 13,
  },
  address: {
    fontFamily: 'NunitoSans-Regular',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    fontFamily: 'NunitoSans-Regular',
    padding: 3,
    color: '#fff'
  },
});
