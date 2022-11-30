import requests
import json
import threading

reqUrl = "http://localhost:8088/api/sms/send-bulk"

headersList = {
    "Accept": "*/*",
    "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    "x-api-key": "MEWtRosYLHMiTvskm2ruIS72rB68UWS6LEuZPDN9s19bxUr0",
    "Content-Type": "application/json"
}

payload = json.dumps({
    "callbackURL": "",
    "cpID": "381",
    "message": "Hi richard, how are you in test",
    "originAddress": "chiriku",
    "packageID": "8789",
    "partnerUsername": "chiriku",
    "username": "chiriku_api",
    "password": "#EDC4rfv",
    "recipients": [
        "254708113456"
    ],
    "requestID": "f9de6dda-696f-4fa8-93d3-29ac1e9ec34d"
})


def threadProc():
    r = requests.request(
        "POST", reqUrl, data=payload,  headers=headersList)

    print(r.text)


threads = []

for i in range(10):
    t = threading.Thread(target=threadProc)
    threads.append(t)
    t.start()

for t in threads:
    t.join()

print("Done")
