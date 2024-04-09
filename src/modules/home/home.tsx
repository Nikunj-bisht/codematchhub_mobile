import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import LottieView from 'lottie-react-native';
import {getFontScale, moderateScale, verticalScale} from '../../utils/scale';
import firestore from '@react-native-firebase/firestore';
import QuizTopic from './components/quizTopic';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Feather';
import Icon3 from 'react-native-vector-icons/Entypo';
import QuizRoomListing from './components/quizRoomListing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MobileAds, { AdEventType, BannerAd, BannerAdSize, InterstitialAd, TestIds } from 'react-native-google-mobile-ads';
import Score from '../scores/score';

const Tab = createBottomTabNavigator();
const adUnitId = true ? TestIds.BANNER : 'ca-app-pub-6565982892610234/3379355030';
const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);
console.log(TestIds.BANNER,'banner')
function Home(props: any) {
  const {navigation} = props;
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [userData,setUserData] = useState({
    name:"",
    img:""
  });
  function goToList(tag: string) {
    navigation.navigate('listing', {
      tag: tag,
    });
  }
  useEffect(() => {
    const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
      // setLoaded(true);
      console.log("loadded")
    });
    interstitial.load();

    // Start loading the interstitial straight away

    // Unsubscribe from events on unmount
    return unsubscribe;
  }, []);
  useEffect(() => {
    const userDocument = firestore().collection('topquizs').get();
    userDocument.then(data => {
      let temp = [];
      data.docs.forEach(item => {
        temp.push(item.data());
      });
     

      setData(temp);

    });
    async function getUserData(){
       let userData:any = await AsyncStorage.getItem('userData');
       setUserData(JSON.parse(userData))
       try {
        // await MobileAds().openAdInspector();
        // The promise will resolve when the inspector is closed.
      } catch (error) {
        // The promise will reject if ad inspector is closed due to an error.
        console.log(error,'error');
      }
    }
    getUserData()
  }, []);
  console.log(userData,'user')
  const showModal = useCallback(() => {
    setVisible(!visible);
  }, [visible]);
  return (
    <View style={styles.container}>
      <View style={{backgroundColor:colors.theme,flexDirection:'row',alignItems:'center',height:80,paddingLeft:moderateScale(12)}}>
        {

       userData.img && <Image resizeMode='contain' style={{width:40,height:40,borderRadius:50}} source={{uri:userData?.img}}/>
        }
        <Text numberOfLines={1} style={{fontWeight:'600',fontSize:getFontScale(24),paddingLeft:moderateScale(10),color:'white'}}>Welcome {userData?.name}</Text>
      </View>
      <View style={styles.upperView}>
        <View style={styles.left}>
          <View style={styles.textCont}>
            <Text style={styles.leftText}>Challenge your coding skills!</Text>
            <TouchableOpacity onPress={showModal} style={styles.quizRoom}>
              <Text style={styles.roomText}>Quiz Room</Text>
              <Icon
                onPress={() => console.log('popo')}
                name="arrowright"
                size={20}
                color="black"
              />
            </TouchableOpacity>
            {/* <Text style={styles.subHeading}>
              Unleash Your Coding Potential with Exciting Challenges
            </Text> */}
          </View>
          <LottieView
            source={require('../../public/quizAnimation.json')}
            autoPlay
            loop
            style={{width: moderateScale(200), height: verticalScale(130)}}
          />
        </View>
      </View>
      <View style={styles.lowerView}>
        <Text style={styles.topic}>Quiz Topics</Text>
        <FlatList
          columnWrapperStyle={{
            justifyContent: 'space-between',
          }}
          ItemSeparatorComponent={() => <View style={{height: 18}} />}
          numColumns={2}
          data={data}
          renderItem={({item}) => (
            <QuizTopic goToList={() => goToList(item.tag)} item={item} />
          )}></FlatList>
           <BannerAd
      unitId={adUnitId}
      onAdLoaded={()=>console.log('loaded1')}
      onAdFailedToLoad={(err)=>console.log(err,'loaded2')}
      onAdOpened={()=>console.log("loaded3")}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
      </View>
     
      <Modal transparent={true} visible={visible}>
        <QuizRoomListing
          setModalVisible={() => setVisible(false)}
          data={data}
          navigation={navigation}
        />
      </Modal>
    </View>
  );
}

function MyTabs(props:any) {
  return (
    <Tab.Navigator   screenOptions={{tabBarStyle:{height:55,alignItems:'center'},tabBarLabelStyle:{fontSize:getFontScale(14),paddingBottom:verticalScale(8)}}}>
      <Tab.Screen  options={{headerShown:false,tabBarIcon:()=><Icon
                onPress={() => console.log('popo')}
                name="home"
                size={20}
                color="black"
              />}} name="Home" component={Home} />
      <Tab.Screen 
      options={{headerShown:false,tabBarIcon:()=><Icon3
                onPress={() => console.log('popo')}
                name="bar-graph"
                size={20}
                color="black"
              />}}
               name="Scores" component={Score} />
      <Tab.Screen options={{headerShown:false,tabBarIcon:()=><Icon2
                onPress={() => console.log('popo')}
                name="bookmark"
                size={20}
                color="black"
              />}} name='BookMarks' component={Score} ></Tab.Screen>
    </Tab.Navigator>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme,
  },
  upperView: {
    flex: 0.26,
  },
  lowerView: {
    flex: 0.74,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: verticalScale(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EFECE5',
  },
  left: {
    //  backgroundColor:'red',
    flexDirection: 'row',
    flex: 1,
    //  justifyContent:'center',
    alignItems: 'flex-end',
  },
  textCont: {
    flex: 1,
    //    alignItems:'flex-end',
    justifyContent: 'flex-start',
    paddingLeft: moderateScale(10),
  },
  leftText: {
    // flex:1,
    fontWeight: '600',
    color: 'white',
    fontSize: getFontScale(20),
    // textAlign:'center',
    paddingBottom: 20,
    lineHeight: 30,
  },
  subHeading: {
    // flex:1,
    fontWeight: '500',
    color: 'white',
    fontSize: getFontScale(14),
    textAlign: 'right',
    paddingBottom: 20,
    lineHeight: 20,
  },
  topic: {
    textAlign: 'left',
    color: 'black',
    width: Dimensions.get('screen').width,
    paddingLeft: moderateScale(32),
    fontSize: getFontScale(20),
    fontWeight: '600',
    paddingBottom: verticalScale(10),
  },
  quizRoom: {
    paddingVertical: verticalScale(12),
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: verticalScale(14),
    alignItems: 'center',
    alignSelf: 'baseline',
    flexDirection: 'row',
    paddingHorizontal: moderateScale(18),
  },
  roomText: {
    color: 'black',
    fontWeight: '600',
    marginRight: moderateScale(8),
  },
});

export default MyTabs;
