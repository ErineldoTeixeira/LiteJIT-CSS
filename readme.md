# LiteJIT 🚀 (v1.3.0)

O **LiteJIT** é um motor de geração de CSS em tempo real (Just-in-Time) ultra leve, inspirado no Tailwind CSS, mas focado em simplicidade e alta performance para projetos rápidos.

A versão **1.3.0** traz suporte avançado a unidades dinâmicas e flexibilidade total na escrita de classes.

---

## ✨ O que há de novo na v1.3.0?

- **Sintaxe de Colchetes Grudados**: Agora você pode usar `p[10px]` em vez de apenas `p-[10px]`.
- **Inteligência de Borda**: Ao usar `border-10` ou `border[2px]`, o motor injeta automaticamente o estilo `solid` para garantir a renderização.
- **Unidades Dinâmicas**: Suporte nativo para `px`, `rem`, `%`, `vh`, `vw`, `em` e funções `calc()`.
- **Combinação de Propriedades**: A classe `text-20[#f00]` agora resolve tamanho de fonte e cor simultaneamente.

---

## 🚀 Como usar

### 1. Instalação
Clone o repositório e instale as dependências (necessário Node.js):

```bash
npm install