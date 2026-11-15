# Como contribuir com o EcoCard

[Voltar ao README](../README.md) | [Arquitetura](ARQUITETURA.md) | [Referência](REFERENCIA-TECNICA.md)

Contribuições que melhorem a correção das regras, a educação ambiental, a responsividade, a acessibilidade e a documentação são bem-vindas para avaliação pelos responsáveis do repositório. O envio de uma proposta não garante sua aceitação.

## Antes de começar

Leia o [README](../README.md), o [guia de uso](GUIA-DE-USO.md) e a [arquitetura](ARQUITETURA.md). Confira as [issues existentes](https://github.com/yusei21/ecocard/issues) para evitar propostas duplicadas.

Para relatar um erro, abra uma issue com:

- **O que aconteceu:** comportamento observado.
- **O que era esperado:** comportamento pretendido.
- **Como reproduzir:** passos, modo de jogo, campanha, crise ou etapa.
- **Ambiente:** navegador, sistema operacional e tipo de dispositivo.
- **Evidências:** capturas de tela, quando úteis, sem divulgar dados pessoais de terceiros.

No caso de feedback coletado com crianças, evite publicar nomes, fotos ou informações pessoais sem autorização adequada.

## Preparar o ambiente

É possível jogar com um servidor estático. Para modificar e testar o projeto, tenha Git, um editor de código e Node.js (a integração contínua utiliza a versão 22).

```bash
git clone https://github.com/yusei21/ecocard.git
cd ecocard
python3 -m http.server 8000
```

Abra `http://localhost:8000`. O EcoCard não exige `npm install` nem uma etapa de build para funcionar.

## Propor uma alteração

1. Crie uma branch com nome descritivo.
2. Faça alterações pequenas, preferencialmente limitadas a uma funcionalidade ou correção.
3. Adicione ou atualize testes conforme a regra alterada.
4. Atualize a documentação se houver mudança visível, novo comportamento ou alteração de requisito.
5. Execute os testes localmente.
6. Abra um pull request explicando o problema, a solução, o impacto nos dois modos e os testes realizados.

### Validar sintaxe

```bash
node --check card-art.js
node --check kids-game.js
node --check solo-v2.js
node --check victory-share.js
```

### Executar testes

```bash
node tests/card-art.test.cjs
node tests/kids-game.test.cjs
node tests/solo.test.cjs
node tests/decks.test.cjs
node tests/hand-order.test.cjs
```

O fluxo `.github/workflows/test.yml` executa verificações no GitHub Actions em atualizações da branch `main` e em pull requests.

## Padrões do projeto

**Idioma:** textos de interface e documentação em português brasileiro, preferencialmente claros e adequados ao público.

**Sem emojis:** o projeto utiliza ilustrações vetoriais SVG, CSS e texto. Não introduza caracteres emoji em interfaces ou arquivos do repositório.

**Acessibilidade:** mantenha botões acionáveis por teclado, rótulos compreensíveis, estados de seleção e contraste legível. Não use apenas a cor para explicar uma regra, exceto no desafio final intencional da Missão Coleta, que deve preservar alternativas acessíveis apropriadas.

**Educação ambiental:** mudanças em exemplos de descarte devem distinguir corretamente o material do objeto e suas limitações no mundo real. Inclua fontes confiáveis ao alterar afirmações normativas ou técnicas.

**Integridade da jogabilidade:** verifique que coringas e regras de chefes não pontuem em mãos inválidas, que mudanças de baralho não criem identificadores duplicados e que alterações na Missão Coleta mantenham suas cinco etapas e a possibilidade de refazer respostas incorretas.

**Compatibilidade móvel:** teste larguras pequenas, textos longos, campos de toque e disposição das cartas e lixeiras. Prefira descrições do resultado esperado a alegações de teste em dispositivos que não foram efetivamente usados.

## Licenciamento e marcas

O código está sob a **licença MIT**, conforme `LICENSE`. Contribuições de código devem ser compatíveis com essa licença. Não inclua fontes tipográficas, fotografias, logotipos ou outros ativos de terceiros sem direito de uso. O nome, a marca e as atribuições institucionais devem ser confirmados com os responsáveis antes de divulgação oficial.

## Qualidade da documentação

Estruture textos conforme a necessidade do leitor:

- **Tutorial:** aprender a jogar pela primeira vez.
- **Procedimento:** cumprir uma tarefa específica.
- **Referência:** consultar números, regras e funções.
- **Explicação:** entender decisões de design, arquitetura e limites pedagógicos.

Essa divisão segue o modelo [Diátaxis](https://diataxis.fr/) e as recomendações do [GitHub](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) para READMEs claros e fáceis de navegar.
