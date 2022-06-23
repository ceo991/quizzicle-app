
import './App.css';
import React, {useState,useEffect} from 'react';
import Question from './components/Question';
import { v4 as uuidv4 } from 'uuid';


function App() {

  const[questions,setQuestions] = useState([])
  const[isActive,setIsActive] = useState(false)
  const[isEnded,setIsEnded] = useState(false)

  const[numberOfQuestions, setnumberOfQuestions] = useState(0)
  const[category, setCategory] = useState(0)
  const[info, setInfo] = useState({})
  const[difficulty, setDifficulty] = useState("")

  useEffect( () => {
    if(category !== 0 ){
      fetch(`https://opentdb.com/api_count.php?category=${category}`)
      .then(res=>res.json())
      .then(data=>setInfo(data.category_question_count))
    }
      
  },[category])
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
    />
  })
  
  function getQuestions(event){
    event.preventDefault();
    if(numberOfQuestions>0){
      fetch(`https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`)
      .then(res=>res.json())
      .then(data=>data.results
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
        }
      )
    )
      setIsActive(true)
    }else{
      alert("enter number of questions")
    } 
  }


  function setAnswer(ans,index){
    if(!isEnded){
      let temp_state = [...questions];
      let temp_element = { ...temp_state[index] };
      temp_element.userSelection = ans;
      temp_state[index] = temp_element;
      setQuestions(temp_state);
    }
  }

  function handleSubmit(event){
    
    if(!isEnded){
      event.preventDefault();  
      questions.map((question,index)=>{
        let temp_state = [...questions];
        let temp_element = {...question}
        temp_element.isCorrectlyAnswered = (temp_element.userSelection===temp_element.correctAnswer);        
        temp_state[index] = temp_element;   
        setQuestions(temp_state);
      })
      setIsEnded(true)
    }else{
      // setIsActive(false)
      // setIsEnded(false)
      // setQuestions([]);
    }
  }

  function handleQuestionAmount(e){
    e.preventDefault()
    let {value} = e.target
    // if(e.target.value>50){
    //   e.target.value=50
    // }
    // if(e.target.value<1){
    //   e.target.value=1
    // }

    if(value<1){
      value=1
    }

    if(value>50){
      value=50
    }

   if(difficulty === "easy"){
      if(value>info.total_easy_question_count){

        value=info.total_easy_question_count      
      }
    }
    else if(difficulty === "medium"){
      if(value>info.total_medium_question_count){

        value=info.total_medium_question_count     
      }   
    }
    else if(difficulty === "hard"){
      if(value>info.total_hard_question_count){

        value=info.total_hard_question_count      
      }
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

  function setElement(){
  if(isActive){
    if(questions.length<=0){
      return <div className="loader-container">
                <div className="loader"></div>
             </div>
    }else{
      return <form className="App" onSubmit={handleSubmit}>
              {question}
              {questions.length>0 && <button className="sbmt-btn" >{ isEnded ? "Play Again" : "Check Answers"}</button>}
              {isEnded && <span className='result-text'>You answered {questions.map(question=>question).filter(question=>question.userSelection===question.correctAnswer).length}/{questions.length} correctly</span>}       
            </form>
  }
  }else{
    return <form className="Main-menu" onSubmit={getQuestions}>

      <h2>?Quizzicle?</h2>

      <label htmlFor="category-select">Choose a Category:</label>
      <select name="category" id="category-select" value={category} onChange={handleCategorySelection}>
          <option value="">Any Category</option>
          <option value="9">General Knowledge</option>
          <option value="10">Entertainment: Books</option>
          <option value="11">Entertainment: Film</option>
          <option value="12">Entertainment: Music</option>
          <option value="13">Entertainment: Musicals & Theatres</option>
          <option value="14">Entertainment: Television</option>
          <option value="15">Entertainment: Video Games</option>
          <option value="16">Entertainment: Board Games</option>
          <option value="17">Science & Nature</option>
          <option value="18">Science: Computers</option>
          <option value="19">Science: Mathematics</option>
          <option value="20">Mythology</option>
          <option value="21">Sports</option>
          <option value="22">Geography</option>
          <option value="23">History</option>
          <option value="24">Politics</option>
          <option value="25">Art</option>
          <option value="26">Celebrities</option>
          <option value="27">Animals</option>
          <option value="28">Vehicles</option>
          <option value="29">Entertainment: Comics</option>
          <option value="30">Science: Gadgets</option>
          <option value="31">Entertainment: Japanese Anime & Manga</option>
          <option value="32">Entertainment: Cartoon & Animations</option>
      </select>

      <label htmlFor="difficulty-select">Choose a Difficulty:</label>
      <select name="difficulty" id="difficulty-select" value={difficulty} onChange={handleDifficultySelection}>
          <option value="">Any Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
      </select>

      <label htmlFor="numofquestions">Enter the number of questions:</label>
      <input type="number" id="numofquestions" onChange={handleQuestionAmount} value={numberOfQuestions}/>

      <button>Play!!!</button>

  </form>
  }
}

  return (
    <div>  
      {setElement()}
      <h4><a href='https://github.com/ceo991/quizzical-app' style={{color:"balck",textDecoration: "none"}}>You can see the source code here</a></h4>
    </div>  
  );
}

export default App;
