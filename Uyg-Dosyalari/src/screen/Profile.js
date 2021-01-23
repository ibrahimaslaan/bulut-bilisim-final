import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableNativeFeedback,
  ActivityIndicator,
} from 'react-native';
import Color from '../../constants/Color';
import Font from '../../constants/Font';
import database from '@react-native-firebase/database';
import {useSelector, useDispatch} from 'react-redux';
import * as globalActions from '../../store/actions/globalActions';
export default function Profile() {
    const email = useSelector((state) => state.global.email);
  const [password1, setPassword1] = useState('');
  const [passwordValid1, setPasswordValid1] = useState(true);
  const [password2, setPassword2] = useState('');
  const [passwordValid2, setPasswordValid2] = useState(true);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const kontrol = () => {
     
      setLoading(true);
    if (password1.length > 6) {
      setPasswordValid1(true);
    } else {
      setPasswordValid1(false);
      setLoading(false);
      return;
    }
    if (password2.length > 6) {
      setPasswordValid2(true);
    } else {
      setPasswordValid2(false);
      setLoading(false);
      return;
    }
    if (password1 !== password2) {
      alert('Şifreler uyuşmuyor!');
      setLoading(false);
      return;
    }
    database()
      .ref('/users')
      .once('value')
      .then((snapshot) => {
        let key = '';
        let sayac = 0;
        const data = snapshot.forEach((veri) => {
         
          if (email === veri._snapshot.value.email) {
              console.log(veri)
            key = veri._snapshot.key;
            sayac++;
            database()
            .ref('/users/'+key).update({
                password:password1
            }).then(()=>{
setLoading(false);
setPassword1("");
setPassword2("");
alert("Şifre Başarıyla Değiştirildi!")
            })
          }
        });
        // if (sayac > 0) {
        //   setLoading(false);
        //   setLoginStatus(true);
        //   dispatch(globalActions.logincheck(loginStatus, email));
        //   return;
        // } else {
        //   setLoginStatus(true);
        //   alert('Mail yada şifre yanlış!');
        //   setLoading(false);
        //   return;
        // }
      });
  };
  return (
    <View style={{flex: 1, backgroundColor: Color.primary}}>
      <Text
        style={{
          fontSize: 26,
          color: 'white',
          alignSelf: 'center',
          fontFamily: Font.f4,
          marginVertical: 30,
        }}>
        Şifre Değiştir
      </Text>
      <View style={{marginHorizontal: 20, alignSelf: 'center', marginTop: 20}}>
        <Text
          style={{
            fontSize: 17,
            fontFamily: Font.f2,
            marginBottom: 10,
            color: 'white',
          }}>
          Yeni Şifre
        </Text>
        <TextInput
          value={password1}
          secureTextEntry={true}
          onChangeText={(text) => {
            setPassword1(text);
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
        {!passwordValid1 ? (
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
      <View
        style={{
          marginHorizontal: 20,
          alignSelf: 'center',
          marginTop: 20,
          marginBottom: 20,
        }}>
        <Text
          style={{
            fontSize: 17,
            fontFamily: Font.f2,
            marginBottom: 10,
            color: 'white',
          }}>
          Yeni Şifre Tekrar
        </Text>
        <TextInput
          value={password2}
          secureTextEntry={true}
          onChangeText={(text) => {
            setPassword2(text);
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
        {!passwordValid2 ? (
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
      <TouchableNativeFeedback
        onPress={() => {kontrol()}}
        style={{flex: 0.2, marginTop: 15}}>
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
              Şifre Değiştir
            </Text>
          ) : (
            <ActivityIndicator color="white" animating size="small" />
          )}
        </View>
      </TouchableNativeFeedback>
      {/* <View style={{justifyContent:'flex-end',flex:1}}>
      <TouchableNativeFeedback
        onPress={() => {
            setLoading(true);
            dispatch(globalActions.logincheck(false, ""));
            setLoading(false);
        }}
        style={{flex: 0.2, marginTop: 15}}>
        <View
          style={{
            width: '100%',
            height: 45,
            backgroundColor: 'gray',
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
            Çıkış Yap
            </Text>
          ) : (
            <ActivityIndicator color="white" animating size="small" />
          )}
        </View>
      </TouchableNativeFeedback>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({});
