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
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const message = document.getElementById('contactMessage').value;

            const btn = form.querySelector('button');
            const ogText = btn.innerText;
            btn.innerText = 'Membuka Email...';
            btn.style.opacity = '0.7';

            // Tuliskan alamat email aslimu di bawah ini
            const myEmail = "hubaibakhtar09@gmail.com";

            const subject = encodeURIComponent(`Pesan dari ${name} (Portfolio)`);
            const body = encodeURIComponent(`Dari: ${name}\nEmail Pengirim: ${email}\n\nPesan:\n${message}`);

            // Buka aplikasi email bawaan dengan data yang terisi otomatis
            window.location.href = `mailto:${myEmail}?subject=${subject}&body=${body}`;

            setTimeout(() => {
                btn.innerText = 'Selesai!';
                btn.style.background = 'transparent';
                btn.style.color = '#08B2C4';
                form.reset();

                setTimeout(() => {
                    btn.innerText = ogText;
                    btn.style.background = '#08B2C4';
                    btn.style.color = '#000';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1000);
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
});
