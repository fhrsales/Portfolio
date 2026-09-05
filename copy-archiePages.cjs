// Builds the runtime content file from static/archiePages.json.
// The application branch keeps the source portfolio intact and applies the
// application-specific narrative at build time.
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'static', 'archiePages.json');
const destDir = path.join(__dirname, 'src', 'lib');
const dest = path.join(destDir, 'archiePages.json');

if (!fs.existsSync(src)) {
	console.error('static/archiePages.json não encontrado!');
	process.exit(1);
}
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

const pages = JSON.parse(fs.readFileSync(src, 'utf8'));
let home = pages.index?.content || '';

const replace = (from, to) => {
	if (!home.includes(from)) {
		console.warn(`Portfolio positioning: block not found: ${from.slice(0, 60)}...`);
		return;
	}
	home = home.replace(from, to);
};

replace(
	"texto_1: Hi, I'm <strong>Fabio Sales</strong>, <strong>Creative Developer</strong> & <strong>Consultant,</strong> shaping complex information with narrative precision through the lens of <strong>Visual Journalism.</strong>",
	"texto_1: Hi, I'm <strong>Fabio Sales</strong>, a <strong>Design Leader</strong> & <strong>Product Builder</strong> turning complex information and systems into experiences people can understand and use."
);
replace(
	"texto_2: I design and build digital systems that perform, <strong>scalable, resilient, </strong>and grounded in <strong>Software Engineering.</strong>",
	"texto_2: My work connects <strong>visual craft, product thinking, technology,</strong> and <strong>business</strong> — from information architecture and design systems to shipped software."
);
replace('h3: Selected Case Studies', 'h3: Selected Product & Design Work');
replace(
	"I don’t bridge the gap between design and code. I eliminate it.\n\nWith decades of experience leading newsrooms and building digital products, I help organizations transform complex information into clear, scalable, and profitable experiences.\n\nBelow is a curated selection of case studies where strategy, design, and technology converge to solve real business problems.",
	"I have spent my career designing clarity inside complex systems.\n\nThat began with information design and visual journalism at scale, expanded into digital products and interaction, and today includes the engineering needed to take ideas all the way to production. I lead teams, shape systems, and remain hands-on with the work.\n\nThese cases show the same principle across very different contexts: understand the complexity, create a coherent system, and make the experience feel simple."
);
replace('h4: Digital Transformation at Scale: Estadão.', 'h4: Estadão — Designing a System at Scale');
replace(
	"<bullet texto='The Challenge' cor='var(--color-secondary)' /> The newspaper needed to modernize its industrial format without losing its identity or readers, while simultaneously migrating content workflows to digital-first.",
	"<bullet texto='The Problem' cor='var(--color-secondary)' /> Modernize a large, established information product without losing its identity or readers — while redesigning the system around new industrial, editorial, digital, and commercial constraints."
);
replace(
	"<bullet texto='My Role' cor='var(--color-secondary)' /> I led the full <a href=\"https://www.estadao.com.br/infograficos/economia,multiplataforma-estadao-renova-e-aprimora-sua-versao-impressa,1199439?srsltid=AfmBOormT2t7Om421rKL3coAJ6rDGkuekNsMJBuO99BxeLVj6DLQAkkT\" target=\"_blank\">redesign strategy,</a> managing the intersection of editorial goals, industrial constraints, and commercial viability. This wasn't just a visual update; it was a business restructuring.",
	"<bullet texto='My Role' cor='var(--color-secondary)' /> I led the <a href=\"https://www.estadao.com.br/infograficos/economia,multiplataforma-estadao-renova-e-aprimora-sua-versao-impressa,1199439?srsltid=AfmBOormT2t7Om421rKL3coAJ6rDGkuekNsMJBuO99BxeLVj6DLQAkkT\" target=\"_blank\">redesign strategy</a> across visual language, information hierarchy, editorial needs, production constraints, and commercial viability. The output was not a collection of pages; it was a design system for a daily product operating at scale."
);
replace(
	"<bullet texto='The Impact' cor='var(--color-success)' /> The project generated an estimated <strong>R$7 million increase in EBITDA</strong> (2022) through operational optimization and fueled a new advertising strategy. It proved that design decisions are business decisions.",
	"<bullet texto='Impact' cor='var(--color-success)' /> The redesign supported operational optimization and a new advertising strategy, with an estimated <strong>R$7 million increase in EBITDA</strong> (2022). It is the clearest example in my career that design decisions can also be business decisions.\n\n<a class='sublinks' href='/estadao'>Read the full design case study →</a>"
);
replace('h4: ATBL Enterprise App ', 'h4: ATBL — Turning Enterprise Complexity into a Usable Product');
replace(
	"While <em>Estadão</em> shows my capacity for scale, <em><a href=\"https://www.atbl.com.br/loja\">ATBL</a></em> demonstrates my hands-on engineering skills. I engineered a digital ecosystem to eliminate manual workflows, replacing spreadsheets with a high-performance PWA.\n\n<bullet texto='Tech Stack' cor='var(--color-secondary)' /> Svelte, Node.js API integration with Sankhya ERP.\n\n<bullet texto='Result' cor='var(--color-success)' /> By placing stock control, sales orders, and dashboards in the employees' pockets, the company saw a <strong>12.5% revenue increase</strong> through improved efficiency.",
	"<em><a href=\"https://www.atbl.com.br/loja\">ATBL</a></em> operates in a technical B2B environment where product specifications, stock, pricing, tax rules, customer agreements, and ERP workflows all affect a seemingly simple task: getting the right product and completing an order.\n\n<bullet texto='The Problem' cor='var(--color-secondary)' /> Critical commercial workflows depended on spreadsheets, manual quotations, repeated data entry, and fragmented access to stock and order information.\n\n<bullet texto='Product Approach' cor='var(--color-secondary)' /> I turned those operational rules into a digital product: a PWA that exposes the information employees need while keeping ERP complexity behind the interface. Stock control, sales orders, and dashboards became accessible from the same experience.\n\n<bullet texto='From Design to Production' cor='var(--color-secondary)' /> I remained hands-on through implementation, using Svelte and Node.js with Sankhya ERP integration. Engineering was part of the design process: the interface had to respect real inventory, pricing, and business rules rather than demonstrate an idealized flow.\n\n<bullet texto='Result' cor='var(--color-success)' /> The company recorded a <strong>12.5% revenue increase</strong> alongside the operational changes enabled by the product.\n\n<a class='sublinks' href='/atbl'>Read the full product design case study →</a>"
);
replace('h4: Ask to fab.IA: Talk to your Data', 'h4: fab.IA — Making Enterprise Data Conversational');
replace(
	"A proprietary voice-activated assistant that queries the company's ERP. Instead of generic wrappers, I engineered a semantic engine that translates natural language directly into execution-ready <strong>SQL</strong>.\n\n<bullet texto='Tech Stack' cor='var(--color-secondary)' /> Svelte, Node.js, Speech-to-Text, custom NLP logic, and <strong>D3.js</strong> for data visualization.\n\n<bullet texto='Result' cor='var(--color-success)' /> Managers access revenue and performance metrics instantly via audio, receiving dynamic charts instead of static spreadsheets.",
	"Enterprise data is powerful but often trapped behind reports, database structures, and specialist knowledge. fab.IA explores a simpler interaction model: ask a business question in natural language and receive an answer grounded in the ERP.\n\n<bullet texto='Interaction Model' cor='var(--color-secondary)' /> Voice and natural language become the interface. A semantic layer translates questions into execution-ready <strong>SQL</strong>, while the response can combine spoken answers with dynamic data visualization.\n\n<bullet texto='Hands-on Build' cor='var(--color-secondary)' /> Svelte, Node.js, Speech-to-Text, custom NLP logic, and <strong>D3.js</strong>.\n\n<bullet texto='Outcome' cor='var(--color-success)' /> Managers can move from a question about revenue or performance directly to an answer and chart, reducing dependence on static spreadsheets and predefined dashboards."
);
replace('h4: Visual Journalism & Awards', 'h4: Visual Craft, Information Systems & Awards');
replace(
	"Before transitioning to software engineering, I spent two decades defining the visual standards of Brazilian journalism. This resulted in hundreds of national and international design awards. <a href='https://www.linkedin.com/in/fabiohrsales/details/honors/' target='_blank'>See the list.</a>\n\nThis background ensures that every digital product I code today has perfect hierarchy, typography, and narrative flow.",
	"My product work is built on decades of visual design, information architecture, typography, data visualization, and art direction. I led multidisciplinary newsroom teams and helped define visual standards for products used by millions of readers, earning hundreds of national and international distinctions. <a href='https://www.linkedin.com/in/fabiohrsales/details/honors/' target='_blank'>See the list.</a>\n\nI did not leave that discipline behind when I began building software. I extended it: from designing information to designing systems, interactions, and the technology that makes them real."
);
replace(
	"h5: Ready to transform your digital product?\n\nI bring the senior experience of Art Direction and the hands-on skills of a Developer.",
	"h5: Design leadership that stays close to the work.\n\nI bring together visual craft, product judgment, business context, team leadership, and the ability to build what I design."
);

if (pages.index) pages.index.content = home;

pages.estadao = {
	content: `imagem: germanico.png, G

h1: Estadão — Designing a System at Scale

A redesign of a newspaper is easy to mistake for a graphic-design exercise. At Estadão, the real challenge was systemic: change a daily information product with a long-established identity while balancing readers, editorial priorities, industrial production, advertising, digital workflows, and business performance.

h3: The problem was larger than the page

The product had to modernize without becoming unfamiliar. Any visual decision affected multiple parts of the organization: how journalists structured stories, how editors made hierarchy visible, how pages moved through production, how advertising inventory worked, and how readers navigated a dense daily product.

The design question therefore became: <strong>how do you change the system without losing the trust encoded in the existing product?</strong>

h3: My role

I led the redesign strategy at the intersection of art direction, information architecture, editorial leadership, production constraints, and commercial viability. My responsibility was not simply to define a visual style. It was to create rules that a large multidisciplinary organization could use every day.

That meant working as a design leader while remaining close to the craft: hierarchy, typography, grids, modules, information density, visual storytelling, and the components needed to make the system coherent.

h3: From pages to a design system

A newspaper is a high-frequency interface. Every edition brings different content, but readers still need to understand the product immediately. The solution therefore depended on reusable principles rather than one-off compositions.

The redesign established a system for hierarchy, typography, modular layouts, visual language, and recurring editorial patterns. The same systems thinking extended into interactive and multimedia components as the newsroom became increasingly digital.

<a class='sublinks' href='https://fhrsales.github.io/design-system-estadao/' target='_blank'>Explore the redesign and design system →</a><br><a class='sublinks' href='/manual' target='_blank'>Explore interactive & multimedia UI components →</a>

h3: Design as an organizational decision

The work connected editorial quality with operational and commercial decisions. The redesign supported production optimization and a new advertising strategy. The business case associated with the project estimated a <strong>R$7 million increase in EBITDA in 2022</strong>.

<a class='sublinks' href='/pdfs/estadao_ca.pdf' target='_blank'>Read the strategic business case presented for board approval →</a><br><a class='sublinks' href='/pdfs/estadao_comercial.pdf' target='_blank'>See the advertising and monetization strategy →</a>

h3: What this project taught me

The most durable lesson was that design leadership is not about controlling every output. It is about creating a system strong enough for many people to make good decisions inside it.

That principle now shapes how I approach software products as well: understand the real constraints, make the rules coherent, give teams reusable building blocks, and keep complexity away from the person using the product.

<a class='sublinks' href='/'>← Back to selected work</a>`,
	showInMenu: false,
	menuLabel: 'Estadão Case Study'
};

pages.atbl = {
	content: `imagem: atbl-app.png, G

h1: ATBL — Turning Enterprise Complexity into a Usable Product

ATBL operates in industrial distribution for Oil & Gas, Offshore, and Maritime customers. What looks like a straightforward commercial flow sits on top of product specifications, stock, customer-specific pricing, tax rules, approvals, ERP processes, technical documentation, and sales relationships.

The product challenge was not to put an ERP on a smaller screen. It was to decide <strong>which complexity users actually need to see — and which complexity the system should absorb for them.</strong>

h3: The legacy experience

Commercial work depended heavily on manual quotations, repeated communication, fragmented stock visibility, spreadsheets, and repeated data entry. Those processes consumed time and created opportunities for error precisely where technical accuracy matters most.

The broader digital strategy followed the same diagnosis: industrial buyers need autonomy, but technical B2B purchasing cannot be reduced to a generic marketplace flow. Specifications, traceability, homologation, availability, contractual pricing, and trust all remain part of the experience.

h3: Product principles

<bullet texto='Expose decisions, not ERP structure' cor='var(--color-secondary)' /> Users should see the stock, order, customer, and performance information needed to act — not the database and process complexity behind it.

<bullet texto='Respect real business rules' cor='var(--color-secondary)' /> Pricing, inventory, tax logic, customer agreements, and order status must come from operational systems rather than a simplified mock workflow.

<bullet texto='Reduce repeated work' cor='var(--color-secondary)' /> Information already known by the ERP should not have to be manually reconstructed across spreadsheets, messages, and order entry.

<bullet texto='Keep expert people on expert problems' cor='var(--color-secondary)' /> Digital self-service should handle routine access to information while technical salespeople remain focused on engineering solutions, relationships, and complex negotiations.

h3: The product

I designed and built a PWA that brings stock control, sales orders, and business dashboards into a coherent mobile experience integrated with Sankhya ERP. In parallel, the customer-facing digital ecosystem connects catalogue information with real stock, pricing, tax, and customer-specific commercial conditions.

This is where my design and engineering practices converge. I can test a product decision against the actual system that must support it, then remain hands-on through implementation rather than handing an idealized interface to another discipline.

h3: Designing for technical B2B

Industrial products are often selected through rigid specifications. The experience therefore has to make dense technical information usable: filters, datasheets, homologations, availability, and commercial context need to help the buyer reach a confident decision without hiding information that matters.

The same principle applies internally. A dashboard is useful only when it helps someone decide; an order screen is useful only when its state reflects the real operational workflow.

h3: From interface to operating model

The digital ecosystem connects real-time price tables, state tax rules, stock, customer agreements, and ERP order flow. Approved orders can move into the operational process without recreating information manually. The goal is not automation for its own sake; it is a more coherent relationship between customer experience and company operations.

The company recorded a <strong>12.5% revenue increase</strong> alongside the operational changes enabled by the product. I treat that figure as business context rather than claiming that interface design alone caused the growth.

h3: What I bring from this work

ATBL is a useful example of how