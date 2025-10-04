// js/explorer.js

function initializeExplorerPage() {
    console.log("🚀 Explorer Hub Initialized with SEQUENCED GSAP Animations");

    const hub = document.querySelector('.explorer-hub');
    const hubCards = document.querySelectorAll('.hub-card');

    // --- 1. تأثير الإضاءة التفاعلية ---
    if (hub) {
        hub.addEventListener('mousemove', (e) => {
            const rect = hub.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            hub.style.setProperty('--mouse-x', `${x}px`);
            hub.style.setProperty('--mouse-y', `${y}px`);
        });
    }

    // --- 2. الانيميشن عند الضغط ---
    hubCards.forEach(card => {
        card.addEventListener('click', function(event) {
            event.preventDefault(); 
            const destinationPage = this.dataset.page;
            
            hubCards.forEach(c => {
                if(c !== this) {
                    gsap.to(c, { opacity: 0, y: -30, duration: 0.3, ease: "power2.in" });
                }
            });

            gsap.to(this, { 
                scale: 1.1, 
                opacity: 0, 
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => {
                    router.navigate(destinationPage);
                }
            });
        });
    });

    // --- 3. منطق الأنيميشن الجديد والمُصحح ---

    // دالة خاصة بحركة الطفو، لن يتم استدعاؤها إلا بعد انتهاء حركة الدخول
    function startFloatingAnimation() {
        hubCards.forEach((card) => {
            gsap.to(card, {
                y: -15, // المسافة التي سترتفعها البطاقة
                duration: 3,
                repeat: -1, // تكرار لا نهائي
                yoyo: true, // للعودة للحالة الأصلية (النزول)
                ease: "sine.inOut",
                delay: Math.random() * 2 // تأخير عشوائي لكل بطاقة لتبدو الحركة طبيعية
            });
        });
    }

    // تشغيل أنيميشن الدخول أولاً
    gsap.from(hubCards, {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.15,
        delay: 0.2,
        ease: "power2.out",
        // عند انتهاء الأنيميشن، نستدعي دالة الطفو
        onComplete: startFloatingAnimation 
    });
}

// جعل الدالة متاحة للـ Router
window.initializeExplorerPage = initializeExplorerPage;