document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');

        // Hamburger Animation
        const spans = hamburger.querySelectorAll('span');
        if (mobileMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Sticky Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Fade Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Initial animations for hero
    document.querySelectorAll('.fade-up').forEach(el => {
        setTimeout(() => el.classList.add('visible'), 100);
    });

    // Observe other elements as they scroll in
    document.querySelectorAll('.section-title, .about-text, .skill-item, .project-card').forEach(el => {
        el.classList.add('fade-up');
        observer.observe(el);
    });

    // Back to top functionality
    const backToTopBtn = document.getElementById('backToTop');
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Form Submissions
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;

            const btn = form.querySelector('button');
            const ogText = btn.innerText;
            btn.innerText = 'Mengirim...';
            btn.style.opacity = '0.7';

            try {
                // Post ke Backend API
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, message })
                });
                
                const result = await response.json();

                if (result.success) {
                    btn.innerText = 'Terkirim ke Server!';
                    btn.style.background = 'transparent';
                    btn.style.color = '#08B2C4';
                    form.reset();
                } else {
                    btn.innerText = 'Gagal Mengirim';
                }
            } catch (err) {
                console.error(err);
                btn.innerText = 'Error Jaringan';
            }

            setTimeout(() => {
                btn.innerText = ogText;
                btn.style.background = '#08B2C4';
                btn.style.color = '#000';
                btn.style.opacity = '1';
            }, 3000);
        });
    }

    // Project Modal Logic
    const projectModal = document.getElementById('projectModal');
    const modalGallery = document.getElementById('modalGallery');
    const modalTitle = document.getElementById('modalTitle');
    const closeModal = document.getElementById('closeModal');
    const viewLinks = document.querySelectorAll('.view-link');

    if (projectModal) {
        viewLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const title = link.getAttribute('data-title') || 'Project Gallery';
                const imagesStr = link.getAttribute('data-images');

                modalTitle.innerText = title;
                modalGallery.innerHTML = '';

                if (imagesStr) {
                    const imgUrls = imagesStr.split(',');
                    imgUrls.forEach(url => {
                        if (url.trim()) {
                            const img = document.createElement('img');
                            img.src = url.trim();
                            modalGallery.appendChild(img);
                        }
                    });
                } else {
                    modalGallery.innerHTML = '<p style="color: var(--text-muted); grid-column: 1/-1;">Belum ada foto untuk proyek ini.</p>';
                }

                projectModal.classList.add('active');
            });
        });

        closeModal.addEventListener('click', () => {
            projectModal.classList.remove('active');
        });

        // Close on click outside
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
            }
        });
    }
    // Fetch GitHub Repositories for Skills
    const fetchGitHubSkills = async () => {
        try {
            const username = 'ubaysigma'; // Changed to your GitHub username
            const response = await fetch(`https://api.github.com/users/${username}/repos`);
            if (!response.ok) throw new Error('Network response was not ok');
            const repos = await response.json();

            const languages = {};
            let totalSize = 0;

            repos.forEach(repo => {
                if (repo.language && repo.size) {
                    if (!languages[repo.language]) {
                        languages[repo.language] = 0;
                    }
                    languages[repo.language] += repo.size;
                    totalSize += repo.size;
                }
            });

            const skillBarsContainer = document.querySelector('.skill-bars');
            if (skillBarsContainer && Object.keys(languages).length > 0) {
                skillBarsContainer.innerHTML = ''; // Clear hardcoded skills

                // Sort languages by size descending
                const sortedLanguages = Object.entries(languages)
                    .sort(([, a], [, b]) => b - a);

                sortedLanguages.forEach(([language, size]) => {
                    // Calculate percentage and ensure it's at least 1% if there's any code
                    const percentage = Math.max(1, Math.round((size / totalSize) * 100));

                    const skillItem = document.createElement('div');
                    skillItem.className = 'skill-item fade-up';

                    skillItem.innerHTML = `
                        <div class="skill-info">
                            <span>${language}</span>
                            <span>${percentage}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: 0%; transition: width 1s ease-out;"></div>
                        </div>
                    `;

                    skillBarsContainer.appendChild(skillItem);

                    // Observe for animation
                    observer.observe(skillItem);

                    // Animate the progress bar width after a short delay
                    setTimeout(() => {
                        const progressBar = skillItem.querySelector('.progress');
                        if (progressBar) {
                            progressBar.style.width = `${percentage}%`;
                        }
                    }, 500);
                });
            }
        } catch (error) {
            console.error('Error fetching GitHub skills:', error);
            // If it fails, it will just leave the hardcoded Dart/Flutter skills in the HTML
        }
    };

    fetchGitHubSkills();
    // --- Fetch GitHub Mobile Projects from Backend API ---
    const fetchGitHubProjects = async () => {
        try {
            const projectList = document.querySelector('.project-list');
            if (!projectList) return;

            const response = await fetch('/api/github-projects');
            const projects = await response.json();

            if (!projects || projects.length === 0 || projects.error) {
                console.warn('Could not load Github projects or no projects found.');
                return;
            }

            // Append the fetched GitHub projects to the list
            projects.forEach((project, index) => {
                const card = document.createElement('div');
                // Alternating reverse layout for new cards (assuming existing cards might end on a reverse or non-reverse)
                const isReverse = document.querySelectorAll('.project-card').length % 2 !== 0;
                card.className = `project-card ${isReverse ? 'reverse' : ''} fade-up`;
                
                card.innerHTML = `
                    <div class="project-image" style="background: linear-gradient(135deg, #0a1f33, #05101a);">
                        <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; color:rgba(8,178,196,0.3);">
                            <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        </div>
                    </div>
                    <div class="project-content">
                        <div class="project-meta">${project.updated_at || '2026'} &middot; ${project.language}</div>
                        <h3 class="project-name">${project.name}</h3>
                        <p class="project-tech">${project.description.length > 100 ? project.description.substring(0, 100) + '...' : project.description}</p>
                        <a href="${project.url}" target="_blank" class="view-link">VIEW REPO &rarr;</a>
                    </div>
                `;
                
                projectList.appendChild(card);
                observer.observe(card); // Observe new cards for scroll animation
            });

        } catch (error) {
            console.error('Error fetching github projects:', error);
        }
    };

    fetchGitHubProjects();
});
