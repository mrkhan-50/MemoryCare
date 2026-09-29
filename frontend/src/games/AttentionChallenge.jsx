import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:5000";

const QUESTIONS = [
  {
    target: "🍎",
    items: ["🍎", "🍎", "🍎", "🍌", "🍎"],
    answer: "🍌",
  },
  {
    target: "⭐",
    items: ["⭐", "⭐", "❤️", "⭐", "⭐"],
    answer: "❤️",
  },
  {
    target: "🐱",
    items: ["🐱", "🐶", "🐱", "🐱", "🐱"],
    answer: "🐶",
  },
  {
    target: "🔵",
    items: ["🔵", "🔵", "🟢", "🔵", "🔵"],
    answer: "🟢",
  },
  {
    target: "🌞",
    items: ["🌞", "🌞", "🌙", "🌞", "🌞"],
    answer: "🌙",
  },
  {
    target: "🚗",
    items: ["🚗", "🚗", "🚌", "🚗", "🚗"],
    answer: "🚌",
  },
  {
    target: "🍓",
    items: ["🍓", "🍓", "🍊", "🍓", "🍓"],
    answer: "🍊",
  },
  {
    target: "🔺",
    items: ["🔺", "🔺", "⬛", "🔺", "🔺"],
    answer: "⬛",
  },
];

function AttentionChallenge() {
  const navigate = useNavigate();

  const [started, setStarted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);

  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [finished, setFinished] = useState(false);

  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const question = QUESTIONS[questionIndex];

  // ==========================================
  // START GAME
  // ==========================================

  const startGame = () => {
    setStarted(true);
    setStartTime(Date.now());
  };

  // ==========================================
  // HANDLE ANSWER
  // ==========================================

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(answer);

    setAttempts((previous) => previous + 1);

    if (answer === question.answer) {
      setScore((previous) => previous + 10);

      setCorrectAnswers(
        (previous) => previous + 1
      );
    }

    setTimeout(() => {
      if (questionIndex < QUESTIONS.length - 1) {
        setQuestionIndex(
          (previous) => previous + 1
        );

        setSelectedAnswer(null);
      } else {
        const finalTime = Math.floor(
          (Date.now() - startTime) / 1000
        );

        setTimeTaken(finalTime);
        setFinished(true);
      }
    }, 800);
  };

  // ==========================================
  // SAVE RESULT
  // ==========================================

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

      const user = JSON.parse(storedUser);

      const response = await fetch(
        `${API_URL}/api/game-results`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id: user.id,
            game_name: "Attention Challenge",
            score: score,
            attempts: attempts,
            time_taken: timeTaken,
            matches: correctAnswers,
          }),
        }
      );

      const data = await response.json();

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

  // ==========================================
  // SAVE AFTER GAME
  // ==========================================

  useEffect(() => {
    if (finished) {
      saveResult();
    }
  }, [finished]);

  // ==========================================
  // START SCREEN
  // ==========================================

  if (!started) {
    return (
      <div style={page}>
        <div style={card}>
          <div style={icon}>
            🎯
          </div>

          <h1 style={title}>
            Attention Challenge
          </h1>

          <p style={description}>
            Find the one symbol that is
            different from the others.
          </p>

          <div style={instructionBox}>
            <strong>
              How to play
            </strong>

            <p>
              Look carefully at all the
              symbols.
            </p>

            <p>
              Find the symbol that does not
              match the others.
            </p>

            <p>
              Choose your answer.
            </p>
          </div>

          <button
            style={primaryButton}
            onClick={startGame}
          >
            ▶ Start Game
          </button>

          <button
            style={secondaryButton}
            onClick={() =>
              navigate("/patient")
            }
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // FINISHED SCREEN
  // ==========================================

  if (finished) {
    return (
      <div style={page}>
        <div style={card}>
          <div style={icon}>
            🎉
          </div>

          <h1 style={title}>
            Great Job!
          </h1>

          <p style={description}>
            You completed the Attention
            Challenge.
          </p>

          <div style={resultGrid}>
            <div style={resultBox}>
              <span>⭐</span>

              <strong>
                {score}
              </strong>

              <small>
                Score
              </small>
            </div>

            <div style={resultBox}>
              <span>✅</span>

              <strong>
                {correctAnswers}
              </strong>

              <small>
                Correct
              </small>
            </div>

            <div style={resultBox}>
              <span>⏱️</span>

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
            style={primaryButton}
            onClick={() =>
              navigate("/patient")
            }
          >
            🏠 Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ==========================================
  // GAME SCREEN
  // ==========================================

  return (
    <div style={page}>
      <div style={gameContainer}>

        {/* HEADER */}

        <div style={gameHeader}>
          <button
            style={backButton}
            onClick={() =>
              navigate("/patient")
            }
          >
            ← Dashboard
          </button>

          <div style={headerStats}>
            <span>
              ⭐ {score}
            </span>

            <span>
              {questionIndex + 1}/
              {QUESTIONS.length}
            </span>
          </div>
        </div>

        {/* TITLE */}

        <div style={gameTitleSection}>
          <div style={smallIcon}>
            🎯
          </div>

          <div>
            <h1 style={gameTitle}>
              Attention Challenge
            </h1>

            <p style={subtitle}>
              Find the different symbol
            </p>
          </div>
        </div>

        {/* QUESTION */}

        <div style={questionCard}>
          <p style={questionText}>
            Which symbol is different?
          </p>

          <div style={targetBox}>
            <span style={targetLabel}>
              Target pattern
            </span>

            <span style={targetSymbol}>
              {question.target}
            </span>
          </div>

          <div style={itemsContainer}>
            {question.items.map(
              (item, index) => (
                <div
                  key={index}
                  style={itemBox}
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        {/* OPTIONS */}

        <div style={answerTitle}>
          Choose the different symbol
        </div>

        <div style={optionsGrid}>
          {[
            ...new Set(question.items),
          ].map((item) => {
            const isSelected =
              selectedAnswer === item;

            const isCorrect =
              item === question.answer;

            let buttonStyle =
              optionButton;

            if (
              selectedAnswer !== null &&
              isCorrect
            ) {
              buttonStyle = {
                ...optionButton,
                ...correctButton,
              };
            }

            if (
              isSelected &&
              !isCorrect
            ) {
              buttonStyle = {
                ...optionButton,
                ...wrongButton,
              };
            }

            return (
              <button
                key={item}
                style={buttonStyle}
                disabled={
                  selectedAnswer !== null
                }
                onClick={() =>
                  handleAnswer(item)
                }
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* PROGRESS */}

        <div style={progressContainer}>
          <div
            style={{
              ...progressBar,
              width: `${
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
    "linear-gradient(135deg, #f0f9ff, #f8fafc)",
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

const icon = {
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
  marginBottom: "25px",
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

const subtitle = {
  margin: "5px 0 0",
  color: "#64748b",
};

const questionCard = {
  background: "white",
  borderRadius: "20px",
  padding: "30px 20px",
  marginTop: "20px",
  textAlign: "center",
  boxShadow:
    "0 8px 25px rgba(15,23,42,0.05)",
};

const questionText = {
  fontSize: "21px",
  fontWeight: "700",
  color: "#334155",
};

const targetBox = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "15px",
  marginTop: "20px",
};

const targetLabel = {
  color: "#64748b",
  fontSize: "14px",
};

const targetSymbol = {
  fontSize: "32px",
};

const itemsContainer = {
  display: "flex",
  justifyContent: "center",
  gap: "15px",
  flexWrap: "wrap",
  marginTop: "30px",
};

const itemBox = {
  width: "75px",
  height: "75px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f8fafc",
  border: "2px solid #e2e8f0",
  borderRadius: "16px",
  fontSize: "36px",
};

const answerTitle = {
  textAlign: "center",
  marginTop: "25px",
  color: "#475569",
  fontWeight: "600",
};

const optionsGrid = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "15px",
  marginTop: "15px",
};

const optionButton = {
  width: "90px",
  height: "70px",
  borderRadius: "15px",
  border: "2px solid #e2e8f0",
  background: "white",
  fontSize: "32px",
  cursor: "pointer",
};

const correctButton = {
  background: "#dcfce7",
  border: "2px solid #22c55e",
};

const wrongButton = {
  background: "#fee2e2",
  border: "2px solid #ef4444",
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

export default AttentionChallenge;