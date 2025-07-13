import React, { useState } from "react";
import { Context } from "./context";  
import runChat from "../config/gemini";






export const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

  const onSent = async (prompt) => {
  setResultData("");
  setLoading(true);
  setShowResult(true);

  try {
    let response;
    const currentPrompt = prompt !== undefined ? prompt : input;
    console.log("Sending Prompt:", currentPrompt);

    // Save prompt to previous if not already passed
    if (prompt === undefined) {
      setPrevPrompts((prev) => [...prev, input]);
    }

    setRecentPrompt(currentPrompt);

    // Call Gemini API
    response = await runChat(currentPrompt);
    console.log("Gemini API Response:", response);

    if (!response || typeof response !== "string") {
      throw new Error("Invalid response format");
    }

    // Format response: bold and line breaks
    let responseArray = response.split("**");
    let newResponse = "";

    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i];
      } else {
        newResponse += "<b>" + responseArray[i] + "</b>";
      }
    }

    let newResponse2 = newResponse.split("*").join("</br>");
    let newResponseArray = newResponse2.split(" ");

    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i];
      delayPara(i, nextWord + " ");
    }
  } catch (error) {
    console.error("❌ Error during onSent:", error);
    setResultData("❌ Something went wrong while contacting Gemini.");
  } finally {
    setLoading(false);
    setInput("");
  }
};


  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;