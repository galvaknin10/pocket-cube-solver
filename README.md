# Pocket Cube Solver 

<p align="center">
  <img src="pocket-cube.png" alt="Pocket Cube" width="200"/>
</p>

An interactive and intuitive 2x2x2 cube simulation web app.
It allows users to scramble the cube, solve any configuration, follow step-by-step instructions, and manually input custom cube states — all in a smooth 3D interface.

---

## Short Demo
[Watch the demo on YouTube](https://www.youtube.com/watch?v=mnSEGXDUn74&t=2s)

---

## Features

- Scramble the cube with real-time 3D animation
- Solve any state using a BFS-powered backend
- "Guide Me" step-by-step solving assistant
- Manual color input for custom configurations
- Fun facts about the Pocket Cube from Gemini AI

---

## Tech Stack

The project is built with **React** for the interactive 3D cube frontend and **FastAPI** for the backend logic and API endpoints. It uses **MongoDB** to store precomputed cube states for building the solution paths. Everything is containerized with **Docker** and deployed using **Render** for the backend services and **GitHub Pages** for the frontend.
Automated testing is handled using **Pytest** for backend/unit tests and **Playwright** for end-to-end frontend testing.

---

## Architecture

![Architecture](./REACT.png)

---

## Installation

Ok, basically you don’t have to do anything, just: 🔗 [Try it out](https://galvaknin10.github.io/pocket-cube-solver)

> Notice: The backend services are hosted on Render’s free tier, which may cause a short delay — so be patient (after all, it's a free plan, you know...)

Or, if you insist on running it locally:

1. Terminal: 

```bash
git clone https://github.com/galvaknin10/pocket-cube-solver.git
cd pocket-cube-solver
```

2. Open `frontend/src/config.js` and make sure it points to your local services:

```js
export const API_BASE_URL = "http://localhost:8000";     // FastAPI backend
export const API_BASE_AI_URL = "http://localhost:8003";  // Gemini AI service
```

3. Create a `.env` file inside the `backend` directory and paste:

 ```python
MONGO_URI=mongodb+srv://readonly_user:readonly123@cluster0.hlrp9cg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

4. Create a `.env` file inside the `cube-ai-agent` directory and add your Gemini API key:

```python 
GEMINI_API_KEY="your-api-key-here"
```

> You can get a Gemini API key by enabling the Generative Language API
at [Google AI Studio](https://aistudio.google.com/apikey) and creating a project in **Google Cloud Console**.

5. Start the project:

```bash
docker-compose up --build
```

You’re all set - Go to `http://localhost:3000` to start messing with the cube.

---

## Project Structure

```plaintext
.
├── backend/             # FastAPI backend microservice
├── cube-ai-agent/       # Gemini AI microservice
├── frontend/            # React microservice
├── playwright_tests/    # E2E tests (Playwright)
└── docker-compose.yml   # Docker Compose setup
```

---

## Mathematical Side

The cube solver relies on a **Breadth-First Search (BFS)** algorithm to precompute all valid cube states and their optimal solutions. These results are stored in a **MongoDB** database, allowing fast lookups during runtime.

### 3.67 Million Unique States:

- **8 corner cubelets**, each with **3 possible orientations**
- Permutations: `8! = 40,320`
- Orientations: `3^7 = 2,187` (the 8th orientation is dependent on the rest)
- Remove symmetry (rotations don’t change state): `/ 24`  
**Total: (8! × 3⁷) / 24 = 3,674,160** unique states

### Tree Building Logic

The actual BFS logic that generates the cube states and stores them to MongoDB is in: `backend/app/scripts/build_tree.py`
Originally built and tested using a local MongoDB instance, and later migrated to **MongoDB Atlas (cloud)** for deployment.

### ⏱ Solution Search Time

In production, when a user asks to solve a cube:

- The system performs a MongoDB query to locate the current cube state.
- Then it recursively backtracks through parent states using the `parent` field, until it reaches the solved state, building the solution path step-by-step.
- Since we’re using the `state` field as an indexed lookup, the search is O(1) on average.
- However, due to **cold starts** on Render’s & Atlas free tier, initial response might be delayed by a few seconds.

---

## License

MIT © 2025 Gal Vaknin
[LinkedIn](https://www.linkedin.com/in/galvaknin10) • [GitHub](https://github.com/galvaknin10)
