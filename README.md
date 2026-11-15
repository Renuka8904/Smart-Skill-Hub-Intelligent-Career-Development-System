# 🚀 Smart Skill Hub – Intelligent Career Development System

### An AI-Driven Platform for Personalized Learning, Career Tracking, and Skill Development

## 📌 Project Overview

Smart Skill Hub is an AI-driven career development platform designed to help students identify their skills, discover skill gaps, improve technical knowledge, and achieve their career goals.

The platform provides personalized learning recommendations, career roadmaps, coding practice, resume analysis, and GitHub profile analysis to support students in their career development journey.

## ✨ Key Features

- **Skill Assessment:** Evaluate technical skills and identify areas for improvement.
- **Resume Analysis:** Upload resumes and identify technical skills.
- **Personalized Learning Recommendations:** Suggest relevant learning resources based on skill gaps.
- **Learning Roadmap:** Provide structured learning paths for career development.
- **EduTube Learning:** Access educational learning resources.
- **Coding Practice:** Practice programming problems and improve coding skills.
- **GitHub Intelligence:** Analyze GitHub profiles and coding activity.
- **Smart Mentor:** Get AI-powered programming guidance.
- **Career Progress Tracking:** Monitor learning progress and skill development.
- **My Portfolio:** Showcase skills and project information.

## 🛠️ Technologies Used

### Frontend
- React.js
- TypeScript
- HTML
- CSS
- JavaScript
- Vite

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas

### AI Integration
- Ollama
- Gemma 3:1B

## 📂 Project Structure

```text
Smart_Skill_Hub/
│
├── backend/
│   ├── server.js
│   ├── Progress.js
│   ├── Resume.js
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd Smart_Skill_Hub
```

### 3. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder and configure your MongoDB connection:

```env
MONGODB_URI=your_mongodb_connection_string
```

Start the backend server:

```bash
node server.js
```

Backend runs at:

`http://localhost:5000`

### 4. Setup Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at the local URL displayed by Vite, usually:

`http://localhost:5173`

### 5. AI Setup

Install Ollama and download the Gemma model:

```bash
ollama pull gemma3:1b
```

Start Ollama before using AI-powered features that depend on it.

## 🎯 Project Objective

The main objective of Smart Skill Hub is to provide students with an intelligent platform that connects skill assessment, personalized learning, coding practice, and career development in one place.

## 🔮 Future Enhancements

- Advanced AI-based career recommendations.
- More personalized learning paths.
- Additional programming languages and coding challenges.
- Enhanced career analytics and progress reports.
- Improved resume evaluation and feedback.

## 👩‍💻 Developed By

**Renuka Basanna Jogin**

Computer Science and Engineering

**Project:** Smart Skill Hub – Intelligent Career Development System