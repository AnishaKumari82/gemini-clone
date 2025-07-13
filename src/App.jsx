import React from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Main from './components/Main/Main'
import runChat from './config/gemini'

// For Vite projects, use import.meta.env; for Create React App, use process.env
const apiKey = import.meta.env.VITE_API_KEY;


const App = () => {

  const handleRunChat = async () => {
    const response = await runChat("Hello Gemini!", apiKey);
    console.log(response);
  };

  return (
    <>
      <Sidebar />
      <Main onRunChat={handleRunChat} />
    </>
  );
}

export default App;
