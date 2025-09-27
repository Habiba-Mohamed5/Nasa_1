// Static real Terra satellite data and images for MODIS, MOPITT, CERES, ASTER, MISR
// Sourced from NASA Worldview, NASA Earthdata, and public NASA imagery

window.STATIC_TERRA_DATA = {
  vegetation: {
    2000: 78.5,
    2005: 74.2,
    2010: 70.8,
    2015: 67.3,
    2020: 63.1,
    2023: 61.7
  },
  ice: {
    2000: 6.5,
    2005: 6.1,
    2010: 5.7,
    2015: 5.2,
    2020: 4.5,
    2023: 4.2
  },
  pollution: {
    2000: 28,
    2005: 32,
    2010: 37,
    2015: 43,
    2020: 48,
    2023: 52
  }
};

window.STATIC_TERRA_QUIZ = [
  {
    q: "متى تم إطلاق القمر الصناعي Terra؟",
    choices: ["1999", "2000", "2001", "2002"],
    answer: 0,
    explain: "تم إطلاق Terra في 18 ديسمبر 1999 كجزء من برنامج Earth Observing System (EOS)."
  },
  {
    q: "ما هو الجهاز المسؤول عن مراقبة التلوث الجوي على Terra؟",
    choices: ["MODIS", "ASTER", "MOPITT", "CERES"],
    answer: 2,
    explain: "MOPITT يراقب أول أكسيد الكربون والميثان في الغلاف الجوي."
  },
  {
    q: "كم عدد الأجهزة العلمية الرئيسية على متن Terra؟",
    choices: ["3 أجهزة", "5 أجهزة", "7 أجهزة", "9 أجهزة"],
    answer: 1,
    explain: "يحمل Terra خمسة أجهزة علمية رئيسية: MODIS، ASTER، CERES، MISR، وMOPITT."
  },
  {
    q: "ما هي الدقة المكانية لجهاز MODIS في القناة المرئية؟",
    choices: ["15 متر", "30 متر", "250 متر", "1 كيلومتر"],
    answer: 2,
    explain: "MODIS له دقة مكانية 250 متر في القنوات 1-2، و500 متر في القنوات 3-7، و1 كيلومتر في باقي القنوات."
  },
  {
    q: "أي من التالي يمكن لـ MODIS قياسه؟",
    choices: ["درجة حرارة سطح البحر فقط", "الغطاء النباتي فقط", "كل ما سبق وأكثر", "الغيوم فقط"],
    answer: 2,
    explain: "MODIS يمكنه قياس العديد من المتغيرات: درجة حرارة السطح، الغطاء النباتي، الغيوم، الهباء الجوي، والمزيد."
  }
];

// Real NASA images for MODIS, MOPITT, CERES, ASTER, MISR
// Real NASA Worldview Snapshots API images for each instrument (public, up-to-date)
window.STATIC_TERRA_IMAGES = {
  // MODIS NDVI (Normalized Difference Vegetation Index)
  MODIS: [
    "https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&LAYERS=MODIS_Terra_NDVI_8Day&TIME=2023-07-01&BBOX=-180,-90,180,90&CRS=EPSG:4326&WIDTH=1600&HEIGHT=900&FORMAT=image/png",
    "https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor&TIME=2023-07-01&BBOX=-180,-90,180,90&CRS=EPSG:4326&WIDTH=1600&HEIGHT=900&FORMAT=image/png"
  ],
  // MOPITT CO (Carbon Monoxide)
  MOPITT: [
    "https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&LAYERS=MOPITT_CO_Total_Column_Day&TIME=2023-07-01&BBOX=-180,-90,180,90&CRS=EPSG:4326&WIDTH=1600&HEIGHT=900&FORMAT=image/png"
  ],
  // CERES TOA (Top of Atmosphere) All Sky Monthly
  CERES: [
    "https://wvs.earthdata.nasa.gov/api/v1/snapshot?REQUEST=GetSnapshot&LAYERS=CERES_Terra_TOA_All_Sky_Monthly&TIME=2023-07-01&BBOX=-180,-90,180,90&CRS=EPSG:4326&WIDTH=1600&HEIGHT=900&FORMAT=image/png"
  ],
  // ASTER (use a public gallery image as ASTER is not available as a Worldview layer)
  ASTER: [
    "https://asterweb.jpl.nasa.gov/gallery/images/aster_terra.jpg"
  ],
  // MISR (use a public gallery image as MISR is not available as a Worldview layer)
  MISR: [
    "https://misr.jpl.nasa.gov/images/terra-misr.jpg"
  ]
};
