import {FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getFontScale, moderateScale, verticalScale} from '../../../utils/scale';
import Icon from 'react-native-vector-icons/Entypo';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';

interface QuizRoomListingProps {
  data: [];
  setModalVisible:Function;
  navigation?:any;
}

interface QuizRoomListingItem {
  item: any;
  navigation?:any;
}

function RenderQuizRoomItem(props: QuizRoomListingItem) {
  const {item,navigation} = props;
  return (

    <TouchableOpacity onPress={()=>navigation.navigate('quizRoom',{
      tag:item.tag
    })} style={{flexDirection: 'row',alignItems:'center',paddingVertical:verticalScale(12)}}>
      <Image
        resizeMode="contain"
        style={{width: '12%', height: '75%', borderRadius: 80,marginRight:moderateScale(14)}}
        source={{uri: item.url}}
        />
      <Text
        style={{
          paddingTop: verticalScale(8),
          fontSize: getFontScale(15),
          fontWeight: '600',
          color: 'black',
          textAlign: 'center',
          paddingBottom: 10,
        }}>
        {item.name}
      </Text>
    </TouchableOpacity>
          
  );
}

function QuizRoomListing(props: QuizRoomListingProps) {
  const {data,setModalVisible,navigation} = props;
  const isFocused = useIsFocused()
  useEffect(()=>{
     if(!isFocused){
      setModalVisible(false)
     }
  },[isFocused])
  return (
    <View style={{backgroundColor:'rgba(0,0,0,0.5)',flex:1,justifyContent:'center'}}>
    
    <View style={styles.container}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>

      <Text style={{fontWeight:'600',fontSize:getFontScale(20),marginBottom:10}}>Select your Quiz</Text>
      <Icon onPress={setModalVisible} size={30} name="cross"></Icon>
      </View>
      <FlatList
        data={data}
        renderItem={({item}) => <RenderQuizRoomItem setModalVisible={setModalVisible} navigation={navigation}  item={item} />}
      />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.6,
    backgroundColor:'white'
    ,marginHorizontal:moderateScale(18),
    borderRadius:12,
    padding:moderateScale(16)
  },
});

export default QuizRoomListing;
