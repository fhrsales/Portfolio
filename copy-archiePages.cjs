// Builds the runtime content file from static/archiePages.json.
// The application branch keeps the source portfolio intact and applies the
// application-specific narrative at build time.
const fs = require('fs');
const path = require('path');
const src = path.join(__dirname,'static','archiePages.json');
const destDir = path.join(__dirname,'src','lib');
const dest = path.join(destDir,'archiePages.json');
if(!fs.existsSync(src)){console.error('static/archiePages.json não encontrado!');process.exit(1);}
if(!fs.existsSync(destDir))fs.mkdirSync(destDir,{recursive:true});
const pages=JSON.parse(fs.readFileSync(src,'utf8'));
let home=pages.index?.content||'';
const replace=(from,to)=>{if(!home.includes(from)){console.warn(`Portfolio positioning: block not found: ${from.slice(0,60)}...`);return;}home=home.replace(from,to);};
replace("texto_1: Hi, I'm <strong>Fabio Sales</strong>, <strong>Creative Developer</strong> & <strong>Consultant,</strong> shaping complex information with narrative precision through the lens of <strong>Visual Journalism.</strong>","texto_1: Hi, I'm <strong>Fabio Sales</strong>, a <strong>Design Leader</strong> & <strong>Product Builder</strong> turning complex information and systems into experiences people can understand and use.");
replace("texto_2: I design and build digital systems that perform, <strong>scalable, resilient, </strong>and grounded in <strong>Software Engineering.</strong>","texto_2: My work connects <strong>visual craft, product thinking, technology,</strong> and <strong>business</strong> — from information architecture and design systems to shipped software.");
replace('h3: Selected Case Studies','h3: Selected Product & Design Work');
replace("I don’t bridge the gap between design and code. I eliminate it.\n\nWith decades of experience leading newsrooms and building digital products, I help organizations transform complex information into clear, scalable, and profitable experiences.\n\nBelow is a curated selection of case studies where strategy, design, and technology converge to solve real business problems.","I have spent my career designing clarity inside complex systems.\n\nThat began with information design and visual journalism at scale, expanded into digital products and interaction, and today includes the engineering needed to take ideas all the way to production. I lead teams, shape systems, and remain hands-on with the work.\n\nThese cases show the same principle across very different contexts: understand the complexity, create a coherent system, and make the experience feel simple.");
replace('h4: Digital Transformation at Scale: Estadão.','h4: Estadão — Designing a System at Scale');
replace("<bullet texto='The Challenge' cor='var(--color-secondary)' /> The newspaper needed to modernize its industrial format without losing its identity or readers, while simultaneously migrating content workflows to digital-first.","<bullet texto='The Problem' cor='var(--color-secondary)' /> Modernize a large, established information product without losing its identity or readers — while redesigning the system around new industrial, editorial, digital, and commercial constraints.");
replace("<bullet texto='The Impact' cor='var(--color-success)' /> The project generated an estimated <strong>R$7 million increase in EBITDA</strong> (2022) through operational optimization and fueled a new advertising strategy. It proved that design decisions are business decisions.","<bullet texto='Impact' cor='var(--color-success)' /> The redesign supported operational optimization and a new advertising strategy, with an estimated <strong>R$7 million increase in EBITDA</strong> (2022).\n\n<a class='sublinks' href='/estadao'>Read the full design case study →</a>");
replace('h4: ATBL Enterprise App ','h4: ATBL — Turning Enterprise Complexity into a Usable Product');
replace("While <em>Estadão</em> shows my capacity for scale, <em><a href=\"https://www.atbl.com.br/loja\">ATBL</a></em> demonstrates my hands-on engineering skills. I engineered a digital ecosystem to eliminate manual workflows, replacing spreadsheets with a high-performance PWA.\n\n<bullet texto='Tech Stack' cor='var(--color-secondary)' /> Svelte, Node.js API integration with Sankhya ERP.\n\n<bullet texto='Result' cor='var(--color-success)' /> By placing stock control, sales orders, and dashboards in the employees' pockets, the company saw a <strong>12.5% revenue increase</strong> through improved efficiency.","<em>ATBL</em> operates in a technical B2B environment where specifications, stock, pricing, tax rules, customer agreements, and ERP workflows all affect a seemingly simple task: getting the right product and completing an order.\n\n<bullet texto='The Problem' cor='var(--color-secondary)' /> Critical workflows depended on manual quotations, repeated data entry, and fragmented access to stock and order information.\n\n<bullet texto='Product Approach' cor='var(--color-secondary)' /> I turned those operational rules into digital products that expose what people need to decide while keeping ERP complexity behind the interface.\n\n<a class='sublinks' href='/atbl'>Read the full product design case study →</a>");
replace('h4: Ask to fab.IA: Talk to your Data','h4: fab.IA — Making Enterprise Data Conversational');
replace('h4: Visual Journalism & Awards','h4: Visual Craft, Information Systems & Awards');
replace("Before transitioning to software engineering, I spent two decades defining the visual standards of Brazilian journalism. This resulted in hundreds of national and international design awards. <a href='https://www.linkedin.com/in/fabiohrsales/details/honors/' target='_blank'>See the list.</a>\n\nThis background ensures that every digital product I code today has perfect hierarchy, typography, and narrative flow.","My product work is built on decades of visual design, information architecture, typography, data visualization, and art direction. I led multidisciplinary teams and helped define visual standards for products used by millions of readers.\n\nI did not leave that discipline behind when I began building software. I extended it: from designing information to designing systems, interactions, and the technology that makes them real.");
if(pages.index)pages.index.content=home;

pages.estadao={content:`imagem: germanico.png, G

h1: Estadão — Designing a System at Scale

<strong>Design leadership / Information architecture / Visual systems / Organizational change</strong>

A newspaper redesign can look like a graphic-design exercise. The real challenge was systemic: evolve a daily information product with a long-established identity while balancing readers, editorial priorities, industrial production, advertising, digital workflows, and business performance.

h3: A high-frequency interface before we called it product design

Every day the content changes completely. The interface cannot. Readers need to recognize hierarchy, understand where they are, scan dense information, and decide what deserves attention in seconds. Editors and designers need enough flexibility to tell very different stories without rebuilding the visual language every morning.

That is fundamentally a systems problem: <strong>create enough consistency to make the product intuitive, and enough flexibility to keep it expressive.</strong>

h3: My role — direction and craft

I led the redesign strategy at the intersection of art direction, information architecture, editorial leadership, production constraints, and commercial viability. Leadership did not mean stepping away from design. I remained close to typography, hierarchy, grids, modules, data visualization, visual storytelling, and the rules that connected those elements.

The work also required alignment across disciplines with different definitions of success: editorial teams, designers, production, technology, advertising, and business leadership.

h3: From individual pages to reusable decisions

A strong daily product cannot depend on a few people making heroic design decisions every night. We needed a visual grammar other teams could apply repeatedly.

The system established reusable principles for typography, hierarchy, modular layouts, recurring editorial patterns, and visual language. Instead of prescribing every page, it defined the boundaries within which teams could make good decisions.

{imagem}
  nome: germanico.png
  tamanho: GG
  tags: Design Leadership, Art Direction, Information Architecture
{}

<a class='sublinks' href='https://fhrsales.github.io/design-system-estadao/' target='_blank'>Explore the redesign and design system →</a>

h3: The system expanded beyond print

As editorial workflows became increasingly digital, the same thinking extended to interactive and multimedia components. The medium changed, but the design problem remained familiar: reusable patterns, clear hierarchy, predictable behavior, and enough flexibility for journalism that rarely arrives in a standard shape.

<a class='sublinks' href='/manual' target='_blank'>Explore interactive & multimedia UI components →</a>

h3: Craft as a way to make complexity legible

My background in visual journalism is not separate from my product work. It is where I learned to turn large amounts of unfamiliar information into something people can understand quickly — through hierarchy, typography, spatial organization, diagrams, maps, and data visualization.

{imagem}
  nome: malofiej.png
  tamanho: G
  tags: Information Design, Visual Craft, Data Visualization
{}

The work produced hundreds of national and international distinctions over my newsroom career, including Malofiej recognition. Awards are not the point of the case; they are external evidence of the level of craft expected from the teams I led.

h3: Design had to work as a business system too

The redesign was connected to industrial and commercial decisions, not isolated from them. It supported production optimization and a new advertising strategy. The business case associated with the project estimated a <strong>R$7 million increase in EBITDA in 2022</strong>.

<a class='sublinks' href='/pdfs/estadao_ca.pdf' target='_blank'>Read the strategic business case →</a><br><a class='sublinks' href='/pdfs/estadao_comercial.pdf' target='_blank'>See the advertising and monetization strategy →</a>

h3: What I carry into product leadership

This project shaped a principle I still use: <strong>a design leader should raise the quality of individual work while building a system that no longer depends on individual heroics.</strong>

The medium may now be software rather than paper, but the leadership problem is remarkably similar. Understand users and constraints. Establish a coherent language. Create reusable building blocks. Give teams enough structure to move quickly and enough freedom to solve the problem in front of them.

That is the bridge between my editorial design career and the digital products I build today.

<a class='sublinks' href='/'>← Back to selected work</a>`,showInMenu:false,menuLabel:'Estadão Case Study'};

pages.atbl={content:`imagem: atbl-app.png, G

h1: ATBL — Turning Enterprise Complexity into a Usable Product

ATBL operates in industrial distribution for Oil & Gas, Offshore, and Maritime customers. A seemingly simple commercial transaction sits on top of technical specifications, inventory, customer-specific pricing, taxes, approvals, ERP processes, documentation, and sales relationships.

The product challenge was not to put an ERP on a smaller screen. It was to decide <strong>which complexity users actually need to see — and which complexity the system should absorb for them.</strong>

h3: The legacy experience

Commercial work depended heavily on manual quotations, repeated communication, fragmented stock visibility, spreadsheets, and repeated data entry. Those processes consumed specialist time and created opportunities for error where technical accuracy matters.

h3: Four product principles

<bullet texto='Expose decisions, not ERP structure' cor='var(--color-secondary)' /> Show the information needed to act, not the database and process complexity behind it.

<bullet texto='Respect real business rules' cor='var(--color-secondary)' /> Pricing, inventory, tax logic, agreements, and order status must reflect operational systems rather than an idealized flow.

<bullet texto='Reduce repeated work' cor='var(--color-secondary)' /> Information already known by the ERP should not be reconstructed across spreadsheets, messages, and order entry.

<bullet texto='Keep experts on expert problems' cor='var(--color-secondary)' /> Self-service handles routine information while technical salespeople focus on engineering solutions, relationships, and complex negotiations.

h3: The system behind the experience

{imagem}
  nome: atbl-ecosystem.svg
  tamanho: GG
  tags: Product Design, Systems Thinking, Information Architecture
{}

<strong>Complexity stays behind the experience.</strong> The customer-facing journey connects to live operational data across the portal, ERP, billing, and delivery. Stock, prices, and tax rules are synchronized instead of being recreated manually.

h3: The product

I designed and built a PWA that brings stock control, sales orders, and business dashboards into a coherent mobile experience integrated with Sankhya ERP. In parallel, the customer-facing ecosystem connects catalogue information with real stock, pricing, taxes, and customer-specific commercial conditions.

This is where my design and engineering practices converge. I can test a product decision against the actual system that must support it, then stay hands-on through implementation rather than handing an idealized interface to another discipline.

h3: Designing for technical B2B

Industrial products are selected through rigid specifications. The interface therefore has to make dense technical information usable: filters, datasheets, homologations, availability, and commercial context must help a buyer reach a confident decision without hiding information that matters.

The catalogue itself is a systems problem: more than <strong>20,000 active products</strong> require structured images, weights, dimensions, attributes, standards, and technical metadata before the interface can make them meaningfully searchable.

h3: Technology + people

Automation is not the goal. Digital channels can handle first-level service, stock and price checks, and order tracking; technical salespeople remain focused on tailored engineering solutions, consultative relationships, and strategic negotiations.

h3: From interface to operating model

The ecosystem connects real-time price tables, state tax rules, inventory, customer agreements, and ERP order flow. The goal is a coherent relationship between customer experience and company operations — not automation for its own sake.

The company recorded a <strong>12.5% revenue increase</strong> alongside these operational changes. I treat that figure as business context rather than claiming interface design alone caused the growth.

h3: What this work demonstrates

ATBL shows the kind of product problem I am most interested in: a complicated system that cannot simply be removed, but can be reorganized so that people experience clarity instead of infrastructure. My role spans product judgment, information architecture, business rules, interaction decisions, technical implementation, and organizational adoption.

<strong>Understand complexity deeply enough to make the experience feel simple.</strong>

<a class='sublinks' href='/'>← Back to selected work</a>`,showInMenu:false,menuLabel:'ATBL Case Study'};

if(pages.about?.content)pages.about.content=pages.about.content.replace('h1: From Newsroom Leadership to Digital Engineering','h1: From Visual Systems to Product Leadership').replace('<strong>The Pivot to Tech.</strong> Since 2010, I have codified that experience into digital products.','<strong>Extending design into technology.</strong> Since 2010, I have expanded that experience into digital products and software engineering.');
fs.writeFileSync(dest,`${JSON.stringify(pages,null,2)}\n`,'utf8');
console.log('Built application portfolio content');
