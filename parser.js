const config = require('./config');
const utils = require('./utils');

function parseClasse(classeOriginal) {
    let classeParaProcessar = classeOriginal;
    let sufixoCss = "";

    // 1. Hover e Estáticos
    if (classeOriginal.startsWith('hover:')) {
        classeParaProcessar = classeOriginal.replace('hover:', '');
        sufixoCss = ":hover";
    }
    if (config.estaticos[classeParaProcessar]) {
        return `.${utils.escapeSeletor(classeOriginal)}${sufixoCss} { ${config.estaticos[classeParaProcessar]} }`;
    }

    // 2. Quebra de Prefixo e Valor
    let partes = classeParaProcessar.split('-');
    let prefixo = "", valor = "";

    for (let i = partes.length - 1; i > 0; i--) {
        let possivelPrefixo = partes.slice(0, i).join('-');
        if (config.mapaPropriedades[possivelPrefixo]) {
            prefixo = possivelPrefixo;
            valor = partes.slice(i).join('-');
            break;
        }
    }

    if (!prefixo) return null;

    // --- LÓGICA DE VALORES COMPOSTOS (Fatiação) ---
    let valorPrincipal = valor;
    let valorExtra = null;

    if (valor.includes('[') && valor.endsWith(']')) {
        const i = valor.indexOf('[');
        if (i > 0) { // Ex: 20[#f00] -> principal: 20, extra: #f00
            valorPrincipal = valor.slice(0, i);
            valorExtra = valor.slice(i + 1, -1);
        } else {
            valorPrincipal = valor.slice(1, -1); // Ex: [#f00]
        }
    }

    // 3. Processamento para TEXTO COMPOSTO (Tamanho + Cor)
    if (prefixo === 'text' && valorExtra) {
        const fontSize = isNaN(parseInt(valorPrincipal)) ? valorPrincipal : `${valorPrincipal}px`;
        const cor = config.cores[valorExtra] || valorExtra;
        return `.${utils.escapeSeletor(classeOriginal)}${sufixoCss} { font-size: ${fontSize}; color: ${cor}; }`;
    }

    // 4. Processamento para BORDA COMPOSTA (Espessura + Cor)
    if (prefixo.startsWith('border') && valorExtra) {
        const direcao = utils.getDirecaoCompleta(prefixo);
        const propBase = prefixo === 'border' ? 'border' : `border-${direcao}`;
        const espessura = isNaN(parseInt(valorPrincipal)) ? valorPrincipal : `${valorPrincipal}px`;
        const cor = config.cores[valorExtra] || valorExtra;
        return `.${utils.escapeSeletor(classeOriginal)}${sufixoCss} { ${propBase}: ${espessura} solid ${cor}; }`;
    }

    // 5. LÓGICA PADRÃO (Valores Simples)
    const eCor = valorPrincipal.includes('#') || config.cores[valorPrincipal];
    let propFinal = utils.resolverPropriedade(prefixo, eCor);
    let estiloExtra = utils.processarEstiloBorda(prefixo);
    let valorFinalCss;

    if (eCor) {
        valorFinalCss = config.cores[valorPrincipal] || valorPrincipal;
    } else {
        const num = parseInt(valorPrincipal);
        if (!isNaN(num)) {
            const isSpacing = prefixo.startsWith('p') || prefixo.startsWith('m');
            valorFinalCss = isSpacing ? `${num * config.baseSpacing}px` : `${num}px`;
        } else {
            valorFinalCss = valorPrincipal;
        }
    }

    return `.${utils.escapeSeletor(classeOriginal)}${sufixoCss} { ${propFinal}: ${valorFinalCss}; ${estiloExtra} }`;
}

module.exports = parseClasse;