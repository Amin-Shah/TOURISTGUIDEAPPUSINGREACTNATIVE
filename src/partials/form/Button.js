import React, {Component, PropTypes} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {getStyleFromProps} from '../../utils';
import {TextFont} from '../text';

export default class Button extends Component {
    render() {
        const style = {
            ...styleButton.container,
            ...getStyleFromProps(['marginTop', 'width', 'flex'], this.props)
        };

        return <View style={{alignItems: 'center'}}>
            <TouchableOpacity style={style} onPress={this.props.onPress}>
                <TextFont style={styleButton.text}>{this.props.children}</TextFont>
            </TouchableOpacity>
        </View>
    }
}

Button.defaultProps = {
    width: 179
}

Button.propTypes = {
    marginTop: PropTypes.number,
    width: PropTypes.number,
    flex: PropTypes.number,
    onPress: PropTypes.func
}

const styleButton = {
    container: {
        paddingTop: 13,
        paddingBottom: 13,
        paddingLeft: 42,
        paddingRight: 42,
        backgroundColor: '#1D5798',
        alignItems: "stretch",
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowRadius: 2,
        shadowOffset: {
            height: 2,
            width: 1
        }
    },
    text: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
        letterSpacing: 3
    }
}