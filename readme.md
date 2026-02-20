# ⚡ LiteJIT-CSS (v1.2.0)

Um motor CSS **Just-In-Time (JIT)** leve, modular e inteligente, construído em Node.js. O LiteJIT-CSS observa seus arquivos HTML em tempo real e gera automaticamente apenas o CSS que você está utilizando, suportando valores arbitrários e super-classes compostas.



## ✨ Diferenciais da Versão 1.2.0

- **Arquitetura Modular**: Lógica dividida entre `parse.js` e `utils.js` para maior escalabilidade e manutenção.
- **Super-Classes (Compound)**: Defina múltiplas propriedades em uma única classe. Ex: `text-20[#f00]`.
- **Diferenciação Inteligente**: O motor identifica se `text-` refere-se a `color` ou `font-size` baseando-se no valor.
- **Shorthand de Bordas**: Geração automática de propriedades curtas como `border-left: 3px solid blue;`.
- **Valores Arbitrários**: Suporte total a unidades customizadas: `w-[500px]`, `p-[10%]`, `h-[100vh]`.

---

## 🚀 Como Funciona (Lógica de Prioridade)

O LiteJIT processa as classes seguindo esta estrutura:

| Classe Exemplo | Propriedade CSS | Resultado |
| :--- | :--- | :--- |
| `text-16` | `font-size` | `16px` |
| `text-[#f00]` | `color` | `#f00` |
| `text-20[#333]` | `font-size` + `color` | `20px` e `#333` |
| `border-l-3[blue]` | `border-left` (shorthand) | `3px solid blue` |
| `p-10` | `padding` | `30px` (Base 3) |
| `hover:bg-black` | `background-color` | Muda no `:hover` |



---

## 💎 Super-Classes em Detalhe

### Texto Combinado (Tamanho + Cor)
Use o formato `text-[tamanho][ [cor] ]`:
* `text-20[#ff0000]` → `font-size: 20px; color: #ff0000;`
* `text-1.5rem[blue]` → `font-size: 1.5rem; color: blue;`

### Bordas Combinadas (Direção + Espessura + Cor)
Use o formato `border-[direção]-[espessura][ [cor] ]`:
* `border-l-3[#eee]` → `border-left: 3px solid #eee;`
* `border-t-1[red]` → `border-top: 1px solid red;`

---

## 📁 Estrutura do Projeto

```text
├── config.js    # Paleta de cores, baseSpacing e mapas de propriedades.
├── utils.js     # Helpers de escape, mapeamento de direções e resolução de props.
├── parse.js     # O "cérebro" que transforma classes em regras CSS.
├── index.js     # O Watcher que monitora os arquivos e gera o style.css.