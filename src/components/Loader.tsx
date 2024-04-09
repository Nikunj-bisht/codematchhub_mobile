import React from 'react';
import LottieView from 'lottie-react-native';
import {verticalScale} from '../utils/scale';
import {ViewStyle} from 'react-native';

interface LoaderProps {
  styles?: ViewStyle;
}

function Loader(props: LoaderProps) {
  const {styles} = props;
  return (
    <LottieView
      source={require('../public/loader.json')}
      autoPlay
      loop
      style={[{width: '60%', height: verticalScale(180)}, styles]}
    />
  );
}

export default React.memo(Loader);
