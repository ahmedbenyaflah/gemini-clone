/* eslint-disable react/prop-types */
import { createContext, useState, useRef } from "react";
import runChat from "../config/gemini";

// Create a new context to manage shared state
export const Context = createContext();

const ContextProvider = (props) => {
    // State to store the current input text
    const [input, setInput] = useState("");
    
    // State to store the most recent prompt sent
    const [recentPrompt, setRecentPrompt] = useState("");
    
    // State to store all previously sent prompts
    const [prevPrompts, setPrevPrompts] = useState([]);
    
    // State to control the visibility of the result area
    const [showResult, setShowResult] = useState(false);
    
    // State to indicate if a request is currently loading
    const [loading, setLoading] = useState(false);
    
    // State to store the result data from the chat
    const [resultData, setResultData] = useState("");

    // Ref to store timeout IDs for the typing animation
    const timeoutsRef = useRef([]); 

    // Function to add a delay before displaying each word of the response
    const delayPara = (index, nextWord) => {
        const timeoutId = setTimeout(() => {
            // Append the next word to the resultData state
            setResultData((prev) => prev + nextWord);
        }, 100 * index); // Delay each word by 100ms times its index
        
        timeoutsRef.current.push(timeoutId); // Store the timeout ID in the array
    };

    // Function to clear any ongoing typing animations
    const clearTypingAnimation = () => {
        // Clear all timeouts to stop the animation
        timeoutsRef.current.forEach(clearTimeout); 
        
        // Reset the array of timeout IDs
        timeoutsRef.current = []; 
        
        // Clear the result data to reset the display
        setResultData("");
    };

    // Function to handle sending the prompt and receiving a response
    const onSent = async (prompt) => {
        clearTypingAnimation(); // Clear previous animation before starting a new one

        setLoading(true); // Set loading state to true to indicate data fetching
        setShowResult(true); // Ensure that the result area is visible
        
        let response;
        let inputDecoy = input; // Store the current input value before resetting it
        setInput(""); // Clear the input field
        
        
        if (prompt !== undefined) {
            // Add the prompt to the previous prompts if it's not already in the list
            setPrevPrompts((prev) => {
                if (!prev.includes(prompt)) {
                    return [...prev, prompt];
                }
                return prev;
            });
            response = await runChat(prompt); // Get the response for the given prompt
        } else {
            // If prompt is undefined, use the current input value
            setPrevPrompts((prev) => [...prev, inputDecoy]);
            setRecentPrompt(inputDecoy); // Store the recent prompt
            response = await runChat(inputDecoy); // Get the response for the input
        }
        
        // Process the response to format it with bold and line breaks
        let responseArray = response.split("**");
        let newResponse = "";
        for (let i = 0; i < responseArray.length; i++) {
            if (i % 2 === 0) {
                newResponse += responseArray[i]; // Add normal text
            } else {
                newResponse += "<b>" + responseArray[i] + "</b>"; // Add bold text
            }
        }

        // Replace "*" with line breaks
        let newResponse2 = newResponse.split("*").join("</br>");
        
        // Split the response into words for typing animation
        let newResponseArray = newResponse2.split(" ");
        for (let i = 0; i < newResponseArray.length; i++) {
            const nextWord = newResponseArray[i];
            delayPara(i, nextWord + " "); // Delay displaying each word
        }
        setLoading(false); // Set loading state to false after fetching data
    };

    // Function to load and send a saved prompt
    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt); // Update the recent prompt
        await onSent(prompt); // Send the prompt and display the result
    };

    // Context value object to be shared with components
    const contextValue = {
        loadPrompt,
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        setShowResult,
        loading,
        resultData,
        input,
        setInput,
    };

    // Provide the context to children components
    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    );
};

export default ContextProvider;
