# EcoCard — EcoResiduários Academy

Plataforma web de jogo de cartas ambiental para demonstração em estande. A experiência principal é **Salve o Mundo**. Interface em português do Brasil, responsiva, com controles por toque, teclado e mouse.

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


### Escalada de dificuldade das crises

A jornada progride de forma fixa: **crise 1 Fácil (meta normal 850, 5 jogadas)**, **crise 2 Médio (2.500, 4 jogadas)**, **crise 3 Médio (4.300, 4 jogadas)**, **crise 4 Difícil (9.300, 3 jogadas)** e **crise 5 Final (20.000, 3 jogadas)**. A última crise aplica **×0,7** ao multiplicador de jogadas com menos de 3 cartas orgânicas; combinações com 3 ou mais orgânicos recebem +80 pontos base. É um desafio final deliberadamente rigoroso, sem bloquear estratégias alternativas.

As quatro opções de dificuldade (**Aprendiz, Normal, Difícil e Extremo**) aplicam modificadores por cima dessa progressão. Os valores são metas iniciais de balanceamento e precisam ser validados com partidas e métricas de vitória.

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

## Feedback visual da Trinca Circular

- Cada jogador tem **9 cartas** e precisa fechar **3 combinações de 3 cartas**; a tela mostra um contador **0/3, 1/3, 2/3 ou 3/3** e destaca com cores diferentes as cartas de cada trinca reconhecida.
- As trincas válidas são três valores idênticos ou sequências consecutivas da mesma categoria (incluindo **A–2–3** e **Q–K–A**).
- Ao completar uma trinca, há indicação visual e um sinal sonoro, sujeito às permissões de áudio do navegador. A primeira interação do usuário pode ser necessária para liberar sons no dispositivo.
- Ao fechar três combinações, aparece uma tela de vitória com animação, partículas e opção de nova rodada para o anfitrião. A verificação de vitória continua a cargo do anfitrião, e a organização manual da mão é preservada.
- Em uma mão temporária de 10 cartas, o contador pode mostrar 3/3, mas é necessário descartar a carta extra e terminar com exatamente 9 para ganhar.
- Animações respeitam `prefers-reduced-motion`.

## Controles e uso no celular

No Salve o Mundo, a ordem da mão pode ser alterada **arrastando uma carta sobre outra**, sem botão adicional. A ordem é local para cada jogador e não altera as cartas recebidas nem as combinações válidas. O suporte a arrastar em navegadores móveis deve ser confirmado em dispositivos reais.

O cabeçalho mobile-first prioriza a identidade do EcoCard, o acesso à EcoResiduários Academy e a marca vetorial do IFMA em uma área institucional com contraste controlado. A nova folha `mobile-v5.css` ajusta o topo e as mãos roláveis para dispositivos menores.

## Abertura e áudio V7

A página inicial usa um menu de videogame em uma mesa 2D, com acesso direto ao Salve o Mundo, marca do IFMA e link do projeto. O estilo está em `landing-v7.css`. O controle extra de organização foi removido; arrastar continua disponível. Os efeitos sonoros do modo solo foram amplificados, com ganho limitado no solo para reduzir distorção. O volume final depende das configurações e permissões do dispositivo.

## Chefes que anulam categorias

A primeira crise apresenta as regras sem anular nenhuma categoria. Na segunda, o chefe anula o plástico (vermelho); na terceira, metal (amarelo); na quarta, papel (azul); e na quinta, vidro (verde). Cartas da categoria anulada **não contribuem para pontos base, combinações ou efeitos de coringas**. É permitido selecioná-las e descartá-las. A indicação aparece acima da mesa e nas cartas afetadas.

A Trinca Circular foi retirada da interface e do código multiplayer. Um futuro jogo infantil ainda será definido e desenvolvido separadamente.
