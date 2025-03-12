// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Language switching functionality
document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('.lang-btn');
    let currentLang = 'en';
    
    // Function to switch language
    function switchLanguage(lang) {
        currentLang = lang;
        
        // Update all elements with data-en and data-cs attributes
        document.querySelectorAll('[data-en][data-cs]').forEach(element => {
            element.textContent = element.getAttribute(`data-${lang}`);
        });
        
        // Update chart labels
        if (window.demographicsChart) {
            if (lang === 'en') {
                window.demographicsChart.data.labels = ['FOR METRO Members', 'Other Players'];
            } else {
                window.demographicsChart.data.labels = ['Členové FOR METRO', 'Ostatní hráči'];
            }
            window.demographicsChart.update();
        }
        
        if (window.satisfactionChart) {
            if (lang === 'en') {
                window.satisfactionChart.data.labels = ['Economy', 'Transportation', 'Campaign', 'Proposals'];
                window.satisfactionChart.data.datasets[0].label = 'FOR METRO Members';
                window.satisfactionChart.data.datasets[1].label = 'Other Players';
            } else {
                window.satisfactionChart.data.labels = ['Ekonomika', 'Doprava', 'Kampaň', 'Návrhy'];
                window.satisfactionChart.data.datasets[0].label = 'Členové FOR METRO';
                window.satisfactionChart.data.datasets[1].label = 'Ostatní hráči';
            }
            window.satisfactionChart.update();
        }
    }
    
    // Add event listeners to language buttons
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            switchLanguage(btn.getAttribute('data-lang'));
        });
    });
});

// Loader Animation
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader');
    const progress = document.querySelector('.progress');
    
    let width = 0;
    const interval = setInterval(() => {
        width += Math.random() * 10;
        if (width > 100) {
            width = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                loader.classList.add('hidden');
                animateHero();
            }, 500);
        }
        progress.style.width = width + '%';
    }, 200);
});

// Hero Animation
function animateHero() {
    const heroContent = document.querySelector('.hero-content');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    gsap.to(heroContent, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out'
    });
    
    gsap.to(scrollIndicator, {
        opacity: 1,
        duration: 1,
        delay: 0.5,
        ease: 'power2.out'
    });
}

// Animate sections on scroll
function animateSections() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        gsap.fromTo(section, 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, 
                y: 0,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1
                }
            }
        );
    });
}

// Animate cards
function animateCards() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach((card, index) => {
        gsap.fromTo(card, 
            { opacity: 0, y: 50 },
            { 
                opacity: 1, 
                y: 0,
                duration: 0.5,
                delay: 0.1 * index,
                scrollTrigger: {
                    trigger: '.cards-container',
                    start: 'top 80%'
                }
            }
        );
    });
}

// Animate details
function animateDetails() {
    const details = document.querySelectorAll('.detail');
    
    details.forEach((detail, index) => {
        gsap.fromTo(detail, 
            { opacity: 0, x: -50 },
            { 
                opacity: 1, 
                x: 0,
                duration: 0.5,
                delay: 0.1 * index,
                scrollTrigger: {
                    trigger: '.demographics-details',
                    start: 'top 80%'
                }
            }
        );
    });
}

// Animate comparison items
function animateComparison() {
    const items = document.querySelectorAll('.comparison-item');
    
    items.forEach((item, index) => {
        gsap.fromTo(item, 
            { opacity: 0, x: 50 },
            { 
                opacity: 1, 
                x: 0,
                duration: 0.5,
                delay: 0.1 * index,
                scrollTrigger: {
                    trigger: '.satisfaction-comparison',
                    start: 'top 80%',
                    onEnter: () => {
                        setTimeout(() => {
                            document.querySelectorAll('.rating-fill').forEach(fill => {
                                fill.style.width = fill.style.width || fill.getAttribute('style').match(/width:\s*(\d+)%/)[1] + '%';
                            });
                        }, 300);
                    }
                }
            }
        );
    });
}

// Animate feedback columns
function animateFeedback() {
    const forMetro = document.querySelector('.feedback-column.for-metro');
    const other = document.querySelector('.feedback-column.other');
    
    gsap.fromTo(forMetro, 
        { opacity: 0, x: -50 },
        { 
            opacity: 1, 
            x: 0,
            duration: 0.5,
            scrollTrigger: {
                trigger: '.feedback-columns',
                start: 'top 80%'
            }
        }
    );
    
    gsap.fromTo(other, 
        { opacity: 0, x: 50 },
        { 
            opacity: 1, 
            x: 0,
            duration: 0.5,
            scrollTrigger: {
                trigger: '.feedback-columns',
                start: 'top 80%'
            }
        }
    );
    
    const feedbackItems = document.querySelectorAll('.feedback-item');
    
    feedbackItems.forEach((item, index) => {
        gsap.fromTo(item, 
            { opacity: 0, scale: 0.9 },
            { 
                opacity: 1, 
                scale: 1,
                duration: 0.5,
                delay: 0.1 * index,
                scrollTrigger: {
                    trigger: '.feedback-columns',
                    start: 'top 70%'
                }
            }
        );
    });
}

// Animate concerns
function animateConcerns() {
    const concerns = document.querySelectorAll('.concern-item');
    
    concerns.forEach((concern, index) => {
        gsap.fromTo(concern, 
            { opacity: 0, scale: 0.8 },
            { 
                opacity: 1, 
                scale: 1,
                duration: 0.5,
                delay: 0.1 * index,
                scrollTrigger: {
                    trigger: '.concerns-container',
                    start: 'top 80%'
                }
            }
        );
    });
}

// Animate debate topics
function animateDebate() {
    const topics = document.querySelectorAll('.topic');
    
    topics.forEach((topic, index) => {
        gsap.fromTo(topic, 
            { opacity: 0, y: 30 },
            { 
                opacity: 1, 
                y: 0,
                duration: 0.5,
                delay: 0.2 * index,
                scrollTrigger: {
                    trigger: '.debate-topics',
                    start: 'top 80%'
                }
            }
        );
    });
}

// Animate conclusion
function animateConclusion() {
    const conclusion = document.querySelector('.conclusion p');
    
    gsap.fromTo(conclusion, 
        { opacity: 0, scale: 0.95 },
        { 
            opacity: 1, 
            scale: 1,
            duration: 0.5,
            scrollTrigger: {
                trigger: '.conclusion',
                start: 'top 80%'
            }
        }
    );
}

// Animate counter
function animateCounter() {
    const counters = document.querySelectorAll('.card-value');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-value'));
        const duration = 2000;
        const step = target / duration * 10;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += step;
                if (current > target) current = target;
                
                if (Number.isInteger(target)) {
                    counter.textContent = Math.floor(current);
                } else {
                    counter.textContent = current.toFixed(1);
                }
                
                setTimeout(updateCounter, 10);
            }
        };
        
        ScrollTrigger.create({
            trigger: counter,
            start: 'top 80%',
            onEnter: updateCounter
        });
    });
}

// Initialize Charts
function initCharts() {
    // Demographics Chart
    const demographicsCtx = document.getElementById('demographicsChart').getContext('2d');
    window.demographicsChart = new Chart(demographicsCtx, {
        type: 'doughnut',
        data: {
            labels: ['FOR METRO Members', 'Other Players'],
            datasets: [{
                data: [3, 1],
                backgroundColor: [
                    'rgba(65, 105, 225, 0.8)',
                    'rgba(255, 165, 0, 0.8)'
                ],
                borderColor: [
                    'rgba(65, 105, 225, 1)',
                    'rgba(255, 165, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14
                        },
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Survey Respondent Distribution',
                    font: {
                        size: 18
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
    
    // Satisfaction Chart
    const satisfactionCtx = document.getElementById('satisfactionChart').getContext('2d');
    window.satisfactionChart = new Chart(satisfactionCtx, {
        type: 'bar',
        data: {
            labels: ['Economy', 'Transportation', 'Campaign', 'Proposals'],
            datasets: [
                {
                    label: 'FOR METRO Members',
                    data: [4.33, 4.67, 4, 4],
                    backgroundColor: 'rgba(65, 105, 225, 0.7)',
                    borderColor: 'rgba(65, 105, 225, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Other Players',
                    data: [2, 1, 1, 1],
                    backgroundColor: 'rgba(255, 165, 0, 0.7)',
                    borderColor: 'rgba(255, 165, 0, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    title: {
                        display: true,
                        text: 'Satisfaction Level',
                        font: {
                            size: 14
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Policy Areas',
                        font: {
                            size: 14
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            size: 14
                        },
                        padding: 20
                    }
                },
                title: {
                    display: true,
                    text: 'Policy Satisfaction Comparison',
                    font: {
                        size: 18
                    },
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                }
            },
            animation: {
                delay: (context) => {
                    return context.dataIndex * 100;
                }
            }
        }
    });
}

// Add parallax effect to hero
window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (scrollPosition <= hero.offsetHeight) {
        hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
    }
});

// Add interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects for feedback items
    const feedbackItems = document.querySelectorAll('.feedback-item');
    feedbackItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.05,
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
                duration: 0.3
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                duration: 0.3
            });
        });
    });
    
    // Add hover effects for concern items
    const concernItems = document.querySelectorAll('.concern-item');
    concernItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.05,
                boxShadow: '0 15px 40px rgba(0, 0, 0, 0.2)',
                duration: 0.3
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                duration: 0.3
            });
        });
    });
    
    // Add floating animation to icons
    const icons = document.querySelectorAll('.card-icon, .concern-icon');
    icons.forEach(icon => {
        gsap.to(icon, {
            y: -5,
            duration: 1.5,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });
    });
    
    // Add pulse animation to chart containers
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        container.addEventListener('mouseenter', () => {
            gsap.to(container, {
                boxShadow: '0 15px 40px rgba(65, 105, 225, 0.2)',
                duration: 0.3
            });
        });
        
        container.addEventListener('mouseleave', () => {
            gsap.to(container, {
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                duration: 0.3
            });
        });
    });
    
    // Add interactive table rows
    const tableRows = document.querySelectorAll('.policy-table tr:not(:first-child)');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            gsap.to(row, {
                backgroundColor: 'rgba(65, 105, 225, 0.1)',
                duration: 0.3
            });
        });
        
        row.addEventListener('mouseleave', () => {
            gsap.to(row, {
                backgroundColor: 'transparent',
                duration: 0.3
            });
        });
    });
});

// Initialize all animations
window.addEventListener('load', () => {
    animateSections();
    animateCards();
    animateDetails();
    animateComparison();
    animateFeedback();
    animateConcerns();
    animateDebate();
    animateConclusion();
    animateCounter();
    initCharts();
});
