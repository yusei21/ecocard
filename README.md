# EcoCard

**Plataforma web de jogos educativos sobre separação de resíduos e sustentabilidade.**

[**Jogar no navegador**](https://yusei21.github.io/ecocard/) · [Guia de uso](docs/GUIA-DE-USO.md) · [Arquitetura](docs/ARQUITETURA.md) · [Referência técnica](docs/REFERENCIA-TECNICA.md) · [Contribuições](docs/CONTRIBUINDO.md)

O EcoCard reúne dois jogos independentes em português brasileiro. **Salve o Mundo** utiliza estratégia, cartas e evolução de campanhas; **Missão Coleta** introduz a coleta seletiva a crianças por meio de objetos ilustrados e escolhas de lixeiras.

O projeto foi pensado para uso em navegadores de computador e celular, inclusive em demonstrações educativas. Não exige cadastro nem instalação para jogar na versão publicada.

> **Escopo ambiental:** os jogos simplificam a coleta seletiva para fins didáticos. As regras de descarte e a aceitação de materiais variam conforme a cidade e o serviço de coleta. O projeto não substitui orientações locais.

## Visão geral

| | Salve o Mundo | Missão Coleta |
| --- | --- | --- |
| Público | Jogadores interessados em estratégia | Crianças e atividades introdutórias |
| Objetivo | Superar metas de pontuação em crises ambientais | Associar objetos às cores das lixeiras |
| Mecânica | Combinações de cartas, coringas, economia e chefes | Escolher entre cinco lixeiras, com explicações |
| Conteúdo | 65 cartas e 50 coringas | Catálogo de 40 objetos |
| Progressão | Quatro campanhas com sete crises cada | Duas etapas, 10 perguntas difíceis |
| Conclusão | Certificado após vencer a campanha Extremo | Tela de parabéns após a décima pergunta |

### Salve o Mundo

- **65 cartas ambientais**: 13 valores em cada uma das categorias papel, plástico, vidro, metal e orgânicos.
- **50 coringas** distribuídos entre Comum (20), Raro (15), Épico (10) e Lendário (5); sete possuem evolução por uso.
- **Quatro campanhas sequenciais**: Fácil, Médio, Difícil e Extremo, cada uma com sete crises.
- Loja com ecofichas, juros, compra e venda de coringas e **especialização do baralho** entre crises.
- Regras de chefes, efeitos sonoros de pontuação e certificado compartilhável **apenas após concluir o Extremo**.

### Missão Coleta

- **Cinco lixeiras** identificadas pelas cores azul, vermelho, verde, amarelo e marrom.
- **40 objetos ilustrados** no catálogo; cada partida seleciona 10 objetos difíceis, sem repetição.
- **Duas etapas de cinco objetos**, respostas educativas, mensagens de incentivo e possibilidade de corrigir erros.
- Em **toda a partida**, as lixeiras mostram **somente as cores**, sem nomes de materiais nem legenda lateral; as descrições acessíveis dos botões identificam a cor, sem entregar a resposta.

## Início rápido

**Online:** abra [EcoCard no GitHub Pages](https://yusei21.github.io/ecocard/) e escolha um dos dois jogos.

**Localmente:** clone o repositório e execute um servidor HTTP estático na raiz.

```bash
git clone https://github.com/yusei21/ecocard.git
cd ecocard
python3 -m http.server 8000
```

Acesse `http://localhost:8000`. Para jogar não há compilação, instalação de pacotes JavaScript nem serviço de backend próprio. A página solicita fontes do Google Fonts; na ausência de internet, o navegador pode usar fontes alternativas. Alguns recursos do navegador, como a área de transferência e o compartilhamento, dependem do contexto e das permissões.

**Requisitos recomendados:** navegador moderno com JavaScript habilitado, suporte a SVG e armazenamento de sessão. O áudio depende das permissões e configurações do dispositivo.

## Documentação

| Documento | Para quem | Conteúdo |
| --- | --- | --- |
| [Guia de uso](docs/GUIA-DE-USO.md) | Jogadores, professores e mediadores | Como jogar os dois modos e resolver dúvidas comuns |
| [Arquitetura](docs/ARQUITETURA.md) | Desenvolvedores | Organização dos arquivos, estados e fluxos principais |
| [Referência técnica](docs/REFERENCIA-TECNICA.md) | Desenvolvedores e revisores | Regras, números, armazenamento, testes e limitações |
| [Fundamentação educacional](docs/FUNDAMENTACAO.md) | Educadores e revisores | Objetivos de aprendizagem, CONAMA 275/2001, limites da simulação |
| [Guia de contribuição](docs/CONTRIBUINDO.md) | Colaboradores | Desenvolvimento, testes, relatos de problema e revisão |

A organização distingue **aprendizado**, **procedimentos**, **referência** e **explicação**, inspirada no [Diátaxis](https://diataxis.fr/), para que cada público encontre rapidamente a informação necessária.

## Estrutura resumida

```text
index.html                 Página inicial e estrutura das telas
solo-v2.js                 Regras, campanhas, loja e pontuação do Salve o Mundo
kids-game.js               Regras e telas da Missão Coleta
card-art.js                Desenhos vetoriais das cartas ambientais
hand-order.js              Reordenação visual da mão
victory-share.js           Certificado e compartilhamento da vitória final
game-v4.css                Estilos do Salve o Mundo
kids-game.css              Estilos da Missão Coleta
identity-v3.css            Identidade visual
mobile-v5.css              Ajustes para dispositivos móveis
landing-v6.css, landing-v7.css  Página inicial
tests/                     Testes automatizados
.github/workflows/test.yml Integração contínua
docs/                      Documentação detalhada
```

## Qualidade e testes

O projeto usa testes automatizados em **Node.js 22** no GitHub Actions. Eles cobrem combos, efeitos de coringas, progressão, ordenação de cartas, ilustrações e jogabilidade infantil, incluindo as duas etapas apenas com cores.

Para executar os testes na raiz do repositório:

```bash
node tests/card-art.test.cjs
node tests/kids-game.test.cjs
node tests/solo.test.cjs
node tests/decks.test.cjs
node tests/hand-order.test.cjs
```

O código de interface evita emojis e utiliza desenhos SVG e texto. O projeto inclui rótulos acessíveis em controles importantes, suporte a teclado e estilos responsivos; isso **não equivale a uma certificação de acessibilidade**. O comportamento deve continuar sendo avaliado em aparelhos reais.

## Estado e limitações

- O Salve o Mundo usa `sessionStorage` para tentar recuperar uma partida recarregada **na mesma aba**; isso não é uma conta nem uma sincronização entre dispositivos.
- A Missão Coleta não mantém um histórico de desempenho entre partidas.
- As metas das campanhas, o equilíbrio dos 50 coringas e a experiência em celulares precisam de testes contínuos com usuários.
- A classificação ambiental dos objetos é uma **simplificação didática**, não uma garantia de aceitação em cooperativas ou serviços municipais.
- O uso de marca institucional exibida no projeto deve ser validado com os responsáveis antes de aplicação em materiais oficiais.

## Identidade, referências e licença

O site utiliza a identificação **EcoResiduários Academy** e exibe uma marca do **Instituto Federal do Maranhão (IFMA)**. A presença dessas marcas na interface não comprova, por si só, vínculo institucional, endosso ou autorização de uso. Consulte os responsáveis pelo projeto antes de divulgar o jogo como iniciativa oficial.

- [EcoResiduários Academy no Instagram](https://www.instagram.com/ecoresiduariosacademy/)
- [Resolução CONAMA 275/2001 — padrão de cores](https://conama.mma.gov.br/images/conteudo/LivroConama.pdf)
- [Fundamentação ambiental e fontes](docs/FUNDAMENTACAO.md)

**Licença do código:** [MIT](LICENSE), conforme o arquivo do repositório. Para imagens, marcas de terceiros e materiais institucionais, respeite os direitos e as regras dos respectivos titulares.

**Ajuda e sugestões:** abra uma [issue no GitHub](https://github.com/yusei21/ecocard/issues). Para contribuir com código ou documentação, consulte o [guia de contribuição](docs/CONTRIBUINDO.md).
