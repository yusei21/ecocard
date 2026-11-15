# EcoCard — EcoResiduários Academy

Plataforma web de jogo de cartas ambiental para demonstração em estande. A experiência principal é **Salve o Mundo**. Interface em português do Brasil, responsiva, com controles por toque, teclado e mouse.

**[Abrir o jogo pelo GitHub Pages](https://yusei21.github.io/ecocard/)** (funciona após habilitar Pages para a branch `main`, pasta raiz).

## Jogo atual

### Salve o Mundo (solo)

Roguelike de pontuação com cartas de cinco categorias de resíduos: **azul/papel**, **vermelho/plástico**, **verde/vidro**, **amarelo/metal**, **marrom/orgânicos**. São **65 cartas**, com **A, 2–10, J, Q, K** por categoria. A=1, J=11, Q=12, K=13 para sequências e pontuação. As combinações de 1–5 cartas recebem pontos base e multiplicadores, com ajustes dos coringas e dos chefes.

- Etapas: Contaminação Cruzada, Descarte Irregular, Desperdício de Recursos, Crise dos Aterros, Poluição dos Oceanos, Consumo Desenfreado e Mudanças Climáticas.
- Cada desafio tem meta crescente; o jogador dispõe de jogadas e descartes limitados.
- Entre desafios, recebe ecofichas para adquirir coringas, até cinco simultâneos.
- Coringas **Reduzir**, **Reutilizar** e **Reciclar** representam os 3 Rs; também existem Compostagem Viva, Força Coletiva e Educação Ambiental.
- **Aventura Circular** é lendária: executa **duas vezes os efeitos de cada outro coringa equipado**, sem autorrecursão. Seu peso individual no sorteio é `0.0005`, inferior ao de todos os outros coringas; a probabilidade exata varia conforme o estoque de cartas elegíveis.

As regras de pontuação são originais para este projeto. O jogo usa o conceito geral de construção de combinações e progressão roguelike, sem reutilizar assets de Balatro.


### Coleção de 40 coringas

O Salve o Mundo possui **40 coringas únicos**: **16 Comuns (verde), 12 Raros (azul), 8 Épicos (roxo) e 4 Lendários (dourado)**. A coleção mantém os 3 Rs e adiciona novas estratégias para cada categoria de resíduo, combinações de valores, sequências e bônus por diversidade de cores. Todos os novos coringas possuem um efeito funcional de pontuação, arte vetorial exclusiva e custo em ecofichas. A loja exibe três opções por visita, respeitando o limite de cinco coringas equipados.

Os lendários são: **Aventura Circular, Planeta Vivo, Renascimento Verde e Pacto Global**. Aventura Circular continua sendo o item de menor peso individual na loja. Os efeitos de pontuação são calculados apenas sobre cartas válidas após as restrições do chefe. Aventura Circular repete duas vezes cada outro coringa, incluindo épicos e lendários, sem ativar a si mesma.

A distribuição de sorteio é ponderada, não uniforme. A raridade não garante automaticamente um resultado melhor em qualquer situação: cartas mais raras exigem condições específicas de combinação.

### Coringas evolutivos e certificado final

Sete dos 40 coringas agora são **evolutivos**: Papel Recuperado, Retorno do Vidro, Valor do Metal, Coleta Integrada, Biofertilizante, Aliança dos Biomas e Usina Circular. Eles começam com os bônus de origem e aumentam o efeito em cada jogada válida na qual a habilidade é ativada, até **8 evoluções**. O progresso aparece diretamente no coringa equipado, com contador e barra. Pré-visualizar cartas ou jogar uma mão anulada não aumenta o nível; a Aventura Circular continua repetindo o bônus, mas não duplica o avanço de nível. As evoluções pertencem ao coringa comprado e reiniciam numa nova campanha.

O **certificado de conclusão**, a imagem compartilhável e os botões para compartilhar ou copiar a vitória aparecem **somente depois da sétima crise da campanha Extremo**, isto é, depois das quatro campanhas (28 crises). Vencer Fácil, Médio ou Difícil apenas desbloqueia a próxima campanha. O certificado final mostra o feito de 28 crises vencidas e os pontos obtidos durante a campanha Extremo.

### Especialização do baralho e proteção contra recarregamentos

Após vencer uma crise, a loja permite ajustar o baralho para uma estratégia específica. Por **4 ecofichas**, escolha **Papel, Plástico, Vidro, Metal ou Orgânicos**: entram **2 cartas** dessa categoria e saem **3 cartas de outras categorias**. São permitidos até **5 ajustes por campanha**; as mudanças valem nas crises seguintes e recomeçam com a próxima dificuldade. A loja apresenta a quantidade atual de cartas de cada categoria para ajudar nas decisões.

Em dispositivos móveis, o estado da partida é armazenado em `sessionStorage` e recuperado quando a página recarrega na mesma aba. A recuperação preserva a campanha, crise, baralho, coringas, evoluções, pontos e loja. Se o recarregamento ocorrer durante a animação de pontos, o resultado já registrado é recuperado uma única vez. O progresso não depende de uma conta e pode desaparecer ao encerrar a sessão do navegador. O botão de reinício explícito limpa o estado salvo.

### Campanhas de dificuldade (7 crises por nível)

O jogo começa no **Fácil** e mostra um seletor com as campanhas **Fácil → Médio → Difícil → Extremo**. Cada campanha contém **as mesmas sete crises**, mantendo a progressão de metas dentro do nível escolhido. Ao concluir a sétima crise, o jogo desbloqueia a campanha seguinte e oferece um botão para avançar. Cada nova campanha começa com cartas, coringas e ecofichas novos, para evitar que a dificuldade seja trivializada por uma coleção pronta.

As metas de resistência do chefe da sétima crise são: Fácil **54.000**, Médio **97.500**, Difícil **150.000**, Extremo **240.000**. O chefe aleatório **Crise agravada** pode dobrar essas metas. Fácil tem uma jogada e um descarte extra por crise; Extremo reduz um de cada. Nenhuma campanha é desbloqueada automaticamente sem vencer as sete fases da anterior.

A partida e os desbloqueios são recuperados após **recarregar a página na mesma aba** (armazenamento de sessão). Fechar a aba pode encerrar a sessão; o botão Reiniciar continua disponível para começar novamente. Ainda falta validar a curva completa com partidas reais.

### Escalada e regras rotativas (7 crises)

Agora a jornada contém **7 crises**: (1) Contaminação Cruzada — Fácil, 850 pontos, 5 mãos; (2) Descarte Irregular — Médio, 2.200 pontos, 4 mãos; (3) Desperdício de Recursos — Médio, 4.000 pontos, 4 mãos; (4) Crise dos Aterros — Difícil, 7.600 pontos, 4 mãos; (5) Poluição dos Oceanos — Difícil, 12.000 pontos, 4 mãos; (6) Consumo Desenfreado — Extremo, 18.500 pontos, 3 mãos; (7) Mudanças Climáticas — Final, 150.000 pontos, 3 mãos. A dificuldade é definida por fase, sem um multiplicador global escolhido pelo jogador.

A primeira crise funciona como introdução. Da segunda à sétima, o jogo sorteia uma **restrição de chefe**, evitando repetir a imediatamente anterior. As possibilidades incluem: uma das cinco categorias anulada; **somente mãos com 3+ cartas da mesma categoria**; **somente mãos com 2+ valores iguais**; **mãos com exatamente 5 cartas valem zero**; **somente mãos de 3 cartas**; ou **Crise agravada, que dobra a meta de pontos do chefe**. Cada crise continua tendo também seu próprio bônus ou penalidade temática e um evento aleatório da rodada.

Uma carta de categoria anulada não conta na combinação, pontuação ou gatilho dos coringas. Se a mão não satisfizer a restrição, **a jogada vale 0**, mas ainda consome uma mão. A prévia exibe zero antes de jogar. Essas restrições são regras ficcionais de jogo, não orientações de descarte de resíduos.

Não há seleção global de dificuldade. O tutorial leva diretamente à crise 1 e as metas aumentam conforme a jornada; eventos e chefes sorteados ainda alteram o desafio de cada fase. As metas precisam de testes práticos de balanceamento para confirmar que cada crise é vencível.

### Tutorial de combinações antes da partida

Antes da escolha de dificuldade, o jogador vê sete exemplos com cartas ilustradas: Separação Inicial, Materiais Equivalentes (par), Reaproveitamento (trinca), Fluxo Circular (sequência), Coleta Seletiva (3 cartas da mesma categoria), Triagem Perfeita (5 da mesma categoria) e Ciclo Completo (5 consecutivas da mesma categoria). A explicação apresenta **pontos base × multiplicador** e avisa que certas regras de chefe zeram a mão. O botão **Entendi · Começar jornada** inicia diretamente a primeira crise.

A sétima crise tem meta-base de **150.000 pontos**. A regra aleatória **Crise agravada (×2)** dobra a meta já ajustada pela dificuldade: por exemplo, na sétima crise, 150.000 → 300.000. Essa é uma meta inicialmente experimental: deve-se testar a viabilidade real com diferentes coringas e combinações para evitar finais impossíveis.

## Como executar

Não há build nem dependências locais: abra `index.html` num navegador moderno. Para o estande, use HTTPS (recomendado: GitHub Pages). Para publicar: **Settings > Pages > Deploy from a branch > main > /(root)**. O endereço acima estará disponível somente após a publicação ser concluída.

## Design

- Linguagem visual original inspirada em materiais naturais, impressão editorial e jogos de mesa.
- Paleta verde-floresta, lima e rosa, combinada com as cinco cores normativas da coleta seletiva. **A paleta exata do Instagram não pôde ser validada**; deve ser substituída por tokens oficiais caso o projeto forneça seu guia de marca.
- Cartas usam **cor, nome da categoria e símbolo** (não apenas cor), identificação do valor, seleção visível e efeito hover discreto. Respeita preferência por movimento reduzido.
- A interface exibe a marca vetorial horizontal do IFMA; confirmar junto à comunicação institucional sua versão autorizada para o estande.
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

1. Testar uma jornada completa do Salve o Mundo em celulares reais, incluindo chefes que anulam cartas.
2. Medir taxas de vitória e ajustar a curva de dificuldade das cinco crises.
3. Validar a identidade visual e os textos ambientais com a equipe do IFMA.
4. Decidir separadamente um segundo jogo infantil de partidas rápidas para o estande.

Licença: consultar o arquivo `LICENSE` do repositório.

## Identidade visual (v3)

Interface editorial inspirada em sinalização de triagem, papel e tipografia impressa. Família **Barlow Condensed** para grandes títulos e valores, **IBM Plex Sans** para leitura e **IBM Plex Mono** para identificação técnica. Layout mantém a cor e um símbolo/texto em cada carta. Arquivo principal de tema: `identity-v3.css`.

A marca institucional exibida é o SVG horizontal do **IFMA (manual de 2015)** disponível no Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Instituto_Federal_do_Maranhão_-_Marca_Horizontal_2015.svg . Para impressão ou ações institucionais, confirmar a versão da marca com comunicação do IFMA.

Referências usadas na revisão: https://www.reddit.com/r/SoloDevelopment/comments/1tf84yf/ ; https://www.reddit.com/r/IndieDev/comments/1wt9lwn/ ; https://www.reddit.com/r/godot/comments/1u5flj3/ ; https://www.reddit.com/r/BoardgameDesign/comments/12qj22f/ .

## Controles e uso no celular

No Salve o Mundo, a ordem da mão pode ser alterada **arrastando uma carta sobre outra**, sem botão adicional. A ordem é local para cada jogador e não altera as cartas recebidas nem as combinações válidas. O suporte a arrastar em navegadores móveis deve ser confirmado em dispositivos reais.

O cabeçalho mobile-first prioriza a identidade do EcoCard, o acesso à EcoResiduários Academy e a marca vetorial do IFMA em uma área institucional com contraste controlado. A nova folha `mobile-v5.css` ajusta o topo e as mãos roláveis para dispositivos menores.

## Abertura e áudio V7

A página inicial usa um menu de videogame em uma mesa 2D, com acesso direto ao Salve o Mundo, marca do IFMA e link do projeto. O estilo está em `landing-v7.css`. O controle extra de organização foi removido; arrastar continua disponível. Os efeitos sonoros do modo solo foram amplificados, com ganho limitado no solo para reduzir distorção. O volume final depende das configurações e permissões do dispositivo.

## Regras especiais dos chefes

As fases 2–7 sorteiam uma regra da lista detalhada acima. O bloqueio de categoria é uma das regras possíveis; não está mais preso a uma fase específica. Cada regra aparece no topo da mesa. O jogador deve adaptar as cartas escolhidas para evitar jogadas anuladas.

