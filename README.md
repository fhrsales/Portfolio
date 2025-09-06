<div align="center">

# Portfolio Dinâmico (SvelteKit)

<a href="https://github.com/fhrsales/portfolio/actions/workflows/tests.yml"><img alt="Tests" src="https://github.com/fhrsales/portfolio/actions/workflows/tests.yml/badge.svg?branch=main"></a>

Motor de páginas com conteúdo estruturado + blocos customizados de mídia (imagem / vídeo), filtragem por tags inline e carregamento otimizado.

</div>

## ✨ Visão Geral

Este projeto implementa um renderer de conteúdo baseado em um arquivo consolidado (`static/archiePages.json`) contendo páginas em formato ArchieML / texto estruturado. O componente central `ArchieRenderer.svelte` interpreta blocos, resolve mídia, injeta seletor de tags e aplica filtros somente nos blocos posteriores ao seletor.

Principais recursos:

- Sintaxe híbrida (linhas simples + blocos multilinha `{imagem} ... {}` e `{video} ... {}`)
- Lazy load real para imagens e vídeos (IntersectionObserver + prefetch antecipado)
- Heurísticas para vídeo: preview estático / clique para iniciar / seleção de fonte conforme rede (`navigator.connection` quando disponível)
- Tagging flexível: trailing `tags:` ou dentro do bloco `{imagem}` / `{video}`
- `TagSelector` inline: só filtra blocos após seu aparecimento
- Fallback acessível: trilha `<track kind="captions">` sempre presente (placeholder) evitando warnings
- Animações suaves de fade e atraso decorativo pós-carregamento de imagens
- Editor administrativo (rota `/admin/editor/`) para alterar conteúdo (usa cópia do JSON na fase de build)
- Build step custom: script `copy-archiePages.cjs` garante que o JSON em `static/` seja copiado para `src/lib/` antes do bundle

## 🗂 Estrutura Essencial

```
copy-archiePages.cjs        Script pré-build
package.json                Scripts e deps
vite.config.js              Config Vite + SvelteKit
static/archiePages.json     Fonte principal de conteúdo (origem)
src/lib/archiePages.json    Cópia usada em runtime (gerada no build)
src/lib/components/         Componentes (ImageBlock, VideoBlock, TagSelector, etc.)
src/lib/stores              Store `archiePages` (não exibido aqui mas referenciado)
src/routes/                 Páginas + admin/editor
```

## 🧱 Sintaxe de Conteúdo

Formato suportado mistura linhas simples separadas por linhas em branco e blocos estruturados.

### Linhas Diretas

```
titulo: Meu Título
embedWrapper: https://...
pdf: documento.pdf
imagem: foto.jpg, M, legenda da foto, classe-extra shadow-lg
video: clipe.mp4, G, legenda do vídeo, destaque
tags: urbano, noite
```

### Blocos Multilinha `{imagem}`

```
{imagem}
nome: foto.jpg
tamanho: G
legenda: Foto grande exemplo
classes: shadow-xl borda-arredondada
radius: 24px
tags: destaque, capa
{}
```

### Blocos Multilinha `{video}`

```
{video}
nome: clipe.mp4
legenda: Video teaser
classes: widescreen
radius: 12px
tags: teaser, destaque
sources: clipe-720.mp4, clipe-480.mp4
{}
```

Observações:

- `tags:` fora de blocos (linha isolada) anexa tags ao último e penúltimo bloco já acumulados (facilita agrupamento lógico)
- Dentro de blocos `{imagem}` / `{video}` a linha `tags:` é parseada diretamente
- Tokens ambíguos em `imagem:` (versão linha) viram ao mesmo tempo classes e tags (ex: `capa`, `destaque`)

### Inserção do Seletor de Tags

Três formas equivalentes:

```
tagSelector
tagSelector: ["capa","destaque"]
<tagSelector />
```

Após o seletor, somente blocos cujas tags incluem a tag selecionada permanecem visíveis; antes dele nada é filtrado.

## 🖼 ImageBlock

Props principais: `src`, `size (P|PP|M|G|GG)`, `caption`, `classes`, `radius`, `tags`, `multiply`.
Fluxo: placeholder → prefetch antecipado → fade-in + aplicação de classes decorativas post-load.

## 🎬 VideoBlock

Características:

- Preview (imagem ou frame inicial) envolto em `<button>` acessível
- Carregamento diferido só quando visível
- Lista de `sources` opcional; heurística escolhe melhor (ex.: prioriza menor bitrate em redes lentas)
- Autoplay condicional somente se interação ou política permitir
- `track kind="captions"` sempre presente (placeholder para evitar warning – substitua por arquivo `.vtt` real p/ acessibilidade completa)

## 🔍 TagSelector

- `bind:selected` atualiza `localSelectedTag`
- Lista de tags pode vir inline (JSON) ou derivada dinamicamente dos blocos subsequentes
- Filtro é case-insensitive

## ♿ Acessibilidade

- Botões reais para interações (não rely somente em `<div>`)
- `<track>` placeholder garante ausência de warning; recomendar substituir por conteúdo real posteriormente
- `aria-label` em elementos de controle de vídeo quando aplicável
- Modal / diálogos (no editor) usam `role="dialog"` + `aria-modal="true"`

## ⚙️ Build & Execução

Scripts:

```
npm run dev        # Desenvolvimento (Vite + SvelteKit)
npm run build      # Executa copy-archiePages.cjs e depois build Vite
npm run preview    # Servir build gerado
npm run format     # Prettier
npm run lint       # Prettier check + ESLint
npm test:unit      # Vitest
```

Passo especial: `copy-archiePages.cjs` copia `static/archiePages.json` para `src/lib/archiePages.json` garantindo que importações estáticas funcionem no bundle.

## ➕ Adicionando Conteúdo

1. Edite `static/archiePages.json` (ou use o editor admin se implementado com persistência)
2. Use blocos conforme sintaxe acima
3. Rode `npm run build` ou `npm run dev` (o script de cópia roda somente no build – para dev você pode importar diretamente do `static/` ou replicar o script num hook se desejar)

## 🗃 Estrutura do JSON

Cada chave representa um slug de página. Exemplo simplificado:

```jsonc
{
	"index": "titulo: Página Inicial\n\n{imagem}\nnome: capa.jpg\nlegenda: Capa principal\ntags: destaque,capa\n{}\n\n<tagSelector />\n\nimagem: exemplo.jpg, M, Uma imagem, destaque\n"
}
```

## 🧪 Testes

- Framework: Vitest com dois projetos:
  - `server` (Node): testes de utilitários/parsers.
  - `client` (DOM): ambiente `happy-dom` (sem navegador real).
- Comandos rápidos:
  - `npm run test:server` — executa testes Node.
  - `npm run test:client` — executa testes DOM.
  - `npm run test:unit` — executa configuração padrão do Vitest.
- Observações:
  - Em alguns ambientes isolados, o Vitest pode exibir um aviso “EPERM kill” ao encerrar; os testes ainda são executados.
  - Pré‑requisitos: Node 18+, dependências dev instaladas (`npm ci`).

### CI (GitHub Actions)

- Este repositório inclui um workflow `tests.yml` que roda em `push`/`pull_request`:
  - Instala dependências com `npm ci`.
  - Roda `npm run lint`.
  - Roda `npm run test:server` e `npm run test:client`.
  - Ajuste a versão de Node no YAML conforme necessário.

## 🚀 Deploy

- O build atual usa Vite + plugin SvelteKit. Ajuste `svelte.config.js` (se existente) para trocar/adicionar adapter (ex: `adapter-static` ou `adapter-node`).
- Verifique se `static/` está incluído no artefato (necessário para origem do JSON).

## 🐛 Troubleshooting

| Sintoma                                    | Possível Causa                      | Ação                                         |
| ------------------------------------------ | ----------------------------------- | -------------------------------------------- |
| Página mostra "Nenhum conteúdo encontrado" | Slug não existe no JSON             | Confirmar chave em `archiePages.json`        |
| Imagem não carrega                         | Caminho incorreto / arquivo ausente | Confirmar `static/imgs/<arquivo>`            |
| Vídeo não inicia autoplay                  | Política do navegador               | Interação manual ou remover autoplay forçado |
| Tags não filtram                           | Seletor antes dos blocos            | Mover `tagSelector` para posição desejada    |

## 📌 Próximos Passos Possíveis

- Implementar armazenamento real no editor (persistir alterações no JSON)
- Substituir trilha de captions placeholder por arquivos `.vtt`
- Otimizar geração de thumbnails de vídeo
- Cache inteligente (Service Worker) para imagens comuns

---

Qualquer dúvida sobre expansão ou ajuste estrutural, abra uma issue ou siga iterando no componente `ArchieRenderer`.
