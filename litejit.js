const motor = require('./src/index.js');
const CleanCSS = require('clean-css');
const fs = require('fs');

// ==========================================
// CONFIGURAÇÃO DO USUÁRIO
// ==========================================
const config = {
    content: './**/*.html',     // Onde está o seu HTML
    output: './style.css',       // Onde o CSS gerado deve ir
    minify: './style.min.css'    // Onde o CSS minificado deve ir
};
// ==========================================

const comando = process.argv[2];

if (comando === 'build') {
    // Passamos o config para o motor
    motor.build(config);
    
    console.log('⚡ Minificando para produção...');
    if (fs.existsSync(config.output)) {
        const css = fs.readFileSync(config.output, 'utf-8');
        const minified = new CleanCSS({ level: 2 }).minify(css);
        fs.writeFileSync(config.minify, minified.styles);
        console.log(`🚀 Build concluído: ${config.minify}`);
    }
} else {
    // Passamos o config para o modo watch
    motor.watch(config);
}