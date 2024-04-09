import React, { useCallback } from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Icon4 from 'react-native-vector-icons/Ionicons';
import { getFontScale } from "../utils/scale";

interface IProps{
    navigation:any
    title?:string;
}

function Header(props:IProps){
   const {navigation,title=""} = props;
   const goBack = useCallback(()=>{
     navigation.goBack();
   },[])
   return (
    <View style={styles.headerContainer}>
        <TouchableOpacity onPress={()=>goBack()}>

      <Icon4 name="chevron-back" size={32}></Icon4>
        </TouchableOpacity>
        <Text style={styles.textStyle}>{title}</Text>
    </View>
   )
}

const styles  = StyleSheet.create({
       headerContainer:{
          flexDirection:'row',
          paddingHorizontal: 8,
          backgroundColor: '#EFECE5',
          paddingTop: 12,
          alignItems:'center'
       },textStyle:{
          fontSize:getFontScale(22),
          textAlign:'center',
          width:'80%'
       }
})


export default React.memo(Header)