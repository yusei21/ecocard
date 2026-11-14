# EcoCard — EcoResiduários Academy

Plataforma web com dois jogos de cartas ambientais, pensada para demonstração em estande. Interface em português do Brasil, responsiva, com controles por toque, teclado e mouse.

**[Abrir o jogo pelo GitHub Pages](https://yusei21.github.io/ecocard/)** (funciona após habilitar Pages para a branch `main`, pasta raiz).

## Jogos

### 1. Salve o Mundo (solo)

Roguelike de pontuação com cartas de cinco categorias de resíduos: **azul/papel**, **vermelho/plástico**, **verde/vidro**, **amarelo/metal**, **marrom/orgânicos**. São **65 cartas**, com **A, 2–10, J, Q, K** por categoria. A=1, J=11, Q=12, K=13 para sequências e pontuação. As combinações de 1–5 cartas recebem pontos base e multiplicadores, com ajustes dos coringas e dos chefes.

- Etapas: Contaminação Cruzada, Descarte Irregular, Desperdício de Recursos, Crise dos Aterros e Mudanças Climáticas.
- Cada desafio tem meta crescente; o jogador dispõe de jogadas e descartes limitados.
- Entre desafios, recebe ecofichas para adquirir coringas, até cinco simultâneos.
- Coringas **Reduzir**, **Reutilizar** e **Reciclar** representam os 3 Rs; também existem Compostagem Viva, Força Coletiva e Educação Ambiental.
- **Aventura Circular** é lendária: executa **duas vezes os efeitos de cada outro coringa equipado**, sem autorrecursão. O peso relativo de aparição na loja é `0.002` contra `1` de cada coringa comum elegível; portanto, a chance exata depende do conjunto restante. É a menor chance individual da lista.

As regras de pontuação são originais para este projeto. O jogo usa o conceito geral de construção de combinações e progressão roguelike, sem reutilizar assets de Balatro.

### 2. Trinca Circular (2–4 pessoas)

Partida em rede via código de seis caracteres. O anfitrião cria a sala; os demais entram com o código, em dispositivos separados.

- O modo usa **2 baralhos ambientais completos**, totalizando **130 cartas** (inclusive cópias físicas de valores e cores). Cada pessoa recebe **7 cartas**.
- Em seu turno, compra do monte fechado ou da pilha de descarte, e descarta uma carta.
- **Trinca válida:** três cartas do **mesmo valor** e **cores diferentes**, ou três cartas de **valores consecutivos** e da **mesma cor**. A vale 1, J vale 11, Q vale 12 e K vale 13. A não vem após K.
- Ganha quem tiver **duas trincas disjuntas** entre as sete cartas, sobrando uma, e clicar em **Bater!** no começo do turno.
- O anfitrião valida compras, descartes, turnos e vitória, mantendo as cartas de outros jogadores ocultas.

**Infraestrutura:** usa PeerJS e um servidor público de sinalização. O anfitrião deve permanecer online, todos devem ter internet, e não há salvamento/reconexão automática. Para produção ou uso intensivo em feira, migrar para servidor próprio com WebSockets, persistência de salas e testes de carga.

## Como executar

Não há build nem dependências locais: abra `index.html` num navegador moderno. Para multiplayer, sirva sobre HTTPS (recomendado: GitHub Pages). Para publicar: **Settings > Pages > Deploy from a branch > main > /(root)**. O endereço acima estará disponível somente após a publicação ser concluída.

## Design

- Linguagem visual original inspirada em materiais naturais, impressão editorial e jogos de mesa.
- Paleta verde-floresta, lima e rosa, combinada com as cinco cores normativas da coleta seletiva. **A paleta exata do Instagram não pôde ser validada**; deve ser substituída por tokens oficiais caso o projeto forneça seu guia de marca.
- Cartas usam **cor, nome da categoria e símbolo** (não apenas cor), identificação do valor, seleção visível e efeito hover discreto. Respeita preferência por movimento reduzido.
- Identificação IFMA/Universo IFMA está **provisoriamente em texto e pictograma estilizado**, não no logotipo institucional oficial. Antes da apresentação formal, substituir pela arte oficial licenciada da instituição.
- Link oficial do projeto: https://www.instagram.com/ecoresiduariosacademy/

## Precisão ambiental

A **Resolução CONAMA 275/2001** estabelece o código de cores usado. O jogo trabalha com cinco das dez cores padronizadas, adequadas ao recorte didático de materiais comuns. As outras cores existem e não devem ser consideradas inexistentes (p.ex. laranja para resíduos perigosos; branco para resíduos de saúde; cinza para rejeitos). O descarte correto depende também das regras municipais, da contaminação e da infraestrutura disponível. Material ilustrativo **não é garantia de reciclabilidade local**. Cascas e restos vegetais podem ser compostados em condições adequadas.

**Fontes:**
- CONAMA 275/2001: https://conama.mma.gov.br/images/conteudo/LivroConama.pdf
- DNIT, guia de gestão de resíduos e cores: https://www.gov.br/dnit/pt-br/central-de-conteudos/atos-normativos/tipo/portarias/portaria-3412-2023-setsust-publ.pdf
- Referência de sistemas de pontuação de roguelikes de cartas: https://teemo.dev/game-design/balatro/systems/game-overview/
- Discussão de legibilidade/inspeção de cartas: https://www.reddit.com/r/IndieDev/comments/1crydcd/
- Discussão de hierarquia e explicação de símbolos: https://www.reddit.com/r/IndieDev/comments/1ohn9p7/
- Discussão sobre animações sutis: https://www.reddit.com/r/UI_Design/comments/1uask44/

## Próximos passos recomendados

1. Testar a partida em **2, 3 e 4 celulares reais**, inclusive em rede móvel e Wi-Fi do estande.
2. Implementar reconexão, temporizador de turno e testes automatizados de regras.
3. Validar paleta oficial do Instagram e obter arquivos vetoriais autorizados do IFMA.
4. Fazer revisão técnica ambiental com equipe do projeto antes de publicação institucional.
5. Para alto tráfego, substituir sinalização pública por backend próprio.

Licença: consultar o arquivo `LICENSE` do repositório.

## Identidade visual (v3)

Interface editorial inspirada em sinalização de triagem, papel e tipografia impressa. Família **Barlow Condensed** para grandes títulos e valores, **IBM Plex Sans** para leitura e **IBM Plex Mono** para identificação técnica. Layout mantém a cor e um símbolo/texto em cada carta. Arquivo principal de tema: `identity-v3.css`.

A marca institucional exibida é o SVG horizontal do **IFMA (manual de 2015)** disponível no Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Instituto_Federal_do_Maranhão_-_Marca_Horizontal_2015.svg . Para impressão ou ações institucionais, confirmar a versão da marca com comunicação do IFMA.

Referências usadas na revisão: https://www.reddit.com/r/SoloDevelopment/comments/1tf84yf/ ; https://www.reddit.com/r/IndieDev/comments/1wt9lwn/ ; https://www.reddit.com/r/godot/comments/1u5flj3/ ; https://www.reddit.com/r/BoardgameDesign/comments/12qj22f/ .
