# EcoCard — EcoResiduários Academy

Plataforma de jogos educativos sobre resíduos sólidos, desenvolvida para uso em navegador, inclusive em celulares e em atividades de demonstração no IFMA. O projeto oferece dois jogos independentes:

- **Salve o Mundo:** estratégia com cartas, combinações, coringas e campanhas progressivas.
- **Missão Coleta:** classificação de resíduos em lixeiras coloridas, com etapas de aprendizado para crianças.

**Jogar:** https://yusei21.github.io/ecocard/

Não requer cadastro. A interface está em português do Brasil e não utiliza emojis: os objetos e elementos de jogo são desenhados com SVG e CSS.

## Missão Coleta — jogo infantil

Na Missão Coleta, cada objeto ilustrado deve ser colocado na lixeira correta. O jogo trabalha com cinco categorias:

| Cor da lixeira | Material |
| --- | --- |
| Azul | Papel |
| Vermelho | Plástico |
| Verde | Vidro |
| Amarelo | Metal |
| Marrom | Orgânicos |

O catálogo contém **40 objetos**, oito por categoria. Cada partida apresenta **25 objetos diferentes**, divididos em cinco etapas com cinco objetos cada. Cada resposta correta vale **100 pontos**; um erro permite outra tentativa, sem perda de pontos, cronômetro ou encerramento da partida. Há explicações educativas, respostas bem-humoradas e uma tela de passagem de etapa.

### Progressão das cinco etapas

| Etapa | Nome | Desafio |
| --- | --- | --- |
| 1 | Primeiros Passos | Materiais familiares, com nomes nas lixeiras e dica |
| 2 | Olho de Águia | Mais observação, ainda com nomes e dica |
| 3 | Detetive da Coleta | Os nomes continuam; a dica do objeto é retirada |
| 4 | Desafio dos Materiais | Objetos menos óbvios, com nomes nas lixeiras, sem dica |
| 5 | Mestre da Separação | **Apenas as cores das lixeiras**, sem nomes dos materiais e sem legenda lateral |

A quinta etapa verifica o aprendizado das cores. Os controles continuam com descrições acessíveis para leitores de tela, usando o nome **da cor** de cada lixeira, sem revelar a categoria. Ao concluir as cinco etapas, aparece a tela de parabéns com os 25 acertos e a pontuação.

O jogo utiliza ilustrações SVG locais, sem imagens externas ou dependência de conexão multiplayer. As recomendações sobre coleta seletiva têm caráter didático: o destino de um material pode variar segundo a infraestrutura e as orientações municipais.

**Arquivos:** `kids-game.js`, `kids-game.css` e `tests/kids-game.test.cjs`.

## Salve o Mundo — estratégia de cartas

O Salve o Mundo combina formação de mãos, pontuação, gestão de ecofichas e construção de estratégias com coringas.

### Baralho e pontuação

- São **65 cartas**: 13 valores por cada uma das cinco categorias de resíduos.
- Valores: **A (1), 2 a 10, J (11), Q (12), K (13)**.
- Cada carta apresenta nome do objeto, categoria, valor e uma ilustração vetorial.
- O jogador seleciona de uma a cinco cartas para formar combinações e somar pontos base e multiplicadores.
- Há um tutorial visual antes de escolher a campanha, com exemplos de pares, trincas, sequências e mãos de uma só categoria.
- Cada crise possui um limite de jogadas e descartes. A prévia de pontuação considera efeitos e restrições, incluindo jogadas anuladas.

As combinações principais são **Separação Inicial**, **Materiais Equivalentes**, **Reaproveitamento**, **Fluxo Circular**, **Coleta Seletiva**, **Triagem Perfeita** e **Ciclo Completo**. O jogo também reconhece **Diversidade Ambiental** e **Mutirão Quádruplo**.

### Quatro campanhas de sete crises

O progresso é sequencial: **Fácil, Médio, Difícil e Extremo**. Cada campanha percorre as mesmas sete crises, com metas e recursos ajustados à dificuldade. Vencer a sétima crise desbloqueia a campanha seguinte.

| Crise | Nome | Meta-base (Difícil) |
| --- | --- | ---: |
| 1 | Contaminação Cruzada | 850 |
| 2 | Descarte Irregular | 2.200 |
| 3 | Desperdício de Recursos | 4.000 |
| 4 | Crise dos Aterros | 7.600 |
| 5 | Poluição dos Oceanos | 12.000 |
| 6 | Consumo Desenfreado | 18.500 |
| 7 | Mudanças Climáticas | 150.000 |

A meta da última crise, sem a regra de dobrar pontos, é **54.000 no Fácil**, **97.500 no Médio**, **150.000 no Difícil** e **240.000 no Extremo**. Os modificadores da campanha também ajustam a quantidade de jogadas, descartes e ecofichas iniciais.

Da segunda à sétima crise, os chefes podem impor restrições aleatórias: anular uma categoria, exigir valores iguais ou categorias específicas, limitar a composição da mão ou dobrar a meta (**Crise agravada**). Cartas anuladas não participam dos efeitos dos coringas.

São **28 crises ao todo** para zerar todas as campanhas. O **certificado de conclusão** e os recursos de compartilhar, copiar ou salvar a imagem de vitória aparecem **somente após concluir a sétima crise do Extremo**. As vitórias nas campanhas anteriores apenas permitem avançar.

### Coleção de 50 coringas

| Raridade | Quantidade | Cor |
| --- | ---: | --- |
| Comum | 20 | Verde |
| Raro | 15 | Azul |
| Épico | 10 | Roxo |
| Lendário | 5 | Dourado |
| **Total** | **50** | |

Cada coringa oferece uma habilidade própria de pontuação e uma ilustração vetorial. A loja apresenta três ofertas por visita, e o jogador pode equipar até **cinco coringas** simultaneamente. O sorteio é ponderado por raridade, e a **Aventura Circular** tem o menor peso individual da coleção. Seu efeito repete duas vezes os efeitos dos outros coringas equipados.

Os cinco lendários são **Aventura Circular**, **Planeta Vivo**, **Renascimento Verde**, **Pacto Global** e **Guardiões da Terra**.

Sete coringas são **evolutivos**: Papel Recuperado, Retorno do Vidro, Valor do Metal, Coleta Integrada, Biofertilizante, Aliança dos Biomas e Usina Circular. Uma jogada válida que ativa a habilidade aumenta seu nível até o limite de **oito evoluções**, indicado por contador e barra no coringa. A prévia de pontuação e mãos anuladas não geram evolução; a Aventura Circular repete o efeito sem duplicar o avanço de nível.

### Loja, economia e especialização do baralho

Ao vencer uma crise, o jogador recebe ecofichas e acessa a loja para comprar ou vender coringas. Há juros por ecofichas guardadas, conforme as regras do jogo. No celular, o painel de **saldo** e **juros** é apresentado em blocos empilhados para evitar texto espremido.

Na loja, por **4 ecofichas**, é possível escolher uma categoria para **acrescentar duas cartas dela e retirar três de outras categorias**. São permitidos até **cinco ajustes por campanha**. A especialização passa a valer a partir da próxima crise, ajudando a construir baralhos alinhados aos coringas adquiridos.

### Progresso no celular

O jogo utiliza `sessionStorage` para tentar recuperar campanha, crise, baralho, coringas, evoluções, pontuação e estado da loja quando a página é recarregada **na mesma aba**. O progresso pode deixar de estar disponível ao encerrar a sessão do navegador. O reinício explícito limpa a partida salva.

A mão pode ser reorganizada arrastando cartas; a pontuação possui animação e sons curtos para cartas contabilizadas. O comportamento em navegadores e aparelhos específicos deve ser verificado com testes reais.

**Arquivos:** `solo-v2.js`, `card-art.js`, `hand-order.js`, `victory-share.js`, `game-v4.css` e folhas auxiliares de estilo.

## Executar localmente

Não há etapa de compilação, nem dependências JavaScript a instalar para jogar. Abra `index.html` em um navegador moderno. Para testes completos dos recursos de navegador (como compartilhamento e área de transferência), prefira um servidor local ou o endereço HTTPS do GitHub Pages.

Exemplo com Python instalado:

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`.

Para publicar pelo GitHub Pages, use **Settings > Pages > Deploy from a branch > main > /(root)**, caso a publicação da branch ainda não esteja configurada.

## Testes automatizados

O repositório usa **Node.js 22** na GitHub Actions, no arquivo `.github/workflows/test.yml`. Os testes verificam regras das combinações, coringas, baralhos, ordenação de cartas, ilustrações e jogabilidade infantil. Também existe uma verificação de ausência de caracteres de emoji nos arquivos-fonte e na documentação.

Para rodar os testes localmente, com Node.js instalado:

```bash
node tests/card-art.test.cjs
node tests/kids-game.test.cjs
node tests/solo.test.cjs
node tests/decks.test.cjs
node tests/hand-order.test.cjs
```

## Design, acessibilidade e instituições

A identidade visual utiliza tons de verde, tipografia editorial, as cinco cores de separação dos resíduos e desenhos vetoriais locais. As famílias tipográficas usadas incluem **Barlow Condensed**, **IBM Plex Sans** e **IBM Plex Mono**. As folhas de estilo incluem `identity-v3.css`, `mobile-v5.css`, `landing-v6.css` e `landing-v7.css`.

A interface conta com rótulos para leitores de tela em controles relevantes, indicação de seleção nas cartas, botões compatíveis com toque e teclado e estilos que consideram a preferência por movimento reduzido. O contraste e a disposição dos elementos devem continuar sendo avaliados em celulares reais.

O projeto exibe a marca do **Instituto Federal do Maranhão (IFMA)** e apresenta ligação com a **EcoResiduários Academy**. Antes de uso institucional ou de impressão, recomenda-se confirmar a versão oficial das marcas com as respectivas equipes.

- Instagram da EcoResiduários Academy: https://www.instagram.com/ecoresiduariosacademy/
- Referência da marca horizontal do IFMA: https://commons.wikimedia.org/wiki/File:Instituto_Federal_do_Maranhão_-_Marca_Horizontal_2015.svg

## Informação ambiental

O jogo utiliza cinco das cores previstas pela **Resolução CONAMA 275/2001**. A norma contempla outras categorias além das cinco usadas nesta experiência. A separação e a possibilidade de reciclagem dependem do material, da contaminação, dos pontos de coleta e das regras municipais. Materiais orgânicos podem ser aproveitados em compostagem quando houver condições adequadas.

- [CONAMA — publicações e normas](https://conama.mma.gov.br/images/conteudo/LivroConama.pdf)
- [DNIT — normas e orientações de gestão de resíduos](https://www.gov.br/dnit/pt-br/central-de-conteudos/atos-normativos/tipo/portarias/portaria-3412-2023-setsust-publ.pdf)

## Próximos passos

1. Testar os dois jogos em celulares reais, especialmente a loja do Salve o Mundo e a quinta etapa da Missão Coleta.
2. Avaliar a dificuldade das 28 crises e a variedade de estratégias com os 50 coringas.
3. Revisar os textos ambientais e a identidade visual com a equipe do projeto e do IFMA.

**Licença:** consulte o arquivo `LICENSE` do repositório.
