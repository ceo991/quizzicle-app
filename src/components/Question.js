import './Question.css'
import { v4 as uuidv4 } from 'uuid';
import He from "he"

function Question(props){

    
    const ans = props.answers.map((answer)=>{
        let styleProp = ""
        if(props.isEnded){
            if(props.userSelection !== ""){
                if(props.isCorrect){
                    styleProp = (props.userSelection === answer) ? "green" : "lightgray"
                }else{
                    if(props.correctAnswer===answer){
                        styleProp = "green"
                    }else if(props.userSelection === answer){
                        styleProp = "#e4717a"
                    }else{
                        styleProp = "lightgray"
                    }
              }
            }else{              
               styleProp = (props.correctAnswer===answer) ? "red":"lightgray"                
            }
        }else{
            styleProp = (props.userSelection===answer ) ? "dodgerblue" : ""
        }
        let style={
            backgroundColor: styleProp,
            cursor: props.isEnded ? "default" :'', 
            border: props.isEnded ? " 1px solid black" :'' 
        }

        return (
            <div className="answer" key = {uuidv4()} style={style} 
            onClick = {()=> props.click(answer,props.index) }>
                 {He.decode(answer)} 
            </div> 
        )
    })

    return(
        <div className="question-container">
            <h2 className="question" >{He.decode(props.question)}</h2>
            <div className="answers-container">
                {ans}
            </div>
            <hr />
        </div>
    )
}

export default Question
