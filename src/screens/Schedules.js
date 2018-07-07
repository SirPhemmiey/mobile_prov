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
  Modal, 
  TouchableHighlight,
  TextInput
} from 'react-native'
import Config from 'react-native-config';
import { Card } from 'react-native-elements';
import {
  ProgressDialog,
  Dialog,
  ConfirmDialog,
} from 'react-native-simple-dialogs';
import {
  Container,
  Content,
  Header,
  Left,
  Button,
  Right,
  Icon,
  Body,
  Item,
  Input,
  InputGroup,
  Title,Form, Textarea
} from 'native-base'
import StarRating from 'react-native-star-rating';
import PTRView from 'react-native-pull-to-refresh';
export default class Schedules extends React.Component {

  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props)
    this.state = {
      modalVisible: false,
      showLoader: true,
      showLoading: false,
      schedules: [],
      showDialog: false,
      dialogMessage: '',
      color: '',
      disable: false,
      showConfirm: false,
      starCount: 3,
      comments: '',
      schedule_id: '',
      provider_id: ''
    }
    this._refresh = this._refresh.bind(this);
    this.loadData = this.loadData.bind(this);
    this._handleAddReview = this._handleAddReview.bind(this);
    this._handleComplete = this._handleComplete.bind(this);
  }
  setModalVisible = (visible, schedule_id, provider_id) => {
    this.setState({
      modalVisible: visible,
      schedule_id: this.state.schedule_id,
      provider_id: this.state.provider_id
                });
  }
  onStarRatingPress(rating) {
    this.setState({
      starCount: rating
    });
  }
  
  _handleAddReview() {
    this.setState({ showLoading: true })
    if (this.state.comments != '') {
      AsyncStorage.getItem('jwt').then(token => {
        fetch(Config.API_URL+'/ProvApi/add_review', {
          method: "POST",
          'Content-Type' : 'application/json',
          'Authorization': `Bearer ${token}`,
          body: JSON.stringify({
            provider_id : this.state.provider_id,
            schedule_id: this.state.schedule_id,
            comments: this.state.comments,
            provider_rating: this.state.starCount
          })
        })
        .then(res => res.json())
        .then(res => {
          if (res == 'done') {
            this.setState({
              showDialog: true,
              dialogMessage: "Review and Rating was successful",
              showLoading: false
            })
            setTimeout(() => {
              this.loadData();
            }, 4000)
          }
          else {
            this.setState({
              showDialog: true,
              dialogMessage: "Oops! An error occured. Please try again",
              showLoading: false
            })
          }
        })
        .catch(err => {
          this.setState({
            showDialog: true,
            dialogMessage: err.message,
            showLoading: false
          })
        });
      })
    }
    else {
      this.setState({
        showDialog: true,
        dialogMessage: "Please write a review",
        showLoading: false
      })
    }
  }
   
  loadData() {
    AsyncStorage.getItem('jwt').then(token => {
      fetch(Config.API_URL+'/ProvApi/all_schedules', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })
        .then(res => res.json())
        .then(res => {
          if (res == 'empty') {
            this.setState({
              //showDialog: true,
              //dialogMessage: "You have no schedule yet",
              showLoader: false,
              showLoading: false
            })
          }
          else if (res == 'user') {
            this.setState({
              showDialog: true,
              dialogMessage: "User not found. Please logout and login again",
              showLoader: false,
              showLoading: false
            })
          }
          else if (res == 'auth'){
            this.setState({
              showDialog: true,
              dialogMessage: "Unauthorized access. Please logout and login again",
              showLoader: false,
              showLoading: false
            })
          }
          else {
            this.setState({
              showLoader: false,
              schedules: res
            })
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
_refresh() {
  this.loadData()
}

_handleComplete = (schedule_id, provider_id) => () => {
  //alert(id)
  //this.setState({ showConfirm: false })
  AsyncStorage.getItem('jwt').then(token => {
    this.setState({ showLoading: true})
    fetch(Config.API_URL+'/ProvApi/mark_complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          schedule_id: schedule_id
        })
      })
      .then(res => res.json())
      .then(res => {
        if (res == 'done') {
          this.setState({
            showLoader: false,
            showDialog: true,
            showLoading: false,
            dialogMessage: "Provider has been confirmed successfully",
          })
          this.loadData()
          //trigger the modal
          this.setModalVisible(true, schedule_id, provider_id);
        } else {
          this.setState({
            showLoading: false,
            showLoader: false,
            showDialog: true,
            dialogMessage: "An error occured during confirmation",
          })
        }
      })
      .catch(err => {
        this.setState({
          showDialog: true,
          showLoading: false,
          dialogMessage: err.message,
          showLoader: false
        })
      })
  })
}

  componentWillMount () {
    this.loadData()
  }

  render () {
    const { navigate,goBack } = this.props.navigation
    return (
      <Container>
         
        <Header style={{ backgroundColor: '#6c5ce7' }}>
         <Left>
         <Button transparent>
              <Icon
                onPress={() => goBack()}
                ios='ios-arrow-back'
                android='md-arrow-back'
              />
            </Button>
         </Left>
         <Body>
             <Title style={{fontFamily: 'NunitoSans-Regular'}}>Schedules</Title>
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
        colors='#6c5ce7'
        >

        {
          !this.state.showLoader ? 
          (
            this.state.schedules != '' ? 
         <View>
            <Text style={styles.title}>List of your schedules</Text>
         
      {
        this.state.schedules.map((section, index) => {
          return (
            <Card title={section['Schedule'].datetime} key={index}>
      <View style={styles.contentContainer}>
          <Text style={styles.contentHeader}>Customer Name</Text>
        <Text style={styles.contentText}>{section['Customer'].full_name}</Text>
      </View>
      <View style={styles.contentContainer}>
          <Text style={styles.contentHeader}>Customer Phone</Text>
        <Text style={styles.contentText}>{section['Schedule'].phone}</Text>
      </View>
      <View style={styles.contentContainer}>
          <Text style={styles.contentHeader}>Service Type</Text>
        <Text style={styles.contentText}>{section['Service'].name}</Text>
      </View>
      <View style={styles.contentContainer}>
          <Text style={styles.contentHeader}>Status</Text>
        <Text style={styles.contentText}>{section['Schedule'].status}</Text>
      </View>
      {
        section['Schedule'].provider_confirm == 'yes' ? 
        <Button disabled success small style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Schedule Confirmed</Text>
        </Button> : 
        <Button disabled danger small style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Schedule not Completed</Text>
      </Button>
      }
      <View style={{marginBottom: 10}}></View>
        {
      section['Schedule'].prov_mark_completed == 'no' ? 
      <Button danger onPress={this._handleComplete(section['Schedule'].id)}  small style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Mark as Complete</Text>
      </Button> :
      null
    }
    

      </Card>
          );
          
        })
      }
         </View>:
      <View style={{ 
      top: 0, left: 0, 
      right: 0, bottom: 0, 
      justifyContent: 'center', 
      alignItems: 'center'}}>
        <Text style={styles.title}>No Schedule yet</Text>
      </View>
          ): null
        }
        
          <ActivityIndicator
            color='#6c5ce7'
            size='small'
            animating={this.state.showLoader}
          />
          <ProgressDialog
            visible={this.state.showLoading}
            title='Initiating Action'
            message='Please wait...'
          />
        <ConfirmDialog
          title="Mark Schedule as Complete"
          message="Are you sure about that?"
          visible={this.state.showConfirm}
          onTouchOutside={() => this.setState({ showConfirm: false })}
          positiveButton={{
            title: 'YES',
            onPress: this._handleComplete,
          }}
          negativeButton={{
            title: 'NO',
            onPress: () => this.setState({ showConfirm: false }),
          }}
        />

        {/* <View>
        <TouchableHighlight
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Text>Show Modal</Text>
        </TouchableHighlight>
        </View> */}

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
    )
  }
}

const styles = StyleSheet.create({
 
  headerContainer: {
    marginLeft:40, 
    marginTop: 10, 
    width: '80%', 
    borderRadius: 5
  },
  headerText: {
    fontFamily: 'NunitoSans-Bold', 
    fontSize: 17,
    textAlign: 'center'
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  contentHeader: {
    fontFamily: 'NunitoSans-Bold', 
    fontSize: 15, 
  },
  contentText: {
    fontFamily: 'NunitoSans-Regular', 
    fontSize: 15
  },
  title: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 18,
    color: '#6c5ce7',
    textAlign: 'center',
    marginTop: 10
  },
  button: {
    width: '45%',
    marginTop: 10,
    //backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    marginLeft: 100,
    padding: 2
  },
  buttonYet: {
    width: '55%',
    marginTop: 10,
    //backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    marginLeft: 85,
    padding: 2
  },
  buttonText: {
      fontFamily: 'NunitoSans-Regular',
      color: '#fff',
      padding:2
  },
  hire: {
    width: '50%',
    marginTop: 10,
    backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    marginLeft: 80,
    padding: 4
  },
  confirmButtonText: {
    fontFamily: 'NunitoSans-Regular',
    color: '#fff',
    padding:4,
    textAlign: 'center'
  },
  confirmButton: {
    width: '65%',
    //marginTop: 10,
    //backgroundColor: '#6c5ce7',
    justifyContent: 'center',
    marginLeft: 60,
    padding: 2
  }
})
