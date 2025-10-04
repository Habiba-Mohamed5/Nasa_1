// js/vegetation.js

async function initializeVegetationPage() {
    console.log("🌿 Initializing Vegetation Story Page...");

    // 1. Fetch data and create chart
    try {
        const ndviData = await fetchData("./data/modis_ndvi_global_annual.json");
        const ctx = document.getElementById('vegetation-chart').getContext('2d');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ndviData.map(d => d.year),
                datasets: [{
                    label: 'NDVI Trend',
                    data: ndviData.map(d => d.ndvi),
                    borderColor: 'limegreen',
                    tension: 0.3,
                    fill: true,
                    backgroundColor: 'rgba(50, 205, 50, 0.2)'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: '#fff' } }, x: { ticks: { color: '#fff' } } } }
        });

    } catch(error) {
        console.error("Failed to load vegetation chart data:", error);
    }

    // 2. Add entrance animations
    gsap.from('.story-header', { duration: 0.8, y: 30, opacity: 0, ease: "power2.out" });
    gsap.from('.story-content > *', { duration: 0.8, x: -30, opacity: 0, stagger: 0.15, delay: 0.3, ease: "power2.out" });
    gsap.from('.story-sidebar > *', { duration: 0.8, x: 30, opacity: 0, stagger: 0.15, delay: 0.5, ease: "power2.out" });

    // 3. Setup "Back" button
    const backBtn = document.getElementById('back-to-hub-btn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            router.navigate('explorer');
        });
    }
}

// Helper function to fetch data (can be moved to a shared file later)
async function fetchData(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch: ${url}`);
    return await response.json();
}