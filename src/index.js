const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

function build(config) {
    // Limpa o cache para aceitar cores novas do config.js
    try {
        delete require.cache[require.resolve('./parser.js')];
        delete require.cache[require.resolve('./config.js')];
    } catch (e) {}

    const parseClasse = require('./parser.js');
    const outputPath = path.resolve(process.cwd(), config.output);

    try {
        const arquivos = glob.sync(config.content, { absolute: true });
        const classesUnicas = new Set();
        const regex = /class=["']([^"']+)["']/g;

        arquivos.forEach(file => {
            const conteudo = fs.readFileSync(file, 'utf-8');
            let match;
            while ((match = regex.exec(conteudo)) !== null) {
                match[1].split(/\s+/).filter(Boolean).forEach(c => classesUnicas.add(c.trim()));
            }
        });

        let cssOutput = "/* LiteJIT v1.0 | Restaurado */\n";
        cssOutput += "* { margin: 0; padding: 0; box-sizing: border-box; }\n";

        Array.from(classesUnicas).forEach(c => {
            const regra = parseClasse(c);
            if (regra) cssOutput += regra + "\n";
        });

        fs.writeFileSync(outputPath, cssOutput);
        console.log(`✅ CSS Atualizado: ${classesUnicas.size} classes.`);
    } catch (e) {
        console.log("❌ Erro no build:", e.message);
    }
}

function watch(config) {
    console.clear();
    console.log(`🚀 LiteJIT Rodando...`);
    build(config); 

    // O segredo para voltar a funcionar: monitorar a pasta atual '.'
    const watcher = chokidar.watch('.', {
        ignored: /node_modules|style\.css/,
        persistent: true,
        usePolling: true,
        interval: 100
    });

    watcher.on('change', (filePath) => {
        // Se o arquivo que mudou for HTML, ele roda o build
        if (filePath.endsWith('.html')) {
            console.log(`⚡ Mudança detectada: ${filePath}`);
            build(config);
        }
    });
}

module.exports = { build, watch };