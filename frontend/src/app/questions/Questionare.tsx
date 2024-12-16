import React, { useState } from "react";
import questions from "./../../lib/questions.js";
import { Button } from "@/components/ui/button.js";
import { ChevronRight } from "lucide-react";
function Questionare() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const currentQuestion = questions[currentIndex];
  const handleChoiceSelect = (choice: string) => {
    const index = currentIndex + 1;
    setAnswers((prev) => ({ ...prev, ["choice" + index]: choice }));
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleQuestions = () => {
    console.log(answers);
  };

  return (
    <div className="px-4 py-4 ">
      {" "}
      <Button
        variant="outline"
        size="icon"
        className="border-0 rotate-180 w-fit mb-6"
        onClick={handleBack}
      >
        <ChevronRight className="!w-6 !h-6" />
      </Button>
      <h2 className="font-bold text-[20px] mb-2">{currentQuestion.question}</h2>
      <p className="text-[14px]">
        Your account has been successfully created. Let's make your community
        better together.
      </p>
      <div className="mt-12 grid grid-cols-2 grid-rows-2 gap-4">
        {currentQuestion.choices.map((choice: string, index: number) => (
          <button
            key={index}
            onClick={() => handleChoiceSelect(choice)}
            className="choice-button  h-[78px] rounded-[6px] border border-[##E5E7EB] shadow-[0_4px_4px_0_rgba(174,174,174,0.25)] py-3 px-3 flex items-center justify-between"
          >
            {choice}
          </button>
        ))}
      </div>
      <div>
        {currentIndex === questions.length - 1 &&
          Object.keys(answers).length == 8 && (
            <Button
              className="bg-black text-white w-full rounded-[124px] border-[1px] border-black mt-4"
              onClick={handleQuestions}
            >
              Confirm Now
            </Button>
          )}
      </div>
    </div>
  );
}

export default Questionare;
