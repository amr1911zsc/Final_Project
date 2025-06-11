from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import HTMLResponse
from ultralytics import YOLO
from PIL import Image
import io
import base64
from jinja2 import Template
import torch

app = FastAPI()

# Load your YOLO model
model = YOLO("E:\EELU\Graduation-Project 2025\AI")

# HTML template with automatic submission
html_template = Template("""
<!DOCTYPE html>
<html>
<head>
    <title>YOLO Image Classification</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 20px; 
        }
        .container { 
            text-align: center; 
        }
        .upload-box {
            margin: 20px 0;
            padding: 20px;
            border: 2px dashed #cccccc;
            border-radius: 5px;
            cursor: pointer;
        }
        .upload-box.dragover {
            background-color: #e6f2ff;
        }
        img { 
            max-width: 224px; 
            max-height: 224px; 
            margin: 20px 0; 
        }
        .result { 
            font-size: 1.2em; 
            margin-top: 20px; 
        }
        .prediction-item { 
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
            padding: 8px;
            background: #f0f0f0;
            border-radius: 5px;
        }
        .confidence { 
            color: #2c7be5; 
            font-weight: bold; 
        }
        .loading {
            display: none;
            margin: 20px 0;
            color: #666;
        }
        .error {
            color: red;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>YOLO Image Classification</h1>
        <div class="upload-box" id="dropZone">
            <p>Drag and drop an image here, or click to select</p>
            <form id="uploadForm" action="/" method="post" enctype="multipart/form-data" style="display: none;">
                <input type="file" name="file" accept="image/*" id="fileInput" required>
            </form>
        </div>
        
        {% if error %}
        <div class="error">{{ error }}</div>
        {% endif %}

        {% if predictions %}
        <div class="result">
            <img src="data:image/{{ image_format }};base64,{{ image }}">
            <h3>Top Predictions:</h3>
            {% for class_name, confidence in predictions %}
            <div class="prediction-item">
                <span>{{ class_name }}</span>
                <span class="confidence">{{ confidence }}%</span>
            </div>
            {% endfor %}
        </div>
        {% endif %}
    </div>
    <div class="loading" id="loading">Processing image...</div>
    <script>
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const uploadForm = document.getElementById('uploadForm');
        const loading = document.getElementById('loading');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
        });

        dropZone.addEventListener('drop', handleDrop, false);
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', handleFileSelect, false);

        function handleDrop(e) {
            const files = e.dataTransfer.files;
            handleFiles(files);
        }

        function handleFileSelect(e) {
            const files = e.target.files;
            handleFiles(files);
        }

        function handleFiles(files) {
            if (files.length > 0) {
                fileInput.files = files;
                uploadForm.submit();
                loading.style.display = 'block';
            }
        }

        uploadForm.addEventListener('submit', () => loading.style.display = 'block');
    </script>
</body>
</html>
""")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return HTMLResponse(html_template.render(predictions=None))

@app.post("/", response_class=HTMLResponse)
async def predict(request: Request, file: UploadFile = File(...)):
    # Read and process image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    # Perform prediction
    results = model(image)
    
    # Get top 5 predictions
    probs = results[0].probs.data
    top5_conf, top5_idx = torch.topk(probs, 5)
    
    # Prepare predictions list
    predictions = []
    for conf, idx in zip(top5_conf.tolist(), top5_idx.tolist()):
        class_name = model.names[idx]
        confidence = round(conf * 100, 2)
        predictions.append((class_name, confidence))
    
    # Convert image to base64 for display
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    return HTMLResponse(html_template.render(
        predictions=predictions,
        image=img_str
    ))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)