import React from 'react'
import { StyleSheet, Text, View,Image, ScrollView } from 'react-native'
import Color from '../../constants/Color';
import Font from '../../constants/Font';
export default function NewsDetail({ route, navigation }) {
    console.log(route)
 
    return (
        <View style={{flex:1,backgroundColor:Color.primary}}>
            <Text style={{fontSize:17,color:'white',textAlign:'center'}}> {route.params.title}</Text>
            <Image source={{uri:route.params.img}} resizeMode='contain' style={{width:'100%',height:250,borderRadius:8}} />
            <ScrollView>
            <Text style={{fontSize:17,color:'white',textAlign:'center'}}> {route.params.content}</Text>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({})
