let chart;
let currentDataset = "vegetation";
let dataStore = {};
let map, overlay;

fetch("data.json")
  .then(res => res.json())
  .then(data => {
    dataStore = data;
    initMap();
    initChart();
    updateMap("vegetation");
    updateView(2000);
  });

/* خريطة Leaflet */
function initMap() {
  map = L.map("map").setView([20, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);
}

/* تحديث الصور على الخريطة */
function updateMap(dataset) {
  if (overlay) map.removeLayer(overlay);

  let imgUrl = "";
  if (dataset === "vegetation") imgUrl = "assets/vegetation.jpg";
  if (dataset === "ice") imgUrl = "assets/ice.jpg";
  if (dataset === "pollution") imgUrl = "assets/pollution.jpg";

  overlay = L.imageOverlay(imgUrl, [[-90, -180], [90, 180]]);
  overlay.addTo(map);
}

/* الرسم البياني */
function initChart() {
  const ctx = document.getElementById("chart").getContext("2d");
  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: Object.keys(dataStore.vegetation),
      datasets: [{
        label: "البيانات",
        data: Object.values(dataStore[currentDataset]),
        borderColor: "cyan",
        backgroundColor: "rgba(0,255,255,0.3)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "white" } } },
      scales: {
        x: { ticks: { color: "white" } },
        y: { ticks: { color: "white" } }
      }
    }
  });
}

/* تحديث العرض */
function updateView(year) {
  document.getElementById("yearValue").textContent = year;

  let dataset = dataStore[currentDataset];
  let value = dataset[year] || "غير متاح";

  document.getElementById("storyTitle").textContent = getTitle(currentDataset, year);
  document.getElementById("storyText").textContent = getStory(currentDataset, year, value);

  chart.data.datasets[0].data = Object.values(dataStore[currentDataset]);
  chart.update();
}

/* تغيير الداتا */
function setDataset(type) {
  currentDataset = type;
  chart.data.datasets[0].data = Object.values(dataStore[type]);
  chart.data.labels = Object.keys(dataStore[type]);
  chart.update();

  updateMap(type);

  let year = document.getElementById("yearRange").value;
  updateView(year);
}

/* النصوص */
function getTitle(dataset, year) {
  if(dataset === "vegetation") return `الغابات عام ${year}`;
  if(dataset === "ice") return `الجليد عام ${year}`;
  if(dataset === "pollution") return `التلوث عام ${year}`;
}

function getStory(dataset, year, value) {
  if(dataset === "vegetation"){
    if(year <= 2005) return "في بداية الألفية كان الغطاء النباتي مستقراً نسبياً.";
    if(year <= 2010) return "بدأت مؤشرات فقدان الغابات تظهر بوضوح.";
    if(year <= 2015) return "تسارع تراجع الغابات نتيجة قطع الأشجار والحرائق.";
    if(year <= 2020) return "بين 2015 و2020 فقد العالم مساحات كبيرة من الغابات.";
    return "عام 2023: جهود إعادة التشجير مستمرة لكن الانخفاض مازال ملموساً.";
  }
  if(dataset === "ice"){
    if(year <= 2005) return "الجليد القطبي كان واسع الامتداد في بداية الألفية.";
    if(year <= 2010) return "بدأ الجليد يتقلص بوتيرة أسرع مع ارتفاع الحرارة.";
    if(year <= 2015) return "سجلت مستويات قياسية دنيا للجليد البحري.";
    if(year <= 2020) return "استمرت خسائر الجليد بشكل مقلق.";
    return "عام 2023: مستويات منخفضة جداً للجليد مقارنة ببداية القرن.";
  }
  if(dataset === "pollution"){
    if(year <= 2005) return "التلوث الصناعي كان أقل نسبياً في بداية القرن.";
    if(year <= 2010) return "ارتفعت مستويات التلوث خصوصاً في آسيا.";
    if(year <= 2015) return "وصل التلوث الهوائي لمستويات حرجة في المدن الكبرى.";
    if(year <= 2020) return "بدأت مبادرات الطاقة النظيفة لكن التلوث بقي مرتفعاً.";
    return "عام 2023: رغم التحسن الجزئي، التلوث العالمي مازال تحدياً كبيراً.";
  }
}

/* التحكم في السلايدر */
document.getElementById("yearRange").addEventListener("input", (e) => {
  updateView(e.target.value);
});

/* التحكم في الزراء */
document.getElementById("vegetationButton").addEventListener("click", () => {
  setDataset("vegetation");
});
document.getElementById("iceButton").addEventListener("click", () => {
  setDataset("ice");
});
document.getElementById("pollutionButton").addEventListener("click", () => {
  setDataset("pollution");
});