// Base URL for backend API calls.
// Uses the REACT_APP_BACKEND_URL env var if defined (set at build time),
// otherwise defaults to localhost for local development.
export const API_BASE_BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";



