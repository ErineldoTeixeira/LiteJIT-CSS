const config = require('./config');

function parseClasse(classeOriginal) {
    let classeParaProcessar = classeOriginal;
    let sufixoCss = ""; 
    // Escapa os caracteres especiais ( : e [ ] ) para o seletor CSS funcionar
    let seletorCss = classeOriginal.replace(/:/g, '\\:').replace(/\[/g, '\\[').replace(/\]/g, '\\]');

    // 1. Detecta o prefixo HOVER
    if (classeOriginal.startsWith('hover:')) {
        classeParaProcessar = classeOriginal.replace('hover:', '');
        sufixoCss = ":hover";
    }

    // --- A partir daqui, usamos 'classeParaProcessar' para a lógica ---

    // 2. Caso especial: "border" sozinho
    if (classeParaProcessar === 'border') {
        return `.${seletorCss}${sufixoCss} { border-width: 1px; border-style: solid; }`;
    }

    // 3. Classes estáticas
    if (config.estaticos[classeParaProcessar]) {
        return `.${seletorCss}${sufixoCss} { ${config.estaticos[classeParaProcessar]} }`;
    }

    // 4. Divide Prefixo e Valor
    const partes = classeParaProcessar.split('-');
    if (partes.length < 2) return null;

    const prefixo = partes[0];
    const valor = partes.slice(1).join('-'); // slice(1).join('-') lida com cores tipo bg-light-blue
    const propriedade = config.mapaPropriedades[prefixo];

    if (!propriedade) return null;

    // 5. Lógica de Cores
    if (config.cores[valor]) {
        let estiloExtra = prefixo === 'border' ? 'border-style: solid;' : '';
        return `.${seletorCss}${sufixoCss} { ${propriedade}: ${config.cores[valor]}; ${estiloExtra} }`;
    }

    // 6. Valor arbitrário [ ]
    if (valor.startsWith('[') && valor.endsWith(']')) {
        const arbitraryValue = valor.slice(1, -1);
        let estiloExtra = prefixo === 'border' ? 'border-style: solid;' : '';
        return `.${seletorCss}${sufixoCss} { ${propriedade}: ${arbitraryValue}; ${estiloExtra} }`;
    }

    // 7. Números (Base 3 ou Direto)
    const num = parseInt(valor);
    if (!isNaN(num)) {
        let valorFinal;
        if (prefixo === 'p' || prefixo === 'm') {
            valorFinal = `${num * config.baseSpacing}px`;
        } else {
            valorFinal = `${num}px`;
        }
        let estiloExtra = prefixo === 'border' ? 'border-style: solid;' : '';
        return `.${seletorCss}${sufixoCss} { ${propriedade}: ${valorFinal}; ${estiloExtra} }`;
    }

    return null;
}

module.exports = parseClasse;