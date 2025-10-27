import React, { useContext } from 'react' // Importing React and useContext for accessing context
import "./Main.css" // Importing CSS file for styling
import { assets } from '../../assets/assets' // Importing assets (icons/images)
import { Context } from '../../context/Context' // Importing Context to access shared state

const Main = () => {
    // Destructuring values and functions from the Context
    const { loadPrompt, onSent, recentPrompt, showResult, setShowResult, loading, resultData
        , setInput, input } = useContext(Context)
    
    // Function to handle the 'Enter' key press event
    const handleEnterPress = (event) => {
        if (event.key === 'Enter' && !isInputEmpty) {
            onSent(); // Call onSent function when 'Enter' is pressed and input is not empty
        }
    };

    // Check if the input is empty (trimmed value)
    const isInputEmpty = !input.trim();

    return (
        <div className='main'>
            <div className="nav">
                {/* Title of the app that clears the result and returns to the greeting view when clicked */}
                <p onClick={() => setShowResult(false)} style={{ cursor: "pointer" }}>Gemini</p>
                {/* User icon */}
                <img src={assets.user_icon} alt="" />
            </div>

            <div className="main-container">
                {/* Conditionally render content based on whether a result is being shown */}
                {showResult 
                ? 
                <div className="result">
                    <div className="result-title">
                        {/* User icon and recent prompt displayed */}
                        <img src={assets.user_icon} alt="" />
                        <p>{recentPrompt}</p>
                    </div>
                    <div className="result-data">
                        {/* Gemini icon displayed */}
                        <img src={assets.gemini_icon} alt="" />
                        {/* Display loading animation or the result data */}
                        {  
                        loading ?
                            <div className="loader">
                                <hr />
                                <hr />
                                <hr />
                            </div>
                            :
                            <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                        }
                    </div>
                </div>
                :
                <>
                    {/* Greeting message displayed when no result is shown */}
                    <div className="greet">
                        <p><span>Hello, Ahmed</span></p>
                        <p>How can I help you today?</p>
                    </div>
                    
                    {/* Predefined prompts as cards that can be clicked to load them */}
                    <div className="cards">
                        <div 
                        onClick={() => { loadPrompt("What are some tips to improve public speaking skills for beginners?") }}
                        className="card">
                            <p>What are some tips to improve public speaking skills for beginners?</p>
                            <img src={assets.compass_icon} alt="" />
                        </div>
                        
                        <div 
                        onClick={() => { loadPrompt("I have an orchid and I'm not sure how to care for it. Can you give me some tips?") }}
                        className="card">
                            <p>I have an orchid and I'm not sure how to care for it. Can you give me some tips?</p>
                            <img src={assets.bulb_icon} alt="" />
                        </div>
                        
                        <div 
                        onClick={() => { loadPrompt("Recommend 3-5 different types of water sports that might be a good fit for me.") }}
                        className="card">
                            <p>Recommend 3-5 different types of water sports that might be a good fit for me.</p>
                            <img src={assets.message_icon} alt="" />
                        </div>
                        
                        <div 
                        onClick={() => { loadPrompt("Suggest Python libraries I should use if I want to perform a k-means clustering analysis on a dataset") }}
                        className="card">
                            <p>Suggest Python libraries I should use if I want to perform a k-means clustering analysis on a dataset</p>
                            <img src={assets.code_icon} alt="" />
                        </div>
                    </div>
                </>
                }

                {/* Bottom section with input box and buttons */}
                <div className="main-bottom">
                    <div className="search-box">
                        {/* Input field for entering a prompt */}
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => (setInput(e.target.value))} // Update input value on change
                            onKeyDown={handleEnterPress} // Handle 'Enter' key press
                            placeholder="Enter a prompt here"
                        />
                        <div>
                            {/* Icons for gallery, microphone, and send action */}
                            <img src={assets.gallery_icon} alt="Gallery" />
                            <img src={assets.mic_icon} alt="Mic" />
                            <img
                                onClick={() => { !isInputEmpty && onSent() }} // Send input when send icon is clicked
                                src={assets.send_icon}
                                style={{ 
                                    opacity: isInputEmpty ? 0.5 : 1, // Adjust opacity based on whether input is empty
                                    pointerEvents: isInputEmpty ? 'none' : 'auto' // Disable click if input is empty
                                }}
                                alt="Send"
                            />
                        </div>
                    </div>

                    {/* Disclaimer message at the bottom */}
                    <p className="bottom-info">
                        Gemini may display inaccurate info, including about people, so double-check its responses. Your privacy & Gemini Apps
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Main
