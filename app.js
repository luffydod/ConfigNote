document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const homeView = document.getElementById('home-view');
    const noteView = document.getElementById('note-view');
    const notesGrid = document.getElementById('notes-grid');
    const markdownContent = document.getElementById('markdown-content');
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    const githubEditLink = document.getElementById('github-edit-link');

    const GITHUB_REPO_URL = 'https://github.com/luffydod/ConfigNote/edit/main/';

    // --- Theme Management ---
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
            document.documentElement.setAttribute('data-theme', 'dark');
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (newTheme === 'dark') {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        } else {
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
    });

    // --- Render Grid ---
    function renderGrid() {
        if (!notesConfig || notesConfig.length === 0) {
            notesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 2rem;">
                    没有发现笔记。请运行 <code>python3 update_notes.py</code> 来生成配置。
                </div>`;
            return;
        }

        notesGrid.innerHTML = notesConfig.map(note => `
            <a href="?note=${encodeURIComponent(note.path)}" class="note-card" data-path="${note.path}">
                <div class="note-title">${note.title}</div>
                <div class="note-path">${note.path}</div>
            </a>
        `).join('');
    }

    // --- Markdown Rendering Setup ---
    marked.setOptions({
        highlight: function(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
        langPrefix: 'hljs language-', // highlight.js css expects a top-level 'hljs' class.
    });

    // Handle relative links in markdown (intercept links to other .md files)
    const renderer = new marked.Renderer();
    renderer.link = function(href, title, text) {
        // If it's a relative link to an .md file, convert it to our routing system
        if (href && !href.startsWith('http') && !href.startsWith('#') && href.endsWith('.md')) {
            // Need to resolve the relative path based on current note path
            const currentNote = new URLSearchParams(window.location.search).get('note');
            let resolvedPath = href;
            if (currentNote) {
                const parts = currentNote.split('/');
                parts.pop(); // remove current filename
                // simple resolution for ./ and ../
                const hrefParts = href.split('/');
                for (const part of hrefParts) {
                    if (part === '.') {
                        continue;
                    } else if (part === '..') {
                        parts.pop();
                    } else {
                        parts.push(part);
                    }
                }
                resolvedPath = parts.join('/');
            }
            return `<a href="?note=${encodeURIComponent(resolvedPath)}" title="${title || ''}">${text}</a>`;
        }
        return `<a href="${href}" title="${title || ''}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    };
    marked.use({ renderer });

    // --- Render Note ---
    async function fetchAndRenderNote(notePath) {
        homeView.classList.replace('section-active', 'section-hidden');
        noteView.classList.replace('section-hidden', 'section-active');
        window.scrollTo(0, 0);

        markdownContent.innerHTML = `
            <div class="loader">
                <div class="spinner"></div>
                <p>加载笔记中...</p>
            </div>`;
        
        githubEditLink.href = `${GITHUB_REPO_URL}${notePath}`;

        try {
            // Append a unique query param to bypass cache during development
            const resp = await fetch(notePath + '?v=' + new Date().getTime());
            if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
            const text = await resp.text();
            
            // Parse Markdown to HTML
            const html = marked.parse(text);
            markdownContent.innerHTML = html;
        } catch (error) {
            console.error('Error fetching markdown:', error);
            markdownContent.innerHTML = `
                <div style="color: #ef4444; padding: 2rem; text-align: center;">
                    <h2>无法加载笔记 😢</h2>
                    <p style="margin-top: 1rem;">找不到文件: <code>${notePath}</code></p>
                    <p style="margin-top: 0.5rem; font-size: 0.9em; color: var(--text-secondary);">请检查路径是否正确，或重新生成 config.js。</p>
                </div>
            `;
        }
    }

    // --- Router ---
    function handleRoute() {
        const urlParams = new URLSearchParams(window.location.search);
        const notePath = urlParams.get('note');

        if (notePath) {
            fetchAndRenderNote(notePath);
        } else {
            noteView.classList.replace('section-active', 'section-hidden');
            homeView.classList.replace('section-hidden', 'section-active');
            renderGrid();
        }
    }

    // Listen for back/forward browser navigation
    window.addEventListener('popstate', handleRoute);

    // Bootstrap
    initTheme();
    handleRoute();
});
