import React, { Component } from 'react'
import { NavigationActions } from 'react-navigation'
import {
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity
} from 'react-native'
import Config from 'react-native-config'
import {
  Container,
  Content,
  Header,
  Button,
  Icon,
  List,
  ListItem,
  Left,
  Footer,
  Body,
  Thumbnail
} from 'native-base'
const links = [
  {
    link: 'drawerStack',
    label: 'Home',
    icon: 'ios-home'
  },
  {
    link: 'schedules',
    label: 'Schedules',
    icon: 'ios-briefcase'
  },
  {
    link: 'mapping',
    label: 'Track Customer',
    icon: 'ios-locate'
  },
  {
    link: 'changePassword',
    label: 'Change Password',
    icon: 'ios-send'
  }
]

export default class Sidebar extends React.Component {
  navigateToScreen = route => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    })
    this.props.navigation.dispatch(navigateAction)
  }
  render () {
    return (
      <Container>
        <Header style={{ backgroundColor: '#6c5ce7' }}>
          <Body>

            <TouchableOpacity style={{justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
              <Thumbnail
                style={{
                  alignSelf: 'center'
                }}
                resizeMode='cover'
                large
                source={{ uri: Config.IMAGE_URL + 'fitness.png' }}
              />
            </TouchableOpacity>
          </Body>
        </Header>
        <Content>

          <List
            dataArray={links}
            renderRow={url => (
              <ListItem icon>
                <Left>
                  <Icon name={url['icon']} />
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
            )}
          />
        </Content>
        
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  footer: {
    fontFamily: 'NunitoSans-SemiBold',
    marginTop: 6,
    fontSize: 12,
    letterSpacing: 0.5,
    // color: '#fff',
    padding: 3
  },
  item: {
    fontFamily: 'NunitoSans-Regular'
  }
})
