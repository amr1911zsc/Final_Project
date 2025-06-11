from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import base64
import torch
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files
app.mount("/static", StaticFiles(directory="."), name="static")

# Load YOLO model
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "best.pt")
model = YOLO(model_path)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Resize image to 256x256
        image = image.resize((256, 256), Image.Resampling.LANCZOS)
        
        # Perform prediction
        results = model(image)
        
        # Get top 5 predictions
        probs = results[0].probs.data
        top5_conf, top5_idx = torch.topk(probs, 5)  # Get top 5 predictions
        
        # Prepare predictions list
        predictions = []
        for conf, idx in zip(top5_conf.tolist(), top5_idx.tolist()):
            class_name = model.names[idx]
            confidence = round(conf * 100, 2)
            predictions.append({
                "class": class_name,
                "confidence": confidence
            })
        
        # Convert image to base64
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return JSONResponse({
            "success": True,
            "predictions": predictions,
            "image": img_str
        })
        
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return JSONResponse({
            "success": False,
            "error": str(e)
        })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)