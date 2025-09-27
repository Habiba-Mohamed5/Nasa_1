// Shared utilities and data for the NASA Data Visualization project

// Data constants
const YEARS = Array.from({length: 24}, (_, i) => 2000 + i); // 2000..2023

// Static data storage
let REAL_DATA = {
    vegetation: {},
    ice: {},
    pollution: {}
};

// NASA Worldview API URLs for real satellite imagery
const NASA_IMAGES = {
    vegetation: {
        2000: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MODIS_Terra_NDVI_8Day&time=2000-01-01&bbox=-180,-90,180,90',
        2005: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MODIS_Terra_NDVI_8Day&time=2005-07-01&bbox=-180,-90,180,90',
        2010: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MODIS_Terra_NDVI_8Day&time=2010-07-01&bbox=-180,-90,180,90',
        2015: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MODIS_Terra_NDVI_8Day&time=2015-07-01&bbox=-180,-90,180,90',
        2020: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MODIS_Terra_NDVI_8Day&time=2020-07-01&bbox=-180,-90,180,90',
        2023: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MODIS_Terra_NDVI_8Day&time=2023-07-01&bbox=-180,-90,180,90'
    },
    ice: {
        2000: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MODIS_Terra_Snow_Cover&time=2000-03-01&bbox=-180,60,180,90',
        2005: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MODIS_Terra_Snow_Cover&time=2005-03-01&bbox=-180,60,180,90',
        2010: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MODIS_Terra_Snow_Cover&time=2010-03-01&bbox=-180,60,180,90',
        2015: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MODIS_Terra_Snow_Cover&time=2015-03-01&bbox=-180,60,180,90',
        2020: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MODIS_Terra_Snow_Cover&time=2020-03-01&bbox=-180,60,180,90',
        2023: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MODIS_Terra_Snow_Cover&time=2023-03-01&bbox=-180,60,180,90'
    },
    pollution: {
        2000: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MOPITT_CO_Total_Column_Day&time=2000-07-01&bbox=-180,-90,180,90',
        2005: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MOPITT_CO_Total_Column_Day&time=2005-07-01&bbox=-180,-90,180,90',
        2010: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MOPITT_CO_Total_Column_Day&time=2010-07-01&bbox=-180,-90,180,90',
        2015: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MOPITT_CO_Total_Column_Day&time=2015-07-01&bbox=-180,-90,180,90',
        2020: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MOPITT_CO_Total_Column_Day&time=2020-07-01&bbox=-180,-90,180,90',
        2023: '/api/nasa/worldview?layers=MODIS_Terra_CorrectedReflectance_TrueColor,MOPITT_CO_Total_Column_Day&time=2023-07-01&bbox=-180,-90,180,90'
    }
};

// Quiz data storage
let QUIZ_DATA = [];

// Function to load Terra satellite quiz data
async function loadTerraQuizData() {
    if (window.STATIC_TERRA_QUIZ) {
        QUIZ_DATA = window.STATIC_TERRA_QUIZ;
        return QUIZ_DATA;
    }
    
    // Fallback quiz questions
    QUIZ_DATA = [
        {
            q: 'متى تم إطلاق القمر الصناعي Terra؟',
            choices: ['1999', '2000', '2001', '2002'],
            answer: 0,
            explain: 'تم إطلاق Terra في 18 ديسمبر 1999 كجزء من برنامج Earth Observing System (EOS).'
        },
        {
            q: 'ما هو الجهاز المسؤول عن مراقبة التلوث الجوي على Terra؟',
            choices: ['MODIS', 'ASTER', 'MOPITT', 'CERES'],
            answer: 2,
            explain: 'MOPITT يراقب أول أكسيد الكربون والميثان في الغلاف الجوي.'
        },
        {
            q: 'كم عدد الأجهزة العلمية الرئيسية على متن Terra؟',
            choices: ['3 أجهزة', '5 أجهزة', '7 أجهزة', '9 أجهزة'],
            answer: 1,
            explain: 'يحمل Terra خمسة أجهزة علمية رئيسية: MODIS، ASTER، CERES، MISR، وMOPITT.'
        }
    ];
    return QUIZ_DATA;
}

// Get nearest available image for a dataset and year
function getNearestImage(dataset, year) {
    const keys = Object.keys(NASA_IMAGES[dataset]).map(k => parseInt(k)).sort((a, b) => a - b);
    let best = keys[0];
    for (let k of keys) {
        if (k <= year) best = k;
        else break;
    }
    return NASA_IMAGES[dataset][best];
}

// Export to global scope
window.NasaApp = {
    YEARS,
    REAL_DATA,
    NASA_IMAGES,
    getNearestImage,
    loadTerraQuizData
};

// Export data to global scope
window.QUIZ_DATA = QUIZ_DATA;
window.REAL_DATA = REAL_DATA;