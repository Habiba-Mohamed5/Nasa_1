// js/explorer.js

let currentStory = 'vegetation';
let storyChart;

// دالة لتحديث كل عناصر الواجهة بناءً على سنة محددة
function updateDashboard(index) {
    const story = storyData[currentStory];
    if (!story || !story.frames[index]) return;

    const frame = story.frames[index];
    const year = frame.year;

    // 1. تحديث الصورة في العارض
    const viewer = document.getElementById('story-viewer');
    if (viewer) viewer.style.backgroundImage = `url(${frame.image})`;

    // 2. تحديث نص القصة والسنة
    const captionYear = document.getElementById('caption-year');
    if (captionYear) captionYear.innerText = `Year: ${year}`;
    
    const captionNote = document.getElementById('caption-note');
    if (captionNote) captionNote.innerText = frame.note;

    // 3. تحديث قيمة شريط الزمن والنص بجانبه
    const timelineLabel = document.getElementById('timeline-label');
    if (timelineLabel) timelineLabel.innerText = year;
    
    const timelineSlider = document.getElementById('timeline-slider');
    if (timelineSlider) timelineSlider.value = index;
    
    // 4. تحديث التفاعل مع المخطط البياني (إظهار النقطة الحالية)
    if (storyChart) {
        storyChart.setActiveElements([{ datasetIndex: 0, index: index }]);
        storyChart.tooltip.setActiveElements([{ datasetIndex: 0, index: index }]);
        storyChart.update();
    }
}

// دالة لرسم المخطط البياني أو تحديثه عند تغيير القصة
function drawChart() {
    const story = storyData[currentStory];
    if (!story || !story.data || story.data.length === 0) {
        // إخفاء المخطط إذا لم تكن هناك بيانات
        const canvasId = 'story-chart';
        const existingChart = Chart.getChart(canvasId);
        if (existingChart) existingChart.destroy();
        return;
    };

    const canvasId = 'story-chart';
    const existingChart = Chart.getChart(canvasId);
    if (existingChart) existingChart.destroy();
    
    const ctx = document.getElementById(canvasId).getContext('2d');

    // تحديد البيانات التي سيتم عرضها بناءً على القصة الحالية
    const dataKey = Object.keys(story.data[0]).find(key => key !== 'year');

    const chartData = {
        labels: story.data.map(d => d.year),
        datasets: [{
            label: currentStory.charAt(0).toUpperCase() + currentStory.slice(1),
            data: story.data.map(d => d[dataKey]),
            borderColor: 'cyan',
            tension: 0.3,
            pointBackgroundColor: 'white',
            pointRadius: 4,
        }]
    };

    storyChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#fff' } } },
            scales: {
                y: { ticks: { color: '#fff' } },
                x: { ticks: { color: '#fff' } }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            onHover: (event, chartElement) => {
                if (chartElement.length > 0) {
                    const index = chartElement[0].index;
                    // تحديث الواجهة عند مرور الماوس فوق المخطط
                    if (parseInt(document.getElementById('timeline-slider').value) !== index) {
                         updateDashboard(index);
                    }
                }
            }
        }
    });
}

// الدالة الرئيسية التي يستدعيها الـ Router
function initializeExplorerPage() {
    if (!document.getElementById('timeline-slider')) return; // نتأكد أننا في الصفحة الصحيحة
    
    // إعداد أزرار اختيار القصة
    const buttons = document.querySelectorAll('.dataset-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            currentStory = button.dataset.story;
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            drawChart();
            updateDashboard(0); // العودة للبداية عند تغيير القصة
        });
    });

    // إعداد شريط الزمن
    const slider = document.getElementById('timeline-slider');
    slider.addEventListener('input', (event) => {
        const index = parseInt(event.target.value, 10);
        updateDashboard(index);
    });

    // تحميل أول قصة بشكل افتراضي
    drawChart();
    updateDashboard(0);
}

// جعل الدالة متاحة للـ Router
window.initializeExplorerPage = initializeExplorerPage;