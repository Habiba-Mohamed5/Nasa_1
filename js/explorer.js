// explorer.js

// UI for Explorer Page
function explorerPageTemplate() {
  return `
    <div class="explorer-page container">
      <h2>🌍 NASA Data Explorer</h2>
      <p>Select a dataset and year to view satellite imagery.</p>
      
      <div class="explorer-controls">
        <label>Dataset:</label>
        <select id="datasetSelect">
          <option value="vegetation">Vegetation</option>
          <option value="ice">Ice</option>
          <option value="pollution">Pollution</option>
        </select>
        
        <label>Year:</label>
        <select id="yearSelect">
          ${window.NasaApp.YEARS.map(y => `<option value="${y}">${y}</option>`).join('')}
        </select>
        
        <button id="loadBtn" class="btn">Load Image</button>
      </div>
      
      <div class="explorer-result">
        <img id="resultImage" src="" alt="NASA Data" />
      </div>
    </div>
  `;
}

// Logic for Explorer Page
function initializeExplorerPage() {
  const datasetSelect = document.getElementById('datasetSelect');
  const yearSelect = document.getElementById('yearSelect');
  const loadBtn = document.getElementById('loadBtn');
  const resultImage = document.getElementById('resultImage');

  if (!datasetSelect || !yearSelect || !loadBtn || !resultImage) {
    console.error("❌ Explorer page elements not found");
    return;
  }

  loadBtn.addEventListener('click', () => {
    const dataset = datasetSelect.value;
    const year = parseInt(yearSelect.value);
    const imgUrl = window.NasaApp.getNearestImage(dataset, year);
    console.log("🛰 Loading image:", imgUrl);
    resultImage.src = imgUrl;
  });
}

// Export functions
window.explorerPageTemplate = explorerPageTemplate;
window.initializeExplorerPage = initializeExplorerPage;
