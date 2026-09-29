import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:5000";


// ==========================================
// QUESTION BANK
// ==========================================

const QUESTIONS = [

  // EASY
  {
    difficulty: "easy",
    sequence: [2, 4, 6],
    answer: 8,
    options: [7, 8, 9, 10],
  },

  {
    difficulty: "easy",
    sequence: [5, 10, 15],
    answer: 20,
    options: [18, 20, 25, 30],
  },

  {
    difficulty: "easy",
    sequence: [10, 20, 30],
    answer: 40,
    options: [35, 40, 45, 50],
  },


  // MEDIUM
  {
    difficulty: "medium",
    sequence: [3, 6, 12],
    answer: 24,
    options: [18, 20, 24, 30],
  },

  {
    difficulty: "medium",
    sequence: [2, 6, 18],
    answer: 54,
    options: [36, 42, 54, 60],
  },

  {
    difficulty: "medium",
    sequence: [4, 8, 16],
    answer: 32,
    options: [24, 28, 32, 36],
  },


  // HARD
  {
    difficulty: "hard",
    sequence: [1, 4, 9],
    answer: 16,
    options: [12, 15, 16, 18],
  },

  {
    difficulty: "hard",
    sequence: [2, 5, 10],
    answer: 17,
    options: [15, 16, 17, 20],
  },

  {
    difficulty: "hard",
    sequence: [3, 7, 15],
    answer: 31,
    options: [25, 27, 31, 35],
  },

];


// ==========================================
// COMPONENT
// ==========================================

function NumberSequence() {

  const navigate = useNavigate();


  // ========================================
  // STATE
  // ========================================

  const [questionIndex, setQuestionIndex] =
    useState(0);

  const [score, setScore] =
    useState(0);

  const [attempts, setAttempts] =
    useState(0);

  const [correctAnswers, setCorrectAnswers] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState(null);

  const [finished, setFinished] =
    useState(false);

  const [startTime] =
    useState(Date.now());

  const [timeTaken, setTimeTaken] =
    useState(0);

  const [saving, setSaving] =
    useState(false);

  const [saveMessage, setSaveMessage] =
    useState("");

  const [gameStarted, setGameStarted] =
    useState(false);


  // ========================================
  // CURRENT QUESTION
  // ========================================

  const question =
    QUESTIONS[questionIndex];


  // ========================================
  // START GAME
  // ========================================

  const startGame = () => {

    setGameStarted(true);

  };


  // ========================================
  // ANSWER QUESTION
  // ========================================

  const handleAnswer = (answer) => {

    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(answer);

    setAttempts(
      (previous) =>
        previous + 1
    );


    if (
      answer === question.answer
    ) {

      setScore(
        (previous) =>
          previous + 10
      );

      setCorrectAnswers(
        (previous) =>
          previous + 1
      );

    }


    setTimeout(() => {

      if (
        questionIndex <
        QUESTIONS.length - 1
      ) {

        setQuestionIndex(
          (previous) =>
            previous + 1
        );

        setSelectedAnswer(null);

      } else {

        const finalTime =
          Math.floor(
            (Date.now() - startTime) /
              1000
          );

        setTimeTaken(
          finalTime
        );

        setFinished(true);

      }

    }, 900);

  };


  // ========================================
  // SAVE RESULT
  // ========================================

  const saveResult = async () => {

    setSaving(true);
    setSaveMessage("");

    try {

      const storedUser =
        localStorage.getItem("user");


      if (!storedUser) {

        setSaveMessage(
          "Please login again to save your result."
        );

        setSaving(false);

        return;
      }


      const user =
        JSON.parse(storedUser);


      const response =
        await fetch(
          `${API_URL}/api/game-results`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              user_id:
                user.id,

              game_name:
                "Number Sequence",

              score:
                score,

              attempts:
                attempts,

              time_taken:
                timeTaken,

              matches:
                correctAnswers,

            }),

          }
        );


      const data =
        await response.json();


      if (!response.ok || !data.success) {

        throw new Error(
          data.message ||
          "Unable to save result."
        );

      }


      setSaveMessage(
        "✅ Result saved successfully!"
      );

    } catch (error) {

      console.error(
        "Save result error:",
        error
      );

      setSaveMessage(
        "⚠️ Unable to save result."
      );

    } finally {

      setSaving(false);

    }

  };


  // ========================================
  // SAVE WHEN GAME FINISHES
  // ========================================

  useEffect(() => {

    if (finished) {

      saveResult();

    }

  }, [finished]);


  // ========================================
  // START SCREEN
  // ========================================

  if (!gameStarted) {

    return (

      <div style={page}>

        <div style={card}>

          <div style={gameIcon}>
            🔢
          </div>

          <h1 style={title}>
            Number Sequence
          </h1>

          <p style={description}>

            Complete the number sequence
            by selecting the correct number.

          </p>


          <div style={instructionBox}>

            <strong>
              How to play
            </strong>

            <p>
              Look carefully at the numbers
              and find the pattern.
            </p>

            <p>
              Take your time and choose the
              number that comes next.
            </p>

          </div>


          <button
            onClick={startGame}
            style={primaryButton}
          >
            ▶ Start Game
          </button>


          <button
            onClick={() =>
              navigate("/patient")
            }
            style={secondaryButton}
          >
            ← Back to Dashboard
          </button>

        </div>

      </div>

    );

  }


  // ========================================
  // FINISHED SCREEN
  // ========================================

  if (finished) {

    return (

      <div style={page}>

        <div style={card}>

          <div style={gameIcon}>
            🎉
          </div>


          <h1 style={title}>
            Great Job!
          </h1>


          <p style={description}>
            You completed the Number Sequence game.
          </p>


          <div style={resultGrid}>

            <div style={resultBox}>

              <span>
                ⭐
              </span>

              <strong>
                {score}
              </strong>

              <small>
                Score
              </small>

            </div>


            <div style={resultBox}>

              <span>
                ✅
              </span>

              <strong>
                {correctAnswers}
              </strong>

              <small>
                Correct
              </small>

            </div>


            <div style={resultBox}>

              <span>
                ⏱️
              </span>

              <strong>
                {timeTaken}s
              </strong>

              <small>
                Time
              </small>

            </div>

          </div>


          <div style={saveBox}>
            {saving
              ? "Saving result..."
              : saveMessage}
          </div>


          <button
            onClick={() =>
              navigate("/patient")
            }
            style={primaryButton}
          >
            🏠 Back to Dashboard
          </button>

        </div>

      </div>

    );

  }


  // ========================================
  // GAME SCREEN
  // ========================================

  return (

    <div style={page}>

      <div style={gameContainer}>

        {/* HEADER */}

        <div style={gameHeader}>

          <button
            onClick={() =>
              navigate("/patient")
            }
            style={backButton}
          >
            ← Dashboard
          </button>


          <div style={headerStats}>

            <span>
              ⭐ {score}
            </span>

            <span>
              🧩 {questionIndex + 1}/
              {QUESTIONS.length}
            </span>

          </div>

        </div>


        {/* TITLE */}

        <div style={gameTitleSection}>

          <div style={smallIcon}>
            🔢
          </div>

          <div>

            <h1 style={gameTitle}>
              Number Sequence
            </h1>

            <p style={difficulty}>
              Difficulty:{" "}
              <strong>
                {question.difficulty}
              </strong>
            </p>

          </div>

        </div>


        {/* QUESTION */}

        <div style={questionCard}>

          <p style={questionText}>
            What number comes next?
          </p>


          <div style={sequence}>

            {question.sequence.map(
              (number, index) => (

                <React.Fragment
                  key={index}
                >

                  <div
                    style={numberBox}
                  >
                    {number}
                  </div>

                  <span style={arrow}>
                    →
                  </span>

                </React.Fragment>

              )
            )}


            <div style={questionMark}>
              ?
            </div>

          </div>

        </div>


        {/* OPTIONS */}

        <div style={optionsGrid}>

          {question.options.map(
            (option) => {

              const isSelected =
                selectedAnswer ===
                option;

              const isCorrect =
                option ===
                question.answer;

              let optionStyle =
                optionButton;


              if (
                selectedAnswer !== null &&
                isCorrect
              ) {

                optionStyle = {
                  ...optionButton,
                  ...correctButton,
                };

              }


              if (
                isSelected &&
                !isCorrect
              ) {

                optionStyle = {
                  ...optionButton,
                  ...wrongButton,
                };

              }


              return (

                <button
                  key={option}
                  onClick={() =>
                    handleAnswer(option)
                  }
                  disabled={
                    selectedAnswer !== null
                  }
                  style={optionStyle}
                >
                  {option}
                </button>

              );

            }
          )}

        </div>


        {/* PROGRESS */}

        <div style={progressContainer}>

          <div
            style={{
              ...progressBar,
              width:
                `${
                  ((questionIndex + 1) /
                    QUESTIONS.length) *
                  100
                }%`,
            }}
          />

        </div>

      </div>

    </div>

  );

}


// ==========================================
// STYLES
// ==========================================

const page = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #eff6ff, #f8fafc)",
  padding: "30px 20px",
  fontFamily:
    "Arial, Helvetica, sans-serif",
};


const card = {
  maxWidth: "650px",
  margin: "50px auto",
  background: "white",
  borderRadius: "24px",
  padding: "40px",
  textAlign: "center",
  boxShadow:
    "0 15px 40px rgba(15,23,42,0.08)",
};


const gameIcon = {
  fontSize: "60px",
  marginBottom: "10px",
};


const title = {
  margin: 0,
  fontSize: "30px",
  color: "#172554",
};


const description = {
  color: "#64748b",
  lineHeight: "1.7",
  fontSize: "16px",
};


const instructionBox = {
  background: "#eff6ff",
  borderRadius: "15px",
  padding: "20px",
  margin: "25px 0",
  textAlign: "left",
  color: "#334155",
};


const primaryButton = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "12px",
  background: "#2563eb",
  color: "white",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  marginTop: "10px",
};


const secondaryButton = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "12px",
  background: "#f1f5f9",
  color: "#334155",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
  marginTop: "10px",
};


const gameContainer = {
  maxWidth: "850px",
  margin: "0 auto",
};


const gameHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};


const backButton = {
  border: "none",
  background: "white",
  padding: "10px 15px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};


const headerStats = {
  display: "flex",
  gap: "15px",
  color: "#334155",
  fontWeight: "700",
};


const gameTitleSection = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  background: "white",
  padding: "20px",
  borderRadius: "18px",
  boxShadow:
    "0 8px 25px rgba(15,23,42,0.05)",
};


const smallIcon = {
  width: "55px",
  height: "55px",
  borderRadius: "15px",
  background: "#dbeafe",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "28px",
};


const gameTitle = {
  margin: 0,
  fontSize: "24px",
};


const difficulty = {
  margin: "5px 0 0",
  color: "#64748b",
};


const questionCard = {
  background: "white",
  borderRadius: "20px",
  padding: "35px 20px",
  marginTop: "20px",
  textAlign: "center",
  boxShadow:
    "0 8px 25px rgba(15,23,42,0.05)",
};


const questionText = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#334155",
};


const sequence = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "25px",
};


const numberBox = {
  width: "65px",
  height: "65px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#eff6ff",
  borderRadius: "14px",
  fontSize: "25px",
  fontWeight: "700",
  color: "#1d4ed8",
};


const questionMark = {
  width: "65px",
  height: "65px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#dbeafe",
  borderRadius: "14px",
  fontSize: "28px",
  fontWeight: "700",
  color: "#2563eb",
};


const arrow = {
  fontSize: "22px",
  color: "#94a3b8",
};


const optionsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, 1fr)",
  gap: "15px",
  marginTop: "20px",
};


const optionButton = {
  padding: "18px",
  borderRadius: "15px",
  border: "2px solid #e2e8f0",
  background: "white",
  fontSize: "22px",
  fontWeight: "700",
  cursor: "pointer",
};


const correctButton = {
  background: "#dcfce7",
  border:
    "2px solid #22c55e",
  color: "#166534",
};


const wrongButton = {
  background: "#fee2e2",
  border:
    "2px solid #ef4444",
  color: "#991b1b",
};


const progressContainer = {
  height: "8px",
  background: "#e2e8f0",
  borderRadius: "10px",
  marginTop: "25px",
  overflow: "hidden",
};


const progressBar = {
  height: "100%",
  background: "#2563eb",
  borderRadius: "10px",
};


const resultGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(3, 1fr)",
  gap: "10px",
  marginTop: "25px",
};


const resultBox = {
  background: "#f8fafc",
  borderRadius: "14px",
  padding: "15px",
};


const saveBox = {
  marginTop: "15px",
  minHeight: "22px",
  color: "#475569",
  fontWeight: "600",
};


export default NumberSequence;