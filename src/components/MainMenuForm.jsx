
import {motion} from "framer-motion"

function MainMenuForm({
  getQuestions,
  category,
  handleCategorySelection,
  difficulty,
  handleDifficultySelection,
  handleQuestionAmount,
  numberOfQuestions,
  categories}) {

  let categoriesArr = [{id:"", name:"Any Category"}, ...categories]
  const opt = categoriesArr.map(category =><option value={category.id} key={category.id}>{category.name}</option>)
  

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  return (
    <motion.div  initial="hidden" animate="visible" variants={variants}>
        <form className="Main-menu" onSubmit={getQuestions}>

        <h2>?Quizzicle?</h2>

        <label htmlFor="category-select">Choose a Category:</label>
        <select name="category" id="category-select" value={category} onChange={handleCategorySelection}>
          {opt}
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

        <button id="play-btn">Play!!!</button>

    </form>
  </motion.div>
  )
}

export default MainMenuForm