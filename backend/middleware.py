from dotenv import load_dotenv
import os

load_dotenv()

apiKey = os.getenv("API_KEY")

def isPass(inputKey):
    return inputKey==apiKey

