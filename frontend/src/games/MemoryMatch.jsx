import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";

const CARD_SETS = {
  easy: [
    "🍎",
    "🌸",
    "🐦",
  ],

  medium: [
    "🍎",
    "🌸",
    "🐦",
    "⭐",
    "🍀",
    "🦋",
  ],

  hard: [
    "🍎",
    "🌸",
    "🐦",
    "⭐",
    "🍀",
    "🦋",
    "🌻",
    "🐢",
  ],
};


function MemoryMatch() {

  const navigate = useNavigate();

  // ==========================================
  // USER
  // ==========================================

  const [user] = useState(() => {
    try {
      const storedUser = localStorage.getItem("memorycare_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  // ==========================================
  // ADAPTIVE DIFFICULTY
  // ==========================================

  const [difficulty, setDifficulty] =
    useState("easy");

  const [difficultyLevel, setDifficultyLevel] =
    useState(1);

  const [difficultyReason, setDifficultyReason] =
    useState("");

  const [loadingDifficulty, setLoadingDifficulty] =
    useState(true);

  // ==========================================
  // GAME
  // ==========================================

  const [cards, setCards] = useState([]);

  const [flippedCards, setFlippedCards] =
    useState([]);

  const [matchedCards, setMatchedCards] =
    useState([]);

  const [attempts, setAttempts] =
    useState(0);

  const [startTime, setStartTime] =
    useState(null);

  const [timeTaken, setTimeTaken] =
    useState(0);

  const [gameStarted, setGameStarted] =
    useState(false);

  const [gameCompleted, setGameCompleted] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");


  // ==========================================
  // LOAD USER
  // ==========================================

  useEffect(() => {
    if (!user) {
      localStorage.removeItem("memorycare_user");
      navigate("/login");
    }
  }, [navigate, user]);


  // ==========================================
  // GET ADAPTIVE DIFFICULTY
  // ==========================================

  useEffect(() => {

    if (!user) return;

    const getDifficulty = async () => {

      setLoadingDifficulty(true);

      try {

        const response = await fetch(
          apiUrl(`/api/adaptive-difficulty/${user.id}`)
        );

        const data =
          await response.json();

        if (
          response.ok &&
          data.success
        ) {

          setDifficulty(
            data.difficulty || "easy"
          );

          setDifficultyLevel(
            data.level || 1
          );

          setDifficultyReason(
            data.reason || ""
          );

        } else {

          console.error(
            "Adaptive difficulty error:",
            data.message
          );

          setDifficulty("easy");
          setDifficultyLevel(1);

        }

      } catch (error) {

        console.error(
          "Unable to load adaptive difficulty:",
          error
        );

        // Safe fallback
        setDifficulty("easy");
        setDifficultyLevel(1);

      } finally {

        setLoadingDifficulty(false);

      }
    };

    getDifficulty();

  }, [user]);


  // ==========================================
  // CREATE CARDS
  // ==========================================

  const createCards = (level) => {

    const symbols =
      CARD_SETS[level] || CARD_SETS.easy;

    const duplicated = [
      ...symbols,
      ...symbols,
    ];

    const shuffled =
      [...duplicated].sort(
        () => Math.random() - 0.5
      );

    return shuffled.map(
      (symbol, index) => ({
        id: index,
        symbol,
      })
    );
  };


  // ==========================================
  // START GAME
  // ==========================================

  const startGame = () => {

    const newCards =
      createCards(difficulty);

    setCards(newCards);

    setFlippedCards([]);

    setMatchedCards([]);

    setAttempts(0);

    setTimeTaken(0);

    setGameCompleted(false);

    setGameStarted(true);

    setMessage("");

    setStartTime(Date.now());

  };


  // ==========================================
  // HANDLE CARD CLICK
  // ==========================================

  const handleCardClick = (index) => {

    // Don't allow clicks before game starts
    if (!gameStarted) return;

    // Don't allow clicks after completion
    if (gameCompleted) return;

    // Don't allow clicking matched card
    if (
      matchedCards.includes(index)
    ) {
      return;
    }

    // Don't allow clicking same card
    if (
      flippedCards.includes(index)
    ) {
      return;
    }

    // Don't allow more than two cards
    if (
      flippedCards.length >= 2
    ) {
      return;
    }

    const newFlipped = [
      ...flippedCards,
      index,
    ];

    setFlippedCards(newFlipped);


    // --------------------------------------
    // CHECK MATCH
    // --------------------------------------

    if (newFlipped.length === 2) {

      setAttempts(
        (previous) =>
          previous + 1
      );

      const firstIndex =
        newFlipped[0];

      const secondIndex =
        newFlipped[1];

      const firstCard =
        cards[firstIndex];

      const secondCard =
        cards[secondIndex];


      if (
        firstCard.symbol ===
        secondCard.symbol
      ) {

        const newMatched = [
          ...matchedCards,
          firstIndex,
          secondIndex,
        ];

        setTimeout(() => {

          setMatchedCards(
            newMatched
          );

          setFlippedCards([]);

          // Check completion
          if (
            newMatched.length ===
            cards.length
          ) {

            finishGame(Date.now());

          }

        }, 500);

      } else {

        setTimeout(() => {

          setFlippedCards([]);

        }, 900);

      }

    }

  };


  // ==========================================
  // FINISH GAME
  // ==========================================

  const finishGame = (endTime) => {

    const seconds = Math.max(
      1,
      Math.round(
        (endTime - startTime) / 1000
      )
    );

    setTimeTaken(seconds);

    setGameCompleted(true);

    setGameStarted(false);

  };


  // ==========================================
  // CALCULATE SCORE
  // ==========================================

  const calculateScore = () => {

    const totalPairs =
      cards.length / 2;

    if (!totalPairs) return 0;

    const accuracy =
      attempts > 0
        ? totalPairs / attempts
        : 1;

    const baseScore =
      Math.round(
        accuracy * 100
      );

    const timeBonus =
      timeTaken > 0 &&
      timeTaken <= 30
        ? 10
        : 0;

    return Math.min(
      100,
      baseScore + timeBonus
    );

  };


  // ==========================================
  // SAVE RESULT
  // ==========================================

  const saveResult = async () => {

    if (!user) return;

    setSaving(true);
    setMessage("");

    const score =
      calculateScore();

    const matches =
      cards.length / 2;


    try {

      const response = await fetch(
        apiUrl("/api/game-results"),
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            user_id: user.id,

            game_name:
              "Memory Match",

            score,

            attempts,

            time_taken:
              timeTaken,

            matches,

          }),

        }
      );


      const data =
        await response.json();


      if (
        response.ok &&
        data.success
      ) {

        setMessage(
          "✅ Your game result was saved successfully!"
        );

      } else {

        setMessage(
          data.message ||
            "Unable to save game result."
        );

      }

    } catch (error) {

      console.error(error);

      setMessage(
        "⚠️ Unable to connect to the server."
      );

    } finally {

      setSaving(false);

    }

  };


  // ==========================================
  // SCORE
  // ==========================================

  const score = calculateScore();


  // ==========================================
  // DIFFICULTY COLOR
  // ==========================================

  const difficultyStyle = {

    easy: {
      background: "#dcfce7",
      color: "#166534",
    },

    medium: {
      background: "#fef3c7",
      color: "#92400e",
    },

    hard: {
      background: "#fee2e2",
      color: "#991b1b",
    },

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (
    !user ||
    loadingDifficulty
  ) {

    return (
      <div style={loadingPage}>

        <div style={loadingBox}>

          <div style={loadingEmoji}>
            🧠
          </div>

          <h2>
            Preparing your game...
          </h2>

          <p>
            MemoryCare is selecting a
            suitable difficulty level.
          </p>

        </div>

      </div>
    );

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <div style={page}>

      {/* HEADER */}

      <header style={header}>

        <button
          style={backButton}
          onClick={() =>
            navigate("/patient")
          }
        >
          ← Dashboard
        </button>

        <div style={headerTitle}>
          🧠 Memory Match
        </div>

        <div
          style={{
            ...difficultyBadge,
            ...difficultyStyle[
              difficulty
            ],
          }}
        >
          {difficulty === "easy" &&
            "🟢 Easy"}

          {difficulty === "medium" &&
            "🟡 Medium"}

          {difficulty === "hard" &&
            "🔴 Hard"}
        </div>

      </header>


      {/* CONTENT */}

      <main style={container}>

        {/* INTRO */}

        {!gameStarted &&
          !gameCompleted && (

          <div style={introCard}>

            <div style={brainEmoji}>
              🧠
            </div>

            <h1 style={title}>
              Memory Match
            </h1>

            <p style={description}>
              Match the same pictures
              and exercise your memory.
            </p>


            {/* ADAPTIVE INFO */}

            <div style={adaptiveBox}>

              <div style={adaptiveTitle}>
                ✨ Personalized for You
              </div>

              <div style={adaptiveText}>

                Your current level is{" "}

                <strong>
                  {difficulty}
                </strong>

                {" "}(Level{" "}
                {difficultyLevel}
                ).

              </div>

              {difficultyReason && (
                <div
                  style={adaptiveReason}
                >
                  {difficultyReason}
                </div>
              )}

            </div>


            <button
              style={startButton}
              onClick={startGame}
            >
              ▶ Start Game
            </button>

          </div>

        )}


        {/* GAME */}

        {gameStarted && (

          <>

            <div style={gameInfo}>

              <div style={infoItem}>
                <span>
                  🎯 Attempts
                </span>

                <strong>
                  {attempts}
                </strong>
              </div>

              <div style={infoItem}>
                <span>
                  🧩 Matches
                </span>

                <strong>
                  {matchedCards.length / 2}
                </strong>
              </div>

              <div style={infoItem}>
                <span>
                  📦 Pairs
                </span>

                <strong>
                  {cards.length / 2}
                </strong>
              </div>

              <div
                style={{
                  ...infoItem,
                  ...difficultyStyle[
                    difficulty
                  ],
                  padding: "8px 14px",
                  borderRadius: "10px",
                }}
              >
                <span>
                  Level
                </span>

                <strong>
                  {difficultyLevel}
                </strong>
              </div>

            </div>


            <div
              style={{
                ...gameBoard,
                gridTemplateColumns:
                  cards.length <= 6
                    ? "repeat(3, 1fr)"
                    : cards.length <= 12
                    ? "repeat(4, 1fr)"
                    : "repeat(4, 1fr)",
              }}
            >

              {cards.map(
                (card, index) => {

                  const isFlipped =
                    flippedCards.includes(
                      index
                    );

                  const isMatched =
                    matchedCards.includes(
                      index
                    );

                  return (

                    <button
                      key={card.id}
                      onClick={() =>
                        handleCardClick(
                          index
                        )
                      }
                      style={{
                        ...cardStyle,

                        ...(isFlipped ||
                        isMatched
                          ? flippedCardStyle
                          : {}),
                      }}
                    >

                      {isFlipped ||
                      isMatched
                        ? card.symbol
                        : "?"}

                    </button>

                  );

                }
              )}

            </div>

          </>

        )}


        {/* RESULT */}

        {gameCompleted && (

          <div style={resultCard}>

            <div style={successEmoji}>
              🎉
            </div>

            <h1>
              Great Job!
            </h1>

            <p>
              You completed the Memory Match
              game.
            </p>


            <div style={resultGrid}>

              <div style={resultItem}>
                <strong>
                  {score}
                </strong>

                <span>
                  Score
                </span>
              </div>

              <div style={resultItem}>
                <strong>
                  {attempts}
                </strong>

                <span>
                  Attempts
                </span>
              </div>

              <div style={resultItem}>
                <strong>
                  {timeTaken}s
                </strong>

                <span>
                  Time
                </span>
              </div>

              <div style={resultItem}>
                <strong>
                  {difficulty}
                </strong>

                <span>
                  Difficulty
                </span>
              </div>

            </div>


            <button
              style={{
                ...saveButton,
                opacity:
                  saving ? 0.6 : 1,
              }}
              disabled={saving}
              onClick={saveResult}
            >

              {saving
                ? "Saving..."
                : "💾 Save Result"}

            </button>


            {message && (

              <div style={messageStyle}>
                {message}
              </div>

            )}


            <button
              style={playAgainButton}
              onClick={() => {

                setGameCompleted(false);

                setMessage("");

                startGame();

              }}
            >
              🔄 Play Again
            </button>


            <button
              style={dashboardButton}
              onClick={() =>
                navigate("/patient")
              }
            >
              ← Back to Dashboard
            </button>

          </div>

        )}

      </main>

    </div>
  );
}


// ==========================================
// STYLES
// ==========================================

const page = {
  minHeight: "100vh",
  background:
    "linear-gradient(135deg, #eff6ff, #f0fdf4)",
  fontFamily:
    "Arial, Helvetica, sans-serif",
};

const header = {
  background: "white",
  padding: "16px 25px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow:
    "0 3px 15px rgba(0,0,0,0.06)",
};

const headerTitle = {
  fontSize: "22px",
  fontWeight: "bold",
  color: "#172554",
};

const backButton = {
  border: "none",
  background: "#eff6ff",
  color: "#1d4ed8",
  padding: "10px 15px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};

const difficultyBadge = {
  padding: "9px 14px",
  borderRadius: "20px",
  fontSize: "13px",
  fontWeight: "bold",
};

const container = {
  maxWidth: "850px",
  margin: "0 auto",
  padding: "40px 20px 70px",
};

const introCard = {
  background: "white",
  borderRadius: "25px",
  padding: "45px 30px",
  textAlign: "center",
  boxShadow:
    "0 12px 40px rgba(0,0,0,0.07)",
};

const brainEmoji = {
  fontSize: "65px",
};

const title = {
  fontSize: "35px",
  margin: "10px 0",
};

const description = {
  color: "#64748b",
  fontSize: "16px",
};

const adaptiveBox = {
  margin:
    "25px auto",
  maxWidth: "500px",
  background: "#eff6ff",
  padding: "18px",
  borderRadius: "15px",
};

const adaptiveTitle = {
  fontWeight: "bold",
  color: "#1d4ed8",
  marginBottom: "7px",
};

const adaptiveText = {
  color: "#334155",
};

const adaptiveReason = {
  marginTop: "8px",
  fontSize: "13px",
  color: "#64748b",
};

const startButton = {
  border: "none",
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",
  color: "white",
  padding: "15px 35px",
  borderRadius: "13px",
  cursor: "pointer",
  fontSize: "17px",
  fontWeight: "bold",
  marginTop: "10px",
};

const gameInfo = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "12px",
  marginBottom: "25px",
};

const infoItem = {
  background: "white",
  borderRadius: "12px",
  padding: "10px 17px",
  display: "flex",
  gap: "9px",
  alignItems: "center",
  boxShadow:
    "0 4px 15px rgba(0,0,0,0.05)",
};

const gameBoard = {
  display: "grid",
  gap: "14px",
  maxWidth: "560px",
  margin: "0 auto",
};

const cardStyle = {
  aspectRatio: "1",
  border: "none",
  borderRadius: "17px",
  background:
    "linear-gradient(135deg, #2563eb, #4f46e5)",
  color: "white",
  fontSize: "35px",
  fontWeight: "bold",
  cursor: "pointer",
  boxShadow:
    "0 6px 15px rgba(0,0,0,0.08)",
};

const flippedCardStyle = {
  background: "white",
  color: "#172554",
  border:
    "3px solid #60a5fa",
};

const resultCard = {
  background: "white",
  borderRadius: "25px",
  padding: "40px 25px",
  textAlign: "center",
  boxShadow:
    "0 12px 40px rgba(0,0,0,0.07)",
};

const successEmoji = {
  fontSize: "65px",
};

const resultGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(130px, 1fr))",
  gap: "12px",
  margin:
    "25px auto",
  maxWidth: "600px",
};

const resultItem = {
  background: "#f8fafc",
  borderRadius: "14px",
  padding: "17px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};

const saveButton = {
  display: "block",
  width: "100%",
  maxWidth: "400px",
  margin: "15px auto",
  border: "none",
  background: "#16a34a",
  color: "white",
  padding: "14px",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
};

const playAgainButton = {
  border: "none",
  background: "#eff6ff",
  color: "#1d4ed8",
  padding: "13px 22px",
  borderRadius: "11px",
  cursor: "pointer",
  fontWeight: "bold",
  margin: "5px",
};

const dashboardButton = {
  border: "none",
  background: "#f1f5f9",
  color: "#475569",
  padding: "13px 22px",
  borderRadius: "11px",
  cursor: "pointer",
  fontWeight: "bold",
  margin: "5px",
};

const messageStyle = {
  margin: "15px auto",
  padding: "12px",
  maxWidth: "500px",
  background: "#f0fdf4",
  color: "#166534",
  borderRadius: "10px",
};

const loadingPage = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#f8fafc",
};

const loadingBox = {
  background: "white",
  padding: "40px",
  borderRadius: "20px",
  textAlign: "center",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.06)",
};

const loadingEmoji = {
  fontSize: "55px",
};


export default MemoryMatch;