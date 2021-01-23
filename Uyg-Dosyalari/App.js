import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import Root from './src/Root';
import globalReducers from './store/reducer/globalReducers';
import firebase from '@react-native-firebase/app';
var firebaseConfig = {
  apiKey: 'AIzaSyBauzy1uLhxoSz0b3c0DKjoG0Iuvos2UzE',
  authDomain: 'newsapp-2449d.firebaseapp.com',
  databaseURL: 'https://newsapp-2449d-default-rtdb.firebaseio.com',
  projectId: 'newsapp-2449d',
  storageBucket: 'newsapp-2449d.appspot.com',
  messagingSenderId: '267491413633',
  appId: '1:267491413633:web:508757602e3ec131b00780',
};

if(!firebase.app.length){
  firebase.initializeApp(firebaseConfig);
}

const rootReducer = combineReducers({
  global: globalReducers,
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));


const App = () => {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
};

export default App;
