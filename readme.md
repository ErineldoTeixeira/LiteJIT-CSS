# ⚡ LiteJIT-CSS

Um motor CSS **Just-In-Time (JIT)** leve e inteligente, inspirado no Tailwind CSS, construído em Node.js. O LiteJIT-CSS lê seus arquivos HTML em tempo real e gera apenas o CSS que você realmente utiliza.

## ✨ Diferenciais

- **Diferenciação Inteligente**: O motor entende se `text-` refere-se a `color` ou `font-size` baseando-se no valor digitado.
- **Valores Arbitrários**: Suporte total a colchetes para cores hexadecimais e unidades customizadas: `text-[#ff5500]` ou `w-[500px]`.
- **Base de Espaçamento**: Sistema de escala para `padding` e `margin` (Multiplicador configurável).
- **Suporte a Hover**: Gere estados de hover automaticamente adicionando o prefixo `hover:`.

---

## 🚀 Como Funciona

O LiteJIT processa as classes seguindo esta lógica de prioridade:

| Classe Exemplo | Propriedade CSS | Resultado |
| :--- | :--- | :--- |
| `text-16` | `font-size` | `16px` |
| `text-[#f00]` | `color` | `#f00` |
| `border-2` | `border-width` | `2px` + `solid` |
| `border-[blue]` | `border-color` | `blue` + `solid` |
| `p-10` | `padding` | `30px` (Base 3) |
| `rounded-5` | `border-radius` | `5px` |

---

## 🛠️ Instalação e Uso

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/ErineldoTeixeira/litejit-css.git](https://github.com/ErineldoTeixeira/litejit-css.git)
   cd litejit-css