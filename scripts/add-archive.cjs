const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'lib', 'archiePages.json');
if (!fs.existsSync(file)) process.exit(1);
const pages = JSON.parse(fs.readFileSync(file, 'utf8'));

pages.archive = {
  showInMenu: true,
  menuLabel: 'Archive',
  content: `h1: Archive

A broader selection from three decades of visual journalism, information design, art direction, storytelling, and experimental digital work.

The selected work on the home page is intentionally focused. This archive preserves the wider body of craft behind it.

{divisor}

{imagem}
  nome: malofiej.png
  tamanho: G
  classes: shadow-1
  tags: Information Design, Graphics, Art Direction
  borda: 10px
{}

h3: Malofiej distinctions

Five distinctions at Malofiej, the international information-design awards often described as the “Oscars of Infographics”.

{divisor}

{imagem}
  nome: rota_segura.jpg
  tamanho: G
  classes: var(--shadow-2)
  borda: 10px
  tags: Data Visualization, Interaction Design, Code, Storytelling
{}

h3: Rota +Segura — Safer Route

Data visualization turned into utility: an interactive map helping drivers identify safer routes in São Paulo using crime data filtered by time, vehicle type, and location.

<a class='sublinks' href='https://www.estadao.com.br/sao-paulo/rota-segura-ferramenta-permite-tracar-os-trajetos-com-menos-roubos-de-veiculos/' target='_blank'>View the project →</a>

{divisor}

h3: Tapuiassauro — From evidence to understanding

The reconstruction was not illustration added after the reporting. It turned fragments, measurements, and scientific inference into something readers could understand.

{tapuiScrolly}

{imagem}
  nome: tapuiassauro.png
  tamanho: M
  classes: shadow-1
  tags: Information Design, Art Direction, Graphics
{}

h3: Tapuiassauro — Malofiej Gold Medal

A visual reconstruction of a newly discovered Brazilian titanosaur, translating scientific evidence into an accessible visual narrative.

<a class='sublinks' href='https://www.estadao.com.br/infograficos/tapuiassauro-o-novo-dinossauro-do-brasil,ciencia,280832' target='_blank'>View the project →</a>

{divisor}

{imagem}
  nome: speeches.png
  tamanho: P
  classes: var(--multiply)
  tags: Data Visualization, Information Design, Storytelling
{}

h3: The Semantics of Power

Visual analysis of Brazilian presidential inaugural speeches after redemocratization, using vocabulary size and keyword frequency to reveal political shifts.

<a class='sublinks' href='https://www.estadao.com.br/infograficos/politica,graficos-mostram-temas-dos-discursos-de-posse-desde-volta-das-diretas,955154' target='_blank'>View the project →</a>

{divisor}

{imagem}
  nome: caro_leitor.png
  tamanho: GG
  classes: var(--multiply)
  tags: Editorial Design, UX/UI, Information Architecture
{}

h3: Caro Leitor & Supercoluna

A mobile-first daily briefing for political coverage, analysis, and opinion, designed for rapid scanning with links guiding readers through the day's essential stories.

{divisor}

{video}
  nome: green_hydrogen.mov
  tamanho: M
  tags: Motion, Art Direction, Storytelling
{}

h3: Economia Verde

A motion explainer on green hydrogen and Brazil's potential role in the transition to a low-carbon economy, part of a broader visual series on the green economy.

{divisor}

{imagem}
  nome: cronologia_copa.png
  tamanho: GG
  classes: var(--multiply)
  tags: Information Design, Editorial Design, Graphics
{}

h3: World Cup 2010 visual timeline

A five-page visual chronology of the 2010 World Cup that assembled into a 1.5-meter-wide panel. Finalist for the Esso Award.

{divisor}

{imagem}
  nome: favela_amazonia.png
  tamanho: G
  tags: Art Direction, Editorial Design, Storytelling
{}

h3: Favela Amazônia — Portrait of a New Forest

Winner of the Inter American Press Association (SIP) Award. A visual investigation into urbanization in the Amazon rainforest, balancing atmosphere, evidence, and complexity without sensationalism.

<a class='sublinks' href='https://infograficos.estadao.com.br/especiais/favela-amazonia/' target='_blank'>View the project →</a>

{divisor}

{imagem}
  nome: movimento_baterista.png
  tamanho: G
  tags: Art Direction, Editorial Design, Graphics
{}

h3: The Drummer's Movement

Complete art direction and layout for André Polvo's instructional methodology, translating rhythm and musical concepts into graphic notation and a coherent learning system.

{divisor}

h3: The wider body of work

These projects are not presented as contemporary product-design case studies. They document the visual craft, information design, experimentation, and systems thinking that shaped how I work today.

<a class='sublinks' href='/'>← Back to selected work</a>`
};

fs.writeFileSync(file, JSON.stringify(pages, null, 2) + '\n', 'utf8');
console.log('Added Archive page');
