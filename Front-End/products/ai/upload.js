const dropArea = document.querySelector('.drop-area');
const inputFile = document.getElementById('input-file');

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

  // 🔍 Check file size
  if (file.size > 2 * 1024 * 1024) {
    alert('Image must be less than 2MB.');
    return;
  }

  // ⏳ Show loading
  dropArea.innerHTML = '<p class="loading">Analyzing image...</p>';

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
        showResults(data);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    })
    .catch(err => {
      dropArea.innerHTML = `
        <div class="error">
          <h3>Upload failed</h3>
          <p>${err.message}</p>
        </div>
      `;
    });
}

// عرض النتائج (التنبؤات)
function showResults(data) {
  const resultsContainer = document.createElement('div');
  resultsContainer.className = 'results-container';

  // Create image container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'image-container';
  const img = document.createElement('img');
  img.src = `data:image/jpeg;base64,${data.image}`;
  imageContainer.appendChild(img);

  // Create predictions list
  const predictionsList = document.createElement('div');
  predictionsList.className = 'predictions-list';
  data.predictions.forEach(prediction => {
    const predictionItem = document.createElement('div');
    predictionItem.className = 'prediction-item';

    const className = document.createElement('span');
    className.className = 'class-name';
    className.textContent = prediction.class;

    const confidence = document.createElement('span');
    confidence.className = 'confidence';
    confidence.textContent = `${prediction.confidence}%`;

    predictionItem.appendChild(className);
    predictionItem.appendChild(confidence);
    predictionsList.appendChild(predictionItem);
  });

  // Append image and predictions to results container
  resultsContainer.appendChild(imageContainer);
  resultsContainer.appendChild(predictionsList);

  // Replace drop area content with results
  dropArea.innerHTML = '';
  dropArea.appendChild(resultsContainer);
}
