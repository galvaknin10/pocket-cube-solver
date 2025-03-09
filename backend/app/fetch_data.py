import requests

GOOGLE_DRIVE_FILE_ID = "1qRwBc83zIU_uDC356Ls55JmWaU9Co7pX"
URL = f"https://drive.google.com/uc?export=download&id={GOOGLE_DRIVE_FILE_ID}"
OUTPUT_FILE = "/data/tree_data.pkl"

response = requests.get(URL)
with open(OUTPUT_FILE, "wb") as file:
    file.write(response.content)
