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
    Switch
  } from 'native-base'
  import React from 'react'
  import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ToastAndroid,
  } from 'react-native'
  import Config from 'react-native-config'
  import { Card, Button as ButtonNative } from 'react-native-elements'
  import ImagePicker2 from 'react-native-image-picker'
  import ImagePicker from 'react-native-image-crop-picker';
  import Image from 'react-native-image-progress';
  import ProgressBar from 'react-native-progress/Bar';
  const links = [
    {
      link: 'editProfile',
      label: 'Update Profile',
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
        showDialog: '',
        dialogMessage: '',
        avatarSource: '',
        notiValue: ''
      }
      this.logout = this.logout.bind(this);
      this.navigateToScreen = this.navigateToScreen.bind(this);
      this._handleUpload = this._handleUpload.bind(this);
    }
    logout(){
      let keys = ['jwt'];
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
              dialogMessage: err.message,
              showLoader: false
            })
          })
      })
    }
    _handleUpload () {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropperStatusBarColor: '#3897f1',
        freeStyleCropEnabled: true,
        mediaType: 'photo',
        enableRotationGesture: true,
        includeBase64: true,
        cropping: true
      }).then(image => {
        console.warn(image);
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
           fetch(Config.API_URL + '/Provapi/upload_image', {
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
    _handleUpload2 = () => {
      var options = {
        title: 'Choose a picture',
        takePhotoButtonTitle:'Capture Photo',
        quality: 1.0,
        maxWidth: 1000,
        maxHeight: 1000,
        storageOptions: {
          skipBackup: true,
          path: 'images'
        }
      }
      ImagePicker2.showImagePicker(options, response => {
        if (response.didCancel) {
          //console.warn('User cancelled image picker')
        } else if (response.error) {
          //console.warn('ImagePicker Error: ', response.error)
        } else if (response.customButton) {
          //console.warn('Custom button tapped');
        } else {
          const data = new FormData();
          data.append('image', {
            uri: response.uri,
            type: response.type,
            name: response.fileName
          });
          //console.warn(response)
          AsyncStorage.getItem('jwt').then(token => {
            this.setState({showLoading: true})
           fetch(Config.API_URL + '/Provapi/upload_image', {
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
             avatarSource: response.uri
           })
         })
        }
      })
    }
    componentWillMount () {
      this.loadData()
    }

    render () {
      const profile = this.state.profile
      const { goBack } = this.props.navigation;
      return (
        <Container>

          <Header style={{ backgroundColor: '#3897f1' }}>
            <Left>
              <Button transparent iconLeft onPress={() => goBack()}>
              <Icon ios='ios-arrow-back'
                  android='md-arrow-back' onPress={() => goBack()} />
              </Button>
            </Left>
            <Body>
              <Title style={styles.heading}>Settings</Title>
            </Body>
            <Right />
          </Header>
          <StatusBar
            barStyle='light-content'
            backgroundColor='#3897f1'
            networkActivityIndicatorVisible
          />
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
                  <TouchableOpacity>
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

                <ButtonNative
                    buttonStyle={styles.dialogButton}
                    onPress={this._handleUpload2}
                    color="#fff"
                    title="Upload2"
              />
                  </TouchableOpacity>
                  <Text style={styles.title}>{info.Provider.name}</Text>
                </View>
              </Card>
               );
             })
           }

            {/* <ImageBackground
            style={{
              width: 320,
              height: 240,
            }}
            source={{
              uri: this.state.avatarSource ? this.state.avatarSource : Config.PROVIDER_PIC + profile.pic
            }}>

            </ImageBackground> */}

            <List>
              <Card>
              <ListItem noBorder icon>
              <Left>
                  <Icon name="ios-notifications-outline"/>
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
          </Content>
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
      borderRadius: 5,
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
