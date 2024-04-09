import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Header from '../../components/header';
import {getFontScale, moderateScale, verticalScale} from '../../utils/scale';
import {colors} from '../../utils/colors';
import {QuizQuestion} from '../home/components/topicListing';
import Loader from '../../components/Loader';

interface QuizRoomProps {
  route?: any;
  navigation: any;
}
interface CurrentQuestion {
  code: string;
  options: Array<string>;
  answer: number;
}
interface OptionInter{
    selectedAnswer:number;
}
function getRandom(min, max) {
  const floatRandom = Math.random();

  const difference = max - min;

  // random between 0 and the difference
  const random = Math.round(difference * floatRandom);

  const randomWithinRange = random + min;

  return randomWithinRange;
}
function generateResult(questions,answered:Array<OptionInter>){
         let score = 0;
         for(let currentQuestion = 0 ; currentQuestion < questions.length;currentQuestion++){
             if(questions[currentQuestion].answer === answered[currentQuestion].selectedAnswer){
                 score+=10;
             }
         }
         return score;
}
function QuizRoom(props: QuizRoomProps) {
  const [questions, setQuestions] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Array<OptionInter>>([]);
  const {route, navigation} = props;
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  console.log(questions, 'quesssss');
  useEffect(() => {
    firestore()
      .collection('quiz')
      .where('tags', 'array-contains', route.params.tag)
      .get()
      .then(data => {
        let pickedQuizQuestions: any = [];
        let selected: any = [];
        let docs = data.docs,
          len = docs.length;

        for (let iterator = 0; iterator < 10; iterator++) {
          let randomNum = getRandom(0, len - 1);
          let selObj = {selectedAnswer: null};
          selected.push(selObj)
          pickedQuizQuestions.push(docs[randomNum].data());
        }
        setSelectedAnswers(selected);
        setQuestions(pickedQuizQuestions);
      });
  }, []);
  function nextQuestion() {
    if(currentQuestion === 9){
           let score =  generateResult(questions,selectedAnswers);
           navigation.navigate('result',{
            score,
            type:route.params.tag
           })
           return;
    }
    setCurrentQuestion(prev => prev + 1);
  }

  function optionClicked(optionIndex: number) {
    let tempSelectedAns = [...selectedAnswers];
    tempSelectedAns[currentQuestion].selectedAnswer = optionIndex;
    console.log(tempSelectedAns,'temppppp')
    setSelectedAnswers(tempSelectedAns)
  }
  return (
    <View style={styles.container}>
      <Header navigation={navigation} title="Quiz Room"></Header>
      <View style={styles.innerContainer}>
        <ScrollView>
          {questions ? (
            <QuizQuestion
              optionClicked={optionClicked}
              currentSel={selectedAnswers[currentQuestion]?.selectedAnswer}
              item={questions[currentQuestion]}
              index={currentQuestion}
              fromRoom={true}
            />
          ) : <Loader styles={{alignSelf:'center'}}/>}
        </ScrollView>
        <TouchableOpacity onPress={nextQuestion} style={styles.next}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    justifyContent: 'space-between',
    flex: 1,
    paddingHorizontal: moderateScale(12),
    paddingTop: verticalScale(12),
    // backgroundColor:'red'
  },
  next: {
    // justifyContent:'flex-end',
    backgroundColor: colors.theme,
    paddingVertical: verticalScale(12),
    marginHorizontal: moderateScale(12),
    borderRadius: 20,
    marginBottom: verticalScale(10),
    alignItems: 'center',
  },
  nextText: {
    color: 'white',
    fontWeight: '700',
    fontSize: getFontScale(16),
  },
  questionHeading: {
    fontWeight: '600',
    fontSize: getFontScale(15),
  },
});

export default QuizRoom;
