import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState, version} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {getFontScale, moderateScale, verticalScale} from '../../utils/scale';
import Rating from '../../components/rating';

function ScoreItem({item}) {
  return (
    <View style={styles.card}>
      <View>
        <Text
          style={{
            color: 'black',
            fontWeight: '700',
            fontSize: getFontScale(20),
          }}>
          Language - {item.type}
        </Text>
        <Rating rate={4} />
      </View>
      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            color: 'black',
            fontWeight: '700',
            fontSize: getFontScale(20),
          }}>
          Scored
        </Text>
        <Text
          style={{
            color: 'black',
            fontWeight: '500',
            fontSize: getFontScale(18),
            marginTop: verticalScale(8),
          }}>
          {item.score}
        </Text>
      </View>
    </View>
  );
}

function Score() {
  const [scores, setScores] = useState([]);
  useEffect(() => {
    async function getScores() {
      const userData: any = await AsyncStorage.getItem('userData');
      const {id} = JSON.parse(userData);
      firestore()
        .collection('scores')
        .where('userId', '==', id)
        .get()
        .then(querySnapshot => {
          let docs = querySnapshot.docs,
            tempScore: any = [];

          for (let i = 0; i < docs.length; i++) {
            console.log(docs[i].data());
            tempScore.push(docs[i].data());
          }
          setScores(tempScore);
        });
    }

    getScores();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={scores}
        renderItem={({item}) => <ScoreItem item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(22),
    paddingVertical: verticalScale(28),
    borderRadius: 15,
    
  },
});

export default Score;
