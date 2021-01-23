export const LOGINCHECK = 'LOGINCHECK';

export const logincheck = (status, email) => {
  return async (dispatch, getState) => {
    dispatch({
      type: LOGINCHECK,
      loginStatus: status,
      email: email,
    });
  };
};
