const config = require('./config');
const utils = require('./utils');

function parseClasse(classeOriginal) {
    if (!classeOriginal) return null;

    let classeParaProcessar = classeOriginal;
    let sufixoCss = "";
// 1. Hover e Estáticos
if (classeOriginal.startsWith('hover:')) {
    classeParaProcessar = classeOriginal.replace('hover:', '');
    sufixoCss = ":hover";
}

// CORREÇÃO AQUI: Verificamos se config.estaticos existe E se a classe está lá
if (config.estaticos && config.estaticos[classeParaProcessar]) {
    return `.${utils.escapeSeletor(classeOriginal)}${sufixoCss} { ${config.estaticos[classeParaProcessar]} }`;
}
    // 2. EXTRAÇÃO GULOSA DE PREFIXO (Ex: border-l-20)
    let partes = classeParaProcessar.split('-');
    let prefixo = "", valor = "";

    for (let i = partes.length - 1; i > 0; i--) {
        let possivel = partes.slice(0, i).join('-');
        if (config.mapaPropriedades[possivel]) {
            prefixo = possivel;
            valor = partes.slice(i).join('-');
            break;
        }
    }

    if (!prefixo) return null;

    // 3. LÓGICA DE COLCHETES (Ex: 20[#f00] ou [#f00])
    let valorPrincipal = valor;
    let valorExtra = null;

    if (valor.includes('[') && valor.endsWith(']')) {
        const i = valor.indexOf('[');
        if (i > 0) {
            valorPrincipal = valor.slice(0, i); // '20'
            valorExtra = valor.slice(i + 1, -1); // '#f00'
        } else {
            valorPrincipal = valor.slice(1, -1); // '#f00'
        }
    }

    // 4. PREPARAÇÃO PARA O CSS
    const seletor = utils.escapeSeletor(classeOriginal);
    
    // Identifica se estamos lidando com uma cor
    const valorCor = valorExtra || (valorPrincipal.startsWith('#') || config.cores[valorPrincipal] ? valorPrincipal : null);
    const eCor = !!valorCor;

    // Resolve a propriedade correta (Ex: bg -> background-color)
    const prop = utils.resolverPropriedade(prefixo, eCor);



    // CASO A: Cores ou Compostos com Cor (bg-[#000], text-20[#f00], border-l-2[#000])
// 5. GERAÇÃO DA REGRA FINAL

    // CASO A: Cores ou Compostos com Cor (bg-[#000], text-20[#f00], border-l-2[#000])
    if (eCor) {
        const corFinal = config.cores[valorCor] || valorCor;
        const estiloBorda = utils.processarEstiloBorda(prefixo);

        // 1. TEXTO COMPOSTO: text-20[#fff]
        if (prefixo === 'text' && valorExtra) {
            const fontSize = isNaN(parseInt(valorPrincipal)) ? valorPrincipal : `${valorPrincipal}px`;
            return `.${seletor}${sufixoCss} { font-size: ${fontSize}; color: ${corFinal}; }`;
        }

        // 2. BORDA COMPOSTA: border-l-2[#000]
        if (prefixo.startsWith('border') && valorExtra) {
            const direcao = utils.getDirecaoCompleta(prefixo);
            const propBase = direcao ? `border-${direcao}` : 'border';
            return `.${seletor}${sufixoCss} { ${propBase}: ${valorPrincipal}px solid ${corFinal}; }`;
        }

        // 3. COR SIMPLES: bg-[#000], text-[#fff], border-l-[#000]
        return `.${seletor}${sufixoCss} { ${prop}: ${corFinal}; ${estiloBorda} }`.replace(/\s+/g, ' ').replace('; ;', ';').trim();
    }
   // Trecho final do parser.js
// Trecho final do parser.js para teste de vida ou morte
    const num = parseInt(valorPrincipal);
    if (!isNaN(num)) {
        let valorFinalCss;
        let propFinal = prop; 

        if (prefixo === 'text') {
            propFinal = 'font-size'; 
            valorFinalCss = `${num}px`;
        } else {
            const isSpacing = prefixo.startsWith('p') || prefixo.startsWith('m');
            const multiplicador = (prefixo.startsWith('p') || prefixo.startsWith('m')) ? (config.baseSpacing || 1) : 1;
            valorFinalCss = `${num * multiplicador}px`;
        }
        
      const regraGerada = `.${seletor}${sufixoCss} { ${propFinal}: ${valorFinalCss} !important; }`;
        // console.log('Gerando:', regraGerada); // Descomente para ver no terminal
        return regraGerada;
    }

    return null;
}

module.exports = parseClasse;