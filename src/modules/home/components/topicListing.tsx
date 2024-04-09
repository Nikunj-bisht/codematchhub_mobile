import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import CodeHighlighter from 'react-native-code-highlighter';
import {atomOneDarkReasonable} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Icon from 'react-native-vector-icons/EvilIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon4 from 'react-native-vector-icons/Ionicons';
import {getFontScale, moderateScale} from '../../../utils/scale';
import Icon5 from 'react-native-vector-icons/SimpleLineIcons';
import Icon6 from 'react-native-vector-icons/Fontisto';
import Header from '../../../components/header';
import Loader from '../../../components/Loader';
import MobileAds, {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';

interface IProps {
  navigation: any;
  route: any;
}
const adUnitId = true
  ? TestIds.BANNER
  : 'ca-app-pub-6565982892610234/3379355030';

function Options({
  option,
  index,
  setCurrentSelected,
  currentSelected,
  showCorrectAnswer,
  answer,
}) {
  const changeOption = () => {
    setCurrentSelected(index);
  };
  return (
    <TouchableOpacity
      onPress={changeOption}
      style={
        !(currentSelected !== null)
          ? styles.unSelected
          : showCorrectAnswer
          ? index === answer
            ? styles.selected
            : styles.wrong
          : index === currentSelected
          ? styles.selected
          : styles.unSelected
      }>
      <Icon4
        name={
          currentSelected === index
            ? 'radio-button-on'
            : 'radio-button-off-outline'
        }
        size={15}
        color={
          currentSelected !== null &&
          (index === currentSelected || showCorrectAnswer)
            ? 'white'
            : 'black'
        }></Icon4>

      <Text
        style={{
          fontSize: getFontScale(15),
          fontWeight: '600',
          paddingLeft: 8,
          color:
            currentSelected !== null &&
            (index === currentSelected || showCorrectAnswer)
              ? 'white'
              : 'black',
        }}>
        {option}
      </Text>
    </TouchableOpacity>
  );
}

export function QuizQuestion({
  item,
  index,
  optionClicked = null,
  currentSel = null,
  fromRoom = false,
}: any) {
  const [currentSelected, setCurrentSelected] = useState(null);
  const [likes, setLikes] = useState(item.like);
  console.log(item, 'iddddddd');
  function likeQues() {
    setLikes(prev => prev + 1);
    firestore()
      .collection('quiz')
      .doc(item.id)
      .update({
        like: item.like + 1,
      })
      .then(() => {});
  }
  return (
    <View style={styles.codeQuestion}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 15,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '500',
            color: 'black',
            marginBottom: 8,
          }}>{`${index + 1} -  What will be Output for below Code?`}</Text>
        <Icon5 name="options-vertical" size={17}></Icon5>
      </View>
      <CodeHighlighter
        hljsStyle={atomOneDarkReasonable}
        startingLineNumber={1}
        CodeTag={'circle'}
        textStyle={styles.text}
        customStyle={{
          width: '100%',
          backgroundColor: '#292D34',
          padding: 10,
          borderRadius: 10,
        }}
        language={item.language}>
        {`${item?.code?.replaceAll('\\n', '\n')}`}
      </CodeHighlighter>
      <View style={styles.icons}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {likes > item.like ? (
            <Icon2
              onPress={likes > item.like ? null : likeQues}
              name="heart"
              size={20}
              color="red"
              style={{marginRight: moderateScale(6)}}
            />
          ) : (
            <Icon
              onPress={likes > item.like ? null : likeQues}
              name="heart"
              size={30}
              color="black"
            />
          )}
          <Text style={{fontWeight: '500'}}>{likes} likes</Text>
          {/* <Icon2 name="heart" size={30} color="black"  /> */}
          {/* <Icon3
            style={{marginLeft: moderateScale(17)}}
            name="comment-flash-outline"
            size={25}
            color="black"></Icon3> */}
        </View>
        <View style={{paddingRight: 10}}>
          <Icon6
            style={{marginLeft: moderateScale(17)}}
            name="favorite"
            size={25}
            color="black"></Icon6>
        </View>
      </View>
      {item?.options?.map((i, index) => (
        <Options
          currentSelected={fromRoom ? currentSel : currentSelected}
          setCurrentSelected={() => {
            optionClicked && optionClicked(index);
            setCurrentSelected(index);
          }}
          option={i}
          showCorrectAnswer={!optionClicked}
          index={index}
          answer={item?.answer}
        />
      ))}
    </View>
  );
}

function TopicListing(props: IProps) {
  const {route, navigation} = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    firestore()
      .collection('quiz')
      .where('tags', 'array-contains', route.params.tag)
      .get()
      .then(data => {
        let temp: any = [];
        data.docs.forEach(item => {
          let tempData = item.data();
          tempData.id = item.id;
          temp.push(tempData);
        });
        setData(temp);
      });
  }, []);
  // console.log(item,'pppppp')
  return (
    <>
      <Header navigation={navigation} />

      <View style={styles.container}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: 'rgba(0, 0, 0, .12)',
                marginBottom: 15,
              }}></View>
          )}
          ListEmptyComponent={() => <Loader styles={{alignSelf: 'center'}} />}
          renderItem={({item, index}) => (
            <QuizQuestion item={item} index={index} />
          )}
        />
        <BannerAd
          unitId={adUnitId}
          onAdLoaded={() => console.log('loaded1')}
          onAdFailedToLoad={err => console.log(err, 'loaded2')}
          onAdOpened={() => console.log('loaded3')}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  codeContainer: {
    // padding: 16,
    width: '100%',
    backgroundColor: 'red',
    height: 300,
  },
  text: {
    fontSize: 18,
    width: '100%',
    lineHeight: 30,
  },
  codeQuestion: {
    marginBottom: 34,
    borderRadius: 10,
  },
  container: {
    paddingHorizontal: moderateScale(12),
    backgroundColor: '#EFECE5',
    paddingTop: 15,
    flex: 1,
    justifyContent: 'center',
  },
  icons: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  unSelected: {
    paddingVertical: 12,
    borderWidth: 0,
    borderRadius: 12,
    marginTop: 10,
    paddingLeft: 7,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  wrong: {
    paddingVertical: 12,
    borderWidth: 0,
    borderRadius: 12,
    marginTop: 10,
    paddingLeft: 7,
    backgroundColor: '#e57373',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  selected: {
    paddingVertical: 12,
    borderWidth: 0,
    borderRadius: 12,
    marginTop: 10,
    paddingLeft: 7,
    backgroundColor: '#4CAF4F',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  disabledQuestion: {
    marginBottom: 34,
    borderRadius: 10,
    pointerEvents: 'none',
  },
  nonClickable: {
    marginBottom: 34,
    borderRadius: 10,
    pointerEvents: 'none',
  },
});

export default TopicListing;
