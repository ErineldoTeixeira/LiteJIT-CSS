module.exports = {
    baseSpacing: 3, // O multiplicador que você usou no parser
    
    // Classes que não precisam de cálculo
    estaticos: {
        'flex': 'display: flex',
        'block': 'display: block;',
        'hidden': 'display: none;',
        'items-center': 'align-items: center;',
        'justify-center': 'justify-content: center;',
        'flex-col': 'flex-direction: column',
        'relative': 'position: relative',
        'absolute': 'position: absolute',
        'pointer': 'cursor: pointer;',
        'full': 'width: 100%; height: 100%;',
        'w-screen': 'width: 100vw;',
        'h-screen': 'height: 100vh;'
    },

    // Mapeamento para a lógica dinâmica
    mapaPropriedades: {
        'font': 'font-family',
        'p': 'padding',
        'pt': 'padding-top',
        'pr': 'padding-right',
        'pb': 'padding-bottom',
        'pl': 'padding-left',
        'm': 'margin',
        'mt': 'margin-top',
        'mr': 'margin-right',
        'mb': 'margin-bottom',
        'ml': 'margin-left',
        'bg': 'background-color',
        'text': 'color',
        'border': 'border-width',
        'border-l': 'border-left-width',
        'border-r': 'border-right-width',
        'border-t': 'border-top-width',
        'border-b': 'border-bottom-width'
        // Adicione outros conforme necessário
    },

    cores: {
        'white': '#ffffff',
        'black': '#000000',
        'red': '#f00',
        
    }
};