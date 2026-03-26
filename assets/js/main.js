// ============================================================
// NAVIGATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.navbar')) {
            navMenu.classList.remove('active');
        }
    });
});

// ============================================================
// TABLE OF CONTENTS
// ============================================================

function generateTableOfContents() {
    const postBody = document.querySelector('.post-body');
    if (!postBody) return;

    const headings = postBody.querySelectorAll('h2, h3');
    if (headings.length === 0) return;

    const tocNav = document.querySelector('.toc-nav');
    if (!tocNav) return;

    let html = '<ul>';
    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        const level = heading.tagName === 'H3' ? 'h3' : 'h2';
        const indent = level === 'h3' ? 'style="margin-left: 20px;"' : '';
        html += `<li ${indent}><a href="#${heading.id}">${heading.textContent}</a></li>`;
    });
    html += '</ul>';
    tocNav.innerHTML = html;

    // Smooth scroll to heading
    const tocLinks = tocNav.querySelectorAll('a');
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ============================================================
// READING PROGRESS BAR
// ============================================================

function initReadingProgressBar() {
    const postBody = document.querySelector('.post-body');
    if (!postBody) return;

    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(to right, #2563eb, #1e40af);
        z-index: 999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// ============================================================
// LAZY LOADING IMAGES
// ============================================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// ============================================================
// BACK TO TOP BUTTON
// ============================================================

function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 24px;
        display: none;
        z-index: 99;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;

    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    backToTopBtn.addEventListener('mouseover', function() {
        this.style.background = '#1e40af';
        this.style.transform = 'scale(1.1)';
    });

    backToTopBtn.addEventListener('mouseout', function() {
        this.style.background = '#2563eb';
        this.style.transform = 'scale(1)';
    });
}

// ============================================================
// CODE COPY BUTTON
// ============================================================

function initCodeCopyButton() {
    const codeBlocks = document.querySelectorAll('.post-body pre');
    codeBlocks.forEach(block => {
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 5px 10px;
            background: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            z-index: 10;
        `;

        block.style.position = 'relative';
        block.appendChild(copyBtn);

        copyBtn.addEventListener('click', function() {
            const code = block.querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy';
                }, 2000);
            });
        });
    });
}

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    generateTableOfContents();
    initReadingProgressBar();
    initLazyLoading();
    initBackToTop();
    initCodeCopyButton();
});
