const express = require('express');
const cors = require('cors');
const axios = require('axios');
const xss = require('xss');
const validator = require('validator');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Mengamankan header HTTP aplikasi dari kerentanan umum
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Membatasi ukuran body request maksimal 10kb untuk mencegah serangan DoS
app.use(express.static('public')); // Serve the frontend from 'public' folder

// Konfigurasi Rate Limiter untuk form kontak (Maksimal 3 pesan per 15 menit per IP)
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Menit
    max: 3, // Limit tiap IP mengirim maksimal 3 request per windowMs
    message: { success: false, message: 'Terlalu banyak pesan terkirim. Silakan coba lagi setelah 15 menit.' },
    standardHeaders: true, 
    legacyHeaders: false, 
});

// Configuration
// You can change this to your actual GitHub username
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'ubaysigma';

// --- 1. API: Fetch GitHub Projects (Mobile Focus) ---
app.get('/api/github-projects', async (req, res) => {
    try {
        const response = await axios.get(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
                // 'Authorization': `token ${process.env.GITHUB_TOKEN}` // Uncomment and set token in .env to avoid rate limits
            }
        });

        const repos = response.data;

        // Keywords and languages related to Mobile Development
        const mobileKeywords = ['android', 'ios', 'flutter', 'react-native', 'mobile', 'react native'];
        const mobileLanguages = ['kotlin', 'swift', 'dart', 'java', 'objective-c'];

        // Filter projects
        let mobileRepos = repos.filter(repo => {
            const hasMobileLang = repo.language && mobileLanguages.includes(repo.language.toLowerCase());

            const hasMobileTopic = repo.topics && repo.topics.some(topic =>
                mobileKeywords.includes(topic.toLowerCase())
            );

            const hasMobileDesc = repo.description && mobileKeywords.some(keyword =>
                repo.description.toLowerCase().includes(keyword)
            );

            return hasMobileLang || hasMobileTopic || hasMobileDesc;
        });

        // Fallback: If no mobile projects found, grab the top starred repos
        if (mobileRepos.length === 0) {
            mobileRepos = repos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);
        } else {
            // Sort by stars and take up to 6 mobile projects
            mobileRepos = mobileRepos.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);
        }

        // Format for frontend
        const formattedProjects = mobileRepos.map(repo => ({
            id: repo.id,
            name: repo.name.replace(/-/g, ' '),
            description: repo.description || 'Awesome mobile project repository.',
            url: repo.html_url,
            stars: repo.stargazers_count,
            language: repo.language || 'Mobile',
            updated_at: new Date(repo.updated_at).getFullYear()
        }));

        res.json(formattedProjects);
    } catch (error) {
        console.error('Error fetching GitHub data:', error.message);
        res.status(500).json({ error: 'Failed to fetch projects from GitHub' });
    }
});

// --- 2. API: Contact Form Submission ---
// Apply contactLimiter here to prevent spam
app.post('/api/contact', contactLimiter, (req, res) => {
    let { name, email, message } = req.body;

    // 1. Validasi input kosong
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Semua kolom wajib diisi!' });
    }

    // 2. Validasi format email
    if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: 'Format email tidak valid!' });
    }

    // 3. Sanitasi untuk mencegah XSS & SQL Injection (membersihkan HTML/Script)
    const cleanName = xss(validator.escape(validator.trim(name)));
    const cleanEmail = validator.normalizeEmail(validator.trim(email));
    const cleanMessage = xss(validator.escape(validator.trim(message)));

    // Simulate processing the message (e.g. saving to DB or sending email)
    console.log('\n--- NEW SECURE MESSAGE RECEIVED ---');
    console.log(`Name   : ${cleanName}`);
    console.log(`Email  : ${cleanEmail}`);
    console.log(`Message: ${cleanMessage}`);
    console.log('-----------------------------------\n');

    res.json({ success: true, message: 'Message sent successfully!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
    console.log(`Serving frontend from /public folder`);
});
