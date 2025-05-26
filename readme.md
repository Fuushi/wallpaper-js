# Wallpaper JS - Spotify Clockface

A real-time, visually appealing clockface and music display for a desk or kiosk screen. This project combines a Python FastAPI backend (for Spotify integration) and a modern HTML/JS/CSS frontend to show the current time and Spotify playback info, including album art, track title, artist, and progress.

## Features
- Large, readable digital clock display
- Spotify playback info: album cover, track title, artist(s), progress bar
- Smooth UI with animated scrolling for long track titles
- Responsive updates (every 0.5s) for playback and clock
- Designed for local use on a dedicated screen or kiosk

## Prerequisites
- **Python 3.8+** (for backend)
- **Node.js** (optional, for frontend development)
- **Spotify Developer Account** (for API keys)
- **Keys.py** file with your Spotify API credentials (see below)

## Setup

### 1. Clone the repository
```
git clone <your-repo-url>
cd _wallpaper_js
```

### 2. Install Python dependencies
```
pip install spotipy fastapi uvicorn
```

### 3. Set up your Spotify API keys
- Create a `Keys.py` file in the project root with the following structure:
  ```python
  class Keys:
      sp_client_id = "your_spotify_client_id"
      sp_client_secret = "your_spotify_client_secret"
  ```
- Register your app at https://developer.spotify.com/dashboard/ to get these keys.

### 4. Configure (optional)
- Edit `config.json` to adjust query rates or addresses if needed. (indev)

### 5. Run the backend server
```
python spotify_api.py
```
- The FastAPI server will start on `localhost:3010`.

### 6. Open the frontend
- Open `index.html` in your browser (Chrome recommended).
- The UI will connect to the backend and display the current time and Spotify playback info.

## File Structure
- `index.html` — Main UI
- `styles.css` — Styling for the UI
- `scripts.js` — Frontend logic (fetches playback, updates UI, handles animation)
- `spotify_api.py` — Python FastAPI backend for Spotify
- `Keys.py` — Your Spotify API keys (not included in repo)
- `config.json` — Configuration for query rates and addresses
- `src/` — Images (local assets)
- `cache/` — Spotify token cache, or other misc caches

## API Endpoints
- `GET /get_playback` — Returns current playback info (used by frontend)
- `GET /get_album_cover_url` — Returns current album cover URL
- `GET /get_playback_raw` — Returns raw Spotify playback data (debug)

## Notes
- This project is intended for local use (e.g., on a Raspberry Pi, Windows PC, or kiosk display).
- The backend must be running for the frontend to show Spotify info.
- Make sure your Spotify account is active and playing music for data to appear.
- The UI will show a default image and "Not Playing" if nothing is playing.

## License
See LICENSE file.

---

> **Note:** Most documentation in this project is AI-generated and may require review for accuracy or completeness. (im a backend developer not an english proffesor)

For questions or issues, open an issue or contact the author.
