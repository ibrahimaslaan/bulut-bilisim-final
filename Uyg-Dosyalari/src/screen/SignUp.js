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
export default function SignUp({navigation}) {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordValid, setPasswordValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mailKontrol, setMailKontrol] = useState(true);
  const register = () => {
    const kontrol = emailValidate(email);
    console.log(kontrol)

    if (!kontrol) {
      setEmailValid(false);
      return;
    } else {
      setEmailValid(true);
    }

    if (password.length > 5) {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
      return;
    }

    if (emailValid === true && passwordValid === true) {
      setLoading(true);
      database()
        .ref('/users')
        .once('value')
        .then((snapshot) => {
          const data = snapshot.forEach((veri) => {
            if (email === veri._snapshot.value.email) {
              alert('Mail Adresi Zaten Kayıtlı!');
              setMailKontrol(false);
              setLoading(false);
            } else {
              setLoading(false)
            }
          });
          if (mailKontrol) {
            database()
              .ref('/users/' + Math.random().toString(36).substr(2, 9))
              .set({
                email,
                password,
              })
              .then(() => {
                setLoading(false);
                setEmail('');
                setPassword('');
                setMailKontrol(true);
                alert("Kayıt Başarılı Giriş Yapabilirsin.")
                return;
              });
          }
        });
    }

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
          Kayıt Ol
        </Text>
      </View>

      <View style={{flex: 0.5}}>
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
          style={{marginHorizontal: 20, alignSelf: 'center', marginTop: 10}}>
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
          if (!loading) {
            register();
          }
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
              Kayıt Ol
            </Text>
          ) : (
            <ActivityIndicator color="white" animating size="small" />
          )}
        </View>
      </TouchableNativeFeedback>
      <Text
        onPress={() => {
          navigation.navigate('Login');
        }}
        style={{
          marginTop: 10,
          fontSize: 14,
          fontFamily: Font.f2,
          margin: 10,
          color: 'white',
          alignSelf: 'center',
        }}>
        Zaten kayıtlımısın ? Giriş Yap !
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({});
