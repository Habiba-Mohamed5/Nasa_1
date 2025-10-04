// Main application entry point
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Content Loaded - Starting app initialization');
    console.log('📦 Available libraries:', {
        Leaflet: typeof L !== 'undefined' ? '✅' : '❌',
        Chart: typeof Chart !== 'undefined' ? '✅' : '❌',
        GSAP: typeof gsap !== 'undefined' ? '✅' : '❌'
    });
    initializeApp();
});

async function initializeApp() {
    // Show loading message
    showGlobalLoading('Loading Real Terra Data...');

    try {
        // Wait a bit for external libraries to load
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if libraries are loaded
        console.log('📚 Library check after delay:', {
            Leaflet: typeof L !== 'undefined' ? '✅' : '❌',
            Chart: typeof Chart !== 'undefined' ? '✅' : '❌',
            GSAP: typeof gsap !== 'undefined' ? '✅' : '❌'
        });
        
        // Load static data
        await loadStaticData();
        
        // Register all routes
        registerRoutes();

        // Initialize the router
        console.log('🔄 Initializing router...');
        router.init();

        console.log('✅ NASA Terra Visualization App initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing app:', error);
        showError('Application Loading Error');
    } finally {
        // Hide loading
        hideGlobalLoading();
    }
}

async function loadStaticData() {
    console.log('🔄 Loading static data...');
    
    // Load Terra quiz questions from JSON file
    try {
        console.log('📡 Fetching quiz data from data/quiz_questions.json...');
        const response = await fetch('data/quiz_questions.json');
        console.log('📡 Response status:', response.status, response.statusText);
        
        if (response.ok) {
            const quizData = await response.json();
            // Assuming the JSON structure has a 'questions' array
            window.QUIZ_DATA = quizData.questions; 
            console.log('✅ Terra quiz questions loaded from JSON:', window.QUIZ_DATA.length, 'questions');
            console.log('🔍 First question:', window.QUIZ_DATA[0]);
        } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.warn('⚠️ Failed to load quiz from JSON, using fallback:', error);
        // Fallback to static data
        if (window.STATIC_TERRA_QUIZ) {
            window.QUIZ_DATA = window.STATIC_TERRA_QUIZ;
            console.log('✅ Terra quiz questions loaded from static data');
        } else {
            // Ultimate fallback (translated questions)
            window.QUIZ_DATA = [
                {
                    id: 1,
                    question: "When was the Terra satellite launched?",
                    choices: ["1999", "2000", "2001", "2002"],
                    correctAnswer: 0,
                    explanation: "Terra was launched on December 18, 1999, as part of the Earth Observing System (EOS) program."
                }
            ];
            console.log('✅ Using minimal fallback quiz data');
        }
    }
    
    // Load static Terra data if available
    if (window.STATIC_TERRA_DATA) {
        window.REAL_DATA = window.STATIC_TERRA_DATA;
        console.log('✅ Terra static data loaded');
    }
    
    console.log('🔍 Final QUIZ_DATA:', window.QUIZ_DATA);
}

function showGlobalLoading(message) {
    const loading = document.createElement('div');
    loading.id = 'global-loading';
    loading.innerHTML = `
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                    background: rgba(15, 23, 42, 0.95); z-index: 9999; 
                    display: flex; flex-direction: column; align-items: center; 
                    justify-content: center; color: white;">
            <div class="spinner" style="width: 60px; height: 60px; border: 4px solid rgba(255,255,255,0.1); 
                                        border-top: 4px solid #0ea5e9; border-radius: 50%; 
                                        animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
            <h3 style="margin: 0; font-family: 'Cairo', sans-serif;">${message}</h3>
            <p style="color: #cbd5e1; margin-top: 8px;">Please wait...</p>
        </div>
    `;
    document.body.appendChild(loading);
}

function hideGlobalLoading() {
    const loading = document.getElementById('global-loading');
    if (loading) {
        loading.remove();
    }
}

function showError(message) {
    console.warn('⚠️', message);
    // Could show a toast notification here
}

function registerRoutes() {
    // Home page
    router.addRoute('home', loadHomePage);
    
    // Data Explorer page
    router.addRoute('explorer', loadExplorerPage);
    
    // Video page
    router.addRoute('video', loadVideoPage);
    
    // Quiz page
    router.addRoute('quiz', loadQuizPage);
    
    // About page
    router.addRoute('about', loadAboutPage);
}

// Page loading functions
async function loadHomePage() {
    console.log('🏠 Loading home page...');
    const response = await fetch('pages/home.html');
    const html = await response.text();
    console.log('✅ Home page HTML loaded, length:', html.length);
    
    setTimeout(() => {
        console.log('🔄 Initializing home page...');
        initializeHomePage();
    }, 100);
    
    // Additional fallback button setup with longer delay
    setTimeout(() => {
        console.log('🔄 Fallback button setup...');
        setupHomePageButtons();
    }, 500);
    
    return html;
}

async function loadExplorerPage() {
    const response = await fetch('pages/explorer.html');
    const html = await response.text();
    
    setTimeout(() => {
        initializeExplorerPage();
    }, 100);
    
    return html;
}

async function loadVideoPage() {
    console.log('🎬 Loading video page...');
    const response = await fetch('pages/video.html');
    const html = await response.text();
    console.log('✅ Video page HTML loaded, length:', html.length);
    
    setTimeout(() => {
        console.log('🔄 Initializing video page...');
        initializeVideoPage();
    }, 100);
    
    return html;
}

async function loadQuizPage() {
    const response = await fetch('pages/quiz.html');
    const html = await response.text();
    
    // Ensure quiz data is loaded before initializing
    setTimeout(async () => {
        console.log('🔄 Initializing quiz page...');
        
        // Check if quiz data is available
        if (!window.QUIZ_DATA || window.QUIZ_DATA.length === 0) {
            console.log('⚠️ Quiz data not loaded, attempting to load...');
            try {
                await loadStaticData();
            } catch (error) {
                console.error('❌ Failed to load quiz data:', error);
            }
        }
        
        // Initialize quiz with a small delay to ensure DOM is ready
        setTimeout(() => {
            initializeQuizPage();
        }, 200);
    }, 100);
    
    return html;
}

async function loadAboutPage() {
    const response = await fetch('pages/about.html');
    const html = await response.text();
    
    setTimeout(() => {
        initializeAboutPage();
    }, 100);
    
    return html;
}

// Page initialization functions
async function initializeHomePage() {
    // Animate elements
    if (typeof gsap !== 'undefined') {
        gsap.from('.hero-section', { duration: 0.8, y: 50, opacity: 0 });
        gsap.from('.feature-card', { duration: 0.6, y: 30, opacity: 0, stagger: 0.2, delay: 0.3 });
    }
    
    // Set up all navigation buttons on home page
    const buttonMappings = {
        'exploreBtn': 'explorer',
        'exploreBtn2': 'explorer',
        'quizBtn': 'quiz',
        'aboutBtn': 'about'
    };
    
    console.log('🔗 Setting up home page navigation buttons...');
    
    Object.entries(buttonMappings).forEach(([btnId, page]) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            console.log(`✅ Found button: ${btnId} -> ${page}`);
            btn.addEventListener('click', () => {
                console.log(`🚀 Button clicked: Navigating to ${page}`);
                router.navigate(page);
            });
        } else {
            console.log(`❌ Button not found: ${btnId}`);
        }
    });
}

// Fallback function to ensure buttons are set up
function setupHomePageButtons() {
    const exploreBtn = document.getElementById('exploreBtn');
    const quizBtn = document.getElementById('quizBtn');
    
    if (exploreBtn && !exploreBtn.hasAttribute('data-listener-added')) {
        console.log('🔧 Adding fallback listener to exploreBtn');
        exploreBtn.addEventListener('click', () => {
            console.log('🚀 Fallback: Navigating to explorer');
            router.navigate('explorer');
        });
        exploreBtn.setAttribute('data-listener-added', 'true');
    }
    
    if (quizBtn && !quizBtn.hasAttribute('data-listener-added')) {
        console.log('🔧 Adding fallback listener to quizBtn');
        quizBtn.addEventListener('click', () => {
            console.log('🚀 Fallback: Navigating to quiz');
            router.navigate('quiz');
        });
        quizBtn.setAttribute('data-listener-added', 'true');
    }
}


function initializeExplorerPage() {
    // The explorer page has its own JavaScript that handles initialization
    // This function is kept for compatibility but the real work is done in explorer.html
    console.log('✅ Explorer page loaded - initialization handled by page script');
    
    // Animate elements
    if (typeof gsap !== 'undefined') {
        gsap.from('.panel', { duration: 0.6, y: 30, opacity: 0, stagger: 0.1 });
    }
}

function initializeVideoPage() {
    console.log('✅ Video page loaded - initialization handled by page script');
    
    // Animate elements
    if (typeof gsap !== 'undefined') {
        gsap.from('.coming-soon-section', { duration: 0.8, y: 50, opacity: 0 });
        gsap.from('.video-preview-section', { duration: 0.6, y: 30, opacity: 0, delay: 0.2 });
        gsap.from('.educational-preview-section', { duration: 0.6, y: 30, opacity: 0, delay: 0.4 });
    }
}

// Chart initialization is now handled in explorer.html

function setupExplorerControls() {
    let currentDataset = 'vegetation';
    let playing = false;
    let playInterval = null;
    let currentYear = 2010;
    
    // Dataset buttons
    const datasetBtns = document.querySelectorAll('.dataset-btn');
    datasetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            datasetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDataset = btn.getAttribute('data-dataset');
            updateVisualization();
        });
    });
    
    // Year slider
    const yearSlider = document.getElementById('yearSlider');
    if (yearSlider) {
        yearSlider.addEventListener('input', () => {
            currentYear = parseInt(yearSlider.value);
            updateVisualization();
        });
    }
    
    // Play/pause button
    const playPauseBtn = document.getElementById('playPause');
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            if (!playing) {
                startAnimation();
            } else {
                stopAnimation();
            }
        });
    }
    
    // Step buttons
    const stepBack = document.getElementById('stepBack');
    const stepForward = document.getElementById('stepForward');
    
    if (stepBack) {
        stepBack.addEventListener('click', () => {
            let newYear = currentYear - 1;
            if (newYear < 2000) newYear = 2023;
            yearSlider.value = newYear;
            currentYear = newYear;
            updateVisualization();
        });
    }
    
    if (stepForward) {
        stepForward.addEventListener('click', () => {
            let newYear = currentYear + 1;
            if (newYear > 2023) newYear = 2000;
            yearSlider.value = newYear;
            currentYear = newYear;
            updateVisualization();
        });
    }
    
    // Region selector
    const regionSelect = document.getElementById('regionSelect');
    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            updateVisualization();
            updateMapView();
        });
    }
    
    function startAnimation() {
        playing = true;
        playPauseBtn.textContent = '⏸ Pause';
        playInterval = setInterval(() => {
            let newYear = currentYear + 1;
            if (newYear > 2023) newYear = 2000;
            yearSlider.value = newYear;
            currentYear = newYear;
            updateVisualization();
        }, 900);
    }
    
    function stopAnimation() {
        playing = false;
        playPauseBtn.textContent = '▶ Play';
        clearInterval(playInterval);
    }
    
    function updateVisualization() {
        // Update map year display
        const mapYearEl = document.getElementById('mapYear');
        if (mapYearEl) {
            mapYearEl.textContent = currentYear;
        }
        
        // Update year display in animation viewer
        const yearDisplay = document.getElementById('yearDisplay');
        if (yearDisplay) {
            yearDisplay.textContent = currentYear;
        }
        
        // Update story text
        updateStoryText();
        
        // Update map data points
        updateMapPoints();
        
        // Update chart highlight
        updateChartHighlight();
    }
    
    function updateStoryText() {
        const storyText = document.getElementById('storyText');
        const regionSelect = document.getElementById('regionSelect');
        
        if (storyText) {
            const region = regionSelect ? regionSelect.value : 'world';
            const story = getStoryText(currentDataset, currentYear, region);
            storyText.textContent = story;
        }
    }
    
    function updateMapPoints() {
        if (!window.currentMap || !window.dataLayer) return;
        
        const regionSelect = document.getElementById('regionSelect');
        const region = regionSelect ? regionSelect.value : 'world';
        
        // Clear existing points
        window.dataLayer.clearLayers();
        
        // Generate new points
        const points = generateMockPoints(currentDataset, currentYear, region);
        points.forEach(point => {
            const circle = L.circle([point.lat, point.lon], {
                color: point.color,
                fillColor: point.color,
                fillOpacity: 0.45,
                radius: point.radius
            });
            circle.bindTooltip(point.tooltip, { direction: 'top' });
            window.dataLayer.addLayer(circle);
        });
    }
    
    function updateChartHighlight() {
        if (!window.currentChart) return;
        
        window.currentChart.data.datasets.forEach(ds => {
            // Note: Chart labels in Arabic are translated below for logic check
            const label = ds.label.toLowerCase(); 
            if ((currentDataset === 'vegetation' && label.includes('vegetation')) ||
                (currentDataset === 'ice' && label.includes('ice')) ||
                (currentDataset === 'pollution' && label.includes('pollution'))) {
                ds.borderWidth = 4;
                ds.pointRadius = 6;
            } else {
                ds.borderWidth = 2;
                ds.pointRadius = 2;
            }
        });
        window.currentChart.update();
    }
    
    function updateMapView() {
        if (!window.currentMap) return;
        
        const regionSelect = document.getElementById('regionSelect');
        const region = regionSelect ? regionSelect.value : 'world';
        
        if (region === 'world') {
            window.currentMap.setView([5, 0], 2);
        } else if (region === 'amazon') {
            window.currentMap.setView([-5, -65], 5);
        } else if (region === 'arctic') {
            window.currentMap.setView([78, 0], 2.2);
        } else if (region === 'africa') {
            window.currentMap.setView([0, 20], 3);
        }
    }
    
    // Initial update
    updateVisualization();
}

// Helper functions (Story text translated)
function getStoryText(dataset, year, region = 'world') {
    if (dataset === 'vegetation') {
        if (year <= 2005) return '2000–2005: Strong vegetation cover in key regions.';
        if (year <= 2012) return '2006–2012: Start of a noticeable decline due to deforestation.';
        if (year <= 2018) return '2013–2018: Accelerated loss in the Amazon and other tropical areas.';
        return '2019–2023: Significant losses in vegetation cover — urgent action needed.';
    } else if (dataset === 'ice') {
        if (year <= 2005) return 'Relatively stable ice, but early signs of melting are visible.';
        if (year <= 2012) return 'Accelerated melting during polar summers.';
        if (year <= 2018) return 'Significant reduction in sea ice thickness and seasonal melting.';
        return 'Reaching unprecedented melting rates in recent records.';
    } else {
        if (year <= 2005) return 'Moderate pollution levels in major cities.';
        if (year <= 2012) return 'Increased emissions due to industrial growth.';
        if (year <= 2018) return 'Temporary improvement in some areas (policy-driven), deterioration in others.';
        return 'Pollution returning to high levels after temporary recovery.';
    }
}

function generateMockPoints(dataset, year, region) {
    const points = [];
    let bbox = [-85, -180, 85, 180]; // default world
    
    if (region === 'amazon') bbox = [-15, -80, 5, -50];
    if (region === 'arctic') bbox = [60, -170, 85, 170];
    if (region === 'africa') bbox = [-35, -20, 37, 55];
    
    const count = 25;
    for (let i = 0; i < count; i++) {
        const lat = bbox[0] + Math.random() * (bbox[2] - bbox[0]);
        const lon = bbox[1] + Math.random() * (bbox[3] - bbox[1]);
        
        let color = '#34d399';
        let radius = 60000;
        if (dataset === 'ice') { color = '#60a5fa'; radius = 80000; }
        if (dataset === 'pollution') { color = '#f97316'; radius = 40000; }
        
        points.push({
            lat,
            lon,
            color,
            radius,
            tooltip: `${dataset} • ${year}`
        });
    }
    
    return points;
}

function initializeQuizPage() {
    console.log('🔄 Initializing quiz page...');
    console.log('🔍 QUIZ_DATA available:', !!window.QUIZ_DATA, window.QUIZ_DATA ? window.QUIZ_DATA.length : 0);
    
    // Ensure we have quiz data before setting up
    if (!window.QUIZ_DATA || window.QUIZ_DATA.length === 0) {
        console.log('⚠️ No quiz data available, loading...');
        loadStaticData().then(() => {
            console.log('✅ Quiz data loaded, setting up quiz...');
            setupQuiz();
        }).catch(error => {
            console.error('❌ Failed to load quiz data:', error);
            // Use fallback data (translated question)
            window.QUIZ_DATA = [
                {
                    id: 1,
                    question: "When was the Terra satellite launched?",
                    choices: ["1999", "2000", "2001", "2002"],
                    correctAnswer: 0,
                    explanation: "Terra was launched on December 18, 1999, as part of the Earth Observing System (EOS)."
                }
            ];
            setupQuiz();
        });
    } else {
        setupQuiz();
    }
    
    // Animate elements
    if (typeof gsap !== 'undefined') {
        gsap.from('.quiz-container', { duration: 0.6, y: 30, opacity: 0 });
    }
}

// Make quiz initialization globally accessible
window.initializeQuizPage = initializeQuizPage;

function setupQuiz() {
    let currentQuestionIndex = 0;
    let score = 0;
    let answeredQuestions = 0;
    let userAnswers = []; // Track user answers for detailed results
    const questions = window.QUIZ_DATA || []; // Use the loaded Terra questions
    
    const questionTitle = document.getElementById('qTitle');
    const choicesContainer = document.getElementById('choices');
    const feedback = document.getElementById('qFeedback');
    const nextBtn = document.getElementById('nextQ');
    const prevBtn = document.getElementById('prevQ');
    const resetBtn = document.getElementById('resetQ');
    const showResultsBtn = document.getElementById('showResults');
    const resultsSection = document.getElementById('resultsSection');
    const currentQuestionNum = document.getElementById('currentQuestionNum');
    const totalQuestions = document.getElementById('totalQuestions');
    const progressBar = document.getElementById('progressBar');
    
    // Check if questions are loaded
    if (!questions || questions.length === 0) {
        console.error('❌ No quiz questions loaded');
        console.log('🔍 Debug info:', {
            questions: questions,
            windowQUIZ_DATA: window.QUIZ_DATA,
            questionsLength: questions ? questions.length : 'undefined'
        });
        
        if (questionTitle) {
            questionTitle.textContent = 'Error loading questions - Retrying...';
        }
        
        // Try to reload quiz data
        setTimeout(async () => {
            console.log('🔄 Retrying quiz data load...');
            try {
                await loadStaticData();
                if (window.QUIZ_DATA && window.QUIZ_DATA.length > 0) {
                    console.log('✅ Quiz data loaded successfully on retry');
                    setupQuiz(); // Recursive call to reinitialize
                } else {
                    console.error('❌ Still no quiz data after retry');
                    if (questionTitle) {
                        questionTitle.textContent = 'Failed to load questions';
                    }
                }
            } catch (error) {
                console.error('❌ Error retrying quiz data load:', error);
                if (questionTitle) {
                    questionTitle.textContent = 'Error loading questions';
                }
            }
        }, 1000);
        
        return;
    }
    
    // Set total questions
    if (totalQuestions) {
        totalQuestions.textContent = questions.length;
    }
    
    console.log('✅ Quiz setup complete with', questions.length, 'questions');
    
    function updateProgress() {
        if (currentQuestionNum) {
            currentQuestionNum.textContent = currentQuestionIndex + 1;
        }
        if (progressBar) {
            const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
            progressBar.style.width = progress + '%';
        }
        
        // Add visual indicator for answered questions
        updateQuestionIndicator();
    }
    
    function updateQuestionIndicator() {
        const currentQuestionEl = document.getElementById('currentQuestionNum');
        if (currentQuestionEl) {
            const isAnswered = userAnswers.some(answer => answer.questionIndex === currentQuestionIndex);
            if (isAnswered) {
                currentQuestionEl.style.color = '#10b981';
                currentQuestionEl.style.fontWeight = 'bold';
            } else {
                currentQuestionEl.style.color = '';
                currentQuestionEl.style.fontWeight = '';
            }
        }
    }
    
    function renderQuestion() {
        const question = questions[currentQuestionIndex];
        
        if (questionTitle) {
            // Handle both old and new data structure
            const questionText = question.question || question.q;
            questionTitle.textContent = questionText;
        }
        
        if (choicesContainer) {
            choicesContainer.innerHTML = '';
            const choices = question.choices || [];
            choices.forEach((choice, index) => {
                const choiceEl = document.createElement('div');
                choiceEl.className = 'choice';
                choiceEl.textContent = choice;
                
                // Check if this question was already answered
                const existingAnswer = userAnswers.find(answer => answer.questionIndex === currentQuestionIndex);
                if (existingAnswer) {
                    // Show the previous answer
                    if (index === existingAnswer.userAnswer) {
                        choiceEl.classList.add(existingAnswer.isCorrect ? 'correct' : 'wrong');
                    }
                    if (index === existingAnswer.correctAnswer && !existingAnswer.isCorrect) {
                        choiceEl.classList.add('correct');
                    }
                    // Disable all choices for answered questions
                    choiceEl.style.pointerEvents = 'none';
                    choiceEl.style.opacity = '0.7';
                } else {
                    // Add click listener only for unanswered questions
                    choiceEl.addEventListener('click', () => selectChoice(index, choiceEl));
                }
                
                choicesContainer.appendChild(choiceEl);
            });
        }
        
        if (feedback) {
            // Show feedback if question was already answered
            const existingAnswer = userAnswers.find(answer => answer.questionIndex === currentQuestionIndex);
            if (existingAnswer) {
                feedback.textContent = existingAnswer.isCorrect ? 'Correct! ' + existingAnswer.explanation : 'Wrong — ' + existingAnswer.explanation;
                feedback.style.display = 'block';
            } else {
                feedback.textContent = '';
                feedback.style.display = 'none';
            }
        }
        
        updateProgress();
        updateNavigationButtons();
    }
    
    function selectChoice(index, element) {
        if (element.classList.contains('correct') || element.classList.contains('wrong')) return;
        
        // Check if this question was already answered
        const existingAnswer = userAnswers.find(answer => answer.questionIndex === currentQuestionIndex);
        if (existingAnswer) return;
        
        const question = questions[currentQuestionIndex];
        const choices = choicesContainer.querySelectorAll('.choice');
        
        // Handle both old and new data structure
        const correctAnswer = question.correctAnswer !== undefined ? question.correctAnswer : question.answer;
        const explanation = question.explanation || question.explain;
        
        // Disable all choices after selection
        choices.forEach(choice => {
            choice.style.pointerEvents = 'none';
            choice.style.opacity = '0.7';
        });
        
        // Store user answer for detailed results
        userAnswers.push({
            questionIndex: currentQuestionIndex,
            question: question.question || question.q,
            userAnswer: index,
            correctAnswer: correctAnswer,
            isCorrect: index === correctAnswer,
            explanation: explanation,
            category: question.category || 'General'
        });
        
        if (index === correctAnswer) {
            element.classList.add('correct');
            feedback.textContent = 'Correct! ' + explanation;
            score++;
        } else {
            element.classList.add('wrong');
            feedback.textContent = 'Wrong — ' + explanation;
            choices[correctAnswer].classList.add('correct');
        }
        
        answeredQuestions++;
        feedback.style.display = 'block';
        
        // Show results button if all questions answered
        if (answeredQuestions === questions.length) {
            showResultsBtn.style.display = 'inline-flex';
        }
        
        // Update navigation buttons
        updateNavigationButtons();
    }
    
    function showResults() {
        if (resultsSection && showResultsBtn) {
            resultsSection.style.display = 'block';
            
            // Update score display
            const correctAnswersEl = document.getElementById('correctAnswers');
            const totalQuestionsResultEl = document.getElementById('totalQuestionsResult');
            const scoreMessageEl = document.getElementById('scoreMessage');
            const scorePercentageEl = document.getElementById('scorePercentage');
            
            if (correctAnswersEl) correctAnswersEl.textContent = score;
            if (totalQuestionsResultEl) totalQuestionsResultEl.textContent = questions.length;
            
            const percentage = Math.round((score / questions.length) * 100);
            if (scorePercentageEl) scorePercentageEl.textContent = `Success Rate: ${percentage}%`;
            
            if (scoreMessageEl) {
                if (percentage === 100) {
                    scoreMessageEl.textContent = 'Excellent! 100% Correct Answers';
                } else if (percentage >= 80) {
                    scoreMessageEl.textContent = 'Great Job! Excellent Performance';
                } else if (percentage >= 60) {
                    scoreMessageEl.textContent = 'Very Good! Good Performance';
                } else if (percentage >= 40) {
                    scoreMessageEl.textContent = 'Acceptable! You can improve more';
                } else {
                    scoreMessageEl.textContent = 'Not bad, try again';
                }
            }
            
            // Add detailed results section
            addDetailedResults();
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    function addDetailedResults() {
        // Check if detailed results already exist
        let detailedSection = document.getElementById('detailedResults');
        if (detailedSection) {
            detailedSection.remove();
        }
        
        // Create detailed results section
        detailedSection = document.createElement('div');
        detailedSection.id = 'detailedResults';
        detailedSection.style.marginTop = '32px';
        detailedSection.innerHTML = `
            <h3 style="margin: 0 0 20px 0; text-align: center;">📋 Answer Details</h3>
            <div class="detailed-questions">
                ${userAnswers.map((answer, index) => `
                    <div class="question-result" style="margin-bottom: 20px; padding: 16px; background: rgba(255,255,255,0.02); border-radius: 10px; border-left: 4px solid ${answer.isCorrect ? '#10b981' : '#ef4444'};">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <h4 style="margin: 0; color: ${answer.isCorrect ? '#10b981' : '#ef4444'};">
                                ${answer.isCorrect ? '✅' : '❌'} Question ${index + 1}
                            </h4>
                            <span class="category-tag" style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 6px; font-size: 0.8rem;">
                                ${answer.category}
                            </span>
                        </div>
                        <p style="margin: 0 0 12px 0; font-weight: 600;">${answer.question}</p>
                        <div style="margin-bottom: 8px;">
                            <strong>Your Answer:</strong> 
                            <span style="color: ${answer.isCorrect ? '#10b981' : '#ef4444'};">
                                ${questions[answer.questionIndex].choices[answer.userAnswer]}
                            </span>
                        </div>
                        <div style="margin-bottom: 8px;">
                            <strong>Correct Answer:</strong> 
                            <span style="color: #10b981;">
                                ${questions[answer.questionIndex].choices[answer.correctAnswer]}
                            </span>
                        </div>
                        <div style="color: var(--muted); font-size: 0.9rem;">
                            <strong>Explanation:</strong> ${answer.explanation}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Insert after the existing results content
        const existingContent = resultsSection.querySelector('.grid.grid-3').parentNode;
        existingContent.insertBefore(detailedSection, existingContent.lastElementChild);
    }
    
    function resetQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        answeredQuestions = 0;
        userAnswers = []; // Reset user answers
        
        // Remove detailed results if they exist
        const detailedSection = document.getElementById('detailedResults');
        if (detailedSection) {
            detailedSection.remove();
        }
        
        if (resultsSection) resultsSection.style.display = 'none';
        if (showResultsBtn) showResultsBtn.style.display = 'none';
        updateNavigationButtons();
        renderQuestion();
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentQuestionIndex++;
            if (currentQuestionIndex >= questions.length) {
                currentQuestionIndex = 0;
            }
            updateNavigationButtons();
            renderQuestion();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentQuestionIndex--;
            if (currentQuestionIndex < 0) {
                currentQuestionIndex = questions.length - 1;
            }
            updateNavigationButtons();
            renderQuestion();
        });
    }
    
    function updateNavigationButtons() {
        if (prevBtn) {
            prevBtn.style.display = currentQuestionIndex > 0 ? 'inline-flex' : 'none';
        }
        if (nextBtn) {
            nextBtn.style.display = currentQuestionIndex < questions.length - 1 ? 'inline-flex' : 'none';
        }
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetQuiz);
    }
    
    if (showResultsBtn) {
        showResultsBtn.addEventListener('click', showResults);
    }
    
    // Additional buttons
    const retakeQuizBtn = document.getElementById('retakeQuiz');
    if (retakeQuizBtn) {
        retakeQuizBtn.addEventListener('click', resetQuiz);
    }
    
    // Back to explorer button
    const backToExplorerBtn = document.getElementById('backToExplorer');
    if (backToExplorerBtn) {
        backToExplorerBtn.addEventListener('click', () => {
            console.log('🚀 Navigating to explorer from quiz');
            router.navigate('explorer');
        });
    }
    
    // Explore more button (in results section)
    const exploreMoreBtn = document.getElementById('exploreMore');
    if (exploreMoreBtn) {
        exploreMoreBtn.addEventListener('click', () => {
            console.log('🚀 Navigating to explorer from quiz results');
            router.navigate('explorer');
        });
    }
    
    // Initial render
    renderQuestion();
}

async function initializeAboutPage() {
    // Animate elements
    if (typeof gsap !== 'undefined') {
        gsap.from('.about-section', { duration: 0.6, y: 30, opacity: 0, stagger: 0.2 });
    }
    
    // Set up navigation button
    const goToExplorerBtn = document.getElementById('goToExplorer');
    if (goToExplorerBtn) {
        goToExplorerBtn.addEventListener('click', () => {
            console.log('Navigating to explorer');
            router.navigate('explorer');
        });
    }
}
// Add Explorer Route
router.addRoute('explorer', async () => {
  return window.explorerPageTemplate();
});
async function loadVegetationPage() {
    const response = await fetch('pages/vegetation.html');
    const html = await response.text();
    setTimeout(() => {
        if (window.initializeVegetationPage) {
            window.initializeVegetationPage();
        }
    }, 100);
    return html;
    // js/app.js

function registerRoutes() {
    // المسارات الأساسية
    router.addRoute('home', () => fetch('./pages/home.html').then(res => res.text()));
    router.addRoute('explorer', loadExplorerPage);
    router.addRoute('video', () => fetch('./pages/video.html').then(res => res.text()));
    router.addRoute('quiz', () => fetch('./pages/quiz.html').then(res => res.text()));
    router.addRoute('about', () => fetch('./pages/about.html').then(res => res.text()));

    // ✅✅✅ المسارات الجديدة والمهمة ✅✅✅
    router.addRoute('vegetation', () => fetch('./pages/vegetation.html').then(res => res.text()));
    router.addRoute('ice', () => fetch('./pages/ice.html').then(res => res.text()));
    router.addRoute('pollution', () => fetch('./pages/pollution.html').then(res => res.text()));
    router.addRoute('fires', () => fetch('./pages/fires.html').then(res => res.text()));
}
}
