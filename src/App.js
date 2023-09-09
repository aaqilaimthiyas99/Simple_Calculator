import React, { useReducer } from 'react'
import DigitButtons from './DigitButtons'
import OperationButton from './OperationButton'
import "./styles.css"

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operarion',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer (state, {type, payload}) { //breaking the action into type and payload. We are going to have different types of those actions and those actions are going to pass some parameters
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return{
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) { //It uses the includes method to search for the dot in the currentOperand
        return state  
      }

      return { //normal update operation
        ...state,
        currentOperand: `${state.currentOperand  ||  ""}${payload.digit}`,
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.currentOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      if (state.previousOperand == null)
      return {
        ...state,
        operation: payload.operation,
        previousOperand: state.currentOperand,
        currentOperand: null
      }
      return{
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null
      }

    case ACTIONS.CLEAR:
      return {}
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return{
          ...state,
          overwrite: false,
          currentOperand: null
        }
      }
      if(state.currentOperand == null)
      return state
      if (state.currentOperand.length === 1) {
        return {...state, currentOperand: null}
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state)
      }
  }
}

function evaluate({currentOperand, previousOperand, operation}){
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)  //parsing a variable named currentOperand and converting its value to a floating-point number using the parseFloat function
  if (isNaN(prev) || isNaN(current)) return ""  //The code snippet you provided checks if either prev or current is not a valid number using the isNaN function
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

export default function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})  //useReducer going to take function as reducer and {} the default state which is the empty object for now
  return (
    <>
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
          <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})}> AC </button>
      
      <button  onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}> DEL </button>
      
      <OperationButton operation= "÷" dispatch={dispatch}/>
      <DigitButtons digit= "1" dispatch={dispatch}/>
      <DigitButtons digit= "2" dispatch={dispatch}/>
      <DigitButtons digit= "3" dispatch={dispatch}/>
      <OperationButton operation= "*" dispatch={dispatch}/>
      <DigitButtons digit= "4" dispatch={dispatch}/>
      <DigitButtons digit= "5" dispatch={dispatch}/>
      <DigitButtons digit= "6" dispatch={dispatch}/>
      <OperationButton operation= "+" dispatch={dispatch}/>
      <DigitButtons digit= "7" dispatch={dispatch}/>
      <DigitButtons digit= "8" dispatch={dispatch}/>
      <DigitButtons digit= "9" dispatch={dispatch}/>
      <OperationButton operation= "-" dispatch={dispatch}/>
      <DigitButtons digit= "." dispatch={dispatch}/>
      <DigitButtons digit= "0" dispatch={dispatch}/>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}> = </button>
    </div>
    </>
  )
}