import { connect } from 'react-redux';
import Login from '../components/Login';
import { loginRequest } from '../store/actions/login';

function mapStateToProps(state) {
    return {
        application: state.App
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loginRequest: (userData) => dispatch(loginRequest(userData))
    };
}

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginContainer;