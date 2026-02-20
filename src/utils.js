// utils.js
const config = require('./config');

const escapeSeletor = (classe) => 
    classe.replace(/([#\[\]\(\)\.\:\/\%\,])/g, '\\$1');

const getDirecaoCompleta = (pref) => {
    const mapa = { 'l': 'left', 'r': 'right', 't': 'top', 'b': 'bottom' };
    const partes = pref.split('-');
    
    // Se não houver hífen (ex: "border"), não tem direção específica
    if (partes.length < 2) return null;

    const sigla = partes[1]; 
    return mapa[sigla] || null;
};

const resolverPropriedade = (prefixo, eCor) => {
    // Caso especial para Texto
    if (prefixo === 'text') {
        return eCor ? 'color' : 'font-size';
    }
    
    // Caso especial para Background
    if (prefixo === 'bg') return 'background-color';
    
    // Caso para Bordas (border, border-l, border-t, etc)
    if (prefixo.startsWith('border')) {
        const direcao = getDirecaoCompleta(prefixo);
        if (direcao) {
            return eCor ? `border-${direcao}-color` : `border-${direcao}-width`;
        }
        return eCor ? 'border-color' : 'border-width';
    }
    
    return config.mapaPropriedades[prefixo] || prefixo;
};

const processarEstiloBorda = (prefixo) => {
    if (prefixo.startsWith('border')) {
        const direcao = getDirecaoCompleta(prefixo);
        // Se tiver direção, aplica nela, se não, aplica na borda toda
        return direcao ? `border-${direcao}-style: solid;` : `border-style: solid;`;
    }
    return '';
};

module.exports = {
    escapeSeletor,
    getDirecaoCompleta,
    processarEstiloBorda,
    resolverPropriedade
};