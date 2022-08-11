
import './App.css';
import React, {useState,useEffect, useCallback, useRef} from 'react';
import Question from './components/Question';
import { v4 as uuidv4 } from 'uuid';
import ReactCanvasConfetti from "react-canvas-confetti";
import MainMenuForm from './components/MainMenuForm';


function App() {

  const [questions,setQuestions] = useState([])
  const [isActive,setIsActive] = useState(false)
  const [isEnded,setIsEnded] = useState(false)
  const [correctAmount, setCorrectAmount] = useState(0)
  const [count, setCount] = useState(0)
  const [numberOfQuestions, setnumberOfQuestions] = useState(0)
  const [category, setCategory] = useState(0)
  const [difficulty, setDifficulty] = useState("")
  const [categories, setCategories] = useState([])
  
  useEffect( () => {
    setCorrectAmount( questions.map(question=>question).filter(question=>question.userSelection===question.correctAnswer).length)
  },[questions])


  useEffect( () => {
    getAvailbleCategories()
  },[])

  // useEffect( () => {
  //   console.log(categories)
  // },[categories])

  useEffect( () => {
    console.log(count)
  },[count])

  useEffect( () => {

    if(isActive) return

    },[isActive])

  const question = questions.map((q,index)=>{
    return <Question
      index={index} 
      question={q.question} 
      answers={q.answers}
      correctAnswer={q.correctAnswer}
      key = {uuidv4()}
      click={setAnswer}
      userSelection={q.userSelection}
      isCorrect = {q.isCorrectlyAnswered}
      isEnded={isEnded}
      count={count}
    />
  })
  
  async function  getAvailbleCategories() {
    const data = await fetch("https://opentdb.com/api_category.php")
    const categories = await data.json()
    const categoriesArr = categories.trivia_categories
    setCategories(categoriesArr)
  }

  function getQuestions(event){
    event.preventDefault();
    if(numberOfQuestions>0){
      fetch(`https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`)
      .then(res=>res.json())
      .then(data=>{
        if(data.response_code===1){
          alert("There are not that many questions in the database, please try again")
          setQuestions([])
          setIsActive(false)
          setIsEnded(false)
          setCount(0)
        }
        data.results
      .map((d,index)=>{
        const randomIndex = Math.round(Math.random(0)*d.incorrect_answers.length);

        d.incorrect_answers.splice(randomIndex, 0, d.correct_answer)
  
        const formattedData={
          question:d.question,
          correctAnswer:d.correct_answer,
          answers:d.incorrect_answers,
          id:uuidv4(),
          userSelection:"",
          index:index,
          isCorrectlyAnswered :false
        }
        setQuestions(prevQuestion=>[...prevQuestion,formattedData])
        return true
        }
      )}
    )
      setnumberOfQuestions(0)
      setCategory("")
      setDifficulty("")
      setIsActive(true)
    }else{
      alert("enter number of questions")
    } 
  }


  function setAnswer(ans, index){
    if(!isEnded){

      if(count < 1){
        setCount(prevCount=>prevCount+1)
      }
      let temp_state = [...questions];
      let temp_element = { ...temp_state[index] };
      temp_element.userSelection = ans;
      temp_state[index] = temp_element;
      setQuestions(prevState => {
        if(prevState[index].userSelection=== temp_state[index].userSelection){
          temp_element.userSelection = "";
          temp_state[index] = temp_element;
          return temp_state
        }
        return temp_state
      });
    }
  }

  function handleSubmit(event){
    event.preventDefault();  
    
    if(!isEnded){
      questions.map((question,index)=>{
        let temp_state = [...questions];
        let temp_element = {...question}
        temp_element.isCorrectlyAnswered = (temp_element.userSelection===temp_element.correctAnswer);        
        temp_state[index] = temp_element;   
        setQuestions(temp_state);
        return true
      })
      if(count < 1){
        setCount(prevCount=>prevCount+1)
      }
    if(correctAmount === questions.length){
      fire()
    }

      setIsEnded(true)
    }else{
      setIsEnded(false)
      setIsActive(false)
      setQuestions([])
      setCount(0)
    }
  }

  function handleQuestionAmount(e){
    // e.preventDefault()
    let {value} = e.target

    if(value === "+" || value === "-") {
      value=0
    }

    if(value<1){
      value=0
    }
    
    if(value>50){
      value=50
    }
    
    if(value<10 && value.length>1){
      value = value.slice(1)
    }
    
    setnumberOfQuestions(value)
  }

  function handleCategorySelection(e){
    e.preventDefault()
    setCategory(e.target.value)
  }

  function handleDifficultySelection(e){
    e.preventDefault()
    setDifficulty(e.target.value)
  }

  const refAnimationInstance = useRef(null);

  const canvasStyles = {
    position: "fixed",
    pointerEvents: "none",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0
  };
  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback((particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio)
      });
  }, []);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55
    });

    makeShot(0.2, {
      spread: 60
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45
    });
  }, [makeShot]);


  function setElement(){

  let style = {
    color: "initial"
  }

  if(correctAmount === 0) {
    style = {
      color: "red"
    }
  }else if(correctAmount < questions.length){
    style = {
      color: "orange"
    }
  }else if(correctAmount === questions.length){
    style = {
      color: "green"
    }
  }

  if(isActive){
    if(questions.length<=0){
      return <div className="loader-container">
                <div className="loader"></div>
             </div>
    }else{
      return <form className="App" onSubmit={handleSubmit}>
              <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
              {question}
              {questions.length>0 && <button className="sbmt-btn" >{ isEnded ? "Play Again" : "Check Answers"}</button>}
              {isEnded && <span className='result-text' style={style}>You answered {correctAmount}/{questions.length} correctly</span>}       
            </form>
  }
  }else{
    return (
        <MainMenuForm
          getQuestions={getQuestions}
          category={category}
          handleCategorySelection={handleCategorySelection}
          difficulty={difficulty}
          handleDifficultySelection={handleDifficultySelection}
          handleQuestionAmount={handleQuestionAmount}
          numberOfQuestions={numberOfQuestions}
          categories={categories}
        />
      )
  }
}

  return (
    <div className='App-header'>  
      {setElement()}
      <h4><a href='https://github.com/ceo991/quizzicle-app' style={{color:"aliceblue",textDecoration: "none"}}>You can see the source code here</a></h4>
    </div>  
  );
}

export default App;
