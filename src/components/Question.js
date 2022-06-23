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
            styleProp = (props.userSelection===answer ) ? "rgb(175, 203, 230)" : ""
        }
        let style={
            backgroundColor: styleProp,
            cursor: props.isEnded ? "default" :'', 
         
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
            <h2 className="question" >{props.index+1}- {He.decode(props.question)}</h2>
            <div className="answers-container">
                {ans}
            </div>
        </div>
    )
}

export default Question
