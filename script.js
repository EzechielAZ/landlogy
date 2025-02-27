document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    hamburger.addEventListener('click', function() {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile nav if open
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                hamburger.classList.remove('active');
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Testimonials slider
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    // Hide all testimonials except the first one
    testimonials.forEach((testimonial, index) => {
        if (index !== 0) {
            testimonial.style.display = 'none';
        }
    });

    // Function to show a specific slide
    function showSlide(n) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the current testimonial and activate its dot
        testimonials[n].style.display = 'block';
        dots[n].classList.add('active');
    }

    // Next button click handler
    nextBtn.addEventListener('click', function() {
        currentSlide++;
        if (currentSlide >= testimonials.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    });

    // Previous button click handler
    prevBtn.addEventListener('click', function() {
        currentSlide--;
        if (currentSlide < 0) {
            currentSlide = testimonials.length - 1;
        }
        showSlide(currentSlide);
    });

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-advance slides every 5 seconds
    setInterval(function() {
        currentSlide++;
        if (currentSlide >= testimonials.length) {
            currentSlide = 0;
        }
        showSlide(currentSlide);
    }, 7000);

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-toggle i').className = 'fas fa-plus';
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            // Change icon
            if (item.classList.contains('active')) {
                toggle.querySelector('i').className = 'fas fa-minus';
            } else {
                toggle.querySelector('i').className = 'fas fa-plus';
            }
        });
    });
    
    // Counter animation for stats
    const stats = document.querySelectorAll('.stat-number');
    
    const animateCounter = (el, start = 0, end, duration = 2000) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            el.textContent = value + (el.dataset.suffix || '');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };
    
    // Initialize counter animation when element is in viewport
    const isInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };
    
    const handleScroll = () => {
        stats.forEach(stat => {
            if (isInViewport(stat) && !stat.dataset.counted) {
                stat.dataset.counted = true;
                const end = parseInt(stat.textContent, 10);
                animateCounter(stat, 0, end);
            }
        });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Run once on load
    handleScroll();
    
    // Form validation and submission
    const waitlistForm = document.getElementById('waitlist-form');
    const formSuccess = document.getElementById('form-success');

    waitlistForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // In a real implementation, you would send the form data to your server
        // For this example, we'll just simulate a successful submission
        
        // Get form data
        const formData = new FormData(waitlistForm);
        const data = Object.fromEntries(formData.entries());
        
        // Add loading state to button
        const submitButton = waitlistForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Traitement en cours...';
        submitButton.disabled = true;
        
        // Simulate network request
        setTimeout(function() {
            // Hide the form and show success message
            waitlistForm.style.display = 'none';
            formSuccess.classList.remove('hidden');
            
            // Log the collected data (for demonstration purposes)
            console.log('Form submitted with data:', data);
            
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            
             //In a real implementation, you would send this data to your server
             fetch('https://formspree.io/f/xpwqgeze', {
                 method: 'POST',
                 headers: {
                     'Content-Type': 'application/json',
                 },
                 body: JSON.stringify(data),
             })
             .then(response => response.json())
             .then(data => {
                 waitlistForm.style.display = 'none';
                 formSuccess.classList.remove('hidden');
             })
             .catch(error => {
                 console.error('Error:', error);
                 // Show error message to user
             });
        }, 1500);
    });
});
