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
    const backToTopBtn = document.getElementById('back-to-top');
    const searchInput = document.getElementById('search-input');
    const searchDropdown = document.getElementById('search-dropdown');
    const searchWrap = document.getElementById('search-wrap');
    const hljsThemeLink = document.getElementById('hljs-theme');

    const GITHUB_REPO_URL = 'https://github.com/luffydod/ConfigNote/edit/main/';
    const APP_BASE_URL = new URL('./', document.baseURI);

    // highlight.js CDN base
    const HLJS_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/';
    const HLJS_LIGHT = `${HLJS_CDN}github.min.css`;
    const HLJS_DARK  = `${HLJS_CDN}github-dark-dimmed.min.css`;

    // ─── Utility ────────────────────────────────────────────────────────────────

    function normalizeNotePath(notePath) {
        return decodeURIComponent(notePath || '')
            .trim()
            .replace(/\\/g, '/')
            .replace(/^\.\//, '')
            .replace(/^\/+/, '');
    }

    function buildNoteRequestUrls(notePath) {
        const normalizedPath = normalizeNotePath(notePath);
        const candidates = [
            new URL(normalizedPath, APP_BASE_URL),
            new URL(normalizedPath, document.baseURI),
            new URL(normalizedPath, window.location.href),
        ];
        return [...new Map(candidates.map((url) => [url.href, url])).values()];
    }

    function buildNoteHref(notePath) {
        const noteUrl = new URL(APP_BASE_URL);
        noteUrl.searchParams.set('note', normalizeNotePath(notePath));
        return `${noteUrl.pathname}${noteUrl.search}`;
    }

    function buildHomeHref() {
        return APP_BASE_URL.pathname;
    }

    function buildNoteAssetUrl(notePath) {
        return new URL(normalizeNotePath(notePath), APP_BASE_URL);
    }

    function resolveNotePath(currentNotePath, targetPath) {
        const virtualBase = new URL(
            currentNotePath ? currentNotePath.replace(/[^/]+$/, '') : '',
            'https://confignote.local/'
        );
        return normalizeNotePath(new URL(targetPath, virtualBase).pathname);
    }

    function getMarkedLinkArgs(hrefOrToken, title, text, rendererContext) {
        if (hrefOrToken && typeof hrefOrToken === 'object') {
            const token = hrefOrToken;
            const renderedText = token.tokens && rendererContext?.parser
                ? rendererContext.parser.parseInline(token.tokens)
                : (token.text || token.href || '');
            return { href: token.href || '', title: token.title || '', text: renderedText };
        }
        return { href: hrefOrToken || '', title: title || '', text: text || hrefOrToken || '' };
    }

    function scrollToHeading(targetId) {
        if (!targetId) return;
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;
        const yOffset = -80;
        const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }

    function navigateToUrl(url, replace = false) {
        const method = replace ? 'replaceState' : 'pushState';
        window.history[method]({}, '', `${url.pathname}${url.search}${url.hash}`);
        handleRoute();
    }

    function navigateToNote(notePath, options = {}) {
        const noteUrl = new URL(APP_BASE_URL);
        noteUrl.searchParams.set('note', normalizeNotePath(notePath));
        if (options.hash) noteUrl.hash = options.hash;
        navigateToUrl(noteUrl, options.replace);
    }

    function navigateHome(replace = false) {
        navigateToUrl(new URL(APP_BASE_URL), replace);
    }

    function isModifiedClick(event) {
        return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    }

    function getAppUrl(anchor) {
        if (!anchor || !anchor.href) return null;
        try {
            const url = new URL(anchor.href, window.location.href);
            if (url.origin !== window.location.origin) return null;
            if (url.pathname !== APP_BASE_URL.pathname) return null;
            return url;
        } catch {
            return null;
        }
    }

    // ─── Priority 1: Theme Management + Dynamic HLJS ─────────────────────────────

    function applyHljsTheme(isDark) {
        if (hljsThemeLink) {
            hljsThemeLink.href = isDark ? HLJS_DARK : HLJS_LIGHT;
        }
    }

    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const isDark = savedTheme === 'dark' || (!savedTheme && systemDark);

        if (isDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            sunIcon.classList.add('hidden');
            moonIcon.classList.remove('hidden');
        }
        applyHljsTheme(isDark);
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
        applyHljsTheme(newTheme === 'dark');
    });

    // ─── Priority 2: Global Search ───────────────────────────────────────────────

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    }

    function highlightMatch(text, query) {
        if (!query) return escapeHtml(text);
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return escapeHtml(text);
        return escapeHtml(text.slice(0, idx))
            + `<mark>${escapeHtml(text.slice(idx, idx + query.length))}</mark>`
            + escapeHtml(text.slice(idx + query.length));
    }

    let searchActive = false;

    function performSearch(query) {
        if (!query || !notesConfig || notesConfig.length === 0) {
            closeSearch();
            return;
        }
        const q = query.trim().toLowerCase();
        if (!q) { closeSearch(); return; }

        const results = notesConfig.filter(note =>
            note.title.toLowerCase().includes(q) || note.path.toLowerCase().includes(q)
        ).slice(0, 8);

        if (results.length === 0) {
            searchDropdown.innerHTML = `<div class="search-empty">没有找到匹配的笔记</div>`;
        } else {
            searchDropdown.innerHTML = results.map((note, i) => `
                <a class="search-result-item" href="${buildNoteHref(note.path)}" data-note-path="${note.path}" tabindex="-1">
                    <span class="search-result-title">${highlightMatch(note.title, query.trim())}</span>
                    <span class="search-result-path">${highlightMatch(note.path, query.trim())}</span>
                </a>
            `).join('');
        }

        searchDropdown.classList.add('open');
        searchActive = true;
    }

    function closeSearch() {
        searchDropdown.classList.remove('open');
        searchActive = false;
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => performSearch(searchInput.value));

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearch();
                searchInput.blur();
            }
            if (e.key === 'ArrowDown' && searchActive) {
                e.preventDefault();
                const first = searchDropdown.querySelector('.search-result-item');
                if (first) first.focus();
            }
        });

        searchDropdown.addEventListener('keydown', (e) => {
            const items = Array.from(searchDropdown.querySelectorAll('.search-result-item'));
            const focused = document.activeElement;
            const idx = items.indexOf(focused);
            if (e.key === 'ArrowDown') { e.preventDefault(); items[idx + 1]?.focus(); }
            if (e.key === 'ArrowUp')   { e.preventDefault(); idx > 0 ? items[idx - 1].focus() : searchInput.focus(); }
            if (e.key === 'Escape')    { closeSearch(); searchInput.focus(); }
        });

        searchDropdown.addEventListener('click', (e) => {
            const item = e.target.closest('.search-result-item');
            if (item) {
                e.preventDefault();
                const notePath = item.dataset.notePath;
                closeSearch();
                searchInput.value = '';
                navigateToNote(notePath);
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (searchWrap && !searchWrap.contains(e.target)) closeSearch();
        });

        // Keyboard shortcut: "/" to focus search
        document.addEventListener('keydown', (e) => {
            if (e.key === '/' && document.activeElement !== searchInput
                && document.activeElement.tagName !== 'INPUT'
                && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                searchInput.focus();
                searchInput.select();
            }
        });
    }

    // ─── Render Grid ─────────────────────────────────────────────────────────────

    function renderGrid() {
        if (!notesConfig || notesConfig.length === 0) {
            notesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 2rem;">
                    没有发现笔记。请运行 <code>python3 scripts/update_notes.py</code> 来生成配置。
                </div>`;
            return;
        }

        notesGrid.innerHTML = notesConfig.map(note => `
            <a href="${buildNoteHref(note.path)}" class="note-card" data-path="${note.path}">
                <div class="note-title">${note.title}</div>
                <div class="note-path">${note.path}</div>
            </a>
        `).join('');
    }

    // ─── Priority 4: Markdown Renderer (image lazy-load, external link icon) ────

    const renderer = new marked.Renderer();

    renderer.link = function(href, title, text) {
        const linkArgs = getMarkedLinkArgs(href, title, text, this);
        if (linkArgs.href && !linkArgs.href.startsWith('http') && !linkArgs.href.startsWith('#') && linkArgs.href.endsWith('.md')) {
            const currentNote = new URLSearchParams(window.location.search).get('note');
            const resolvedPath = resolveNotePath(currentNote, linkArgs.href);
            return `<a href="${buildNoteHref(resolvedPath)}" data-note-path="${resolvedPath}" title="${linkArgs.title}">${linkArgs.text}</a>`;
        }
        // External link: add icon + security attrs
        const isExternal = linkArgs.href.startsWith('http');
        const externalAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        const externalIcon  = isExternal ? ' <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ext-link-icon"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>' : '';
        return `<a href="${linkArgs.href}" title="${linkArgs.title}"${externalAttrs}>${linkArgs.text}${externalIcon}</a>`;
    };

    renderer.image = function(href, title, text) {
        // Support both old string signature and new token object
        let src = typeof href === 'object' ? (href.href || '') : (href || '');
        let altText = typeof href === 'object' ? (href.text || text || '') : (text || '');
        let titleText = typeof href === 'object' ? (href.title || title || '') : (title || '');
        return `<img src="${src}" alt="${altText}" title="${titleText}" loading="lazy" decoding="async">`;
    };

    marked.use({ renderer });

    // ─── Render Note ─────────────────────────────────────────────────────────────

    async function fetchNoteContent(notePath) {
        const attemptErrors = [];
        for (const candidateUrl of buildNoteRequestUrls(notePath)) {
            const requestUrl = new URL(candidateUrl);
            requestUrl.searchParams.set('v', Date.now().toString());
            try {
                const response = await fetch(requestUrl);
                if (!response.ok) {
                    attemptErrors.push(`${requestUrl.pathname} -> HTTP ${response.status}`);
                    continue;
                }
                return await response.text();
            } catch (error) {
                attemptErrors.push(`${requestUrl.pathname} -> ${error.message}`);
            }
        }
        throw new Error(attemptErrors.join(' | '));
    }

    async function fetchAndRenderNote(notePath) {
        const normalizedNotePath = normalizeNotePath(notePath);

        // Priority 3: Smooth transition — fade out home, fade in note
        homeView.classList.remove('section-active');
        homeView.classList.add('section-hidden');
        noteView.classList.remove('section-hidden');
        noteView.classList.add('section-active');
        window.scrollTo(0, 0);

        markdownContent.innerHTML = `
            <div class="loader">
                <div class="spinner"></div>
                <p>加载笔记中...</p>
            </div>`;

        githubEditLink.href = `${GITHUB_REPO_URL}${normalizedNotePath}`;

        let text;
        try {
            text = await fetchNoteContent(normalizedNotePath);
        } catch (error) {
            console.error('Error fetching markdown:', error);
            markdownContent.innerHTML = `
                <div style="color: #ef4444; padding: 2rem; text-align: center;">
                    <h2>无法加载笔记 😢</h2>
                    <p style="margin-top: 1rem;">找不到文件: <code>${normalizedNotePath}</code></p>
                    <p style="margin-top: 0.5rem; font-size: 0.9em; color: var(--text-secondary);">请检查路径是否正确，或确认当前站点根目录可访问该 Markdown 文件。</p>
                </div>
            `;
            return;
        }

        try {
            const html = marked.parse(text);
            markdownContent.innerHTML = html;

            markdownContent.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
                // Priority 1: Language Label on code blocks
                addLanguageLabel(block);
            });

            buildTableOfContents();
            addCopyButtons();

            const h1 = markdownContent.querySelector('h1');
            const fileTitle = typeof notesConfig !== 'undefined'
                ? notesConfig.find(n => n.path === normalizedNotePath)?.title
                : undefined;
            const noteTitle = h1 ? h1.textContent : (fileTitle || '笔记');
            document.title = `${noteTitle} - ConfigNote`;

            if (window.location.hash) {
                scrollToHeading(window.location.hash.substring(1));
            }
        } catch (error) {
            console.error('Error rendering markdown:', error);
            markdownContent.innerHTML = `
                <div style="color: #ef4444; padding: 2rem; text-align: center;">
                    <h2>笔记渲染失败 😵</h2>
                    <p style="margin-top: 1rem;">文件已加载，但 Markdown 渲染过程中发生错误。</p>
                    <p style="margin-top: 0.5rem; font-size: 0.9em; color: var(--text-secondary);">请检查控制台错误信息，或修复当前文档中的链接与语法。</p>
                </div>
            `;
        }
    }

    // ─── Priority 1: Language Label ──────────────────────────────────────────────

    function addLanguageLabel(codeBlock) {
        const pre = codeBlock.parentElement;
        if (!pre || pre.querySelector('.lang-label')) return;

        // hljs adds class "language-xxx" after highlight
        const langClass = Array.from(codeBlock.classList).find(c => c.startsWith('language-'));
        if (!langClass) return;
        const lang = langClass.replace('language-', '');
        if (!lang || lang === 'plaintext') return;

        const label = document.createElement('span');
        label.className = 'lang-label';
        label.textContent = lang;
        pre.appendChild(label);
    }

    // ─── Table of Contents ───────────────────────────────────────────────────────

    function buildTableOfContents() {
        const tocList = document.getElementById('toc-list');
        if (!tocList) return;

        tocList.innerHTML = '';
        const headings = markdownContent.querySelectorAll('h1, h2, h3, h4');

        if (headings.length === 0) {
            tocList.innerHTML = '<li style="color: var(--text-secondary); font-size: 0.875rem;">无目录结构</li>';
            return;
        }

        let tocHTML = '';
        headings.forEach((heading, index) => {
            if (!heading.id) {
                let id = heading.textContent.trim().toLowerCase().replace(/[\s\W]+/g, '-');
                if (!id) id = `heading-${index}`;
                let uniqueId = id;
                let counter = 1;
                while (document.getElementById(uniqueId)) {
                    uniqueId = `${id}-${counter}`;
                    counter++;
                }
                heading.id = uniqueId;
            }
            const level = parseInt(heading.tagName.substring(1));
            tocHTML += `<li class="toc-h${level}"><a href="#${heading.id}">${heading.textContent}</a></li>`;
        });

        tocList.innerHTML = tocHTML;
        setupScrollspy();
    }

    const tocListDom = document.getElementById('toc-list');
    if (tocListDom) {
        tocListDom.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}#${targetId}`);
                scrollToHeading(targetId);
            }
        });
    }

    // ─── Global Click Delegation ─────────────────────────────────────────────────

    document.addEventListener('click', (event) => {
        const anchor = event.target.closest('a');
        if (!anchor || isModifiedClick(event) || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

        if (anchor.getAttribute('href')?.startsWith('#')) {
            event.preventDefault();
            const targetId = anchor.getAttribute('href').substring(1);
            window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}#${targetId}`);
            scrollToHeading(targetId);
            return;
        }

        const explicitNotePath = anchor.dataset.notePath;
        if (explicitNotePath) {
            event.preventDefault();
            navigateToNote(explicitNotePath);
            return;
        }

        const appUrl = getAppUrl(anchor);
        if (!appUrl) return;

        event.preventDefault();
        const notePath = appUrl.searchParams.get('note');
        if (notePath) {
            navigateToNote(notePath, { hash: appUrl.hash });
            return;
        }

        navigateHome();
    });

    // ─── Code Copy Buttons ───────────────────────────────────────────────────────

    function addCopyButtons() {
        const preBlocks = markdownContent.querySelectorAll('pre');
        preBlocks.forEach((pre) => {
            const button = document.createElement('button');
            button.className = 'copy-btn';
            button.title = '复制代码';
            button.setAttribute('aria-label', '复制代码');
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';

            button.addEventListener('click', async () => {
                const codeBlock = pre.querySelector('code');
                if (!codeBlock) return;
                try {
                    await navigator.clipboard.writeText(codeBlock.innerText);
                    button.classList.add('copied');
                    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    setTimeout(() => {
                        button.classList.remove('copied');
                        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }
            });

            pre.appendChild(button);
        });
    }

    // ─── Scrollspy & Back to Top ─────────────────────────────────────────────────

    let currentScrollListener = null;

    function setupScrollspy() {
        const headings = Array.from(markdownContent.querySelectorAll('h1, h2, h3, h4'));
        const tocLinks = document.querySelectorAll('#toc-list a');

        if (headings.length === 0) return;

        if (currentScrollListener) {
            window.removeEventListener('scroll', currentScrollListener);
        }

        currentScrollListener = () => {
            let activeId = '';
            const scrollPos = window.scrollY + 120;

            for (const h of headings) {
                if (h.offsetTop <= scrollPos) {
                    activeId = h.id;
                } else {
                    break;
                }
            }

            if (!activeId && headings.length > 0) activeId = headings[0].id;

            tocLinks.forEach(a => {
                a.classList.remove('active');
                if (activeId && a.getAttribute('href') === `#${activeId}`) {
                    a.classList.add('active');
                }
            });
        };

        window.addEventListener('scroll', currentScrollListener);
        currentScrollListener();
    }

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('show', window.scrollY > 300);
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ─── Priority 3: Router with smooth view transition ───────────────────────────

    function showHomeView() {
        document.title = "ConfigNote - 📝 我的开发工具配置备忘录";
        noteView.classList.remove('section-active');
        noteView.classList.add('section-hidden');
        homeView.classList.remove('section-hidden');
        homeView.classList.add('section-active');
        window.scrollTo(0, 0);
        renderGrid();
    }

    function handleRoute() {
        const urlParams = new URLSearchParams(window.location.search);
        const notePath = urlParams.get('note');
        if (notePath) {
            fetchAndRenderNote(notePath);
        } else {
            showHomeView();
        }
    }

    window.addEventListener('popstate', handleRoute);

    // ─── Bootstrap ───────────────────────────────────────────────────────────────
    initTheme();
    handleRoute();
});