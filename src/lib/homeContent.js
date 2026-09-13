const homeContent = `{intro}
  fundo_1: color-mix(in srgb, var(--color-primary) 55%, transparent)
  altura_1:
  texto_1: Hi, I'm <strong>Fabio Sales</strong>, a <strong>Design Leader</strong> & <strong>Product Builder</strong> turning complex systems into experiences people can understand and use.
  fundo_2: var(--color-secondary)
  altura_2: 100vh
  texto_2: I design systems that make complex things easier to <strong>understand, use, and scale.</strong> Across design, product, technology, and business.
{}

h3: Selected Product & Design Work

Different problems. Different systems. The same principle: <strong>understand the complexity deeply enough to make the experience feel simple.</strong>

{.bloco}
{imagem}
  nome: germanico.png
  tamanho: M 
  tags: Art Direction, Design, Project Management
{}

chapeu: Estadão
h4: Redesigning a System at Scale

<bullet texto='Design Leadership' cor='var(--color-secondary)' /> A high-frequency information product, a multidisciplinary organization, and a visual system balancing editorial expression, production constraints, and business goals.

<bullet texto='My Role' cor='var(--color-secondary)' /> I led the <a href="https://www.estadao.com.br/infograficos/economia,multiplataforma-estadao-renova-e-aprimora-sua-versao-impressa,1199439?srsltid=AfmBOormT2t7Om421rKL3coAJ6rDGkuekNsMJBuO99BxeLVj6DLQAkkT" target="_blank">redesign strategy</a> across editorial, product, production, and commercial requirements.

<bullet texto='Impact' cor='var(--color-success)' /> The new system supported operational optimization and a new advertising strategy, contributing to an estimated <strong>R$7 million increase in EBITDA</strong> (2022).

<a class='sublinks' href='/estadao'>Read the full design case study →</a>

<a class='sublinks' href='https://fhrsales.github.io/design-system-estadao/' target='_blank'>Explore the redesign case study & design system →</a><br><a class='sublinks' href='/manual' target='_blank'>Explore the interactive & multimedia UI components →</a><br><a class='sublinks' href='/pdfs/estadao_ca.pdf' target='_blank'>Read the strategic business case: Board approval →</a><br><a class='sublinks' href='/pdfs/estadao_comercial.pdf' target='_blank'>Advertising strategy & monetization impact →</a>

{}

{divisor}

{scrollerVideo}
  video: atbl-scrolly.mp4
  video-mobile: atbl-scrolly-mobile.mp4
  video-desktop: atbl-scrolly.mp4
  tamanho: G
  fixar: nao
  proporcao: 16 / 9
  fit: contain
  fps: 24
  guia: nao
  vinheta: nao
  preload: auto
{}

chapeu: ATBL
h4: Turning Enterprise Complexity into a Usable Product

Pricing, inventory, taxes, approvals, technical specifications, and ERP rules sit behind everyday commercial decisions.

I turned that operational complexity into digital products people could actually use.

<bullet texto='Product + Engineering' cor='var(--color-secondary)' /> I designed the experience, defined the product logic, and built software connecting interfaces to real business data.

<a class='sublinks' href='/atbl'>Read the full product design case study →</a>

{divisor}

{bloco}
{imagem}
  nome: newsletters/saiba-agora.jpg
  tamanho: P
  classes: shadow-2
  tags: Product Strategy, UX/UI, Data Analysis
{}

chapeu: Personalized newsletters
h4: Testing Relevance at Scale

Could personalization make a daily news briefing more relevant?

<bullet texto='Experiment' cor='var(--color-secondary)' /> We tested two recommendation systems across ten audience clusters against an editorial control group.

<bullet texto='Learning' cor='var(--color-secondary)' /> Overall click-through was similar. The real signal was in understanding which audiences responded to personalization — and what a longer experiment would need to prove.

<a class='sublinks' href='/newsletters'>Read the personalization case study →</a>

{}

{divisor}

{imagem}
  nome: blue/tela02.png
  tamanho: M
  classes:
  tags: Product Design, UX/UI, Interaction Design
{}

chapeu: Blue
h4: Designing for a New Interaction Model

In 2010, tablets introduced a new question: what happens to information when touch replaces the mouse?

<bullet texto='Interaction' cor='var(--color-secondary)' /> Blue explored financial news as a continuous, gesture-driven stream — not a website squeezed onto a smaller screen.

<bullet texto='Product Thinking' cor='var(--color-secondary)' /> An R&D prototype for learning how touch changed navigation, hierarchy, density, and reading behavior.

<a class='sublinks' href='/blue-case'>Read the interaction design case →</a>

{.bloco}
{video}
  nome: fabia.mov
  tamanho: G
  tags: Full-Stack, Code, API, UX/UI, Project Management, Business Strategy
{}

chapeu: fab.IA
h4: Talking to Business Data

Could natural language become an interface to enterprise data?

<bullet texto='Exploration' cor='var(--color-secondary)' /> I built an early prototype connecting speech recognition, language processing, SQL queries, and data visualization.

<bullet texto='Prototype' cor='var(--color-secondary)' /> Built with Svelte, Node.js, and D3.js. An exploratory experiment rather than a production product.
{}

{divisor}

h3: Three decades of craft. Still hands-on.

I lead at the system level and stay close enough to the work to prototype, design, build, refine, and ship.

<strong>Complexity is the material. Simplicity is the outcome.</strong>

h5: Let's talk.

<a class='sublinks' href='mailto:fabio.sales@me.com'>fabio.sales@me.com →</a>`;

export default homeContent;
