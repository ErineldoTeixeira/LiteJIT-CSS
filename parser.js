const config = require('./config');

function parseClasse(classeOriginal) {
    let classeParaProcessar = classeOriginal;
    let sufixoCss = ""; 


    // O ESCAPAMENTO: Transforma 'text-[20px]' em 'text-\[20px\]'
    // Sem isso, o navegador ignora a regra CSS.
    let seletorCss = classeOriginal
        .replace(/:/g, '\\:')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/#/g, '\\#');

    // 1. Lógica de Hover
    if (classeOriginal.startsWith('hover:')) {
        classeParaProcessar = classeOriginal.replace('hover:', '');
        sufixoCss = ":hover";
    }

    // 2. Classes Estáticas (Ex: 'flex', 'block')
    if (config.estaticos[classeParaProcessar]) {
        return `.${seletorCss}${sufixoCss} { ${config.estaticos[classeParaProcessar]} }`;
    }

    // 3. Separação de Prefixo e Valor
    const partes = classeParaProcessar.split('-');
    if (partes.length < 2) return null;

    const prefixo = partes[0];
    const valor = partes.slice(1).join('-');
    const propriedade = config.mapaPropriedades[prefixo];

    if (!propriedade) return null;

    // 4. Lógica de Cores (Configuradas no config.js)
    if (config.cores[valor]) {
        let propFinal = (prefixo === 'border') ? 'border-color' : propriedade;
        let estiloExtra = (prefixo === 'border') ? 'border-style: solid;' : '';
        return `.${seletorCss}${sufixoCss} { ${propFinal}: ${config.cores[valor]}; ${estiloExtra} }`;
    }

    // 5. Valores Arbitrários com Colchetes []

if (valor.startsWith('[') && valor.endsWith(']')) {
    const arbitraryValue = valor.slice(1, -1);
    let propFinal = propriedade;
    let estiloExtra = ''; // Começa vazio

    // 1. Se tem '#' é COR
    if (arbitraryValue.includes('#')) {
        if (prefixo === 'border') {
            propFinal = 'border-color';
            estiloExtra = 'border-style: solid;'; // Só adiciona se for border
        } else {
            propFinal = 'color';
        }
    } 
    // 2. Se não tem '#' mas tem unidade (px, rem...), é font-size ou border-width
    else if (arbitraryValue.match(/px|rem|em|vh|vw|%/)) {
        if (prefixo === 'text') {
            propFinal = 'font-size';
        } else if (prefixo === 'border') {
            propFinal = 'border-width';
            estiloExtra = 'border-style: solid;';
        }
    }
    // 3. Caso genérico para cores nomeadas como text-[red] ou border-[blue]
    else {
        if (prefixo === 'border') {
            propFinal = 'border-color';
            estiloExtra = 'border-style: solid;';
        } else if (prefixo === 'text') {
            propFinal = 'color';
        }
    }

    return `.${seletorCss}${sufixoCss} { ${propFinal}: ${arbitraryValue}; ${estiloExtra} }`;
}

  // 7. Números (Base 3 ou Direto)
const num = parseInt(valor);
if (!isNaN(num)) {
    let valorFinal;
    let propFinal = propriedade;
    let estiloExtra = '';

    // Lógica para PADDING e MARGIN (Base 3)
    if (prefixo === 'p' || prefixo === 'm') {
        valorFinal = `${num * config.baseSpacing}px`;
    } 
    // Lógica para TEXTO (Se for número puro, assume font-size)
    else if (prefixo === 'text') {
        propFinal = 'font-size';
        valorFinal = `${num}px`;
    }
    // Lógica para BORDAS (Se for número puro, assume largura)
    else if (prefixo === 'border') {
        propFinal = 'border-width';
        valorFinal = `${num}px`;
        estiloExtra = 'border-style: solid;';
    } 
    // Outros (w, h, rounded...)
    else {
        valorFinal = `${num}px`;
    }

    return `.${seletorCss}${sufixoCss} { ${propFinal}: ${valorFinal}; ${estiloExtra} }`;
}
    return null;
}

module.exports = parseClasse;