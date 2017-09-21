import ActionTypes from '../actions/ActionTypes';

const initial_state = {};
export function AppReducer(state = initial_state, action) {
    switch (action.type) {
        case ActionTypes.LoginRequestSuccess: {
            var newState = Object.assign({}, state, { user: action.data });
            state = newState;
            return state;
        }
        case ActionTypes.SignUpRequestSuccess: {
          var newState = Object.assign({}, state, { user: action.data });
          state = newState;
          return state;
        }
        default:
            return state;
    }
}