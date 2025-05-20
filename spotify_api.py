#includes
from Keys import Keys
keys = Keys()
import os, time, sys, json
from threading import Thread

#wraps the spotify rest api to make it easier to use

##create state object to hold spotify state, accessed by the API
class State:
    def __init__(self):
        self.playback_raw = None
        return
state = State()
    
##create spotify API object to interact with the spotify API
class SpotifyAPI:
    def __init__(self, state):       
        #initialize
        import spotipy
        from spotipy.oauth2 import SpotifyOAuth

        self.interval = 5 #seconds
        self.state=state

        #declare intents
        self._scopes='user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-read-collaborative user-follow-read user-read-recently-played user-read-playback-position user-library-read'
        
        try:
            self.auth_manager = SpotifyOAuth(
                client_id=keys.sp_client_id,
                client_secret=keys.sp_client_secret,
                redirect_uri='http://localhost:3002',
                scope=self._scopes,
                cache_path="cache/spotifycache.txt"
            )
            self.spotify_object = spotipy.Spotify(auth_manager=self.auth_manager)
        except Exception as e:
            print(f"Error: {e}")
            print("Failed to connect to Spotify API. Please check your credentials.")
            return
        print("Connected to Spotify API.")
        time.sleep(1)
        return

    
    def run(self): #<-- thread loop
        while True:
            print("Tick")
            try:
                self.state.playback_raw = self.spotify_object.current_playback()
            except Exception as e:
                print(f"Error: {e}")
                print("Error: Failed to get current playback, attempting to reconnect.")
                self.__init__(self.state)
            time.sleep(self.interval)
        return
    
##spawn spotify API objectb / thread
spotifyAPI = SpotifyAPI(state)
spotifyAPI_thread = Thread(target=spotifyAPI.run)
spotifyAPI_thread.daemon = True
spotifyAPI_thread.start()

#temporary pause
time.sleep(5)
    
##create fastAPI to interact with the spotify API via the State and make it accessible
##over localhost

##create fastAPI app
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

##initialize fastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://172.16.1.91:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/get_playback")
def read_root():
    return {"playback_raw": state.playback_raw}

@app.get("/get_album_cover_url")
def get_album_cover_url():
    fallback_url = "https://cdn.kindling.me/pub.php?id=00000001.jpeg"

    if state.playback_raw is not None:
        try:
            album_cover_url = state.playback_raw['item']['album']['images'][0]['url']
            return {"album_cover_url": album_cover_url}
        except KeyError:
            return {"album_cover_url": fallback_url}
    else:
        return {"album_cover_url": fallback_url}

uvicorn.run(app, host="localhost", port=3010, reload=False)