import React from "react"
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getFontScale, verticalScale } from "../../../utils/scale";

interface QuizTopicProps{
   item:any;
   goToList:Function;
}

function QuizTopic(props:QuizTopicProps) {
    const {item,goToList} = props;
    console.log(item,'item')
    return (
        <TouchableOpacity  onPress={()=>goToList()} style={styles.container}>
         <Image resizeMode="contain" style={{width:'60%',height:'50%',borderRadius:20}} source={{uri:item.url}}/>
         <Text style={{paddingTop:verticalScale(8),fontSize:getFontScale(15),fontWeight:'600',color:'black',textAlign:'center',paddingBottom:10}}>{item.name}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
      container:{
          width:'45%',
          height:verticalScale(170),
        //   padding:10,
          shadowOffset:{
            width:0,
            height:2
          },
          shadowOpacity:0.1,
          shadowRadius:2,
         
          borderRadius:20,
          backgroundColor:'white',
          alignItems:'center',
          justifyContent:'center'
          
      }
})

export default React.memo(QuizTopic)