const dropArea = document.querySelector('.drop-area');
const inputFile = document.getElementById('input-file');
const predictionsContainer = document.getElementById('predictions-container');

// 👆 Click opens file picker
dropArea.addEventListener('click', () => {
  inputFile.click();
});

// 📂 File selected from input
inputFile.addEventListener('change', () => {
  const file = inputFile.files[0];
  processFile(file);
});

// 🖱 Drag file over
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.classList.add('highlight');
  dropArea.querySelector('h3').textContent = 'Release to upload image';
});

// 🖱 Drop file
dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.classList.remove('highlight');
  const file = e.dataTransfer.files[0];
  processFile(file);
});

// ❌ Drag leave or end
['dragleave', 'dragend'].forEach(type => {
  dropArea.addEventListener(type, () => {
    dropArea.classList.remove('highlight');
    dropArea.querySelector('h3').textContent = 'Drag and drop or click here to select image';
  });
});

// 📦 Main file processor
function processFile(file) {
  if (!file) return;

  // 🔍 Check file type
  if (!file.type.startsWith('image/')) {
    alert('Please upload a valid image file.');
    return;
  }

  // Reset prediction container
  predictionsContainer.innerHTML = '';
  
  // ⏳ Show loading
  dropArea.innerHTML = `
    <i class='bx bxs-cloud-upload upload-icon'></i>
    <p class="loading">Analyzing image...</p>
  `;

  // 📤 Send to backend
  const formData = new FormData();
  formData.append('file', file);

  fetch('http://localhost:8000/predict', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Show results in the predictions container
        showResults(data);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    })
    .catch(err => {
      dropArea.innerHTML = `
        <i class='bx bxs-cloud-upload upload-icon'></i>
        <div class="error">
          <h3>Upload failed</h3>
          <p>${err.message}</p>
        </div>
        <p style="margin-top: 15px">Click to try again</p>
      `;
    });
}

// Display the prediction results
function showResults(data) {
  // Add the image to the drop area
  dropArea.innerHTML = `
    <div class="image-container">
      <img src="data:image/jpeg;base64,${data.image}" alt="Uploaded image">
    </div>
    <h3>Click to upload another image</h3>
    <input type="file" accept="image/*" id="input-file" hidden>
  `;
  
  // Update the input file reference
  const newInputFile = document.getElementById('input-file');
  newInputFile.addEventListener('change', () => {
    const file = newInputFile.files[0];
    processFile(file);
  });

  // Create results container for predictions
  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'results-container';

  // Create predictions list
  const predictionsList = document.createElement('div');
  predictionsList.className = 'predictions-list';
  
  // Add header to predictions
  const predictionsHeader = document.createElement('h3');
  predictionsHeader.textContent = 'Flower Analysis Results';
  
  predictionsList.appendChild(predictionsHeader);
  
  // Sort predictions by confidence in descending order
  const sortedPredictions = [...data.predictions].sort((a, b) => 
    parseFloat(b.confidence) - parseFloat(a.confidence)
  );
  
  sortedPredictions.forEach(prediction => {
    const predictionItem = document.createElement('div');
    predictionItem.className = 'prediction-item';

    const className = document.createElement('span');
    className.className = 'class-name';
    className.textContent = prediction.class;

    const confidence = document.createElement('span');
    confidence.className = 'confidence';
    // Format the confidence to 2 decimal places
    const confidenceValue = parseFloat(prediction.confidence).toFixed(2);
    confidence.textContent = `${confidenceValue}%`;

    predictionItem.appendChild(className);
    predictionItem.appendChild(confidence);
    predictionsList.appendChild(predictionItem);
  });

  // Add predictions to the results container
  resultsContainer.appendChild(predictionsList);

  // Place results in the predictions container
  predictionsContainer.innerHTML = '';
  predictionsContainer.appendChild(resultsContainer);
}
