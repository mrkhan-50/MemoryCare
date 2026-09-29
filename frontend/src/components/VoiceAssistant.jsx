import {
  useEffectEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";


// ==========================================
// VOICE ASSISTANT
// ==========================================

function VoiceAssistant() {

  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [language, setLanguage] =
    useState("en-IN");

  const [listening, setListening] =
    useState(false);

  const [text, setText] =
    useState("");

  const [statusMessage, setStatusMessage] =
    useState("");

  const [supported] = useState(() =>
    typeof window !== "undefined" &&
    Boolean(
      window.SpeechRecognition ||
        window.webkitSpeechRecognition
    )
  );

  const recognitionRef =
    useRef(null);


  // ==========================================
  // TEXT
  // ==========================================

  const messages = {

    "en-IN": {

      title: "Voice Assistant",

      subtitle:
        "Speak naturally and MemoryCare will listen.",

      start:
        "Start Listening",

      stop:
        "Stop Listening",

      speak:
        "Speak",

      placeholder:
        "Your spoken words will appear here...",

      ready:
        "Ready",

      listening:
        "Listening...",

      processing:
        "Processing your command...",

      welcome:
        "Hello! I am your MemoryCare voice assistant. How can I help you today?",

      unsupported:
        "Your browser does not support voice recognition. Please use Google Chrome or Microsoft Edge.",

      microphoneError:
        "Please allow microphone access and try again.",

      unknown:
        "Sorry, I did not understand that command.",

      help:
        "You can say: start memory game, show my progress, show my reminders, or open dashboard.",

      memoryGame:
        "Opening the memory game.",

      progress:
        "Opening your progress.",

      reminders:
        "Opening your reminders.",

      dashboard:
        "Opening your dashboard.",

    },


    "hi-IN": {

      title:
        "वॉइस असिस्टेंट",

      subtitle:
        "स्वाभाविक रूप से बोलें और MemoryCare आपकी बात सुनेगा।",

      start:
        "सुनना शुरू करें",

      stop:
        "सुनना बंद करें",

      speak:
        "बोलें",

      placeholder:
        "आपके बोले हुए शब्द यहाँ दिखाई देंगे...",

      ready:
        "तैयार",

      listening:
        "सुन रहा हूँ...",

      processing:
        "आपकी कमांड समझी जा रही है...",

      welcome:
        "नमस्ते! मैं आपका MemoryCare वॉइस असिस्टेंट हूँ। मैं आपकी कैसे मदद कर सकता हूँ?",

      unsupported:
        "आपका ब्राउज़र वॉइस रिकग्निशन को सपोर्ट नहीं करता। कृपया Google Chrome या Microsoft Edge का उपयोग करें।",

      microphoneError:
        "कृपया माइक्रोफोन की अनुमति दें और फिर से प्रयास करें।",

      unknown:
        "माफ कीजिए, मैं इस कमांड को समझ नहीं पाया।",

      help:
        "आप कह सकते हैं: मेमोरी गेम शुरू करो, मेरी प्रगति दिखाओ, रिमाइंडर दिखाओ या डैशबोर्ड खोलो।",

      memoryGame:
        "मेमोरी गेम खोला जा रहा है।",

      progress:
        "आपकी प्रगति खोली जा रही है।",

      reminders:
        "आपके रिमाइंडर खोले जा रहे हैं।",

      dashboard:
        "आपका डैशबोर्ड खोला जा रहा है।",

    },

  };


  const currentText =
    messages[language] ||
    messages["en-IN"];


  // ==========================================
  // SPEAK TEXT
  // ==========================================

  const speakText = (message) => {

    if (
      !window.speechSynthesis
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(
        message
      );

    speech.lang =
      language;

    speech.rate =
      0.85;

    speech.pitch =
      1;

    speech.volume =
      1;

    window.speechSynthesis.speak(
      speech
    );
  };


  // ==========================================
  // VOICE COMMAND HANDLER
  // ==========================================

  const handleVoiceCommand = useEffectEvent(
    (command) => {

      const commandText =
        command
          .toLowerCase()
          .trim();


      if (!commandText) {
        return;
      }


      setStatusMessage(
        currentText.processing
      );


      // ======================================
      // MEMORY GAME
      // ======================================

      if (

        commandText.includes(
          "memory game"
        ) ||

        commandText.includes(
          "memory match"
        ) ||

        commandText.includes(
          "play game"
        ) ||

        commandText.includes(
          "start game"
        ) ||

        commandText.includes(
          "मेमोरी गेम"
        ) ||

        commandText.includes(
          "मेमोरी मैच"
        ) ||

        commandText.includes(
          "गेम शुरू"
        )

      ) {

        setStatusMessage(
          currentText.memoryGame
        );

        speakText(
          currentText.memoryGame
        );

        setTimeout(() => {

          navigate(
            "/games/memory-match"
          );

        }, 1200);

        return;
      }


      // ======================================
      // PROGRESS
      // ======================================

      if (

        commandText.includes(
          "progress"
        ) ||

        commandText.includes(
          "my progress"
        ) ||

        commandText.includes(
          "performance"
        ) ||

        commandText.includes(
          "प्रगति"
        ) ||

        commandText.includes(
          "मेरी प्रगति"
        )

      ) {

        setStatusMessage(
          currentText.progress
        );

        speakText(
          currentText.progress
        );

        setTimeout(() => {

          navigate(
            "/patient"
          );

        }, 1200);

        return;
      }


      // ======================================
      // REMINDERS
      // ======================================

      if (

        commandText.includes(
          "reminder"
        ) ||

        commandText.includes(
          "reminders"
        ) ||

        commandText.includes(
          "medicine"
        ) ||

        commandText.includes(
          "medicines"
        ) ||

        commandText.includes(
          "दवाई"
        ) ||

        commandText.includes(
          "दवा"
        ) ||

        commandText.includes(
          "रिमाइंडर"
        )

      ) {

        setStatusMessage(
          currentText.reminders
        );

        speakText(
          currentText.reminders
        );

        setTimeout(() => {

          navigate(
            "/patient"
          );

        }, 1200);

        return;
      }


      // ======================================
      // DASHBOARD
      // ======================================

      if (

        commandText.includes(
          "dashboard"
        ) ||

        commandText.includes(
          "home"
        ) ||

        commandText.includes(
          "go back"
        ) ||

        commandText.includes(
          "डैशबोर्ड"
        ) ||

        commandText.includes(
          "होम"
        )

      ) {

        setStatusMessage(
          currentText.dashboard
        );

        speakText(
          currentText.dashboard
        );

        setTimeout(() => {

          navigate(
            "/patient"
          );

        }, 1200);

        return;
      }


      // ======================================
      // HELP
      // ======================================

      if (

        commandText.includes(
          "help"
        ) ||

        commandText.includes(
          "what can you do"
        ) ||

        commandText.includes(
          "मदद"
        ) ||

        commandText.includes(
          "क्या कर सकते"
        )

      ) {

        setStatusMessage(
          currentText.help
        );

        speakText(
          currentText.help
        );

        return;
      }


      // ======================================
      // UNKNOWN COMMAND
      // ======================================

      setStatusMessage(
        currentText.unknown
      );

      speakText(
        currentText.unknown
      );

    }
  );


  // ==========================================
  // CREATE SPEECH RECOGNITION
  // ==========================================

  useEffect(() => {

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;


    // ----------------------------------------
    // CHECK SUPPORT
    // ----------------------------------------

    if (!SpeechRecognition) {
      return;

    }


    // ----------------------------------------
    // CREATE RECOGNITION
    // ----------------------------------------

    const recognition =
      new SpeechRecognition();


    recognition.continuous =
      false;

    recognition.interimResults =
      true;

    recognition.lang =
      language;


    // ----------------------------------------
    // ON START
    // ----------------------------------------

    recognition.onstart = () => {

      setListening(true);

      setStatusMessage(
        currentText.listening
      );

    };


    // ----------------------------------------
    // ON RESULT
    // ----------------------------------------

    recognition.onresult =
      (event) => {

        let transcript =
          "";

        for (
          let i =
            event.resultIndex;

          i <
            event.results.length;

          i++
        ) {

          transcript +=
            event.results[i][0]
              .transcript;

        }


        setText(
          transcript
        );


        // Only process final speech
        const lastResult =
          event.results[
            event.results.length - 1
          ];


        if (
          lastResult &&
          lastResult.isFinal
        ) {

          handleVoiceCommand(
            transcript
          );

        }

      };


    // ----------------------------------------
    // ON END
    // ----------------------------------------

    recognition.onend = () => {

      setListening(false);

    };


    // ----------------------------------------
    // ON ERROR
    // ----------------------------------------

    recognition.onerror =
      (event) => {

        console.error(
          "Speech recognition error:",
          event.error
        );


        setListening(false);


        if (
          event.error ===
            "not-allowed" ||

          event.error ===
            "permission-denied"
        ) {

          setStatusMessage(
            currentText.microphoneError
          );

          return;

        }


        if (
          event.error ===
          "no-speech"
        ) {

          setStatusMessage(
            "No speech detected. Please try again."
          );

          return;

        }


        setStatusMessage(
          "Voice recognition error. Please try again."
        );

      };


    recognitionRef.current =
      recognition;


    // ----------------------------------------
    // CLEANUP
    // ----------------------------------------

    return () => {

      try {

        recognition.stop();

      } catch (error) {

        console.log(
          "Recognition cleanup:",
          error
        );

      }

      recognitionRef.current =
        null;

    };

  }, [
    language,
    currentText.listening,
    currentText.microphoneError,
  ]);


  // ==========================================
  // START LISTENING
  // ==========================================

  const startListening = () => {

    if (
      !recognitionRef.current
    ) {

      setStatusMessage(
        currentText.unsupported
      );

      return;

    }


    try {

      setText("");

      setStatusMessage(
        currentText.listening
      );


      recognitionRef.current.lang =
        language;


      recognitionRef.current.start();

    } catch (error) {

      console.error(
        "Unable to start recognition:",
        error
      );

    }

  };


  // ==========================================
  // STOP LISTENING
  // ==========================================

  const stopListening = () => {

    if (
      !recognitionRef.current
    ) {
      return;
    }


    try {

      recognitionRef.current.stop();

    } catch (error) {

      console.error(
        "Unable to stop recognition:",
        error
      );

    }

  };


  // ==========================================
  // SPEAK CURRENT TEXT
  // ==========================================

  const speakCurrentText = () => {

    if (!text.trim()) {

      speakText(
        currentText.welcome
      );

      return;

    }


    speakText(
      text
    );

  };


  // ==========================================
  // UNSUPPORTED BROWSER
  // ==========================================

  if (!supported) {

    return (

      <div
        style={unsupportedCard}
      >

        <div
          style={largeIcon}
        >
          🎤
        </div>


        <h2>
          Voice Recognition Not Available
        </h2>


        <p>
          {currentText.unsupported}
        </p>

      </div>

    );

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div style={card}>

      {/* HEADER */}

      <div style={header}>

        <div style={iconBox}>
          🎤
        </div>


        <div>

          <h2 style={title}>
            {currentText.title}
          </h2>


          <p style={subtitle}>
            {currentText.subtitle}
          </p>

        </div>

      </div>


      {/* LANGUAGE */}

      <div
        style={languageSection}
      >

        <label style={label}>
          Language
        </label>


        <select
          value={language}
          onChange={(event) => {

            setLanguage(
              event.target.value
            );

            setText("");

            setStatusMessage("");

          }}
          style={select}
        >

          <option value="en-IN">
            🇮🇳 English
          </option>


          <option value="hi-IN">
            🇮🇳 हिंदी
          </option>

        </select>

      </div>


      {/* STATUS */}

      <div
        style={{
          ...status,

          ...(listening
            ? listeningStatus
            : {}),
        }}
      >

        {listening ? (

          <>
            <span
              style={pulse}
            >
              🔴
            </span>

            {currentText.listening}
          </>

        ) : (

          <>
            🟢 {currentText.ready}
          </>

        )}

      </div>


      {/* SPOKEN TEXT */}

      <div style={textBox}>

        {text ? (

          <span>
            {text}
          </span>

        ) : (

          <span
            style={placeholder}
          >
            {currentText.placeholder}
          </span>

        )}

      </div>


      {/* COMMAND RESULT */}

      {statusMessage && (

        <div
          style={commandBox}
        >

          🤖{" "}

          {statusMessage}

        </div>

      )}


      {/* CONTROLS */}

      <div style={controls}>

        {!listening ? (

          <button
            onClick={
              startListening
            }
            style={listenButton}
          >

            🎤{" "}
            {currentText.start}

          </button>

        ) : (

          <button
            onClick={
              stopListening
            }
            style={stopButton}
          >

            ⏹{" "}
            {currentText.stop}

          </button>

        )}


        <button
          onClick={
            speakCurrentText
          }
          disabled={
            !text.trim()
          }
          style={{
            ...speakButton,

            opacity:
              text.trim()
                ? 1
                : 0.5,
          }}
        >

          🔊{" "}
          {currentText.speak}

        </button>

      </div>


      {/* COMMAND HELP */}

      <div style={helpBox}>

        <strong>
          💡 Try saying:
        </strong>


        <ul
          style={commandList}
        >

          <li>
            "Start memory game"
          </li>

          <li>
            "Show my progress"
          </li>

          <li>
            "Show my reminders"
          </li>

          <li>
            "Open dashboard"
          </li>

          <li>
            "Help"
          </li>

        </ul>

      </div>

    </div>

  );
}


// ==========================================
// STYLES
// ==========================================

const card = {
  background: "white",
  borderRadius: "22px",
  padding: "25px",
  boxShadow:
    "0 8px 30px rgba(0,0,0,0.06)",
  marginTop: "25px",
};


const header = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};


const iconBox = {
  width: "55px",
  height: "55px",
  borderRadius: "16px",
  background: "#dbeafe",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
};


const title = {
  margin: 0,
  fontSize: "22px",
  color: "#172554",
};


const subtitle = {
  margin: "5px 0 0",
  color: "#64748b",
  fontSize: "14px",
};


const languageSection = {
  marginTop: "20px",
};


const label = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "7px",
  color: "#334155",
};


const select = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border:
    "1px solid #cbd5e1",
  fontSize: "15px",
  background: "white",
};


const status = {
  marginTop: "18px",
  padding: "10px 14px",
  borderRadius: "10px",
  background: "#f0fdf4",
  color: "#166534",
  fontWeight: "bold",
  textAlign: "center",
};


const listeningStatus = {
  background: "#fef2f2",
  color: "#991b1b",
};


const pulse = {
  marginRight: "7px",
};


const textBox = {
  marginTop: "15px",
  minHeight: "90px",
  padding: "18px",
  borderRadius: "14px",
  background: "#f8fafc",
  border:
    "1px solid #e2e8f0",
  fontSize: "17px",
  lineHeight: "1.6",
};


const placeholder = {
  color: "#94a3b8",
};


const commandBox = {
  marginTop: "12px",
  padding: "13px",
  borderRadius: "10px",
  background: "#eff6ff",
  color: "#1e40af",
  fontSize: "14px",
  fontWeight: "600",
};


const controls = {
  display: "flex",
  gap: "10px",
  marginTop: "15px",
  flexWrap: "wrap",
};


const listenButton = {
  flex: 1,
  border: "none",
  background: "#2563eb",
  color: "white",
  padding: "13px",
  borderRadius: "11px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
};


const stopButton = {
  flex: 1,
  border: "none",
  background: "#dc2626",
  color: "white",
  padding: "13px",
  borderRadius: "11px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
};


const speakButton = {
  flex: 1,
  border: "none",
  background: "#16a34a",
  color: "white",
  padding: "13px",
  borderRadius: "11px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
};


const helpBox = {
  marginTop: "17px",
  padding: "14px",
  background: "#eff6ff",
  color: "#475569",
  borderRadius: "10px",
  fontSize: "13px",
};


const commandList = {
  marginTop: "8px",
  marginBottom: 0,
  paddingLeft: "20px",
  lineHeight: "1.8",
};


const unsupportedCard = {
  background: "white",
  borderRadius: "20px",
  padding: "35px",
  textAlign: "center",
  boxShadow:
    "0 8px 30px rgba(0,0,0,0.06)",
};


const largeIcon = {
  fontSize: "50px",
};


export default VoiceAssistant;