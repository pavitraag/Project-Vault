import React, { useState } from "react";

const questions = [
  { q: "What is the capital of France?", options: ["Berlin", "Paris", "Madrid"], answer: "Paris" },
  { q: "Which language is used in React?", options: ["Python", "JavaScript", "C++"], answer: "JavaScript" },
  { q: "Who developed React?", options: ["Google", "Facebook", "Microsoft"], answer: "Facebook" }
];

export default function QuizApp() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (option) => {
    if (option === questions[current].answer) setScore(score + 1);
    if (current + 1 < questions.length) setCurrent(current + 1);
    else setFinished(true);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quiz App</h1>
      {!finished ? (
        <div>
          <h2 className="mb-2">{questions[current].q}</h2>
          <div className="flex flex-col gap-2">
            {questions[current].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <h2 className="text-xl font-semibold">Your Score: {score}/{questions.length}</h2>
      )}
    </div>
  );
}
