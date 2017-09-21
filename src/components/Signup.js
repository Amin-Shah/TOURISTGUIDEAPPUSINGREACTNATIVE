import React, { Component, PropTypes } from 'react';
import {
    View, Text, Image, StyleSheet, Animated, InteractionManager, Alert
} from 'react-native';
import { Input, Button, Logo, Heading, BackgroundWrapper, AlertStatus } from '../partials';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';

export default class Signup extends Component {
    state = {
        username: '',
        email: '',
        password: '',
        animation: {
            headerPositionTop: new Animated.Value(-148),
            formPositionLeft: new Animated.Value(614),
            buttonPositionTop: new Animated.Value(1354)
        }
    }

    handleChangeInput(stateName, text) {
        this.setState({
            [stateName]: text
        })
    }

    handleSignup = (ev) => {
        ev.preventDefault();

        var username = this.state.username;
        var email = this.state.email;
        var password = this.state.password;
        var userObj = { email: email, password: password, username: username };
        this.props.signUpRequest(userObj);
        Actions.login()
    }

    unmountComponent(callback) {
        const timing = Animated.timing;
        Animated.parallel([
            timing(this.state.animation.headerPositionTop, {
                toValue: -148,
                duration: 400,
                delay: 100
            }),
            timing(this.state.animation.formPositionLeft, {
                toValue: 614,
                duration: 500,
                delay: 120
            }),
            timing(this.state.animation.buttonPositionTop, {
                toValue: 1354,
                duration: 400,
                delay: 130
            })
        ]).start(callback);
    }

    handleBack() {
        this.unmountComponent(() => {
            Actions.pop();
        })
    }

    handleLogin() {
        this.unmountComponent(() => {
            Actions.login();
        })
    }

    componentDidMount() {
        Animated.timing(this.state.animation.formPositionLeft, {
            toValue: 0,
            duration: 700,
            delay: 120
        }).start();
        Animated.timing(this.state.animation.buttonPositionTop, {
            toValue: 0,
            duration: 600,
            delay: 130
        }).start();
    }

    render() {
        return <BackgroundWrapper transparent iconLeft="arrow-left-circle" onPressIcon={this.handleBack.bind(this)}>
            <View style={loginStyle.loginContainer}>
                <Logo marginTop={25} />
                <View style={loginStyle.formContainer}>
                    <Animated.View style={{ position: 'relative', left: this.state.animation.formPositionLeft }}>
                        <Input label="Username"
                            icon={<Icon name="user" />}
                            value={this.state.username}
                            onChange={this.handleChangeInput.bind(this, 'username')}
                        />
                        <Input label="Email"
                            icon={<Icon name="envelope-o" />}
                            value={this.state.email}
                            marginTop={23}
                            onChange={this.handleChangeInput.bind(this, 'email')}
                        />
                        <Input label="Password"
                            icon={<Icon name="key" />}
                            value={this.state.password}
                            marginTop={23}
                            onChange={this.handleChangeInput.bind(this, 'password')}
                            secureTextEntry
                        />
                    </Animated.View>
                    <Animated.View style={{ position: 'relative', top: this.state.animation.buttonPositionTop }}>
                        <Button marginTop={55} width={200} onPress={this.handleSignup}>
                            Create
                        </Button>
                    </Animated.View>
                </View>
            </View>
            <Animated.View style={{ position: 'relative', marginBottom: '5.3%', top: this.state.animation.statusPositionTop }}>
                <AlertStatus textHelper="You're ready account" textAction="Login"
                    onPressAction={this.handleLogin.bind(this)} />
            </Animated.View>
        </BackgroundWrapper>
    }
}

const loginStyle = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    formContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 15
    }
})

console.ignoredYellowBox = [
    'Setting a timer'
]