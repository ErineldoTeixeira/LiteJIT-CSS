// utils.js
const config = require('./config');

/**
 * Escapa caracteres especiais para seletores CSS válidos
 */
const escapeSeletor = (classe) => 
    classe.replace(/:/g, '\\:').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/#/g, '\\#');

/**
 * Mapeia siglas de direção para nomes completos do CSS
 */
const getDirecaoCompleta = (pref) => {
    const mapa = { 't': 'top', 'b': 'bottom', 'l': 'left', 'r': 'right' };
    const parte = pref.split('-')[1]; // Pega o 'l' de 'border-l'
    return mapa[parte] || parte;
};

/**
 * Gera a regra de estilo de borda específica
 */
const processarEstiloBorda = (prefixo) => {
    if (prefixo === 'border') return 'border-style: solid;';
    if (prefixo.startsWith('border-')) {
        return `border-${getDirecaoCompleta(prefixo)}-style: solid;`;
    }
    return '';
};

/**
 * Resolve qual propriedade CSS usar baseada no valor (cor vs tamanho)
 */
const resolverPropriedade = (prefixo, eCor) => {
    let prop = config.mapaPropriedades[prefixo];
    
    if (eCor) {
        if (prefixo.startsWith('border')) {
            const direcao = getDirecaoCompleta(prefixo);
            return prefixo === 'border' ? 'border-color' : `border-${direcao}-color`;
        }
        if (prefixo === 'text') return 'color';
    } else {
        if (prefixo === 'text') return 'font-size';
    }
    return prop;
};

module.exports = {
    escapeSeletor,
    getDirecaoCompleta,
    processarEstiloBorda,
    resolverPropriedade
};