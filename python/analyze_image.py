# analyze_image.py
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse

app = FastAPI()

import os

@app.post("/analyze")
def analyze_image(file: UploadFile = File(...)):
    # public/images/analyze_image_test のみを常に読み込む
    image_path = os.path.join(os.path.dirname(__file__), "..", "public", "images", "analyze_image_test")
    if not os.path.exists(image_path):
        return JSONResponse(content={"error": "File not found: analyze_image_test"}, status_code=404)
    with open(image_path, "rb") as f:
        image_bytes = f.read()
    # ここで image_bytes を使って画像解析処理を行う
    # 仮実装: 画像内容を無視してダミー食材リストを返す
    return JSONResponse(content={"ingredients": ["たまご", "牛乳", "トマト"]})
