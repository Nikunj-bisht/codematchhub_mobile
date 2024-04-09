import React, { useEffect } from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {colors} from '../../utils/colors';
import {getFontScale, moderateScale, verticalScale} from '../../utils/scale';
import CircularProgress from 'react-native-circular-progress-indicator';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface ResultProps {
  route?: any;
  navigation?: any;
}
async function storeResult(score,type){
   let userId = await AsyncStorage.getItem('userData')
   const {id} = JSON.parse(userId);
   console.log(userId,'userIdddd')
   await 
   firestore()
   .collection('scores')
   .add({
    score: score,
    userId: id,
    type:type
   }).then(()=>{

   })
}
function QuizResult(props: ResultProps) {
  const {route, navigation} = props;
  const {score,type} = route?.params;
  useEffect(()=>{
     storeResult(score,type)
  //  storeResult
  },[])
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text
          style={{
            fontWeight: '700',
            fontSize: getFontScale(20),
            color: 'black',
            marginBottom: verticalScale(28),
          }}>
          Your Score
        </Text>
        <CircularProgress
          value={score}
          activeStrokeWidth={12}
          progressValueColor={colors.theme}
          titleStyle={{
            color: 'red',
            fontSize: getFontScale(16),
            fontWeight: '700',
          }}
          progressValueStyle={{color: colors.theme}}
          title="/100"
          activeStrokeSecondaryColor={colors.theme}
          activeStrokeColor={colors.theme}
        />
        <Text
          style={{
            fontWeight: '500',
            fontSize: getFontScale(14),
            color: 'black',
            marginTop: verticalScale(28),
            marginBottom: verticalScale(18),
          }}>
          You did a great job, Learn more by taking new quiz
        </Text>
        <Button
          onPress={() => navigation.pop(2)}
          title="Go to Home"
          color={colors.theme}></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(12),
  },
  innerContainer: {
    flex: 0.5,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    paddingTop: verticalScale(18),
    // justifyContent:'center'
  },
});

export default QuizResult;
