import {
  Body,
  Button,
  Container,
  Content,
  Header,
  Icon,
  Title,
  Left,
  Right,
  List,
  ListItem,
  Switch,
  View
} from 'native-base'
import React from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
  Text
} from 'react-native'
import Config from 'react-native-config'
import { Card, Button as ButtonNative } from 'react-native-elements'
import ImagePicker from 'react-native-image-crop-picker';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import { ProgressDialog, Dialog } from 'react-native-simple-dialogs'
const links = [
  {
    link: 'editProfile',
    label: 'Update rofile',
    ios: 'ios-contact',
    android: 'md-contact'
  },
  {
    link: 'changePassword',
    label: 'Change Password',
    ios: 'ios-lock',
    android: 'md-lock'
  },
  // {
  //   link: 'changeSettings',
  //   label: 'Change Settings',
  //   ios: 'ios-settings',
  //   android: 'md-settings'
  // }
]
export default class Settings extends React.Component {
  static navigationOptions = {
    header: null
  }
  constructor (props) {
    super(props)
    this.state = {
      profile: [],
      showLoader: true,
      showDialog: false,
      showLoading: false,
      dialogMessage: '',
      dialogTitle: '',
      avatarSource: '',
      notiValue: ''
    }
    this.logout = this.logout.bind(this);
    this.navigateToScreen = this.navigateToScreen.bind(this);
    this._handleUpload = this._handleUpload.bind(this);
  }
  logout(){
    let keys = ['jwt', 'phone', 'email'];
    AsyncStorage.multiRemove(keys, err => {
      this.props.navigation.replace('Login');
    });
  };
  navigateToScreen(link) {
    this.props.navigation.navigate(link);
  }
  loadData = () => {
    AsyncStorage.getItem('jwt').then(token => {
      fetch(Config.API_URL + '/ProvApi/profile', {
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
            profile: res
          })
        })
        .catch(err => {
          this.setState({
            showDialog: true,
            dialogMessage: err.message + "me",
            showLoader: false
          })
        })
    })
  }

  _handleUpload () {
    ImagePicker.openPicker({
      cropperStatusBarColor: '#3897f1',
      freeStyleCropEnabled: true,
      mediaType: 'photo',
      enableRotationGesture: true,
      includeBase64: true,
      cropping: true
    }).then(image => {
      var path = image.path;
      var pathString = path.lastIndexOf("/");
      var fileName = path.substring(pathString+1);
      const data = new FormData();
        data.append('image', {
          uri: path,
          type: image.mime,
          name: fileName
        });
         AsyncStorage.getItem('jwt').then(token => {
          this.setState({showLoading: true})
         fetch(Config.API_URL + '/ProvApi/upload_image', {
           method: 'POST',
           headers: {
             'Accept': 'application/json',
             'Content-Type': 'multipart/form-data',
             'Authorization': `Bearer ${token}`
           },
           body: data
         })
         .then(res => res.json())
         .then(res => {
           if (res == 'done') {
             this.setState({
              showLoading: false,
            })
           ToastAndroid.showWithGravity(
           'Uploaded successfully',
           ToastAndroid.SHORT,
           ToastAndroid.CENTER
         )
           } else if (res == 'error') {
             this.setState({
               showLoading: false,
             })
            ToastAndroid.showWithGravity(
            'An error occured',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          )
           }
           else if (res == 'not_user') {
             this.setState({
               showLoading: false,
             })
             ToastAndroid.showWithGravity(
              'Unauthorized access. Please logout and login again',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            )
           }
           else if (res == 'ext') {
            this.setState({
              showLoading: false,
            })
            ToastAndroid.showWithGravity(
             'The file extension is not allowed',
             ToastAndroid.SHORT,
             ToastAndroid.CENTER
           )
           }
           else {
            this.setState({
              showLoading: false,
              showDialog: true,
              dialogTitle: 'Oops!',
              dialogMessage: res
            })
           }
         })
         .catch(err => {
           this.setState({
             showLoading: false,
             showDialog: true,
             dialogTitle: 'Error',
             dialogMessage: 'An error occured.' + err.message
           })
        })

         this.setState({
           avatarSource: path
         })
       })
    });
  }
  componentWillMount () {
    this.loadData()
  }

  render () {
    const profile = this.state.profile
    const { goBack } = this.props.navigation;
    //const full_name = profile.full_name.toLowerCase().split(" ").map(name => name.charAt(0).toUpperCase() + name.substring(1));
    return (
      <Container>

        <Header style={{ backgroundColor: '#3897f1' }}>
        <Left style={{flex:1}} />
       <Body style={{flex:1}}>
       <Title style={styles.heading}>Settings</Title>
         </Body>
         <Right style={{flex:1}}>
                    <Icon name='menu' style={{color:'white'}} />
                </Right>
        </Header>
        <StatusBar
          barStyle='light-content'
          backgroundColor='#3897f1'
          networkActivityIndicatorVisible
        />
        {/* <View animation={'slideOutUp'} delay={800} duration={400}> */}
        <Content>
 {
           profile.map(info => {
             return (
              <Card key={info.Provider.id}>

              <View
                style={{
                  flex: 1,
                  alignContent: 'center',
                  alignSelf: 'center',
                  justifyContent: 'center'
                }}
              >
                <TouchableOpacity onPress={this._handleUpload}>
                  <Image
                  source={{
                    uri: this.state.avatarSource ? this.state.avatarSource : Config.PROVIDER_PIC + info.Provider.pic
                  }}
                  indicator={ProgressBar}
                  style={{
                    width: 320,
                    height: 240,
                  }}/>
                  <ButtonNative
                  buttonStyle={styles.dialogButton}
                  onPress={this._handleUpload}
                  color="#fff"
                  title="Upload"
            />
                </TouchableOpacity>
                <Text style={styles.title}>{info.Provider.name}</Text>
              </View>
            </Card>
             );
           })
         }

<List>
  <Card>
  <ListItem noBorder icon>
  <Left>
      <Icon android="md-notifications-outline" ios="ios-notifications-outline"/>
    </Left>
    <Body>
      <Text>Enable push Notifications</Text>
    </Body>
    <Right>
      <Switch onValueChange={notiValue => this.setState({notiValue})}  value={true} thumbTintColor="#3897f1"/>
    </Right>
  </ListItem>
  </Card>
</List>

  <List
  dataArray={links}
  renderRow={url => (
  //  <View animation={'slideOutUp'} delay={700} duration={400}>
      <TouchableOpacity>
    <Card>
      <ListItem noBorder icon>
      <Left>
        <Icon android={url['android']}
        ios={url['ios']} />
      </Left>
      <Body>
            <Text
          style={styles.item}
          onPress={() => this.navigateToScreen(url['link'])}
        >
          {url['label']}
        </Text>
      </Body>
    </ListItem>
    </Card>
    </TouchableOpacity>
  //  </View>
  )}
/>

<List>
    <Card>
      <ListItem noBorder icon>
      <Left>
        <Icon android="md-log-out"
        ios="ios-log-out" />
      </Left>
      <Body>
        <Text
          style={styles.item}
          onPress={this.logout}
        >
          Logout
        </Text>
      </Body>
    </ListItem>
    </Card>
</List>

<ActivityIndicator
  color='#3897f1'
  size='small'
  animating={this.state.showLoader}
/>
 <ProgressDialog
  visible={this.state.showLoading}
  title='Uploading'
  message='Please wait...'
/>
<Dialog
  visible={this.state.showDialog}
  onTouchOutside={() => this.setState({ showDialog: false })}
  contentStyle={{ justifyContent: 'center', alignItems: 'center' }}
  animationType='slide'
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
      backgroundColor: '#3897f1'
    }}
  >
   <Text style={{fontFamily: 'NunitoSans-Regular', padding: 4, color: '#fff'}}>CLOSE</Text>
  </Button>
</Dialog>
</Content>
        {/* </View> */}
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  dialogButton: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: '#3897f1',
    borderRadius: 3,
    height: 26
  },
  searchInput: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 16
  },
  title: {
    fontFamily: 'NunitoSans-Regular',
    fontSize: 18,
    color: '#3897f1',
    textAlign: 'center',
    marginTop: 10
  },
  heading: {
    fontFamily: 'NunitoSans-Regular'
    // fontSize: 20,
    // color: '#fff'
  },
  account: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-start',
    fontFamily: 'NunitoSans-Regular',
    color: '#3897f1',
    fontSize: 16
  },
  logout: {
    marginTop: 10,
    justifyContent: 'flex-end',
    alignSelf: 'flex-start',
    fontFamily: 'NunitoSans-Regular',
    color: '#3897f1',
    fontSize: 16
  }
})
