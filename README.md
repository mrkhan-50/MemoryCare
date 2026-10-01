# 🧠 MemoryCare

### AI-Based Cognitive Gaming and Memory Assistance Platform for Elderly Dementia Patients

MemoryCare is a web-based cognitive wellness and memory assistance platform designed to support elderly users experiencing memory-related difficulties.

The platform provides an accessible environment where users can participate in cognitive games, record their daily wellness, manage reminders, and monitor their progress over time.

The project is designed with a patient-friendly interface and a separate backend API for managing authentication, cognitive activity, reminders, wellness records, and progress data.

---

## 🌐 Live Application

### Frontend
**Vercel:**  
https://memory-care.vercel.app/

### Backend API
**Render:**  
https://memorycare-2-98ns.onrender.com/

> The frontend communicates with the Flask backend through REST API endpoints.

---

# 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Problem Statement](#-problem-statement)
- [Project Objectives](#-project-objectives)
- [Key Features](#-key-features)
- [Cognitive Games](#-cognitive-games)
- [Wellness Tracking](#-wellness-tracking)
- [Reminder System](#-reminder-system)
- [Progress Tracking](#-progress-tracking)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Frontend](#-frontend)
- [Backend](#-backend)
- [Database](#-database)
- [API Communication](#-api-communication)
- [Environment Variables](#-environment-variables)
- [Local Installation](#-local-installation)
- [Running the Project](#-running-the-project)
- [Deployment](#-deployment)
- [GitHub Workflow](#-github-workflow)
- [Security](#-security)
- [Future Improvements](#-future-improvements)
- [Project Status](#-project-status)
- [Contributors](#-contributors)
- [License](#-license)

---

# 🧠 About the Project

MemoryCare is an AI-oriented cognitive gaming and memory assistance platform developed to provide elderly users with simple digital activities that encourage cognitive engagement and daily wellness tracking.

The platform combines:

- Cognitive games
- Daily wellness tracking
- Reminder management
- Progress monitoring
- User authentication
- Patient dashboard
- Backend REST APIs

The goal is to create a simple, accessible, and user-friendly digital environment for elderly users and their caregivers.

---

# 🚨 Problem Statement

Dementia and memory-related difficulties can significantly affect the daily lives of elderly individuals.

Users may experience difficulties with:

- Remembering daily activities
- Maintaining routines
- Concentration
- Recognizing objects
- Remembering patterns
- Staying hydrated
- Maintaining healthy routines
- Remembering medicines and appointments

At the same time, caregivers may find it difficult to continuously monitor daily activities and wellness.

MemoryCare aims to provide a centralized digital platform where cognitive activities and daily wellness information can be recorded and monitored.

---

# 🎯 Project Objectives

The main objectives of MemoryCare are:

1. Provide simple cognitive activities for elderly users.
2. Encourage regular cognitive engagement.
3. Allow users to record daily wellness information.
4. Provide reminder management for important activities.
5. Track cognitive game performance.
6. Display wellness and cognitive progress.
7. Provide a simple and accessible user interface.
8. Provide a REST API-based backend architecture.
9. Deploy the application online for real-world accessibility.

---

# ✨ Key Features

## 🔐 User Authentication

MemoryCare provides user authentication functionality including:

- User registration
- User login
- Password hashing
- Patient-based access
- User session information through browser storage

User information is stored locally in the application using:

```text
memorycare_user
