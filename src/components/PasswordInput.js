import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
    View,
    TextInput
} from 'react-native';

export default class PasswordInputText extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            icEye: 'visibility-off',
            password: true
        }
    }

    changePwdType = () => {
        let newState;
        if (this.state.password) {
            newState = {
                icEye: 'visibility',
                password: false
            }
        } else {
            newState = {
                icEye: 'visibility-off',
                password: true
            }
        }

        // set new state value
        this.setState(newState)

    };


    render() {
        return (
            <View>
                <TextInput {...this.props}
                           secureTextEntry={this.state.password}/>
                <Icon style={this.props.iconStyle}
                      name={this.state.icEye}
                      size={this.props.iconSize}
                      color={this.props.iconColor}
                      onPress={this.changePwdType}
                />
            </View>
        );
    }
}


// export const styles = StyleSheet.create({

//     icon: {
//         position: 'absolute',
//         top: 10,
//         right: 15,
//     }

// });

PasswordInputText.defaultProps = {
iconSize:25,
iconStyle: {
    position: 'absolute',
    top: 10,
    right: 15,
}
}

