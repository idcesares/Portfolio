---
title: Queimadas no Pantanal - uma análise exploratória dos últimos 10 anos
publishDate: 2022-12-20 00:00:00
img: https://github.com/idcesares/DS_queimadas_pantanal/blob/main/imgs/Queimadas%20no%20Pantanal%20uma%20an%C3%A1lise%20explorat%C3%B3ria%20dos%20%C3%BAltimos%2010%20anos.png?raw=true
img_alt: Imagem de capa de um incêndio no Pantanal.
description: Queimadas no Pantanal - uma análise exploratória da última década
tags:
  - Ciência de Dados
  - Análise Exploratória
  - Experimentos
---

<a href="https://github.com/idcesares/Experimentos-de-IA" target="_blank" class="button-post">Acesso o repositório no GitHub</a>

Este repositório tem como objetivo armazenar e organizar os códigos utilizados para a geração dos relatórios, visualizações e proveniências utilizados no artigo Queimadas no Pantanal: uma análise exploratória dos últimos 10 anos produzido na disciplina de Fundamentos de Ciência de Dados do PPGI-UFRJ. O artigo pode ser acessado [aqui](Artigo_Queimadas_Pantanal.pdf) e o arquivo da apresentação [aqui](apresentação.pdf).

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.7113721.svg)](https://doi.org/10.5281/zenodo.7113721)

## Estrutura do repositório
O repositório está organizado da seguinte forma:
- `Artigo_Queimadas_Pantanal.pdf`: arquivo do artigo produzido na disciplina de Fundamentos de Ciência de Dados do PPGI-UFRJ.
- `apresentação.pdf`: arquivo da apresentação produzida na disciplina de Fundamentos de Ciência de Dados do PPGI-UFRJ.
- `Data_Lasa_12_21`: contém os dados utilizados para a análise.
- `Data_Results`: contém os dados gerados a partir da análise. Foram gerados 3 arquivos:
  - `queimadas_pantanal_2012_2021_csv.zip`: arquivo zip contendo os dados em formato csv.
  - `queimadas_pantanal_2012_2021_geojson.zip`: arquivo zip contendo os dados em formato geojson.
- `imgs`: contém as imagens utilizadas no README.md.
- `Data_RPPN`: contém os dados utilizados de geometria das RRPN do Sesc para a análise.
- `Model_Result`: contém o modelo preditivo gerado.
- `Dashboard.py`: contém os códigos utilizados para a geração do dashboard dinâmico.
- `exploratory_data_analysis.ipynb`: contém os códigos utilizados para a análise exploratória dos dados de queimadas do LASA no Pantanal.
- `LICENSE`: contém a licença do repositório.
- `README.md`: contém a descrição do repositório.
- `requirements.txt`: contém as dependências utilizadas no projeto exportadas para arquivo txt.
- `environment.yml`: contém as dependências utilizadas no projeto exportadas para arquivo yml.
- `prov_generator.ipynb`: contém o script utilizado para a geração das proveniências dos dados.

## Ambientes de desenvolvimento

### Anaconda
Para executar os códigos do projeto, é necessário instalar as dependências contidas no arquivo `requirements.txt` ou `environment.yml`. Foi utilizado o [Anaconda](https://www.anaconda.com/products/distribution) para a criação do ambiente de desenvolvimento do projeto. Para instalar as dependências, basta executar o seguinte comando no terminal:
```bash
conda env create -f environment.yml
```

### Docker
É possível também utilizar oo arquivo `Dockerfile` para a criação de um container com as dependências necessárias para a execução do projeto. Para isso, basta executar o seguinte comando no terminal:
```bash
docker build -t queimadas_pantanal .
```
Após a criação do container, basta executar o seguinte comando para executar o container:
```bash
docker run -it -p 8888:8888 queimadas_pantanal
```
Após a execução do comando, será exibido um link no terminal. Basta copiar o link e colar no navegador para acessar o Jupyter Notebook.

## Execução
Para executar os códigos do projeto , utilize um Jupyter notebook ou o Google Colab. 

### Docker
Para executar os códigos do projeto utilizando o Docker, basta executar o seguinte comando no terminal:
```bash
docker run -it -p 8888:8888 queimadas_pantanal
```

### Jupyter notebook:
```bash
jupyter notebook
```
### Google Colab:
Para executar os códigos no google colab, basta clicar no botão abaixo:
[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/charlespimentel/DS_queimadas_pantanal/blob/main/exploratory_data_analysis.ipynb)

### Dashboard dinâmico
Para executar o dashboard, basta executar o arquivo `dynamic-dashboard.py` no terminal:
```bash
streamlit Dashboard.py
```
É necessário exportar  o arquivo `queimadas_pantanal_2012_2021_geojson.zip` para o diretório `Data_Results` para que o dashboard funcione corretamente.