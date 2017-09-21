import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';
import { BackgroundWrapper } from './partials';
import { Home } from './components';
import LoginContainer from './container/login'
import SignUpContainer from './container/signup'
import { Provider } from 'react-redux';
import { rootReducer } from './store/reducers/rootReducer';
import { store } from './store/index'


export default class App extends Component {
    render() {
        return <BackgroundWrapper paddingTop={0}>
            <Provider store={store}>
                <Router>
                    <Scene key="root" component={Home} initial hideNavBar>
                        <Scene key="login" component={LoginContainer}  />
                        <Scene key="signup" component={SignUpContainer}  />
                        <Scene key="home" component={Home} />
                    </Scene>
                </Router>
            </Provider>
        </BackgroundWrapper>
    }
}
