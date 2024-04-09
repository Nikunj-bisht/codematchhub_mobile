import React, { useState } from 'react';
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {getFontScale, moderateScale, verticalScale} from '../../utils/scale';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import Loader from '../../components/Loader';

GoogleSignin.configure({
  webClientId:
    '588972985147-o1h91nmgttj49gi5r35ar3ne20lf330f.apps.googleusercontent.com',
});

function Login({navigation,setUserData}) {

  const [isSigningUp,setIsSigningUp] = useState(false)

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    // Get the users ID token
    const {idToken} = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }
  function saveUserData(data: any) {
    setIsSigningUp(true)
    firestore()
      .collection('users')
      .add({
        name: data?.additionalUserInfo?.profile?.name,
        img: data?.additionalUserInfo?.profile?.picture,
        mail: data?.user?.email
      })
      .then(async(data) => {
        console.log(data,'daaa')
        let local = (await data.get()).data()
        local.id = data.id
        await AsyncStorage.setItem('userData', JSON.stringify(local))
        setUserData(true)
      }).catch((err)=>{
         console.log(err,'error')
         GoogleSignin.signOut()
      }).finally(()=>setIsSigningUp(false));
  }
  return (
    <View style={styles.container}>
       <LottieView
            source={require('../../public/signup.json')}
            autoPlay
            loop
            style={{width: '100%', height: verticalScale(280)}}
          />
      <Text style={styles.title}>Create an account</Text>
      <Text style={styles.signup}>Sign-up with</Text>
      {
        isSigningUp ? <Loader styles={{alignSelf:'center'}}/> :  <TouchableOpacity
        disabled={isSigningUp}
        style={styles.button}
        onPress={() =>
          onGoogleButtonPress()
            .then(data => saveUserData(data))
            .catch(err => GoogleSignin.signOut())
        }>
        <Image
          style={styles.image}
          source={require('../../public/googlei.png')}></Image>
        <Text style={styles.google}>Google Sign-In</Text>
      </TouchableOpacity>
      }
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222C4E',
    justifyContent: 'center',
  },
  title: {
    fontSize: getFontScale(30),
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 12,
    color: 'white',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '55%',
    paddingVertical: verticalScale(12),
    borderRadius: 30,
    alignSelf: 'center',
    paddingHorizontal: 10,
    justifyContent: 'space-around',
    borderWidth: 0.4,
    borderColor:'white',
    backgroundColor:'white'
    
  },
  image: {
    width: 30,
    height: 30,
  },
  signup: {
    textAlign: 'center',
    marginBottom: verticalScale(30),
    fontSize: 16,
    fontWeight: '500',
    color:'white'
  },
  google: {
    fontSize: getFontScale(14),
    fontWeight: '500',
    color:'black'
  },
});

export default Login;
