class SpeedReader {
    constructor() {
        this.words = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.speed = 300; // WPM (Words Per Minute)
        this.interval = null;

        this.urlInput = document.getElementById('urlInput');
        this.textInput = document.getElementById('textInput');
        this.loadBtn = document.getElementById('loadBtn');
        this.loadTextBtn = document.getElementById('loadTextBtn');
        this.playBtn = document.getElementById('playBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedDisplay = document.getElementById('speedDisplay');
        this.wordDisplay = document.getElementById('wordDisplay');
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        this.readerSection = document.getElementById('readerSection');
        this.errorMessage = document.getElementById('errorMessage');

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Tab switcher
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                document.getElementById(e.target.dataset.tab).classList.add('active');
                this.errorMessage.textContent = '';
            });
        });

        this.loadBtn.addEventListener('click', () => this.loadArticle());
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadArticle();
        });

        this.loadTextBtn.addEventListener('click', () => this.loadDirectText());
        this.textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) this.loadDirectText();
        });

        this.playBtn.addEventListener('click', () => this.play());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());

        this.speedSlider.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            this.speedDisplay.textContent = this.speed;
            if (this.isPlaying) {
                this.pause();
                this.play();
            }
        });
    }

    async loadArticle() {
        const url = this.urlInput.value.trim();
        
        if (!url) {
            this.showError('Vänligen ange en URL');
            return;
        }

        this.loadBtn.disabled = true;
        this.loadBtn.textContent = 'Laddar...';
        this.errorMessage.textContent = '';

        try {
            // Försök med flera proxies
            const proxies = [
                url => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`,
                url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
                url => `https://crossorigin.me/${url}`,
            ];

            let html = null;
            let lastError = null;

            for (let proxyFn of proxies) {
                try {
                    const proxyUrl = proxyFn(url);
                    const response = await fetch(proxyUrl, { 
                        method: 'GET',
                        headers: { 
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                        }
                    });

                    if (!response.ok) {
                        lastError = `HTTP ${response.status}`;
                        continue;
                    }

                    const contentType = response.headers.get('content-type');
                    let data;
                    
                    if (contentType && contentType.includes('application/json')) {
                        data = await response.json();
                        html = data.contents || data.text || data.data;
                    } else {
                        html = await response.text();
                    }

                    if (html && html.length > 500) {
                        break;
                    }
                } catch (e) {
                    lastError = e.message;
                    continue;
                }
            }

            if (!html || html.length === 0) {
                throw new Error('Kunde inte hämta sidan. Testa den direkta text-funktionen istället.');
            }

            const text = this.extractMainText(html);

            if (!text || text.length === 0) {
                throw new Error('Kunde inte extrahera text från sidan.');
            }

            this.words = this.parseWords(text);
            this.currentIndex = 0;
            this.isPlaying = false;

            this.readerSection.style.display = 'block';
            this.displayWord();
            this.updateProgress();
            this.readerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) {
            this.showError('Fel vid laddning: ' + error.message);
        } finally {
            this.loadBtn.disabled = false;
            this.loadBtn.textContent = 'Ladda artikel';
        }
    }

    loadDirectText() {
        const text = this.textInput.value.trim();
        
        if (!text) {
            this.showError('Vänligen klistra in lite text');
            return;
        }

        this.words = this.parseWords(text);
        this.currentIndex = 0;
        this.isPlaying = false;

        this.readerSection.style.display = 'block';
        this.displayWord();
        this.updateProgress();
        this.errorMessage.textContent = '';

        // Scrolla till läsaren
        this.readerSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    extractMainText(html) {
        // Skapa en DOM från HTML-strängen
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Ta bort skript och stilar
        const scripts = doc.querySelectorAll('script, style, nav, footer, .advertisement, .ad, .sidebar');
        scripts.forEach(s => s.remove());

        // Försök extrahera huvudinnehållet
        let mainText = '';

        // Försök hitta huvudartiklelelement
        const article = doc.querySelector('article') || 
                       doc.querySelector('[role="main"]') ||
                       doc.querySelector('main');

        if (article) {
            mainText = article.textContent;
        } else {
            // Fallback: hämta från body
            mainText = doc.body.textContent;
        }

        // Rensa upp texten
        mainText = mainText
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, ' ')
            .trim();

        return mainText;
    }

    parseWords(text) {
        return text
            .split(/\s+/)
            .filter(word => word.length > 0)
            .map(word => word.replace(/[^a-zA-Z0-9åäöÅÄÖ]/g, ''));
    }

    highlightMiddleLetter(word) {
        if (word.length === 0) return word;

        const middle = Math.floor(word.length / 2);
        const before = word.substring(0, middle);
        const letter = word.substring(middle, middle + 1);
        const after = word.substring(middle + 1);

        return `${before}<span class="highlight">${letter}</span>${after}`;
    }

    displayWord() {
        if (this.words.length === 0) return;

        const word = this.words[this.currentIndex];
        this.wordDisplay.innerHTML = this.highlightMiddleLetter(word);
        this.updateProgress();
    }

    updateProgress() {
        const percentage = (this.currentIndex / this.words.length) * 100;
        this.progressBar.style.width = percentage + '%';
        this.progressText.textContent = `${this.currentIndex + 1} / ${this.words.length}`;
    }

    play() {
        if (this.words.length === 0) return;

        this.isPlaying = true;
        this.playBtn.disabled = true;
        this.pauseBtn.disabled = false;

        const msPerWord = 60000 / this.speed;

        this.interval = setInterval(() => {
            this.currentIndex++;

            if (this.currentIndex >= this.words.length) {
                this.pause();
                this.currentIndex = this.words.length - 1;
                this.displayWord();
                return;
            }

            this.displayWord();
        }, msPerWord);
    }

    pause() {
        this.isPlaying = false;
        this.playBtn.disabled = false;
        this.pauseBtn.disabled = true;

        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    reset() {
        this.pause();
        this.currentIndex = 0;
        this.displayWord();
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.readerSection.style.display = 'none';
    }
}

// Initialisera när DOM är redo
document.addEventListener('DOMContentLoaded', () => {
    new SpeedReader();
});
