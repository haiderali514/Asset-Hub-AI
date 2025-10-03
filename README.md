# AssetHub AI

AssetHub AI is a full-stack web application for creators to search for free digital assets and generate new assets using various AI providers. Users can search, filter, and save their favorite assets to personal collections.

This prototype features a React frontend and a Node.js (Express) backend.

## Features

-   **Asset Search**: Search for images and illustrations from various sources (mocked data in this prototype).
-   **Advanced Filtering**: Filter results by asset type and orientation.
-   **AI Image Generation**:
    -   Generate images using a backend-integrated Gemini AI.
    -   Switch between multiple AI providers (other providers are mocked).
    -   Link and manage external AI provider accounts.
-   **Favorites**: Save both searched and AI-generated assets to a personal collection (uses Local Storage).
-   **Modern UI/UX**: A clean, responsive interface with light and dark modes.

## Project Structure

-   `/frontend`: Contains the React single-page application.
-   `/backend`: Contains the Node.js Express server providing the API.

## Setup and Running the Application

You will need to run the frontend and backend servers concurrently in separate terminal windows.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the `backend` directory and add your Gemini API key:
    ```
    API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

4.  **Start the backend server:**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:3001`.

### Frontend Setup

The frontend is a no-build React application that can be served by any static file server. The backend is already configured to serve the frontend files.

1.  **Start the backend server** as described above.
2.  **Open your browser** and navigate to `http://localhost:3001`.

The application should now be running.

## Notes for Extension

-   **Search APIs**: The asset search is currently using mock data. To connect to real APIs like Pixabay, update the `/api/search` endpoint in `backend/routes/api.js`.
-   **AI Providers**: To integrate other AI providers (e.g., DALL-E, Stable Diffusion), you'll need to add their respective API call logic within the `/api/ai-generate` endpoint in `backend/routes/api.js`.
