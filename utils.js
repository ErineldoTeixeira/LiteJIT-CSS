// utils.js
const config = require('./config');

/**
 * Escapa caracteres especiais para que o navegador aceite a classe no CSS.
 */
const escapeSeletor = (classe) => 
    classe.replace(/([#\[\]\(\)\.\:\/\%\,])/g, '\\$1');

/**
 * Mapeia siglas de direção (l, r, t, b) para nomes completos (left, right, etc.)
 */
const getDirecaoCompleta = (pref) => {
    const mapa = { 'l': 'left', 'r': 'right', 't': 'top', 'b': 'bottom' };
    const partes = pref.split('-');
    const sigla = partes[1]; 
    return mapa[sigla] || sigla;
};

/**
 * Resolve a propriedade CSS final.
 * Garante que 'text-20' vire 'font-size' e 'text-[#000]' vire 'color'.
 */
const resolverPropriedade = (prefixo, eCor) => {
    if (prefixo === 'text') {
        return eCor ? 'color' : 'font-size';
    }
    if (prefixo === 'bg') return 'background-color';
    
    if (prefixo.startsWith('border-')) {
        const direcao = getDirecaoCompleta(prefixo);
        // Se for border-l-2 -> border-left-width
        // Se for border-l-[#000] -> border-left-color
        return eCor ? `border-${direcao}-color` : `border-${direcao}-width`;
    }
    
    return config.mapaPropriedades[prefixo] || prefixo;
};

/**
 * Define o estilo da borda (solid)
 */
const processarEstiloBorda = (prefixo) => {
    if (prefixo.startsWith('border')) {
        const direcao = getDirecaoCompleta(prefixo);
        return direcao ? `border-${direcao}-style: solid;` : `border-style: solid;`;
    }
    return '';
};

module.exports = {
    escapeSeletor,
    getDirecaoCompleta,
    processarEstiloBorda,
    resolverPropriedade // <-- Sem isso, o parser quebra silenciosamente
};