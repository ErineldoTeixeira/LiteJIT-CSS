const chokidar = require('chokidar');
const fs = require('fs');
const parseClasse = require('./parser.js');

const HTML_FILE = './index.html';
const CSS_FILE = './style.css';

function build() {
    console.log('🏗️  LiteJIT: Construindo e limpando...');
    try {
        const html = fs.readFileSync(HTML_FILE, 'utf-8');
        const regex = /class="([^"]+)"/g;
        let match;
        const classesUnicas = new Set();

        while ((match = regex.exec(html)) !== null) {
            match[1].split(/\s+/).filter(Boolean).forEach(c => classesUnicas.add(c));
        }

        let cssOutput = "/* LiteJIT v1.3 | Purge Ativo */\n";
        cssOutput += "* { margin: 0; padding: 0; box-sizing: border-box; }\n";

        classesUnicas.forEach(c => {
            const regra = parseClasse(c);
            if (regra) cssOutput += regra + "\n";
        });

        fs.writeFileSync(CSS_FILE, cssOutput);
        console.log(`✅ Sucesso! ${classesUnicas.size} classes em uso.`);
    } catch (e) {
        console.log("❌ Erro no build:", e.message);
    }
}

// Inicializa o Chokidar
const watcher = chokidar.watch(HTML_FILE);
watcher.on('change', () => build());

build(); // Roda ao iniciar
console.log('👀 Chock ativo vigiando index.html...');