import React, { useState } from "react";

export default function Calculator() {
  const [input, setInput] = useState("");

  const handleClick = (val) => {
    if (val === "=") {
      try {
        setInput(eval(input).toString()); // For demo (avoid eval in production)
      } catch {
        setInput("Error");
      }
    } else if (val === "C") {
      setInput("");
    } else {
      setInput(input + val);
    }
  };

  const buttons = ["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+","C"];

  return (
    <div className="p-6 max-w-xs mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Calculator</h1>
      <input value={input} readOnly className="border p-2 w-full mb-4 text-right rounded" />
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((b, i) => (
          <button
            key={i}
            onClick={() => handleClick(b)}
            className="bg-gray-300 p-3 rounded hover:bg-gray-400"
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
}
