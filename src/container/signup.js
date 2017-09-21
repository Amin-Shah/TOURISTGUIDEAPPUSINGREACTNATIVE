import { connect } from 'react-redux';
import SignUp from '../components/Signup';
import { SignUpRequest } from '../store/actions/signup';

function mapStateToProps(state) {
    return {
        application: state.App
    };
}

function mapDispatchToProps(dispatch) {
    return {
        signUpRequest: (userData) => dispatch(SignUpRequest(userData))
    };
}

const SignUpContainer = connect(mapStateToProps, mapDispatchToProps)(SignUp);

export default SignUpContainer;