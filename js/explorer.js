// js/explorer.js (النسخة النهائية الطارئة)

// ✅ تم وضع البيانات مباشرة هنا لتجنب أي مشاكل في التحميل
const ndviData = [
    {"year":2000, "ndvi":0.72}, {"year":2001, "ndvi":0.73},
    {"year":2002, "ndvi":0.74}, {"year":2003, "ndvi":0.74},
    {"year":2004, "ndvi":0.75}, {"year":2005, "ndvi":0.75},
    {"year":2006, "ndvi":0.74}, {"year":2007, "ndvi":0.74},
    {"year":2008, "ndvi":0.73}, {"year":2009, "ndvi":0.73},
    {"year":2010, "ndvi":0.72}, {"year":2011, "ndvi":0.72},
    {"year":2012, "ndvi":0.71}, {"year":2013, "ndvi":0.71},
    {"year":2014, "ndvi":0.70}, {"year":2015, "ndvi":0.70},
    {"year":2016, "ndvi":0.69}, {"year":2017, "ndvi":0.69},
    {"year":2018, "ndvi":0.68}, {"year":2019, "ndvi":0.68},
    {"year":2020, "ndvi":0.67}, {"year":2021, "ndvi":0.67},
    {"year":2022, "ndvi":0.66}, {"year":2023, "ndvi":0.66}
];

function createAmazonChart(canvasId, data, label) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const existingChart = Chart.getChart(canvas);
    if (existingChart) existingChart.destroy();

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.year),
            datasets: [{
                label: label,
                data: data.map(d => d.ndvi),
                borderColor: 'limegreen',
                tension: 0.3,
                pointRadius: 0,
                fill: true,
                backgroundColor: 'rgba(50, 205, 50, 0.2)'
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { display: false }, x: { display: false } }
        }
    });
}

function initializeExplorerPage() {
    console.log("🚀 Initializing Amazon Story Page...");

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        return console.error("GSAP or ScrollTrigger is not loaded.");
    }
    gsap.registerPlugin(ScrollTrigger);

    try {
        createAmazonChart('chart1', ndviData.slice(0, 6));
        createAmazonChart('chart2', ndviData.slice(6, 13));
        createAmazonChart('chart3', ndviData.slice(13, 19));
        createAmazonChart('chart4', ndviData.slice(19));

        const sections = document.querySelectorAll('.story-section');
        sections.forEach(section => {
            gsap.from(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: "power2.out",
            });
        });

        console.log("✅ All animations and charts are set up.");
    } catch (error) {
        console.error("An error occurred during explorer page initialization:", error);
    }
}

window.initializeExplorerPage = initializeExplorerPage;