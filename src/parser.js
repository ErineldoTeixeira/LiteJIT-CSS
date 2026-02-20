const config = require('./config');
const utils = require('./utils');

function parseClasse(classeOriginal) {
    if (!classeOriginal) return null;

    let classeParaProcessar = classeOriginal.trim();
    let sufixoCss = "";

    // 1. Hover
    if (classeParaProcessar.startsWith('hover:')) {
        classeParaProcessar = classeParaProcessar.replace('hover:', '');
        sufixoCss = ":hover";
    }

    // 2. Estáticos (flex, block, etc) - PRIORIDADE 1
    if (config.estaticos && config.estaticos[classeParaProcessar]) {
        return `.${utils.escapeSeletor(classeOriginal)}${sufixoCss} { ${config.estaticos[classeParaProcessar]} !important; }`;
    }

    // 3. Extração de Prefixo (bg, text, p, m, border)
    let partes = classeParaProcessar.split('-');
    let prefixo = "", valorRaw = "";

    for (let i = partes.length - 1; i > 0; i--) {
        let possivel = partes.slice(0, i).join('-');
        if (config.mapaPropriedades[possivel]) {
            prefixo = possivel;
            valorRaw = partes.slice(i).join('-');
            break;
        }
    }

    if (!prefixo) return null;

    // 4. Lógica de Colchetes [valor]
    let valorPrincipal = valorRaw;
    let valorExtra = null;
    let ehUnidadeCustomizada = false;

    if (valorRaw.includes('[') && valorRaw.endsWith(']')) {
        const i = valorRaw.indexOf('[');
        valorPrincipal = valorRaw.slice(0, i) || null; 
        valorExtra = valorRaw.slice(i + 1, -1); 

        // Se o colchete não tem valor antes (ex: p-[10%]) ou é p[10%]
        // Identificamos se é unidade (números + unidade CSS)
        if (!valorPrincipal && /^[0-9.]+(px|rem|em|%|vh|vw|pt|vh|calc)?/.test(valorExtra)) {
            ehUnidadeCustomizada = true;
        }
    }

    const seletor = utils.escapeSeletor(classeOriginal);

    // 5. Identificação de VALOR (Unidade Customizada)
    if (ehUnidadeCustomizada) {
        let propFinal = config.mapaPropriedades[prefixo] || prefixo;
        let estiloAdicional = "";

        if (prefixo === 'text') {
            propFinal = 'font-size';
        } else if (prefixo.startsWith('border')) {
            const direcao = utils.getDirecaoCompleta(prefixo);
            propFinal = (direcao && direcao !== prefixo) ? `border-${direcao}` : 'border';
            estiloAdicional = " solid"; // Garante que a borda apareça
        }
        
        return `.${seletor}${sufixoCss} { ${propFinal}: ${valorExtra}${estiloAdicional} !important; }`;
    }

    // Identificação de COR (Variável ou Hex)
    const possivelNomeCor = valorExtra || valorPrincipal;
    const corFinal = config.cores[possivelNomeCor] || (possivelNomeCor && possivelNomeCor.startsWith('#') ? possivelNomeCor : null);

    if (corFinal) {
        let propEfetiva;
        if (prefixo === 'bg') propEfetiva = 'background-color';
        else if (prefixo === 'text') propEfetiva = 'color';
        else if (prefixo.startsWith('border')) {
            const direcao = utils.getDirecaoCompleta(prefixo);
            propEfetiva = (direcao && direcao !== prefixo) ? `border-${direcao}-color` : 'border-color';
        } else {
            propEfetiva = config.mapaPropriedades[prefixo] || prefixo;
        }

        const estiloBorda = utils.processarEstiloBorda(prefixo);

        // Caso A: Texto com tamanho e cor: text-20[primary]
        if (prefixo === 'text' && valorExtra && valorPrincipal) {
            return `.${seletor}${sufixoCss} { font-size: ${valorPrincipal}px !important; color: ${corFinal} !important; }`;
        }

        // Caso B: Borda com largura e cor: border-l-2[primary]
        if (prefixo.startsWith('border') && valorExtra && valorPrincipal) {
            const direcao = utils.getDirecaoCompleta(prefixo);
            const propBase = (direcao && direcao !== prefixo) ? `border-${direcao}` : 'border';
            return `.${seletor}${sufixoCss} { ${propBase}: ${valorPrincipal}px solid ${corFinal} !important; }`;
        }

        // Caso C: Borda simples com cor: border-primary ou border-l-primary
        if (prefixo.startsWith('border')) {
            const direcao = utils.getDirecaoCompleta(prefixo);
            const propBase = (direcao && direcao !== prefixo) ? `border-${direcao}` : 'border';
            return `.${seletor}${sufixoCss} { ${propBase}: 1px solid ${corFinal} !important; }`;
        }

        // Caso D: Cor simples: bg-primary, text-white
        return `.${seletor}${sufixoCss} { ${propEfetiva}: ${corFinal} !important; ${estiloBorda} }`.replace(/\s+/g, ' ').trim();
    }

    // 6. Identificação de NÚMEROS (p-20, m-10, text-30, border-10)
    const num = parseInt(valorPrincipal);
    if (!isNaN(num)) {
        let propFinal = config.mapaPropriedades[prefixo] || prefixo;
        let valorFinalCss;

        if (prefixo === 'text') {
            propFinal = 'font-size';
            valorFinalCss = `${num}px`;
        } else if (prefixo.startsWith('border')) {
            // CORREÇÃO: Para border-10 ou border-t-2
            const direcao = utils.getDirecaoCompleta(prefixo);
            propFinal = (direcao && direcao !== prefixo) ? `border-${direcao}` : 'border';
            return `.${seletor}${sufixoCss} { ${propFinal}: ${num}px solid !important; }`;
        } else {
            const mult = (prefixo.startsWith('p') || prefixo.startsWith('m')) ? (config.baseSpacing || 1) : 1;
            valorFinalCss = `${num * mult}px`;
        }
        
        return `.${seletor}${sufixoCss} { ${propFinal}: ${valorFinalCss} !important; }`;
    }

    return null;
}

module.exports = parseClasse;