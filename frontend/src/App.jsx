import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ==========================================
// PAGES
// ==========================================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import CaregiverDashboard from "./pages/CaregiverDashboard";
import Reminders from "./pages/Reminders";
import DailyWellness from "./pages/DailyWellness";
import Progress from "./pages/Progress";
import NumberSequence from "./games/NumberSequence";
import AttentionChallenge from "./games/AttentionChallenge";
import ObjectRecognition from "./games/ObjectRecognition";
import DailyRoutineRecall from "./games/DailyRoutineRecall";
import MedicationTracker from "./pages/MedicationTracker";
import EmergencySOS from "./pages/EmergencySOS";
import FamilyContacts from "./pages/FamilyContacts";
import WeeklyReport from "./pages/WeeklyReport";


// ==========================================
// GAMES
// ==========================================

import MemoryMatch from "./games/MemoryMatch";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ======================================
            HOME
        ====================================== */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* ======================================
            AUTHENTICATION
        ====================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/weekly-report"
          element={<WeeklyReport />}
        />


        {/* ======================================
            PATIENT DASHBOARD
        ====================================== */}

        <Route
          path="/patient"
          element={<PatientDashboard />}
        />

        

       {/* ======================================
            MEDICATION TRACKER
        ====================================== */}


        <Route
         path="/emergency"
         element={<EmergencySOS />}
        />
 
        <Route
        path="/family"
        element={<FamilyContacts />}
        />
        
        <Route
         path="/medications"
         element={<MedicationTracker />}
        />  

        {/* ======================================
            REMINDERS
        ====================================== */}

        <Route
          path="/reminders"
          element={<Reminders />}
        />

        <Route
          path="/wellness"
          element={<DailyWellness />}
        />

        <Route
          path="/progress"
          element={<Progress />}
        />

        {/* ======================================
            CAREGIVER DASHBOARD
        ====================================== */}

        <Route
          path="/caregiver"
          element={<CaregiverDashboard />}
        />


        {/* ======================================
            MEMORY MATCH GAME
        ====================================== */}

        <Route
          path="/games"
          element={<MemoryMatch />}
        />

        <Route
          path="/games/memory-match"
          element={<MemoryMatch />}
        />

        <Route
          path="/games/number-sequence"
          element={<NumberSequence />}
         />

         <Route
           path="/games/attention"
           element={<AttentionChallenge />}
        />

         <Route
           path="/games/object-recognition"
           element={<ObjectRecognition />}
        />

         <Route
           path="/games/daily-routine"
           element={<DailyRoutineRecall />}
         />

        {/* ======================================
            UNKNOWN URL
        ====================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;