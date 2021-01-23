import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import Color from '../../constants/Color';
import Font from '../../constants/Font';
const {width,height}=Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';

import * as globalActions from '../../store/actions/globalActions';
export default function News({navigation}) {
  const dispatch = useDispatch();
    const email = useSelector((state) => state.global.email);
  const [datam, setDatam] = useState({});
  const [sonraOku, setSonraOku] = useState(false);
  const [kaydet, setKaydet] = useState(false);
  const [storageData, setstorageData] = useState(null);
  const [realData, setrealData] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(loading)
  const getData = async () => {
    try {
      let response = await fetch(
        'https://newsapi.org/v2/top-headlines?country=tr&apiKey=090eade14a9b4b808c73e4fb59812236',
      );
      let json = await response.json();
     setDatam(json.articles);
    
    } catch (error) {
      console.error(error);
    }
  };
  const save = async (item) => {
    try {
        setLoading(true);
      const kontrol=  getStorageCheck(item.title);
      if(kontrol){
        await AsyncStorage.setItem(item.title, JSON.stringify(item));
        alert('Başarılı')
        setLoading(false);
      }else{
          alert("Zaten Haber Kayıtlı!")
          setLoading(false);
      }
     
     
    } catch (e) {
        setLoading(false);
    }
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{flexDirection:'row'}}>
        <Icon onPress={()=>{
          navigation.navigate('Profile')
        }} name="user-alt" color={'white'} size={25} style={{marginHorizontal:20}} />
          <IconM onPress={()=>{
           dispatch(globalActions.logincheck(false, ""));
        }} name="exit-to-app" color={'white'} size={30} style={{marginHorizontal:10}} />
        </View>
        
      ),
    });
  }, [navigation]);


  const getStorageCheck = async (item) => {
    try {
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);
       
        let sayac=0;
        result.forEach(s=>{
         
           if(s[0]===item){
               sayac++;
           }
         
        })
        
        if(sayac>0){
            return false
        }else{
            return true
        }
    //   const value = await AsyncStorage.getItem('@news');
    //   const x = JSON.parse(value);
        //save(x,item);
     
    } catch (e) {
        setLoading(false);
    }
  };


  const getStorage = async (item) => {
    try {

        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);
     setstorageData(result)
     setLoading(false);
    //   const value = await AsyncStorage.getItem('@news');
    //   const x = JSON.parse(value);
        //save(x,item);
     
    } catch (e) {
      // error reading value
    }
  };

  useEffect(() => {
      getData();
    //removeItemValue();
   //getStorage();
  }, []);

  const removeItemStorage = async (item) => {
    try {
       
      const value = await AsyncStorage.removeItem(item);
      alert('Silme işlemi başarılı.')
     
   getStorage();
     
    } catch (e) {
       setLoading(false);
    }
  };



const getRealTime =(item)=>{
    setLoading(true)
    database()
    .ref('/news')
    .once('value')
    .then((snapshot) => {
       
        let sayac=0;
      const data = snapshot.forEach((veri) => {
      
        if (
          item.title === veri._snapshot.value.item.title&&
          email === veri._snapshot.value.email
        ) {
         sayac++;
        } 
      });
      if(sayac>0){
          alert("Haber zaten kayıtlı!");
          setLoading(false);
          return;
      }
      else{
          let regex=Math.random().toString(36).substr(2, 9);
        database()
        .ref('/news/' +regex)
        .set({
         item,
         email,
         regex
        })
        .then(() => {
            setLoading(false);
         alert('Başarılı')
        
        });
      }
       
     
    });
}
if(loading){
  return(
  <View style={{flex:1,backgroundColor:Color.primary,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator color='white' size='large' />

  </View>)
}

const realTimeDataSil=(key)=>{
    setLoading(true);
    database()
    .ref('/news/' +key).remove();
    alert('Silme işlemi başarılı.')
    realtimeDataGetir();
}

const realtimeDataGetir=async ()=>{
    setLoading(true);
    await database()
    .ref('/news')
    .once('value')
    .then((snapshot) => {
        let x=[];
      const data = snapshot.forEach((veri) => {
        if (
            
            email === veri._snapshot.value.email
          ){
         
           x.push( veri._snapshot.value)
          }
    
      });

      setrealData(x);
      setLoading(false);
     
    });
    setLoading(false);
}

const detailGo=(title,content,img)=>{
    navigation.navigate('NewsDetail', {
      title,
      content,
      img
      });
}


const FlatRealTime = (item) => {

   
     return !loading ?(
       <TouchableNativeFeedback onPress={()=>{
        detailGo(item.item.title,item.item.description,item.item.urlToImage)
       }} style={{flex: 1,alignItems:'center'}} >
          
          <View style={{flex:1,borderRadius:8,elevation:5,borderColor:'white',borderWidth:1,alignSelf:'center',margin:10}} >
        <Text style={{textAlign:'center',fontSize:18,color:'white',fontFamily:Font.f2}}>{item.item.title}</Text>
        <Image
            source={{uri:item.item.urlToImage}}
            resizeMode='contain'
            // eslint-disable-next-line react-native/no-inline-styles
            style={{width: 350, height:300,flex:1}}
          />
            <Text style={{textAlign:'center',fontSize:15,color:'white',fontFamily:Font.f2}}>{item.item.description}</Text>
            <View style={{flex:1,justifyContent:'center'}}>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:10,marginBottom:10}}>
       <TouchableNativeFeedback
        onPress={()=>{
          setLoading(true);
       realTimeDataSil(item.regex)
     }}
         style={{flex: 0.1}}>
         <View
           style={{
             width: '30%',
             height: 36,
             backgroundColor: '#00796B',
             alignSelf: 'center',
             borderRadius: 8,
             justifyContent: 'center',
             alignItems: 'center',
             padding:10,
             marginHorizontal:15
           }}>
          <Text onPress={()=>{
               setLoading(true);
            realTimeDataSil(item.regex)
          }} style={{textAlign:'center',fontSize:14,color:'white',fontFamily:Font.f2}}>Sil</Text>
          
         </View>
       </TouchableNativeFeedback>
      
      
       </View>
       </View>
         </View>
     
      
       </TouchableNativeFeedback>
     ): (
      <View style={{flex:1,backgroundColor:Color.primary,justifyContent:'center',alignItems:'center'}}>
          <ActivityIndicator color='white' size='large' />
    
      </View>)
   };




   if(kaydet){
    return(
  <View style={{flex:1,backgroundColor:Color.primary}}>
      <View style={{flexDirection:'row',justifyContent:'center'}}>
    <TouchableNativeFeedback
     onPress={()=>{
      setKaydet(false);
    
  }}
      style={{flex: 0.1}}>
      <View
        style={{
          width: '40%',
          height: 55,
          backgroundColor: kaydet ? 'blue' :'#00796B',
          alignSelf: 'center',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          padding:10,
          marginHorizontal:15
        }}>
       <Text onPress={()=>{
            setKaydet(false);
          
        
       }} style={{textAlign:'center',fontSize:15,color:'white',fontFamily:Font.f2}}>Kaydedilenleri Göster</Text>
       
      </View>
    </TouchableNativeFeedback>
    <TouchableNativeFeedback
      onPress={() => {
        setSonraOku(true);
        
        setKaydet(false);
       
         getStorage();
      }}
      style={{flex: 0.1}}>
      <View
        style={{
          width: '40%',
          height: 55,
          backgroundColor: sonraOku ? 'blue' :'#00796B',
          alignSelf: 'center',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          padding:10
        }}>
       <Text onPress={()=>{
           setSonraOku(true);
        
           setKaydet(false);
          
            getStorage();
          
         
       }} style={{textAlign:'center',fontSize:15,color:'white',fontFamily:Font.f2}}>Sonra Okunacakları Göster</Text>
       
      </View>
    </TouchableNativeFeedback>
   
    </View>
     
      <FlatList
      style={{marginTop: 15}}
      numColumns={1}
      data={realData}
      renderItem={({item, index}) => FlatRealTime(item, index)}
      keyExtractor={(item) => {
        item._id;
      }}
    />
  </View>)
}

  const FlatStorage = (item) => {
   const item2=JSON.parse(item[1]);

    return (
      <TouchableNativeFeedback onPress={()=>{
        detailGo(item2.title,item2.description,item2.urlToImage)
      }} style={{flex: 1,alignItems:'center'}} >
         

         
         <View style={{flex:1,borderRadius:8,elevation:5,borderColor:'white',borderWidth:1,alignSelf:'center',margin:10}} >
        <Text style={{textAlign:'center',fontSize:18,color:'white',fontFamily:Font.f2}}>{item2.title}</Text>
        <Image
            source={{uri:item2.urlToImage}}
            resizeMode='contain'
            // eslint-disable-next-line react-native/no-inline-styles
            style={{width: 350, height:300,flex:1}}
          />
           <Text style={{textAlign:'center',fontSize:15,color:'white',fontFamily:Font.f2}}>{item2.description}</Text>
           <View style={{flex:1,justifyContent:'center'}}>
           <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:10,marginBottom:10}}>
      <TouchableNativeFeedback
        onPress={()=>{
          setLoading(true);
         removeItemStorage(item2.title)
     }}
        style={{flex: 0.1}}>
        <View
          style={{
            width: '30%',
            height: 36,
            backgroundColor: '#00796B',
            alignSelf: 'center',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            padding:10,
            marginHorizontal:15
          }}>
         <Text onPress={()=>{
              setLoading(true);
             removeItemStorage(item2.title)
         }} style={{textAlign:'center',fontSize:14,color:'white',fontFamily:Font.f2}}>Sil</Text>
         
        </View>
      </TouchableNativeFeedback>
     
     
      </View>
      </View>
        </View>
      
     
      </TouchableNativeFeedback>
    );
  };

  if(sonraOku){
      return(
    <View style={{flex:1,backgroundColor:Color.primary}}>
        <View style={{flexDirection:'row',justifyContent:'center'}}>
      <TouchableNativeFeedback
        onPress={() => {
          
        }}
        style={{flex: 0.1}}>
        <View
          style={{
            width: '40%',
            height: 55,
            backgroundColor: '#00796B',
            alignSelf: 'center',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            padding:10,
            marginHorizontal:15
          }}>
         <Text
         onPress={()=>{
            setKaydet(true);
            setSonraOku(false)
           
                realtimeDataGetir();
               
        }}
         style={{textAlign:'center',fontSize:15,color:'white',fontFamily:Font.f2}}>Kaydedilenleri Göster</Text>
         
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        onPress={() => {
          
        }}
        style={{flex: 0.1}}>
        <View
          style={{
            width: '40%',
            height: 55,
            backgroundColor: sonraOku ? 'blue' :'#00796B',
            alignSelf: 'center',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            padding:10
          }}>
         <Text onPress={()=>{
             setSonraOku(false);
           
         }} style={{textAlign:'center',fontSize:15,color:'white',fontFamily:Font.f2}}>Sonra Okunacakları Göster</Text>
         
        </View>
      </TouchableNativeFeedback>
     
      </View>
       
        <FlatList
        style={{marginTop: 15}}
        numColumns={1}
        data={storageData}
        renderItem={({item, index}) => FlatStorage(item, index)}
        keyExtractor={(item) => {
          item._id;
        }}
      />
    </View>)
  }

  const FlatNews = (item) => {
   
    return (
      <TouchableNativeFeedback onPress={()=>{
          detailGo(item.title,item.description,item.urlToImage)
      }} style={{flex: 1,alignItems:'center'}} >
         
         
        <View style={{flex:1,borderRadius:8,elevation:5,borderColor:'white',borderWidth:1,alignSelf:'center',margin:10}} >
        <Text style={{textAlign:'center',fontSize:18,color:'white',fontFamily:Font.f2}}>{item.title}</Text>
        <Image
            source={{uri:item.urlToImage}}
            resizeMode='contain'
            // eslint-disable-next-line react-native/no-inline-styles
            style={{width: 350, height:300,flex:1}}
          />
             <Text style={{textAlign:'center',fontSize:15,color:'white',fontFamily:Font.f2}}>{item.description}</Text>
           <View style={{flex:1,justifyContent:'center'}}>
           <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:10,marginBottom:10}}>
      <TouchableNativeFeedback
        onPress={() => {
          getRealTime(item)
        }}
        style={{flex: 0.1}}>
        <View
          style={{
            width: '30%',
            height: 36,
            backgroundColor: '#00796B',
            alignSelf: 'center',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            padding:10,
            marginHorizontal:15
          }}>
         <Text style={{textAlign:'center',fontSize:14,color:'white',fontFamily:Font.f2}}>Kaydet</Text>
         
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        onPress={() => {
          
        }}
        style={{flex: 0.1}}>
        <View
          style={{
            width: '30%',
            height: 36,
            backgroundColor: '#00796B',
            alignSelf: 'center',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            padding:10
          }}>
         <Text onPress={() => {save(item)}} style={{textAlign:'center',fontSize:14,color:'white',fontFamily:Font.f2}}>Sonra Oku</Text>
         
        </View>
      </TouchableNativeFeedback>
     
      </View>
      </View>
        </View>
     
     
      </TouchableNativeFeedback>
    );
  };
 
  return (
    <View style={{flex: 1, backgroundColor: Color.primary}}>
      <Text
        style={{
          fontSize: 27,
          color: 'white',
          fontFamily: Font.f3,
          alignSelf: 'center',
          marginVertical: 15,
        }}>
        HABER LİSTESİ
      </Text>
      <View style={{flexDirection:'row',justifyContent:'center'}}>
      <TouchableNativeFeedback
        onPress={() => {
          
        }}
        style={{flex: 0.1}}>
        <View
          style={{
            width: '40%',
            height: 55,
            backgroundColor: '#00796B',
            alignSelf: 'center',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            padding:10,
            marginHorizontal:15
          }}>
         <Text onPress={()=>{
            realtimeDataGetir();
            realtimeDataGetir();
             setSonraOku(false);
             setKaydet(true);
              setLoading(true);
             
           
          
         }} style={{textAlign:'center',fontSize:15,color:'white',fontFamily:Font.f2}}>Kaydedilenleri Göster</Text>
         
        </View>
      </TouchableNativeFeedback>
      <TouchableNativeFeedback
        onPress={() => {
          
        }}
        style={{flex: 0.1}}>
        <View
          style={{
            width: '40%',
            height: 55,
            backgroundColor: '#00796B',
            alignSelf: 'center',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center',
            padding:10
          }}>
         <Text onPress={()=>{
             setSonraOku(i=>!i);
             setKaydet(false);
             getStorage();
         }} style={{textAlign:'center',fontSize:15,color:'white',fontFamily:Font.f2}}>Sonra Okunacakları Göster</Text>
         
        </View>
      </TouchableNativeFeedback>
     
      </View>
       <FlatList
        style={{marginTop: 15}}
        numColumns={1}
        data={datam}
        renderItem={({item, index}) => FlatNews(item, index)}
        keyExtractor={(item) => {
          item._id;
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
