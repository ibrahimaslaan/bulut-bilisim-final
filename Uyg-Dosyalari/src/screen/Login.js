import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableNativeFeedback,
  ActivityIndicator,
} from 'react-native';
import Font from '../../constants/Font';
import database from '@react-native-firebase/database';
import {useSelector, useDispatch} from 'react-redux';
import * as globalActions from '../../store/actions/globalActions';
export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const dispatch = useDispatch();
  const login = async () => {
    const kontrol = emailValidate(email);

    if (!kontrol) {
      setEmailValid(false);
      return;
    } else {
      setEmailValid(true);
    }

    if (password.length > 6) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
      return;
    }

    if (emailValid === true && passwordValid === true) {
      setLoading(true);
      await database()
        .ref('/users')
        .once('value')
        .then((snapshot) => {
        

snapshot.forEach(veri=>{
 
  if (email === veri._snapshot.value.email &&password === veri._snapshot.value.password){
           
           
            dispatch(globalActions.logincheck(true, email));
            setLoading(false);
          
  } 
})
setLoading(false);
      
          // let sayac=0;
          // const data = snapshot.forEach((veri) => {
          //   console.log(data)
          //   if (
          //     email === veri._snapshot.value.email &&
          //     password === veri._snapshot.value.password
          //   ) {
          //     sayac++;
          //   }
          // });
          // if(sayac>0){
            
          //   setLoading(false);
          //   setLoginStatus(true);
          //   dispatch(globalActions.logincheck(loginStatus, email));
          //   return;

          // }else{
          //   setLoginStatus(false);
          //   alert('Mail yada şifre yanlış!');
          //   setLoading(false);
          //   return;
          // }
        });
    }
    // else{
    //   alert("Mail Adresi Yada Şifre Yanlış!");
    //   setLoading(false);
    //   return;
    // }
  
  };

  const emailValidate = (email) => {
    let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(String(email).toLowerCase());
  };

  return (
    <View style={{flex: 1, backgroundColor: '#3A3D46'}}>
      <View style={{flex: 0.2, marginTop: 20}}>
        <Text
          style={{
            fontFamily: Font.f5,
            fontSize: 36,
            color: 'white',
            textAlign: 'center',
          }}>
          News APP
        </Text>
      </View>

      <View style={{flex: 0.35}}>
        <View style={{marginHorizontal: 10, alignSelf: 'center'}}>
          <Text
            style={{
              fontSize: 17,
              fontFamily: Font.f2,
              marginBottom: 10,
              color: 'white',
            }}>
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={(text) => {
              setEmail(text);
            }}
            style={{
              fontFamily: Font.f2,
              color: 'white',
              borderRadius: 9,
              borderWidth: 1,
              borderColor: 'white',
              width: 280,
              height: 36,
            }}
          />
          {!emailValid ? (
            <Text
              style={{
                fontSize: 14,
                fontFamily: Font.f2,
                marginBottom: 10,
                color: 'red',
              }}>
              Geçersiz mail adresi
            </Text>
          ) : null}
        </View>
        <View
          style={{marginHorizontal: 20, alignSelf: 'center', marginTop: 0}}>
          <Text
            style={{
              fontSize: 17,
              fontFamily: Font.f2,
              marginBottom: 10,
              color: 'white',
            }}>
            Şifre
          </Text>
          <TextInput
            value={password}
            secureTextEntry={true}
            onChangeText={(text) => {
              setPassword(text);
            }}
            style={{
              fontFamily: Font.f2,
              color: 'white',
              borderRadius: 9,
              borderWidth: 1,
              borderColor: 'white',
              width: 280,
              height: 36,
            }}
          />
          {!passwordValid ? (
            <Text
              style={{
                fontSize: 14,
                fontFamily: Font.f2,
                marginBottom: 10,
                color: 'red',
              }}>
              Şifre minimum 6 haneli olmalıdır!
            </Text>
          ) : null}
        </View>
      </View>
      <TouchableNativeFeedback
        onPress={() => {
          login();
          
        }}
        style={{flex: 0.1}}>
        <View
          style={{
            width: '70%',
            height: 45,
            backgroundColor: '#00796B',
            alignSelf: 'center',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {!loading ? (
            <Text
              style={{
                fontSize: 17,
                fontFamily: Font.f2,
                margin: 10,
                color: 'white',
              }}>
              Giriş Yap
            </Text>
          ) : (
            <ActivityIndicator color="white" animating size="small" />
          )}
        </View>
      </TouchableNativeFeedback>
      <Text
        onPress={() => {
          navigation.navigate('SignUp');
        }}
        style={{
          marginTop: 10,
          fontSize: 14,
          fontFamily: Font.f2,
          margin: 10,
          color: 'white',
          alignSelf: 'center',
        }}>
        Hesabın mı Yok ? Kayıt Ol !
      </Text>
    </View>
  );
}
