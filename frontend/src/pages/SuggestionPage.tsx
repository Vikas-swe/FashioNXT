'use client'

import React, { useState } from 'react'
import { ArrowLeft, Shirt, Tally2Icon as Tie, Palmtree, Dumbbell, Wine, Mic, Send, Loader } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from 'react-router-dom'
import { sendUserPreference, sendUserPreferenceAI } from '@/apiService'
import UserContext, { UserMeta } from '@/context/userContext'
import { cn } from '@/lib/utils'

const questions = [
  {
    'question' : 'What’s the Occasion?',
    'description': 'Choose the occasion to get outfit suggestions tailored to your activity.',
    'choices' : ['Formal Event', 'Casual Outing', 'Beach Day', 'Workout', 'Party'],
    'key': 'occasion',
  },
  {
    'question' : 'What\'s Your Style?',
    'description': 'Choose the style that best describes your fashion sense.',
    'choices' : ['Traditional', 'Modern', 'Sporty', 'Minimalist', 'Experimental'],
    'key': 'style',
  },
  {
    'question' : 'How Do You Want to Feel?',
    'description': 'Choose the feeling you want your outfit to convey.',
    'choices' : ['Elegant', 'Relaxed', 'Bold'],
    'key': 'feel',
  }

]

export default function SuggestionPage() {
  const [inputValue, setInputValue] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const {userData} = React.useContext(UserContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const {userMeta, refetch} = React.useContext(UserMeta);

  function saveAnswers(question,choice){
    setAnswers({...answers, [question.key]: choice})
    if(currentQuestion < questions.length - 1){
      setCurrentQuestion(currentQuestion + 1)
    }
    else{
      // Send the answers to the backend
      console.log({...answers, [question.key]: choice})
      savePreferences({...answers, [question.key]: choice});
      navigate('/products')
    }
  }

  async function savePreferences(reqData){
    setLoading(true)
    await sendUserPreference(reqData,userData.id)
    refetch(userData.id)
    setLoading(false)
    navigate('/products')
  }

  async function saveAIPreferences(){
    setLoading(true)
    await sendUserPreferenceAI(inputValue,userData.id)
    refetch(userData.id)
    setLoading(false)
    navigate('/products')
  }


  return (
    <div className="min-h-screen bg-white p-4 max-w-md mx-auto relative lg:max-w-2xl md:max-w-xl">
      {/* Header */}
        <Loader size={100} className={cn('absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2', { 'hidden': !loading })} />

      <button className="p-2 hover:bg-gray-100 rounded-full" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-6 w-6" />
      </button>
      
      <div className="mt-6 space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">{questions[currentQuestion].question}</h1>
        <p className="text-gray-600 text-sm">
          {questions[currentQuestion].description}
        </p>
      </div>

      {/* Occasion Cards */}
      <div className="mt-8 grid grid-cols-2 gap-4 pb-20">
      {
        questions[currentQuestion].choices.map((choice, index) => (
          <Card className="p-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => {saveAnswers(questions[currentQuestion],choice)}}>
            <div className="w-6 h-6 flex-shrink-0">
              {/* <Shirt className="w-full h-full" /> */}
            </div>
            <span className="text-sm font-medium">{choice}</span>
          </Card>
        ))
      }
      </div>
          
        
      
      

      {/* Search Bar */}
      <div className="fixed bottom-4 left-4 right-4 max-w-md mx-auto">
        <div className="relative">
          <Input 
            placeholder="Try StyleMate"
            className="w-full pl-4 pr-24 py-6 text-lg rounded-full border-2 border-gray-200"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2">
            {/* {inputValue && (
              <Button 
                size="icon"
                variant="ghost" 
                className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <Send className="h-5 w-5 text-gray-600" />
              </Button>
            )} */}
            
              <Button 
                size="icon"
                variant="ghost" 
                className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300"
                disabled={!inputValue}
                onClick={() => saveAIPreferences()}
              >
                <Send className="h-5 w-5 text-gray-600" />
              </Button>
            
            {/* {
                !inputValue && (
                    <Button 
              size="icon"
              variant="ghost" 
              className="h-10 w-10 rounded-full bg-gray-900 hover:bg-gray-800"
            >
              <Mic className="h-5 w-5 text-white" />
            </Button>
                )
            } */}
            
          </div>
        </div>
      </div>
    </div>
  )
}

