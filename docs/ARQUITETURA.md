# Arquitetura e decisões técnicas

[Voltar ao README](../README.md) | [Referência](REFERENCIA-TECNICA.md) | [Contribuir](CONTRIBUINDO.md)

Este documento explica **como o EcoCard é organizado** e como os dois jogos convivem na mesma aplicação web.

## Visão geral

O EcoCard é uma aplicação **estática no navegador**, construída com HTML, CSS e JavaScript. Não há API própria, autenticação, banco de dados no servidor ou compilação obrigatória. O GitHub Pages distribui os arquivos estáticos.

```text
Navegador
  |
  +-- index.html / navegação
  |     |
  |     +-- Salve o Mundo
  |     |     +-- solo-v2.js          regras, estado, campanhas e loja
  |     |     +-- card-art.js         ilustrações das 65 cartas
  |     |     +-- hand-order.js       reordenação visual
  |     |     +-- victory-share.js    certificado da vitória final
  |     |
  |     +-- Missão Coleta
  |           +-- kids-game.js        perguntas, respostas, níveis e telas
  |
  +-- CSS compartilhado e específico de cada modo
  |
  +-- Browser APIs
        +-- Web Audio API
        +-- sessionStorage
        +-- Canvas / download
        +-- Clipboard / Web Share (se disponíveis)
```

## Organização do código

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura das telas, carregamento dos scripts e navegação entre jogos |
| `solo-v2.js` | Pontuação, combinações, chefes, campanhas, loja, sorteio de coringas e estado do modo solo |
| `kids-game.js` | Catálogo ilustrado, seleção de objetos, validação de respostas, progresso em duas etapas |
| `card-art.js` | SVGs das cartas e associação entre categoria/valor e desenhos |
| `hand-order.js` | Ordenação local da mão por interação do usuário |
| `victory-share.js` | Cartão de conquista, compartilhamento nativo, cópia e geração de imagem |
| `game-v4.css` | Estilos principais de cartas, loja, campanhas e HUD |
| `kids-game.css` | Estilos da Missão Coleta e responsividade das lixeiras |
| `identity-v3.css`, `mobile-v5.css`, `landing-v6.css`, `landing-v7.css` | Identidade e refinamentos da experiência visual |
| `tests/` | Testes de lógica e verificações de regressão |
| `.github/workflows/test.yml` | Execução automatizada dos testes no GitHub |

O modo solo substitui funções da versão inicial no arquivo HTML por implementações mais recentes de `solo-v2.js`. Essa compatibilidade com código legado deve ser considerada ao refatorar a inicialização; alterações no carregamento de scripts precisam ser testadas em ambos os modos.

## Fluxo do Salve o Mundo

O jogador consulta o tutorial, escolhe uma campanha disponível e começa uma crise. Durante a crise, seleciona cartas, verifica a pontuação prevista e joga. A pontuação depende da combinação, das regras da crise e dos efeitos dos coringas, respeitando a restrição do chefe.

Ao superar a meta, o jogo transita para a loja: a carteira recebe ecofichas, permite comprar e vender coringas e ajustar o baralho. A próxima crise utiliza o baralho especializado. Ao vencer a sétima crise, o jogador pode iniciar a próxima campanha; somente a conclusão da campanha Extremo gera o certificado final.

Os dados de coringas possuem identificador, raridade, preço, descrição e regras de pontuação. Alguns possuem `growth` e regras em `EVOLUTION_RULES`; o avanço de nível ocorre depois de uma jogada válida e não durante a prévia.

O estado de uma campanha é mantido em memória durante a execução. O jogo também registra uma representação no `sessionStorage` para recuperação na mesma aba, sem garantia de preservação após encerramento da sessão.

## Fluxo da Missão Coleta

O módulo contém `CATEGORIES`, `ITEMS` e ilustrações SVG em `SHAPES`. A função `createRound` escolhe dez objetos entre os mais difíceis (dois por categoria), distribuindo uma categoria por etapa. O jogo mantém os estados de apresentação, escolha, feedback, transição de nível e conclusão.

A função `scoreAnswer` compara a categoria do objeto à lixeira selecionada. Uma resposta correta vale 100 pontos; uma resposta incorreta exige nova tentativa antes do avanço. Após cada grupo de cinco objetos há uma passagem de etapa.

Em toda a partida, `binsHTML` desenha apenas as lixeiras coloridas. O painel lateral não exibe a legenda de categorias; os botões mantêm rótulos acessíveis baseados **somente na cor**.

## Interface e acessibilidade

- Cartas e objetos usam desenhos SVG, não emojis.
- O conteúdo mantém nomes e texto alternativo/descrições de controle quando necessário.
- Os estilos contemplam responsividade e preferência por redução de movimento.
- O projeto suporta interações por toque, mouse e teclado em controles comuns. Gestos específicos, áudio e recursos de compartilhamento podem variar conforme navegador.
- O modo infantil utiliza botões grandes e feedback sem cronômetro ou punição por erro.

Acessibilidade deve ser testada empiricamente com teclado e tecnologias assistivas; a existência de atributos ARIA não garante conformidade integral com WCAG.

## Ciclo de desenvolvimento

1. Atualizar dados e regras no módulo correspondente.
2. Atualizar a documentação e os testes associados à alteração.
3. Validar sintaxe com `node --check`.
4. Executar as suítes na pasta `tests/`.
5. Revisar responsividade e navegação em navegador real.
6. Enviar alterações via Git e verificar a GitHub Actions e a publicação do GitHub Pages.

Veja o procedimento detalhado em [Contribuindo](CONTRIBUINDO.md). Para números e regras, consulte a [Referência técnica](REFERENCIA-TECNICA.md).

## Limitações e oportunidades

- A recuperação de sessão do Salve o Mundo não substitui persistência entre dispositivos.
- Uma refatoração futura pode separar melhor a estrutura do HTML e o motor legado.
- O equilíbrio de economia, metas e coringas precisa de testes com partidas reais.
- Validações de acessibilidade, performance e usabilidade com crianças devem ser conduzidas antes de uso em larga escala.
