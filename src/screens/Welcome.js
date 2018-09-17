import React from 'react';
import {
    Text,
    View,
    StatusBar,
    AsyncStorage,
    Image
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import {
    Thumbnail,
    Button,
    Title,
    Container,
    Content
} from 'native-base';
import { Button as Bu } from 'react-native-elements';


export default class Welcome extends React.Component {
        constructor() {
            super();
            this.gotoLogin = this.gotoLogin.bind(this);
        }
        gotoLogin() {
            this.props.navigation.replace("Login")
        }
        componentWillMount() {
            AsyncStorage.setItem('seeWelcome', 'yes')
        }

    render() {
        const Square = ({ isLight, selected }) => {
            let backgroundColor;
            if (isLight) {
              backgroundColor = selected ? '#3897f1' : 'rgba(0, 0, 0, 0.3)';
            } else {
              backgroundColor = selected ? '#fff' : 'rgba(255, 255, 255, 0.5)';
            }
            return (
              <View
                style={{
                  width: 6,
                  height: 6,
                  marginHorizontal: 3,
                  backgroundColor,
                }}
              />
            );
          };
        const backgroundColor = isLight => (isLight ? '#3897f1' : 'lightblue');
const color = isLight => backgroundColor(!isLight);

const Done = ({ isLight, ...props }) => (
  <Bu
    title={'Done'}
    buttonStyle={{
      borderRadius: 4,
      backgroundColor: backgroundColor(isLight),
    }}
    containerViewStyle={{
      marginVertical: 10,
      width: 70,
      backgroundColor: backgroundColor(isLight),
    }}
    textStyle={{ color: color(isLight), fontFamily: 'NunitoSans-Regular' }}
    {...props}
  />
);

const Skip = ({ isLight, skipLabel, ...props }) => (
  <Bu
    title={'Skip'}
    buttonStyle={{
        borderRadius: 4,
      backgroundColor: backgroundColor(isLight),
    }}
    containerViewStyle={{
      marginVertical: 10,
      width: 70,
    }}
    textStyle={{ color: color(isLight), fontFamily: 'NunitoSans-Regular' }}
    {...props}
  >
    {skipLabel}
  </Bu>
);

const Next = ({ isLight, ...props }) => (
  <Bu
    title={'Next'}
    buttonStyle={{
        borderRadius: 4,
      backgroundColor: backgroundColor(isLight),
    }}
    containerViewStyle={{
      marginVertical: 10,
      width: 70,
      backgroundColor: backgroundColor(isLight),
    }}
    textStyle={{ color: color(isLight), fontFamily: 'NunitoSans-Regular' }}
    {...props}
  />
);
        return(
      <Container>
             <StatusBar
    barStyle='light-content'
    backgroundColor='#3897f1'
    networkActivityIndicatorVisible
  />
   <Onboarding
   showSkip={false}
   onDone = {this.gotoLogin}
   DotComponent={Square}
    NextButtonComponent={Next}
    SkipButtonComponent={Skip}
DoneButtonComponent={Done}
  pages={[
    {
      backgroundColor: '#fff',
      image: <Thumbnail style={{width: 150, height: 150, borderRadius: 150/2}} large source={require("../assets/images/cop.png")} />,
      title: <Text style={styles.heading}>Welcome to StyleFit</Text>,
      subtitle: <Text style={styles.text}>Connecting customers looking for Beauty and Fitness
      service providers registered on the platform.</Text>,
    },
    {
        backgroundColor: '#fff',
        image: <Thumbnail style={{width: 150, height: 150, borderRadius: 150/2}} large source={require("../assets/images/cop.png")} />,
        title: <Text style={styles.heading}>Tag and get Taggged</Text>,
        subtitle: <Text style={styles.text}>Suggest three service providers you trust to the community.
        You may create an account to get discovered by those in need of your service too.</Text>,
      },
      {
        backgroundColor: '#fff',
        image: <Thumbnail style={{width: 150, height: 150, borderRadius: 150/2}} large source={require("../assets/images/cop.png")} />,
        title: <Text style={styles.heading}>Discover New Experiences</Text>,
        subtitle: <Text style={styles.text}>Gain access to a list of service providers your friends
        use and contact them directly.</Text>,
      }
  ]}
/>
      </Container>
        )
    }
}

const styles = {
    wrapper: {
        backgroundColor: '#3897f1',
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
        backgroundColor: '#3897f1',
        justifyContent: 'center',
        marginLeft: 150
    }
};