// module.exports = {

//     // Prefixos que aceitam números ou cores
//     mapaPropriedades: {
//         'p': 'padding',
//         'm': 'margin',
//         'w': 'width',
//         'h': 'height',
//         'bg': 'background-color',
//         'text': 'color',
//         'rounded': 'border-radius',
//         'border': 'border-width',
//         'border': 'border-width',
//         'border-l': 'border-left-width',
//         'border-r': 'border-right-width',
//         'border-t': 'border-top-width',
//         'border-b': 'border-bottom-width',
//     },
//     // Valores fixos de design
//     cores: {
//         'blue': '#3b82f6',
//         'red': '#ef4444',
//         'black': '#000',
//         'white': '#fff'
//     },
//     // Classes que não mudam (estáticas)
//     estaticos: {
//         'flex': 'display: flex;',
//         'inline': 'display: inline',
//         'grid': 'display: grid;',
//         'items-center': 'align-items: center;',
//         'justify-center': 'justify-content: center;',
//         'block': 'display: block;',

//     },
//     baseSpacing: 3
// };

// config.js
module.exports = {
    baseSpacing: 4, // Ex: p-2 viraria 8px
    cores: {
        'preto': '#000000',
        'branco': '#ffffff'
    },
    mapaPropriedades: {
        'bg': 'background-color',
        'text': 'color',
        'p': 'padding',
        'm': 'margin',
        'border': 'border',
        'border-l': 'border-left',   // O segredo para border-l funcionar
        'border-r': 'border-right',
        'border-t': 'border-top',
        'border-b': 'border-bottom'
    }
};