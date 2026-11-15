# Referência técnica e regras de jogo

[Voltar ao README](../README.md) | [Guia de uso](GUIA-DE-USO.md) | [Arquitetura](ARQUITETURA.md)

Este documento reúne **dados de referência** das regras atuais. Para procedimentos passo a passo, consulte o [Guia de uso](GUIA-DE-USO.md). O código-fonte continua sendo a fonte de verdade se houver divergência entre regra e documentação.

## Categorias de resíduos

| Identificador interno | Cor | Material |
| --- | --- | --- |
| `azul` | Azul | Papel/papelão |
| `vermelho` | Vermelho | Plástico |
| `verde` | Verde | Vidro |
| `amarelo` | Amarelo | Metal |
| `marrom` | Marrom | Orgânicos |

O EcoCard usa cinco cores do conjunto da **Resolução CONAMA 275/2001**, e não todas as dez categorias oficiais. O recorte é pedagógico.

## Salve o Mundo — valores

**Baralho-base:** 65 cartas, 13 para cada categoria.

**Valores:** A = 1, 2–10 conforme o número, J = 11, Q = 12, K = 13.

**Composição:** selecionar de uma a cinco cartas, conforme regras e recursos da crise. A pontuação usa pontos base e multiplicador, modificados por chefes, coringas, efeitos temáticos e eventos.

### Campanhas

| Campanha | Multiplicador de meta | Ajuste de mãos | Ajuste de descartes | Ecofichas iniciais |
| --- | ---: | ---: | ---: | ---: |
| Fácil | 0,36 | +1 | +1 | 8 |
| Médio | 0,65 | 0 | 0 | 6 |
| Difícil | 1,00 | 0 | 0 | 5 |
| Extremo | 1,60 | -1 | -1 | 4 |

Os valores de metas são arredondados para cima em múltiplos de 50; a regra `double_hp` dobra o requisito antes do arredondamento. O modificador de crise `short` reduz uma mão adicional. As quantidades finais respeitam limites mínimos do motor.

### Crises

| Nº | Crise | Meta-base | Mãos-base |
| --- | --- | ---: | ---: |
| 1 | Contaminação Cruzada | 850 | 5 |
| 2 | Descarte Irregular | 2.200 | 4 |
| 3 | Desperdício de Recursos | 4.000 | 4 |
| 4 | Crise dos Aterros | 7.600 | 4 |
| 5 | Poluição dos Oceanos | 12.000 | 4 |
| 6 | Consumo Desenfreado | 18.500 | 3 |
| 7 | Mudanças Climáticas | 150.000 | 3 |

**Meta da crise final por campanha, sem chefe que dobra a meta:** Fácil 54.000; Médio 97.500; Difícil 150.000; Extremo 240.000.

### Chefes

A partir da segunda crise há sorteio de uma restrição de chefe. Entre as possibilidades implementadas:

- Anular uma das cinco categorias.
- Exigir pelo menos três cartas da mesma categoria.
- Exigir ao menos dois valores iguais.
- Anular mãos com exatamente cinco cartas.
- Exigir mão de três cartas.
- Dobrar a meta da crise (`double_hp`).

Uma mão inválida pode render zero pontos e ainda consumir uma jogada. A prévia sinaliza essa condição.

### Coringas

**Coleção:** 50 coringas, divididos em 20 Comuns, 15 Raros, 10 Épicos e cinco Lendários.

**Limite equipado:** cinco. **Ofertas por loja:** três. **Aventura Circular:** tem o menor peso individual no sorteio e executa duas vezes o efeito dos demais coringas equipados.

**Lendários:** Aventura Circular, Planeta Vivo, Renascimento Verde, Pacto Global e Guardiões da Terra.

**Evolutivos (sete):** Papel Recuperado, Retorno do Vidro, Valor do Metal, Coleta Integrada, Biofertilizante, Aliança dos Biomas e Usina Circular. A habilidade pode evoluir até oito vezes em jogadas válidas que a ativam. A prévia não evolui o coringa.

**Especialização do baralho:** custa quatro ecofichas; adiciona duas cartas da categoria escolhida e remove três de outras categorias, a partir da próxima crise; limite de cinco ajustes por campanha.

### Certificado

O certificado final é disponibilizado apenas quando o jogador conclui a **sétima crise do Extremo**, depois das campanhas Fácil, Médio e Difícil. A imagem e a mensagem de compartilhamento incluem a conquista completa; a pontuação mostrada refere-se à campanha Extremo.

## Missão Coleta — dados

| Campo | Valor |
| --- | --- |
| Categorias | 5 |
| Objetos cadastrados | 40 (8 por categoria) |
| Objetos por partida | 25, sem repetição |
| Etapas | 5, com 5 objetos cada |
| Pontos por acerto | 100 |
| Pontos por erro | 0, com nova tentativa |
| Pontuação máxima | 2.500 |
| Tempo limite | Não há |
| Tela de conclusão | Após 25 classificações corretas |

Nas etapas 1 e 2 há dica e nome do material. Nas etapas 3 e 4 as dicas são retiradas, mas os nomes permanecem. Na etapa 5, **somente as cores** aparecem nas lixeiras; a legenda lateral de materiais fica oculta. Botões acessíveis identificam a cor, sem anunciar o material.

Os objetos são sorteados de uma coleção em `kids-game.js` e desenhados com SVG local. Uma nova partida pode repetir itens usados em partidas anteriores, embora não os repita na mesma partida.

## Execução e testes

**Frontend:** HTML, CSS e JavaScript no navegador; site estático.

**Testes:** Node.js 22 na GitHub Actions.

```bash
node tests/card-art.test.cjs
node tests/kids-game.test.cjs
node tests/solo.test.cjs
node tests/decks.test.cjs
node tests/hand-order.test.cjs
```

**Recuperação:** o modo solo usa `sessionStorage` para restaurar o estado na mesma aba. **Compartilhamento:** usa recursos nativos do navegador quando disponíveis, com alternativas de copiar texto ou salvar imagem.

## Limites desta referência

O jogo modela categorias de resíduos para fins didáticos e utiliza restrições de chefe ficcionais. Não recomenda descarte de resíduos perigosos, hospitalares, radioativos ou outros materiais fora do recorte pedagógico. A reciclagem efetiva depende do contexto local.

Fontes externas e delimitação pedagógica: [Fundamentação educacional](FUNDAMENTACAO.md).
