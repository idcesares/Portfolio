---
title: "ReFi: transformando finanças para um futuro sustentável"
publishDate: 2026-03-26 19:00:00
updatedDate: 2026-03-26 19:00:00
img: /assets/blog_imgs/refi-ufrj-capa.jpg
img_alt: Cartaz da palestra ReFi apresentada na Semana da Computação da UFRJ em março de 2026
description: Relato da palestra na 8ª Semana da Computação da UFRJ sobre greenwashing, blockchain e finanças regenerativas como infraestrutura de confiança.
tags:
  - ReFi
  - Blockchain
  - UFRJ
  - Sustentabilidade
  - Greenwashing
  - Finanças Regenerativas
---

# Dá para confiar quando uma empresa diz que está ajudando o planeta?

*Relato e reflexões sobre minha palestra na 8ª Semana da Computação da UFRJ, onde falei sobre greenwashing, blockchain e finanças regenerativas.*

![Cartaz da palestra ReFi: Transformando Finanças para um Futuro Sustentável na Semana da Computação da UFRJ](/assets/blog_imgs/refi-ufrj-capa.jpg)
*Cartaz da palestra apresentada na 8ª Semana da Computação da UFRJ, em março de 2026.*

Comecei a minha palestra na 8ª Semana da Computação da UFRJ com essa pergunta. Esse tema vem me provocando nos últimos tempos e a minha pesquisa tem se aprofundado cada vez mais nesse assunto. A resposta para essa pergunta não é simples e depende de múltiplos fatores e atores. É um problema que envolve confiança, transparência, responsabilidade e ética. Mas como medir, rastrear, verificar e validar as ações socioambientais das empresas? E como garantir que essas ações sejam realmente eficazes e não apenas uma estratégia de marketing ou um discurso vazio?

Nesse texto eu quero compartilhar o que apresentei, expandir alguns pontos que o tempo da palestra não permitiu aprofundar e deixar registrado o raciocínio por trás de tudo isso para quem não estava lá.

## O ponto de partida: o que você vê no app

Eu comecei mostrando algo que todo mundo já viu e quase ninguém para pra pensar. Quando você abre o Uber e seleciona o Uber Planet, aparece uma mensagem dizendo que parte da tarifa vai compensar a pegada de carbono da sua corrida. Quando você compra uma passagem na GOL, tem ali a opção de "Compensação de Carbono" no checkout. A Natura estampa "carbono neutro" nas embalagens. Esses selos e mensagens estão por toda parte.

A minha primeira pergunta para a turma foi: vocês sabem o que isso significa na prática? Quem está de fato plantando essas árvores? Quem verifica se elas foram plantadas? Quem garante que o dinheiro chegou onde deveria?

A segunda pergunta foi mais incômoda: e se eu te disser que algumas dessas promessas não se sustentam?

## O problema tem nome: greenwashing

Greenwashing é quando uma empresa projeta uma imagem de responsabilidade ambiental que não corresponde às suas práticas reais. É, numa analogia direta, uma "lavagem verde": assim como a lavagem de dinheiro torna recursos ilícitos aparentemente legítimos, o greenwashing torna práticas ambientalmente questionáveis aparentemente sustentáveis.

E não estou falando de casos obscuros. Em 2024, casos de greenwashing de alta gravidade cresceram mais de 30% no mundo. Em 2025, incidentes ligados à biodiversidade triplicaram. A gestora de ativos DWS (subsidiária do Deutsche Bank) levou uma multa de EUR25 milhões por inflar suas credenciais ESG. A Shein foi multada em EUR1 milhão na Itália por mensagens ambientais enganosas. O HSBC saiu da aliança global de bancos net-zero citando preocupações com a própria exposição ao greenwashing.

Mais perto de casa: o Idec entrou com ação contra a GOL por comercializar ativos digitais no programa "Meu Voo Compensa" no lugar de créditos reais de carbono. E uma investigação revelou que Uber e Audi compraram créditos de carbono de uma fazenda no Pará onde foram encontrados trabalhadores em condições análogas à escravidão.

Quando mostrei essas manchetes na palestra, deu pra sentir o silêncio na sala.

## ESG e a cadeia de confiança que já nasce comprometida

Para entender por que o greenwashing persiste, precisa entender como funciona a cadeia de prestação de contas hoje.

Empresas publicam relatórios ESG (Environmental, Social, Governance) detalhando suas iniciativas ambientais e sociais. Esses relatórios são auditados por empresas contratadas e pagas pela própria empresa auditada. As informações alimentam ratings de agências especializadas que usam metodologias diferentes entre si. E o público final, que é quem deveria se beneficiar da transparência, não tem acesso direto às evidências.

Em cada elo dessa cadeia existe um conflito de interesse ou uma limitação de acesso. A empresa conta a própria história. O auditor tem incentivo para manter o cliente. As agências de rating discordam entre si sobre a mesma empresa. E uma pesquisa publicada na *Finance Research Letters* em 2025 mostrou algo particularmente revelador: empresas com altos scores ESG têm correlação positiva com acusações de greenwashing. Ou seja, quem mais se vende como verde é frequentemente quem mais infla os números.

Isso não é um problema de má fé individual. É um problema estrutural de como a verificação é organizada.

## Tecnologia com intencionalidade

Tecnologia não é uma solução mágica para esse cenário, mas pode muito bem ser uma ferramenta que apoie esse processo e, principalmente, dê garantias para todos os envolvidos e para a sociedade como um todo, já que, se eu declaro que causo um impacto positivo por uma ação, isso deveria ser algo completamente transparente e verificável de ponta a ponta. É nesse momento que a gente remove o hype e adiciona intencionalidade no uso da tecnologia.

Na palestra, antes de falar de qualquer solução, eu fiz os estudantes identificarem as propriedades que uma infraestrutura de verificação precisaria ter: transparência, para que qualquer pessoa possa auditar; imutabilidade, para que registros não sejam alterados retroativamente; descentralização, para que nenhuma entidade única controle o que é verdade; e programabilidade, para que regras sejam executadas automaticamente, sem intervenção humana.

Aí perguntei: conhecem alguma tecnologia que tem essas quatro propriedades?

## Blockchain sem o hype

Blockchain, quando a gente tira a camada de especulação e buzz, é fundamentalmente uma infraestrutura de confiança. Um registro distribuído onde ninguém precisa confiar em ninguém porque todos podem verificar.

Esse foi um dos momentos que mais curti na palestra. Eu desenvolvi um simulador chamado **BlockSim** que permite experimentar blockchain na prática, em três modos:

- No primeiro modo, mineração automática, o sistema adiciona blocos sozinho. Serve para entender a estrutura básica: blocos, hashes e encadeamento.
- No segundo, Proof of Work, os participantes precisam resolver um desafio computacional para minerar um bloco. Serve para entender por que isso consome energia e como garante segurança.
- No terceiro, Proof of Stake, os participantes "apostam" tokens para ter o direito de validar o próximo bloco. Serve para entender o mecanismo alternativo que o Ethereum adotou no The Merge em 2022, reduzindo seu consumo de energia em aproximadamente 99,9%.

Os estudantes acessaram o BlockSim nos seus celulares e rodaram as três simulações. Foi o ponto da palestra em que mais gente tirou o celular do bolso, e dessa vez não era pra ver notificação.

![Isaac D'Césares apresentando o BlockSim durante a 8ª Semana da Computação da UFRJ](/assets/blog_imgs/refi-ufrj-palestra.jpg)
*Demonstração do BlockSim durante a palestra na Semana da Computação da UFRJ.*

## E o que ReFi tem a ver com isso?

Aí entra o **ReFi**. Finanças Regenerativas é o uso de blockchain e mecanismos descentralizados para criar estruturas onde o dinheiro destinado a regenerar ecossistemas só é liberado quando o impacto é verificado. Sem intermediário, sem confiança cega e com evidência pública.

A ideia é simples de explicar e difícil de implementar: ao invés de confiar em relatórios autodeclarados, registrar declarações de impacto em blockchain, verificá-las com dados independentes (satélite, sensores, avaliadores) e só então liberar o financiamento automaticamente via smart contract.

Já existem projetos operando nesse ecossistema. O Toucan Protocol transforma créditos de carbono certificados em tokens na blockchain Polygon. O Hypercerts cria certificados de impacto verificáveis como tokens ERC-1155. O GainForest usa inteligência artificial e dados de satélite para monitorar reflorestamento e pagar comunidades automaticamente. Aqui no Brasil, a Ambipar lançou o token AMBI em parceria com a B3, atrelado a créditos de carbono REDD+. A Ekonavi mapeia iniciativas regenerativas brasileiras conectando projetos ambientais com ferramentas Web3.

Esses projetos são produtos funcionando no mundo real. Mas nenhum deles formalizou uma arquitetura de referência para o que eu chamo de "settlement layer", a camada que efetivamente conecta impacto verificado com liberação de recursos. É exatamente aí que entra a minha pesquisa.

## Claim -> Verify -> Settle

Minha pesquisa de mestrado no PPGI/UFRJ, orientada pela Profa. Maria Luiza Campos e pelo Prof. Sérgio Serra da Cruz, busca formalizar uma arquitetura de referência para liquidação de impacto verificado. Na prática, é um pipeline de três atos:

O primeiro ato é o **Claim**. Uma comunidade de conservação cria um Hypercert (um token ERC-1155) declarando o impacto realizado. Por exemplo: "Plantamos 500 árvores em 10 hectares neste trimestre." É como emitir uma nota fiscal do impacto ambiental.

O segundo é o **Verify**. Um avaliador independente, ou um oráculo automatizado usando dados de satélite, cria uma attestation no EAS (Ethereum Attestation Service), validando a declaração contra evidências armazenadas em IPFS. É um carimbo digital de "confere" que qualquer pessoa pode verificar.

O terceiro é o **Settle**. Um smart contract escrow lê a attestation, verifica se os critérios do milestone foram cumpridos e libera automaticamente a tranche de financiamento. Sem intermediário humano. É como um caixa eletrônico que só libera o dinheiro quando o recibo é validado automaticamente.

O terceiro ato é a contribuição original da dissertação: a formalização da interface de smart contract que consome claims verificados e dispara liberação financeira programável. A prova de conceito aplica esse pipeline ao financiamento milestone-based de reflorestamento na Amazônia brasileira, alinhado ao ODS 15.

Essa pesquisa evolui do meu projeto anterior, o LearnChain, que tratava de tokenização de ativos educacionais. A arquitetura de quatro camadas, a metodologia DSR e boa parte da infraestrutura se mantêm, com cerca de 80% de reaproveitamento. O que muda é o domínio e a urgência: verificação de impacto climático é um problema com financiamento real e demanda documentada.

## O que ficou

Apresentar isso na Semana da Computação foi especial. Alunos de computação entendem o que significa um smart contract que executa sozinho quando as condições são atendidas. Entendem o que é um hash. Entendem por que imutabilidade importa. O desafio era mostrar que essas ferramentas que eles já conhecem, ou estão aprendendo, podem endereçar problemas reais que vão muito além de cripto e especulação.

Pelos comentários e perguntas que recebi depois, acho que essa ficha caiu pra vários. E isso me anima.

Parabéns aos estudantes que protagonizaram o desenvolvimento desse evento e a todos que participaram. A pesquisa se constrói em comunidade e é inspirador ver o engajamento de vocês.

A pesquisa segue. Se você se interessa pelo cruzamento entre tecnologia, sustentabilidade e verificação de impacto, vamos conversar.