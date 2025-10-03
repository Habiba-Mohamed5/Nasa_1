
// Simple SPA Router for NASA Data Visualization Project
class Router {
    constructor() {
        this.routes = new Map();
        this.currentPage = null;
        this.contentElement = null;
        this.navLinks = null;
        
        // Bind methods
        this.navigate = this.navigate.bind(this);
        this.handlePopState = this.handlePopState.bind(this);
        this.handleNavClick = this.handleNavClick.bind(this);
    }
    
    // Initialize DOM elements
    initElements() {
        this.contentElement = document.getElementById('app-content');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        if (!this.contentElement) {
            console.error('❌ app-content element not found');
            return false;
        }
        
        if (!this.navLinks || this.navLinks.length === 0) {
            console.error('❌ Navigation links not found');
            return false;
        }
        
        console.log('✅ Router elements initialized');
        return true;
    }
    
    // Register a route
    addRoute(path, handler) {
        this.routes.set(path, handler);
    }
    
    // Set up navigation event listeners
    setupEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', this.handlePopState);
        
        // Handle navigation clicks
        if (this.navLinks) {
            this.navLinks.forEach(link => {
                link.addEventListener('click', this.handleNavClick);
            });
        }
    }
    
    // Handle navigation link clicks
    handleNavClick(event) {
        event.preventDefault();
        const page = event.target.getAttribute('data-page');
        console.log('🔗 Navigation clicked:', page);
        if (page) {
            this.navigate(page);
        }
    }
    
    // Handle browser navigation
    handlePopState(event) {
        const path = event.state?.page || this.getPathFromURL();
        this.loadPage(path, false);
    }
    
    // Get current path from URL pathname
    getPathFromURL() {
        // Handle GitHub Pages SPA redirect format
        const urlParams = new URLSearchParams(window.location.search);
        const redirectPath = urlParams.get('/');
        
        if (redirectPath) {
            // Clean up the path from GitHub Pages redirect
            const cleanPath = redirectPath.replace(/~and~/g, '&');
            return cleanPath || 'home';
        }
        
        const path = window.location.pathname.slice(1);
        return path || 'home';
    }
    
    // Navigate to a specific page
    async navigate(page, addToHistory = true) {
        console.log('🚀 Navigate called:', { page, currentPage: this.currentPage, addToHistory });
        
        if (this.currentPage === page) {
            console.log('⚠️ Already on page:', page);
            return;
        }
        
        // Add to browser history
        if (addToHistory) {
            const url = page === 'home' ? './' : `./${page}`;
            history.pushState({ page }, '', url);
            console.log('📝 History updated:', url);
        }
        
        await this.loadPage(page);
    }
    
    // Load and display a page
    async loadPage(page, updateNav = true) {
        try {
            console.log(`📄 Loading page: ${page}`);
            
            // Show loading spinner
            this.showLoading();
            
            // Update navigation
            if (updateNav) {
                this.updateNavigation(page);
            }
            
            // Get route handler
            const handler = this.routes.get(page);
            if (!handler) {
                throw new Error(`Route not found: ${page}`);
            }
            
            console.log(`🔄 Executing route handler for: ${page}`);
            
            // Load page content
            const content = await handler();
            
            console.log(`✅ Content loaded for ${page}, length: ${content.length}`);
            
            // Display content with animation
            await this.displayContent(content);
            
            // Update current page
            this.currentPage = page;
            
            console.log(`🎉 Page ${page} loaded successfully`);
            
            // Debug: Check if buttons exist after page load
            if (page === 'home') {
                setTimeout(() => {
                    const exploreBtn = document.getElementById('exploreBtn');
                    const quizBtn = document.getElementById('quizBtn');
                    console.log('🔍 Button check after home page load:');
                    console.log('  exploreBtn:', exploreBtn ? '✅ Found' : '❌ Not found');
                    console.log('  quizBtn:', quizBtn ? '✅ Found' : '❌ Not found');
                }, 200);
            }
            
            // Debug: Check if quiz elements exist after page load
            if (page === 'quiz') {
                setTimeout(() => {
                    const qTitle = document.getElementById('qTitle');
                    const choicesEl = document.getElementById('choices');
                    console.log('🔍 Quiz elements check after page load:');
                    console.log('  qTitle:', qTitle ? '✅ Found' : '❌ Not found');
                    console.log('  choicesEl:', choicesEl ? '✅ Found' : '❌ Not found');
                    
                    // If quiz elements are not found, try to initialize again
                    if (!qTitle || !choicesEl) {
                        console.log('🔄 Retrying quiz initialization...');
                        if (window.initializeQuizPage) {
                            window.initializeQuizPage();
                        }
                    }
                }, 500);
            }

            // Extra: Initialize explorer page if loaded
            if (page === 'explorer') {
                setTimeout(() => {
                    if (window.initializeExplorerPage) {
                        window.initializeExplorerPage();
                    }
                }, 300);
            }
            
        } catch (error) {
            console.error('❌ Error loading page:', error);
            this.showError(error.message);
        }
    }
    
    // Show loading spinner
    showLoading() {
        this.contentElement.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading...</p>
            </div>
        `;
    }
    
    // Show error message
    showError(message) {
        this.contentElement.innerHTML = `
            <div class="error-message">
                <div class="container">
                    <h2>Loading Error</h2>
                    <p>${message}</p>
                    <button class="btn btn-primary" onclick="location.reload()">Reload</button>
                </div>
            </div>
        `;
    }
    
    // Update navigation active state
    updateNavigation(page) {
        this.navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Update body data-page attribute for CSS styling
        document.body.setAttribute('data-page', page);
    }
    
    // Display content with animation
    async displayContent(content) {
        return new Promise((resolve) => {
            // Add exit animation to current content
            this.contentElement.classList.add('page-exit');
            
            setTimeout(() => {
                // Replace content
                this.contentElement.innerHTML = content;
                this.contentElement.classList.remove('page-exit');
                this.contentElement.classList.add('page-enter');
                
                // Trigger enter animation
                setTimeout(() => {
                    this.contentElement.classList.remove('page-enter');
                    this.contentElement.classList.add('page-enter-active');
                    resolve();
                }, 10);
                
                // Clean up animation classes
                setTimeout(() => {
                    this.contentElement.classList.remove('page-enter-active');
                }, 400);
            }, 300);
        });
    }
    
    // Start the router
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.startRouter();
            });
        } else {
            this.startRouter();
        }
    }
    
    startRouter() {
        // Initialize DOM elements first
        if (!this.initElements()) {
            console.error('❌ Failed to initialize router elements');
            return;
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        const initialPage = this.getPathFromURL();
        console.log('🚀 Router starting with page:', initialPage);
        
        // Validate the page exists, fallback to home if not
        const validPages = ['home', 'explorer', 'video', 'quiz', 'about'];
        const pageToLoad = validPages.includes(initialPage) ? initialPage : 'home';
        
        this.loadPage(pageToLoad, true);
    }
}

// Export router instance
window.router = new Router();
