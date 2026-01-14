class SpeedReader {
    constructor() {
        this.words = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.speed = 300; // WPM (Words Per Minute)
        this.interval = null;

        this.urlInput = document.getElementById('urlInput');
        this.loadBtn = document.getElementById('loadBtn');
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
        this.loadBtn.addEventListener('click', () => this.loadArticle());
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.loadArticle();
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
            // Använd en CORS proxy för att hämta innehål
            const encodedUrl = encodeURIComponent(url);
            const proxyUrl = `https://api.allorigins.win/get?url=${encodedUrl}`;
            const response = await fetch(proxyUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const html = data.contents;
            const text = this.extractMainText(html);

            if (!text || text.length === 0) {
                throw new Error('Kunde inte extrahera text från URL:en');
            }

            this.words = this.parseWords(text);
            this.currentIndex = 0;
            this.isPlaying = false;

            this.readerSection.style.display = 'block';
            this.displayWord();
            this.updateProgress();
        } catch (error) {
            this.showError('Fel vid laddning: ' + error.message);
        } finally {
            this.loadBtn.disabled = false;
            this.loadBtn.textContent = 'Ladda artikel';
        }
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
