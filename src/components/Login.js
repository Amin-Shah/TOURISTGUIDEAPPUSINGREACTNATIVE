import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, Alert, BackHandler, Animated, KeyboardAvoidingView } from 'react-native';
import { Input, Button, Logo, Heading, BackgroundWrapper, AlertStatus } from '../partials';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            animation: {
                usernamePostionLeft: new Animated.Value(795),
                passwordPositionLeft: new Animated.Value(905),
                loginPositionTop: new Animated.Value(1402),
                statusPositionTop: new Animated.Value(1542)
            }
        }
    }

    onSubmit = (ev) => {
        ev.preventDefault();
        const { email, password } = this.state
        var userObj = { 'email': email, 'password': password };
        this.props.loginRequest(userObj);
    }

    handleChangeInput(stateName, text) {
        this.setState({
            [stateName]: text
        })
    }

    handePressSignIn() {
        Alert.alert(this.state.email);
    }

    handlePressSignUp() {
        Actions.signup();
    }
    
    handleClose() {
        BackHandler.exitApp();
    }

    componentDidMount() {
        const timing = Animated.timing;
        Animated.parallel([
            timing(this.state.animation.usernamePostionLeft, {
                toValue: 0,
                duration: 700
            }),
            timing(this.state.animation.passwordPositionLeft, {
                toValue: 0,
                duration: 900
            }),
            timing(this.state.animation.loginPositionTop, {
                toValue: 0,
                duration: 700
            }),
            timing(this.state.animation.statusPositionTop, {
                toValue: 0,
                duration: 700
            })

        ]).start()
    }

    render() {
        return <BackgroundWrapper transparent iconLeft="close" onPressIcon={this.handleClose.bind(this)}>
            <View style={loginStyle.loginContainer}>
                <Logo />
                <Heading marginTop={16} color="#ffffff" textAlign="center">
                    {'Tourist Guide App'}
                </Heading>
                <View style={loginStyle.formContainer}>
                    <Animated.View style={{ position: 'relative', left: this.state.animation.usernamePostionLeft }}>
                        <Input label="Email"
                            icon={<Icon name="user" />}
                            value={this.state.email}
                            autoFocus={true}
                            onChange={this.handleChangeInput.bind(this, 'email')}
                        />
                    </Animated.View>
                    <Animated.View style={{ position: 'relative', left: this.state.animation.passwordPositionLeft }}>
                        <Input label="Password"
                            icon={<Icon name="key" />}
                            value={this.state.password}
                            marginTop={23}
                            onChange={this.handleChangeInput.bind(this, 'password')}
                            secureTextEntry
                        />
                    </Animated.View>
                    <Animated.View style={{ position: 'relative', top: this.state.animation.loginPositionTop }}>
                        <Button marginTop={70} onPress={this.onSubmit}>
                            Sign in
                        </Button>
                    </Animated.View>

                </View>
            </View>
            <Animated.View style={{ position: 'relative', marginBottom: '5.3%', top: this.state.animation.statusPositionTop }}>
                <AlertStatus textHelper="Don't have account" textAction="Sign up"
                    onPressAction={this.handlePressSignUp.bind(this)} />
            </Animated.View>

        </BackgroundWrapper>
    }
}

const loginStyle = StyleSheet.create({
    loginContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: 10,
    },
    formContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 25
    }
})


console.ignoredYellowBox = [
    'Setting a timer'
]
