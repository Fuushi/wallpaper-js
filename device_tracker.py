import pythonping
from threading import Thread
import time, os, sys, json

#load config
with open("config.json", 'r') as fp:
    config = json.loads(fp.read())

#global objects
class State:
    def __init__(self):
        self.track_history = []
        return
    
    def get_status() -> bool:
        #uses state to determine the status to return at endpoint (indev)
        return
state = State()

#functions 
def ping_device(ip: str) -> bool:
    ping = pythonping.ping(target=ip, timeout = 1, count = 1)

    return ping.success()

#ping thread declaration
class pingThread:
    def __init__(self, state):
        self.state = state
        pass

    def run(self):
        while True:
            #tracking behavior in here
            
            #ping device
            found=ping_device(config['low_power_device_ip'])

            #add to tracking array
            state.track_history.append(found)

            #trim if over n (30 -> 30 min)
            if len(state.track_history) > config['low_power_device_track_dur']:
                state.track_history = state.track_history[1:]

            #debug print
            print(f"device found?: {found}")
            
            #sleep for n seconds (interval)
            time.sleep(config['low_power_device_ping_interval'])
        return
    
#start thread
ping_obj = pingThread(state)
thread = Thread(target=ping_obj.run)
thread.daemon=True
thread.start()
    


#fastapi endpoint for device tracking, accessing state
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

#initialize app
app = FastAPI()

#add middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#declare root endpoint
@app.get("/")
def read_root():
    return 200

@app.get("/device_status")
def device_status():
    #returns active device status

    if config['low_power_always_true']: return True
    if config['low_power_always_false']: return True

    if True in state.track_history:
        return {
            "status" : 200,
            "device_status" : True
        }
    return {
        "status" : 200,
        "device_status" : False
    }

#launch app with uvicorn
uvicorn.run(app, host="localhost", port=3015, reload=False)

