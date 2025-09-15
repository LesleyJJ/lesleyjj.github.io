// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
// Mobile Navigation Toggle
hamburger.addEventListener('click', ()=>{
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});
// Close mobile menu when clicking on a link
navLinks.forEach((link)=>{
    link.addEventListener('click', ()=>{
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});
// Smooth scrolling for navigation links
navLinks.forEach((link)=>{
    link.addEventListener('click', (e)=>{
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});
// Navbar background change on scroll
window.addEventListener('scroll', ()=>{
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});
// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, observerOptions);
// Observe elements for animation
document.addEventListener('DOMContentLoaded', ()=>{
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .timeline-item, .about-text, .about-image');
    animatedElements.forEach((el)=>{
        el.classList.add('fade-in');
        observer.observe(el);
    });
});
// Active navigation link highlighting
window.addEventListener('scroll', ()=>{
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    sections.forEach((section)=>{
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) navLinks.forEach((link)=>{
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) link.classList.add('active');
        });
    });
});
// Contact form handling
contactForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    const captchaToken = window.grecaptcha ? window.grecaptcha.getResponse() : '';
    // Simple validation
    // Stricter validation
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    if (String(name).trim().length < 2) {
        showNotification('Name must be at least 2 characters', 'error');
        return;
    }
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    if (String(subject).trim().length < 3) {
        showNotification('Subject must be at least 3 characters', 'error');
        return;
    }
    if (String(message).trim().length < 10) {
        showNotification('Message must be at least 10 characters', 'error');
        return;
    }
    if (!captchaToken) {
        showNotification('Please complete the CAPTCHA', 'error');
        return;
    }
    try {
        // Show loading notification
        showNotification('Sending message...', 'info');
        // Send data to server
        const path = 'https://portfolio-server-iota-seven.vercel.app/contact';
        // const path = 'http://localhost:3000/contact';
        const response = await fetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                subject,
                message,
                captchaToken
            })
        });
        const result = await response.json();
        if (result.success) {
            showNotification(result.message, 'success');
            contactForm.reset();
            if (window.grecaptcha) window.grecaptcha.reset();
        } else showNotification(result.message || 'Failed to send message. Please try again.', 'error');
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Failed to send message. Please check your connection and try again.', 'error');
    }
});
// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach((notification)=>notification.remove());
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    // Add to page
    document.body.appendChild(notification);
    // Animate in
    setTimeout(()=>{
        notification.style.transform = 'translateX(0)';
    }, 100);
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', ()=>{
        notification.style.transform = 'translateX(100%)';
        setTimeout(()=>notification.remove(), 300);
    });
    // Auto remove after 5 seconds
    setTimeout(()=>{
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(()=>notification.remove(), 300);
        }
    }, 5000);
}
// Scroll to top button
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.addEventListener('click', ()=>{
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    document.body.appendChild(scrollBtn);
    // Show/hide button based on scroll position
    window.addEventListener('scroll', ()=>{
        if (window.scrollY > 300) scrollBtn.classList.add('visible');
        else scrollBtn.classList.remove('visible');
    });
}
// Typing animation for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}
// Initialize typing animation when page loads
window.addEventListener('load', ()=>{
    const heroTitle = document.querySelector('.hero-title-name');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        typeWriter(heroTitle, originalText, 100);
    }
    createScrollToTopButton();
});
// Parallax effect for hero section
window.addEventListener('scroll', ()=>{
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    if (hero) hero.style.transform = `translateY(${rate}px)`;
});
// Project filter functionality (if you want to add filtering later)
function filterProjects(category) {
    const projects = document.querySelectorAll('.project-card');
    projects.forEach((project)=>{
        if (category === 'all' || project.dataset.category === category) {
            project.style.display = 'block';
            project.style.animation = 'fadeIn 0.5s ease';
        } else project.style.display = 'none';
    });
}
// Skills animation on scroll
function animateSkills() {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index)=>{
        setTimeout(()=>{
            item.style.animation = 'slideInUp 0.5s ease forwards';
        }, index * 100);
    });
}
// Initialize animations when skills section is visible
const skillsObserver = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if (entry.isIntersecting) {
            animateSkills();
            skillsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.5
});
const skillsSection = document.querySelector('.skills');
if (skillsSection) skillsObserver.observe(skillsSection);
// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .nav-link.active {
        color: #667eea !important;
    }
    
    .nav-link.active::after {
        width: 100% !important;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);
// Preloader (optional)
window.addEventListener('load', ()=>{
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(()=>{
            preloader.style.display = 'none';
        }, 500);
    }
});
// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = ()=>{
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(()=>{
// Your scroll handling code here
}, 10);
window.addEventListener('scroll', debouncedScrollHandler);
// Add loading states for images
document.querySelectorAll('img').forEach((img)=>{
    img.addEventListener('load', ()=>{
        img.style.opacity = '1';
    });
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease';
});
// Console message for developers
console.log(`
\u{1F680} Portfolio Website Loaded Successfully!

Built with:
- HTML5
- CSS3 (with modern features)
- Vanilla JavaScript
- Font Awesome Icons
- Google Fonts (Inter)

Features:
- Responsive Design
- Smooth Animations
- Interactive Navigation
- Contact Form
- Scroll Effects
- Modern UI/UX

Made with \u{2764}\u{FE0F} for GitHub Pages
`);

//# sourceMappingURL=portfolio-web.672d4772.js.map
