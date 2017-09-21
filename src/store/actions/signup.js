import ActionTypes from './ActionTypes';
import { Actions } from 'react-native-router-flux';
import * as fb from '../../database/firebase'

export function SignUpRequest(SignUpData) {
    return dispatch => {
        dispatch(signUpRequest());
        fb.auth.createUserWithEmailAndPassword(
            SignUpData.email, SignUpData.password
        )
            .then((data) => {
                const userRef = fb.database.ref('touristapp/users/' + data.uid);
                userRef.set({
                    uid: data.uid,
                    email: data.email,
                    name: SignUpData.name
                }, signUpSuccessData => {
                    dispatch(SignUpRequestSuccess({ uid: data.uid, userEmail: data.email, name: SignUpData.name }));
                });
            })
            .catch((error) => {
                dispatch(SignUpRequestFailed(error));
            });
    }
}

function signUpRequest() {
    return {
        type: ActionTypes.SignUpRequest
    };
}

function SignUpRequestSuccess(data) {
    return {
        type: ActionTypes.SignUpRequestSuccess,
        data
    };
}

function SignUpRequestFailed() {
    return {
        type: ActionTypes.SignUpRequestFailed
    };
}