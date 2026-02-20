const fs = require('fs');
const path = require('path');
const parseClasse = require(path.join(__dirname, 'parser.js'));

const HTML_FILE = './index.html';
const CSS_FILE = './style.css';

function build() {
    console.log('🏗️  Building CSS...');
    const html = fs.readFileSync(HTML_FILE, 'utf-8');
    const regex = /class="([^"]+)"/g;
    let match;
    const classesUnicas = new Set();

    while ((match = regex.exec(html)) !== null) {
        match[1].split(/\s+/).forEach(c => classesUnicas.add(c));
    }

    let cssOutput = "/* Mini Tailwind Generated */\n";
    classesUnicas.forEach(c => {
        const regra = parseClasse(c);
        if (regra) cssOutput += regra + "\n";
    });

    fs.writeFileSync(CSS_FILE, cssOutput);
    console.log('✅ Done!');
}

// Watcher para atualizar ao salvar o HTML
fs.watchFile(HTML_FILE, { interval: 500 }, build);
build(); // Roda ao iniciar