const config = require('./config');
const utils = require('./utils');

function parseClasse(classeOriginal) {
    if (!classeOriginal) return null;

    let classeParaProcessar = classeOriginal.trim();
    let sufixoCss = "";

    // 1. Estados (Hover)
    if (classeParaProcessar.startsWith('hover:')) {
        classeParaProcessar = classeParaProcessar.replace('hover:', '');
        sufixoCss = ":hover";
    }

    // 2. Estáticos
    if (config.estaticos && config.estaticos[classeParaProcessar]) {
        return `.${utils.escapeSeletor(classeOriginal)}${sufixoCss} { ${config.estaticos[classeParaProcessar]} !important; }`;
    }

    // 3. Extração de Prefixo e Valor
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

    if (!prefixo && classeParaProcessar.includes('[')) {
        const i = classeParaProcessar.indexOf('[');
        const possivelPrefixo = classeParaProcessar.slice(0, i);
        if (config.mapaPropriedades[possivelPrefixo]) {
            prefixo = possivelPrefixo;
            valorRaw = classeParaProcessar.slice(i);
        }
    }

    if (!prefixo) return null;

    // 4. Lógica de Colchetes
    let valorPrincipal = valorRaw;
    let valorExtra = null;
    let ehUnidadeCustomizada = false;
    let ehVariavelCss = false;

   if (valorRaw.includes('[') && valorRaw.endsWith(']')) {
        const i = valorRaw.indexOf('[');
        valorPrincipal = valorRaw.slice(0, i).replace('-', '') || null; 
        valorExtra = valorRaw.slice(i + 1, -1); 

        // TRUQUE DE ESTABILIDADE: Converte underline em espaço para o CSS final
        // Ex: p[10px_20px] vira padding: 10px 20px
        if (valorExtra) valorExtra = valorExtra.replace(/_/g, ' ');

        if (valorExtra && valorExtra.startsWith('--')) {
            ehVariavelCss = true;
        }


        // Regex atualizado para aceitar espaços (\s)
        if (!valorPrincipal && /^[0-9.pxrem%vhvwptcalc\s!(),]+/.test(valorExtra)) {
            ehUnidadeCustomizada = true;
        }
    }

    const seletor = utils.escapeSeletor(classeOriginal);

    // 5. PROCESSAMENTO DE REGRAS
    if (ehVariavelCss) {
        let propFinal = config.mapaPropriedades[prefixo] || prefixo;
        if (prefixo === 'text') propFinal = 'color';
        if (prefixo === 'bg') propFinal = 'background-color';
        if (prefixo === 'font') propFinal = 'font-family';
        return `.${seletor}${sufixoCss} { ${propFinal}: var(${valorExtra}) !important; }`;
    }

    if (prefixo === 'font' && valorExtra) {
        const fonteFormatada = valorExtra.includes(' ') && !valorExtra.includes("'") 
            ? `'${valorExtra}'` 
            : valorExtra;
        return `.${seletor}${sufixoCss} { font-family: ${fonteFormatada}, sans-serif !important; }`;
    }

    if (ehUnidadeCustomizada) {
        let propFinal = config.mapaPropriedades[prefixo] || prefixo;
        let estiloAdicional = "";

        if (prefixo === 'text') {
            propFinal = 'font-size';
        } else if (prefixo.startsWith('border')) {
            const direcao = utils.getDirecaoCompleta(prefixo);
            propFinal = (direcao && direcao !== prefixo) ? `border-${direcao}` : 'border';
            if (!valorExtra.includes(' ')) estiloAdicional = " solid";
        }
        
        return `.${seletor}${sufixoCss} { ${propFinal}: ${valorExtra}${estiloAdicional} !important; }`;
    }

    // Cores e Hexadecimais
    const possivelNomeCor = valorExtra || valorPrincipal;
    const corFinal = config.cores[possivelNomeCor] || (possivelNomeCor && possivelNomeCor.startsWith('#') ? possivelNomeCor : null);

    if (corFinal) {
        let propEfetiva = utils.resolverPropriedade(prefixo, true);
        const estiloBorda = utils.processarEstiloBorda(prefixo);

        if (prefixo === 'text' && valorExtra && valorPrincipal) {
            return `.${seletor}${sufixoCss} { font-size: ${valorPrincipal}px !important; color: ${corFinal} !important; }`;
        }

        if (prefixo.startsWith('border') && valorExtra && valorPrincipal) {
            const direcao = utils.getDirecaoCompleta(prefixo);
            const propBase = (direcao && direcao !== prefixo) ? `border-${direcao}` : 'border';
            return `.${seletor}${sufixoCss} { ${propBase}: ${valorPrincipal}px solid ${corFinal} !important; }`;
        }

        if (prefixo.startsWith('border')) {
            const direcao = utils.getDirecaoCompleta(prefixo);
            const propBase = (direcao && direcao !== prefixo) ? `border-${direcao}` : 'border';
            return `.${seletor}${sufixoCss} { ${propBase}: 1px solid ${corFinal} !important; }`;
        }

        return `.${seletor}${sufixoCss} { ${propEfetiva}: ${corFinal} !important; ${estiloBorda} }`.replace(/\s+/g, ' ').trim();
    }

    // Números Puros
    const num = parseInt(valorPrincipal);
    if (!isNaN(num)) {
        let propFinal = utils.resolverPropriedade(prefixo, false);
        let valorFinalCss;

        if (prefixo === 'text') {
            valorFinalCss = `${num}px`;
        } else if (prefixo.startsWith('border')) {
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