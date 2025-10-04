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
        window.addEventListener('popstate', this.handlePopState);
        
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
        const path = window.location.pathname.slice(1).split('/')[0];
        return path || 'home';
    }
    
    // Navigate to a specific page
    async navigate(page, addToHistory = true) {
        if (this.currentPage === page) {
            return;
        }
        
        if (addToHistory) {
            const url = page === 'home' ? './' : `./${page}`;
            history.pushState({ page }, '', url);
        }
        
        await this.loadPage(page);
    }
    
    // Load and display a page
    async loadPage(page, updateNav = true) {
        try {
            if (updateNav) {
                this.updateNavigation(page);
            }
            
            const handler = this.routes.get(page);
            if (!handler) {
                // If route not found, maybe load a 404 page or redirect to home
                throw new Error(`Route not found: ${page}`);
            }
            
            const content = await handler();
            
            await this.displayContent(content);
            
            this.currentPage = page;
            
        } catch (error) {
            console.error('❌ Error loading page:', error);
            this.showError(error.message);
        }
    }
    
    // Show error message
    showError(message) {
        this.contentElement.innerHTML = `<div class="container" style="text-align: center; padding-top: 50px;"><h2>Error</h2><p>${message}</p></div>`;
    }
    
    // Update navigation active state
    updateNavigation(page) {
        this.navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            link.classList.toggle('active', linkPage === page);
        });
        
        document.body.setAttribute('data-page', page);

        // ✅ تم حذف الكود القديم الخاص بـ global-background-video من هنا
    }
    
    // Display content with animation
    async displayContent(content) {
        return new Promise((resolve) => {
            this.contentElement.classList.add('page-exit');
            
            setTimeout(() => {
                this.contentElement.innerHTML = content;
                this.contentElement.classList.remove('page-exit');
                
                // Trigger reflow for animation
                void this.contentElement.offsetWidth; 

                this.contentElement.classList.add('page-enter-active');
                
                setTimeout(() => {
                    this.contentElement.classList.remove('page-enter-active');
                    resolve();
                }, 400);
            }, 300);
        });
    }
    
    // Start the router
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startRouter());
        } else {
            this.startRouter();
        }
    }
    
    startRouter() {
        if (!this.initElements()) {
            return;
        }
        
        this.setupEventListeners();
        
        const initialPage = this.getPathFromURL();
        
        const validPages = Array.from(this.routes.keys());
        const pageToLoad = validPages.includes(initialPage) ? initialPage : 'home';
        
        this.loadPage(pageToLoad, true);
    }
}

// Export router instance
window.router = new Router();