import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TagProps{
   data:[]
}

function Tags(props:TagProps){
     const {data = []} = props
     return (
        <View>
            {
                data.map((item,index)=><Text>{item}</Text>)
            }
        </View>
     )
}

const styles = StyleSheet.create({
     
})

export default Tags;