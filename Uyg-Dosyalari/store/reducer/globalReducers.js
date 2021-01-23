import {LOGINCHECK} from '../actions/globalActions';
const initialState = {
  loginStatus: false,
  email:"",
};
export default (state = initialState, action) => {
  console.log(state);
  switch (action.type) {
    case LOGINCHECK:
      return {
        ...state,
        loginStatus: action.loginStatus,
        email:action.email
      };
  }
  return state;
};
