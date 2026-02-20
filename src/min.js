const CleanCSS = require('clean-css');
const fs = require('fs');

const inputPath = './style.css';
const outputPath = './style.min.css';

// Configuração de minificação agressiva
const options = {
    level: {
        1: { all: true },
        2: { all: true }
    }
};

try {
    if (fs.existsSync(inputPath)) {
        const css = fs.readFileSync(inputPath, 'utf8');
        const minified = new CleanCSS(options).minify(css);

        fs.writeFileSync(outputPath, minified.styles);

        const original = (fs.statSync(inputPath).size / 1024).toFixed(2);
        const final = (minified.styles.length / 1024).toFixed(2);

        console.log(`\n🚀 Build de Produção concluído!`);
        console.log(`📊 Original: ${original}KB | Minificado: ${final}KB`);
        console.log(`📂 Arquivo salvo em: ${outputPath}\n`);
    } else {
        console.log("❌ Erro: style.css não encontrado. Rode o index.js primeiro.");
    }
} catch (err) {
    console.error("❌ Erro no processo de minificação:", err);
}