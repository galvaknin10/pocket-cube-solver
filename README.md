# Pocket Cube Solver 

An interactive 2x2x2 Pocket Cube simulator with AI-powered solving and Gemini fun facts!  
Built with **React**, **FastAPI**, **Docker**, and deployed using **Render** & **GitHub Pages**.

---

## Live Demo

🔗 [Try it Yourself](https://galvaknin10.github.io/pocket-cube-solver)

---

## Features

- Scramble the cube with real-time 3D animation
- Solve any state using a BFS-powered backend
- "Guide Me" step-by-step solving assistant
- Manual color input for custom configurations
- Fun facts about the Pocket Cube from Gemini AI

---

## Tech Stack

| Frontend  | Backend | AI Service      | DevOps         |
|-----------|---------|------------------|----------------|
| React     | FastAPI | Gemini API (Google) | Docker + Render |
| MongoDB | OpenAI Gemini | GitHub Pages   |

---

## Architecture

```plaintext
React (GitHub Pages)
   ↓
FastAPI Backend (Render)
   ↓
MongoDB Data / PKL File
   ↓
Gemini AI Service (Render)

---

## Local Setup

```bash
git clone https://github.com/galvaknin10/pocket-cube-solver.git
cd pocket-cube-solver
⚙️ Config Update (for local development)
If you're running the backend and AI services locally, update the API URLs inside:

frontend/src/config.js
export const API_BASE_URL = "http://localhost:8000";     // FastAPI backend
export const API_BASE_AI_URL = "http://localhost:8003";  // Gemini AI service

Then start the project:

bash
Copy code
docker-compose up --build

---

## AI Integration

-Integrated Gemini API (via Google) to fetch random facts about the Pocket Cube
-Cold-start delay handled via loading spinner


## Project Structure

```plaintext
.
├── backend/             # FastAPI backend service
├── cube-ai-agent/       # Gemini AI microservice
├── frontend/            # React + 3D Cube simulation
├── playwright_tests/    # E2E tests (Playwright)
└── docker-compose.yml   # Docker Compose setup



License
MIT © 2025 Gal Vaknin
LinkedIn | GitHub