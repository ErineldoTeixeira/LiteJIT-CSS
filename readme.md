O Gemini disse
Ah, entendi! Você quer o README focado especificamente na versão 1.2.0, sem as Media Queries da 1.3.0 ainda. Vamos focar no que tornou essa versão "mega": a arquitetura modular e as super-classes compostas.

Aqui está o README oficial para a sua v1.2.0:

🚀 LiteJIT-CSS (v1.2.0)
O LiteJIT-CSS é um motor CSS Just-In-Time ultra-veloz e modular. Esta versão marca a transição de um script simples para uma ferramenta de desenvolvimento profissional, introduzindo o conceito de Super-Classes.

💎 O que há de novo na v1.2.0
1. Arquitetura Modular (utils.js)
O código foi refatorado para seguir o princípio de responsabilidade única.

parse.js: Gerencia o fluxo de detecção e lógica principal.

utils.js: Centraliza o escapamento de seletores, mapeamento de direções e resolução de propriedades.

2. Super-Classes (Compound Values)
Agora é possível definir múltiplas propriedades relacionadas em uma única classe, reduzindo drasticamente o "sujeira" no HTML.

Texto Combinado: text-[tamanho][ [cor] ]

Exemplo: text-20[#ff0000] vira font-size: 20px; color: #ff0000;

Borda Combinada: border-[direção]-[espessura][ [cor] ]

Exemplo: border-l-3[blue] vira border-left: 3px solid blue;

3. Inteligência de Shorthand
Diferente das versões anteriores, a v1.2.0 identifica quando você quer uma borda específica e gera o CSS otimizado:

border-2 -> border-width: 2px; border-style: solid;

border-t-4[red] -> border-top: 4px solid red;

🛠️ Exemplos de Uso
Classe	Resultado CSS
p-4	padding: 12px; (Base 3)
m-[15%]	margin: 15%; (Valor arbitrário)
text-14[#666]	font-size: 14px; color: #666;
border-b-2[#eee]	border-bottom: 2px solid #eee;
hover:bg-black	.hover\:bg-black:hover { background-color: #000; }


## 🛠️ Instalação e Uso

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/ErineldoTeixeira/litejit-css.git](https://github.com/ErineldoTeixeira/litejit-css.git)
   cd litejit-css