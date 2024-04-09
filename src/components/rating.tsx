import React from "react";
import { StyleSheet, View } from "react-native";
import Icon from 'react-native-vector-icons/AntDesign';
import { verticalScale } from "../utils/scale";

interface RatingProps{
  rate:number;
}

function Rating(props:RatingProps){
    const {rate} = props;
    return (<View style={styles.container}>
      {
        Array.from(Array(5)).map((item,index)=>{
            return (
                <Icon
                onPress={() => console.log('popo')}
                name="star"
                size={20}
                color={index < rate ? "#ffb300" : "#bdbdbd"}
              />
            )
        })
      }
    </View>)
}

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        marginTop:verticalScale(8),
    }
})

export default Rating;