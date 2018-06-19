import React from 'react';
import {
  Text,
  View,
  StatusBar
} from 'react-native';
import Swiper from 'react-native-swiper-animated';
import { Thumbnail, Button, Title, Container, Content } from 'native-base';

export default class Welcome extends React.Component {
    constructor() {
        super()
        this.gotoLogin = this.gotoLogin.bind(this);
    }
    gotoLogin() {
    this.props.navigation.replace("Login")
    }
 
    render() {
        return(
           
      <Container>
             <StatusBar
    barStyle='light-content'
    backgroundColor='#6c5ce7'
    networkActivityIndicatorVisible
  />
         
          <Swiper
  style={styles.wrapper}
  smoothTransition
  loop
>
  <View style={styles.slide}>
  <Text style={styles.heading}>Welcome to StyleFit</Text>
  <View style={{marginTop: 15}}></View>
    <Text style={styles.text}>Connecting customers looking for Beauty and Fitness
    service providers registered on the platform.</Text>
  </View>
  <View style={styles.slide}>
  <Thumbnail style={{width: 150, height: 150, borderRadius: 150/2}} large source={require("../assets/images/cop.png")} />
  <View style={{marginTop: 15}}></View>
  <Text style={styles.heading}>Tag and get Taggged</Text>
  <View style={{marginTop: 15}}></View>
    <Text style={styles.text}>Suggest three service providers you trust to the community.
    You may create an account to get discovered by those in need of your service too.</Text>
  </View>
  <View style={styles.slide}>
  <Thumbnail style={{width: 150, height: 150, borderRadius: 150/2}} large source={require("../assets/images/cop.png")} />
  <View style={{marginTop: 15}}></View>
  <Text style={styles.heading}>Discover New Experiences</Text>
  <View style={{marginTop: 15}}></View>
    <Text style={styles.text}>Gain access to a list of service providers your friends
    use and contact them directly.</Text>
    <Button small style={styles.continue} onPress={this.gotoLogin}>
        <Title style={{fontFamily: 'NunitoSans-Regular',fontSize: 15}}>CONTINUE</Title>
    </Button>
  </View>
</Swiper>
        
      </Container>
        )
    }
} 

const styles = {
    wrapper: {
        backgroundColor: '#6c5ce7',
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dfe6e9',
    },
    heading: {
        fontFamily: 'NunitoSans-Regular',
        fontSize: 18,
        fontWeight: "bold"
    },
    text: {
        fontFamily: 'NunitoSans-Regular',
        fontSize: 15,
        textAlign: 'center',
        alignSelf: 'center',
    },
    continue: {
        width: '25%',
        marginTop: 20,
        backgroundColor: '#6c5ce7',
        justifyContent: 'center',
        marginLeft: 150
    }
};