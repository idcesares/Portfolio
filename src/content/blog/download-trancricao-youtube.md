---
title: Como fazer download de transcrições de vídeos do YouTube
publishDate: 2024-10-13 08:00:00
updatedDate: 2024-10-13 08:00:00
img: /assets/blog_imgs/youtube_round.webp
img_alt: Logotipo do YouTube
description: Artigo com snippet de código para baixar transcrições de vídeos do YouTube.
tags:
  - Python
  - YouTube
  - Transcrição
---

## Como Fazer Download de Transcrições de Vídeos do YouTube

Em um mundo imerso em vídeos online, a transcrição de conteúdo audiovisual é uma ferramenta poderosa para acessibilidade, SEO e análise de dados. No entanto, nem sempre é fácil obter essas transcrições, especialmente de vídeos do YouTube. Neste artigo, vou mostrar como você pode baixar transcrições de vídeos do YouTube usando Python de uma forma simples e eficiente. A ideia é que esse processo também possa ser automatizado para os mais diversos fins, inclusive para análise de dados e sumarização de conteúdo utilizando técnicas de Inteligência Artificial.

## Ferramentas e Bibliotecas Necessárias

Para extrair transcrições de vídeos do YouTube, vamos utilizar a biblioteca `youtube-transcript-api`. Ela permite a obtenção de legendas diretamente dos vídeos, o que torna o processo muito mais acessível, especialmente para vídeos que já possuem legendas geradas automaticamente.

### Instalando a Biblioteca

Para começar, você precisa instalar a biblioteca `youtube-transcript-api`. Podemos fazer isso de maneira muito simples utilizando o comando abaixo:

```python
!pip install youtube-transcript-api
```

Com essa biblioteca instalada, estamos prontos para começar a extrair as transcrições.

## Código para Extrair a Transcrição

O próximo passo é escrever um script que possa fazer o download da transcrição de um vídeo do YouTube. Vou compartilhar um trecho de código que possibilita essa tarefa de forma fácil e prática.

### Extraindo o ID do Vídeo e Buscando a Transcrição

Primeiro, precisamos de uma função para extrair o ID do vídeo a partir de uma URL do YouTube e depois outra função para buscar a transcrição. Aqui está um exemplo de como isso pode ser feito:

```python
from youtube_transcript_api import YouTubeTranscriptApi
import re

def extract_video_id(url):
    # Este padrão regex extrai o ID do vídeo de uma URL típica do YouTube.
    pattern = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(pattern, url)
    return match.group(1) if match else None

def fetch_transcript(video_id, language='pt'):
    try:
        # Busca a transcrição na linguagem especificada
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[language])
        return transcript
    except Exception as e:
        print(f"Erro ao buscar transcrição: {e}")
        return None
```

### Salvando a Transcrição em um Arquivo

Depois de obter a transcrição, é útil salvá-la em um arquivo para uso futuro. Podemos fazer isso com a seguinte função:

```python
def save_transcript_to_file(transcript, file_name='transcript.txt'):
    with open(file_name, 'w', encoding='utf-8') as f:
        for entry in transcript:
            start_time = entry['start']
            text = entry['text']
            f.write(f"{start_time:.2f}: {text}\n")
```

Essa função percorre cada entrada da transcrição e salva o tempo de início e o texto correspondente em um arquivo.

### Automatizando o Processo

Podemos criar uma função principal que integra todos os passos anteriores, permitindo que o usuário simplesmente forneça a URL do vídeo e o idioma desejado:

```python
def export_youtube_transcript(url, language='pt', file_name='transcript.txt'):
    video_id = extract_video_id(url)
    if not video_id:
        print("URL do YouTube inválida.")
        return

    transcript = fetch_transcript(video_id, language)
    if transcript:
        save_transcript_to_file(transcript, file_name)
        print(f"Transcrição salva em {file_name}")
    else:
        print("Nenhuma transcrição disponível ou falha ao buscar.")

youtube_url = input("Digite a URL do vídeo do YouTube: ")
export_youtube_transcript(youtube_url)
```

## Conclusão

Este script permite que você baixe transcrições de vídeos do YouTube de forma prática e automatizada. Isso é extremamente útil para criar datasets, realizar análises textuais, ou simplesmente arquivar o conteúdo de vídeos de interesse. Essa técnica pode ser estendida para aplicar modelos de análise de sentimentos, sumarização de conteúdo ou até para a criação de legendas em outros idiomas, tornando o processo bastante poderoso para aplicações em Inteligência Artificial.

Para testar este script diretamente no Google Colab, acesse o link abaixo e comece a experimentar:

<a href="https://colab.research.google.com/drive/1ISt8Tmq_Dk-PUPSNRbRDS4GaLe2GKMQM?usp=sharing" target="_blank" class="button-post">Google Colab: Download de Transcrições do YouTube</a>