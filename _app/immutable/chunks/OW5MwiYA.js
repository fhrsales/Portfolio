import{C as J,x as T,y as xe,g as Y,Y as Ee,D as Se,H as De,F as se,G as H,I as L,P as M,ae as Pe,az as Me,K as N,M as Ce,L as Le,aP as oe,J as he,m as je,a0 as le,aC as ge,au as fe,aQ as U,N as pe,O as Ne,aR as V,aS as ze,aT as X,aE as z,af as Be,aU as Re,aB as Ge,aV as qe,_ as Oe,ak as Ue,aW as me,q as Ve,aX as Fe,h as ee,aY as We,Q as He,aZ as Xe,a_ as $e,a$ as Ke,b0 as Qe,b1 as Ye,b2 as Ze,b3 as Je,b4 as en,b5 as nn,U as an,b6 as tn,b7 as rn}from"./F9-gHgXO.js";import{i as sn,j as on,k as ln,n as cn,l as dn,w as un}from"./Cpeed-PC.js";import{b as hn,r as gn}from"./Bv5qz1Pm.js";function Wn(e,a){return a}function fn(e,a,n){for(var t=e.items,r=[],i=a.length,s=0;s<i;s++)Re(a[s].e,r,!0);var d=i>0&&r.length===0&&n!==null;if(d){var w=n.parentNode;Ge(w),w.append(n),t.clear(),E(e,a[0].prev,a[i-1].next)}qe(r,()=>{for(var h=0;h<i;h++){var y=a[h];d||(t.delete(y.k),E(e,y.prev,y.next)),z(y.e,!d)}})}function Hn(e,a,n,t,r,i=null){var s=e,d={flags:a,items:new Map,first:null},w=(a&me)!==0;if(w){var h=e;s=T?H(Ue(h)):h.appendChild(he())}T&&xe();var y=null,k=!1,m=new Map,I=Ee(()=>{var f=n();return fe(f)?f:f==null?[]:ge(f)}),c,u;function b(){pn(u,c,d,m,s,r,a,t,n),i!==null&&(c.length===0?y?pe(y):y=N(()=>i(s)):y!==null&&Ne(y,()=>{y=null}))}J(()=>{u??(u=Oe),c=Y(I);var f=c.length;if(k&&f===0)return;k=f===0;let A=!1;if(T){var g=Se(s)===De;g!==(f===0)&&(s=se(),H(s),L(!1),A=!0)}if(T){for(var p=null,v,o=0;o<f;o++){if(M.nodeType===Pe&&M.data===Me){s=M,A=!0,L(!1);break}var l=c[o],_=t(l,o);v=Z(M,d,p,null,l,_,o,r,a,n),d.items.set(_,v),p=v}f>0&&H(se())}if(T)f===0&&i&&(y=N(()=>i(s)));else if(Ce()){var S=new Set,B=Le;for(o=0;o<f;o+=1){l=c[o],_=t(l,o);var D=d.items.get(_)??m.get(_);D?(a&(V|U))!==0&&ve(D,l,o,a):(v=Z(null,d,null,null,l,_,o,r,a,n,!0),m.set(_,v)),S.add(_)}for(const[x,R]of d.items)S.has(x)||B.skipped_effects.add(R.e);B.add_callback(b)}else b();A&&L(!0),Y(I)}),T&&(s=M)}function pn(e,a,n,t,r,i,s,d,w){var ne,ae,te,re;var h=(s&Fe)!==0,y=(s&(V|U))!==0,k=a.length,m=n.items,I=n.first,c=I,u,b=null,f,A=[],g=[],p,v,o,l;if(h)for(l=0;l<k;l+=1)p=a[l],v=d(p,l),o=m.get(v),o!==void 0&&((ne=o.a)==null||ne.measure(),(f??(f=new Set)).add(o));for(l=0;l<k;l+=1){if(p=a[l],v=d(p,l),o=m.get(v),o===void 0){var _=t.get(v);if(_!==void 0){t.delete(v),m.set(v,_);var S=b?b.next:c;E(n,b,_),E(n,_,S),$(_,S,r),b=_}else{var B=c?c.e.nodes_start:r;b=Z(B,n,b,b===null?n.first:b.next,p,v,l,i,s,w)}m.set(v,b),A=[],g=[],c=b.next;continue}if(y&&ve(o,p,l,s),(o.e.f&X)!==0&&(pe(o.e),h&&((ae=o.a)==null||ae.unfix(),(f??(f=new Set)).delete(o))),o!==c){if(u!==void 0&&u.has(o)){if(A.length<g.length){var D=g[0],x;b=D.prev;var R=A[0],F=A[A.length-1];for(x=0;x<A.length;x+=1)$(A[x],D,r);for(x=0;x<g.length;x+=1)u.delete(g[x]);E(n,R.prev,F.next),E(n,b,R),E(n,F,D),c=D,b=F,l-=1,A=[],g=[]}else u.delete(o),$(o,c,r),E(n,o.prev,o.next),E(n,o,b===null?n.first:b.next),E(n,b,o),b=o;continue}for(A=[],g=[];c!==null&&c.k!==v;)(c.e.f&X)===0&&(u??(u=new Set)).add(c),g.push(c),c=c.next;if(c===null)continue;o=c}A.push(o),b=o,c=o.next}if(c!==null||u!==void 0){for(var P=u===void 0?[]:ge(u);c!==null;)(c.e.f&X)===0&&P.push(c),c=c.next;var W=P.length;if(W>0){var Ie=(s&me)!==0&&k===0?r:null;if(h){for(l=0;l<W;l+=1)(te=P[l].a)==null||te.measure();for(l=0;l<W;l+=1)(re=P[l].a)==null||re.fix()}fn(n,P,Ie)}}h&&Ve(()=>{var ie;if(f!==void 0)for(o of f)(ie=o.a)==null||ie.apply()}),e.first=n.first&&n.first.e,e.last=b&&b.e;for(var Te of t.values())z(Te.e);t.clear()}function ve(e,a,n,t){(t&V)!==0&&oe(e.v,a),(t&U)!==0?oe(e.i,n):e.i=n}function Z(e,a,n,t,r,i,s,d,w,h,y){var k=(w&V)!==0,m=(w&ze)===0,I=k?m?je(r,!1,!1):le(r):r,c=(w&U)===0?s:le(s),u={i:c,v:I,k:i,a:null,e:null,prev:n,next:t};try{if(e===null){var b=document.createDocumentFragment();b.append(e=he())}return u.e=N(()=>d(e,I,c,h),T),u.e.prev=n&&n.e,u.e.next=t&&t.e,n===null?y||(a.first=u):(n.next=u,n.e.next=u.e),t!==null&&(t.prev=u,t.e.prev=u.e),u}finally{}}function $(e,a,n){for(var t=e.next?e.next.e.nodes_start:n,r=a?a.e.nodes_start:n,i=e.e.nodes_start;i!==null&&i!==t;){var s=Be(i);r.before(i),i=s}}function E(e,a,n){a===null?e.first=n:(a.next=n,a.e.next=n&&n.e),n!==null&&(n.prev=a,n.e.prev=a&&a.e)}function mn(e,a){var n=void 0,t;J(()=>{n!==(n=a())&&(t&&(z(t),t=null),n&&(t=N(()=>{ee(()=>n(e))})))})}function be(e){var a,n,t="";if(typeof e=="string"||typeof e=="number")t+=e;else if(typeof e=="object")if(Array.isArray(e)){var r=e.length;for(a=0;a<r;a++)e[a]&&(n=be(e[a]))&&(t&&(t+=" "),t+=n)}else for(n in e)e[n]&&(t&&(t+=" "),t+=n);return t}function vn(){for(var e,a,n=0,t="",r=arguments.length;n<r;n++)(e=arguments[n])&&(a=be(e))&&(t&&(t+=" "),t+=a);return t}function bn(e){return typeof e=="object"?vn(e):e??""}const ce=[...` 	
\r\f \v\uFEFF`];function yn(e,a,n){var t=e==null?"":""+e;if(a&&(t=t?t+" "+a:a),n){for(var r in n)if(n[r])t=t?t+" "+r:r;else if(t.length)for(var i=r.length,s=0;(s=t.indexOf(r,s))>=0;){var d=s+i;(s===0||ce.includes(t[s-1]))&&(d===t.length||ce.includes(t[d]))?t=(s===0?"":t.substring(0,s))+t.substring(d+1):s=d}}return t===""?null:t}function de(e,a=!1){var n=a?" !important;":";",t="";for(var r in e){var i=e[r];i!=null&&i!==""&&(t+=" "+r+": "+i+n)}return t}function K(e){return e[0]!=="-"||e[1]!=="-"?e.toLowerCase():e}function wn(e,a){if(a){var n="",t,r;if(Array.isArray(a)?(t=a[0],r=a[1]):t=a,e){e=String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g,"").trim();var i=!1,s=0,d=!1,w=[];t&&w.push(...Object.keys(t).map(K)),r&&w.push(...Object.keys(r).map(K));var h=0,y=-1;const u=e.length;for(var k=0;k<u;k++){var m=e[k];if(d?m==="/"&&e[k-1]==="*"&&(d=!1):i?i===m&&(i=!1):m==="/"&&e[k+1]==="*"?d=!0:m==='"'||m==="'"?i=m:m==="("?s++:m===")"&&s--,!d&&i===!1&&s===0){if(m===":"&&y===-1)y=k;else if(m===";"||k===u-1){if(y!==-1){var I=K(e.substring(h,y).trim());if(!w.includes(I)){m!==";"&&k++;var c=e.substring(h,k).trim();n+=" "+c+";"}}h=k+1,y=-1}}}}return t&&(n+=de(t)),r&&(n+=de(r,!0)),n=n.trim(),n===""?null:n}return e==null?null:String(e)}function kn(e,a,n,t,r,i){var s=e.__className;if(T||s!==n||s===void 0){var d=yn(n,t,i);(!T||d!==e.getAttribute("class"))&&(d==null?e.removeAttribute("class"):a?e.className=d:e.setAttribute("class",d)),e.__className=n}else if(i&&r!==i)for(var w in i){var h=!!i[w];(r==null||h!==!!r[w])&&e.classList.toggle(w,h)}return i}function Q(e,a={},n,t){for(var r in n){var i=n[r];a[r]!==i&&(n[r]==null?e.style.removeProperty(r):e.style.setProperty(r,i,t))}}function An(e,a,n,t){var r=e.__style;if(T||r!==a){var i=wn(a,t);(!T||i!==e.getAttribute("style"))&&(i==null?e.removeAttribute("style"):e.style.cssText=i),e.__style=a}else t&&(Array.isArray(t)?(Q(e,n==null?void 0:n[0],t[0]),Q(e,n==null?void 0:n[1],t[1],"important")):Q(e,n,t));return t}function q(e,a,n=!1){if(e.multiple){if(a==null)return;if(!fe(a))return Xe();for(var t of e.options)t.selected=a.includes(j(t));return}for(t of e.options){var r=j(t);if($e(r,a)){t.selected=!0;return}}(!n||a!==void 0)&&(e.selectedIndex=-1)}function ye(e){var a=new MutationObserver(()=>{q(e,e.__value)});a.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),He(()=>{a.disconnect()})}function Xn(e,a,n=a){var t=!0;We(e,"change",r=>{var i=r?"[selected]":":checked",s;if(e.multiple)s=[].map.call(e.querySelectorAll(i),j);else{var d=e.querySelector(i)??e.querySelector("option:not([disabled])");s=d&&j(d)}n(s)}),ee(()=>{var r=a();if(q(e,r,t),t&&r===void 0){var i=e.querySelector(":checked");i!==null&&(r=j(i),n(r))}e.__value=r,t=!1}),ye(e)}function j(e){return"__value"in e?e.__value:e.value}const G=Symbol("class"),C=Symbol("style"),we=Symbol("is custom element"),ke=Symbol("is html");function $n(e){if(T){var a=!1,n=()=>{if(!a){if(a=!0,e.hasAttribute("value")){var t=e.value;O(e,"value",null),e.value=t}if(e.hasAttribute("checked")){var r=e.checked;O(e,"checked",null),e.checked=r}}};e.__on_r=n,tn(n),rn()}}function _n(e,a){a?e.hasAttribute("selected")||e.setAttribute("selected",""):e.removeAttribute("selected")}function O(e,a,n,t){var r=Ae(e);T&&(r[a]=e.getAttribute(a),a==="src"||a==="srcset"||a==="href"&&e.nodeName==="LINK")||r[a]!==(r[a]=n)&&(a==="loading"&&(e[Qe]=n),n==null?e.removeAttribute(a):typeof n!="string"&&_e(e).includes(a)?e[a]=n:e.setAttribute(a,n))}function In(e,a,n,t,r=!1){var i=Ae(e),s=i[we],d=!i[ke];let w=T&&s;w&&L(!1);var h=a||{},y=e.tagName==="OPTION";for(var k in a)k in n||(n[k]=null);n.class?n.class=bn(n.class):n.class=null,n[C]&&(n.style??(n.style=null));var m=_e(e);for(const g in n){let p=n[g];if(y&&g==="value"&&p==null){e.value=e.__value="",h[g]=p;continue}if(g==="class"){var I=e.namespaceURI==="http://www.w3.org/1999/xhtml";kn(e,I,p,t,a==null?void 0:a[G],n[G]),h[g]=p,h[G]=n[G];continue}if(g==="style"){An(e,p,a==null?void 0:a[C],n[C]),h[g]=p,h[C]=n[C];continue}var c=h[g];if(!(p===c&&!(p===void 0&&e.hasAttribute(g)))){h[g]=p;var u=g[0]+g[1];if(u!=="$$")if(u==="on"){const v={},o="$$"+g;let l=g.slice(2);var b=dn(l);if(sn(l)&&(l=l.slice(0,-7),v.capture=!0),!b&&c){if(p!=null)continue;e.removeEventListener(l,h[o],v),h[o]=null}if(p!=null)if(b)e[`__${l}`]=p,ln([l]);else{let _=function(S){h[g].call(this,S)};h[o]=on(l,e,_,v)}else b&&(e[`__${l}`]=void 0)}else if(g==="style")O(e,g,p);else if(g==="autofocus")nn(e,!!p);else if(!s&&(g==="__value"||g==="value"&&p!=null))e.value=e.__value=p;else if(g==="selected"&&y)_n(e,p);else{var f=g;d||(f=cn(f));var A=f==="defaultValue"||f==="defaultChecked";if(p==null&&!s&&!A)if(i[g]=null,f==="value"||f==="checked"){let v=e;const o=a===void 0;if(f==="value"){let l=v.defaultValue;v.removeAttribute(f),v.defaultValue=l,v.value=v.__value=o?l:null}else{let l=v.defaultChecked;v.removeAttribute(f),v.defaultChecked=l,v.checked=o?l:!1}}else e.removeAttribute(g);else A||m.includes(f)&&(s||typeof p!="string")?(e[f]=p,f in i&&(i[f]=an)):typeof p!="function"&&O(e,f,p)}}}return w&&L(!0),h}function Kn(e,a,n=[],t=[],r,i=!1){Ke(n,t,s=>{var d=void 0,w={},h=e.nodeName==="SELECT",y=!1;if(J(()=>{var m=a(...s.map(Y)),I=In(e,d,m,r,i);y&&h&&"value"in m&&q(e,m.value);for(let u of Object.getOwnPropertySymbols(w))m[u]||z(w[u]);for(let u of Object.getOwnPropertySymbols(m)){var c=m[u];u.description===Je&&(!d||c!==d[u])&&(w[u]&&z(w[u]),w[u]=N(()=>mn(e,()=>c))),I[u]=c}d=I}),h){var k=e;ee(()=>{q(k,d.value,!0),ye(k)})}y=!0})}function Ae(e){return e.__attributes??(e.__attributes={[we]:e.nodeName.includes("-"),[ke]:e.namespaceURI===Ye})}var ue=new Map;function _e(e){var a=ue.get(e.nodeName);if(a)return a;ue.set(e.nodeName,a=[]);for(var n,t=e,r=Element.prototype;r!==t;){n=en(t);for(var i in n)n[i].set&&a.push(i);t=Ze(t)}return a}const Tn={content:`{intro}
  fundo_1: color-mix(in srgb, var(--color-primary) 55%, transparent)
  altura_1:
  texto_1: Hi, I'm <strong>Fabio Sales</strong>, a <strong>Design Leader</strong> & <strong>Product Builder</strong> turning complex information and systems into experiences people can understand and use.
  fundo_2: var(--color-secondary)
  altura_2: 100vh
  texto_2: My work connects <strong>visual craft, product thinking, technology,</strong> and <strong>business</strong> — from information architecture and design systems to shipped software.
{}

h3: Selected Product & Design Work

Five projects and experiments, five different kinds of complexity: an editorial design system, an enterprise product, a personalized-news experiment, an early touch interface, and an exploratory prototype for conversational access to business data.

Across them, the principle is the same: <strong>understand the system deeply enough to make the experience feel simple.</strong>

{.bloco}
{imagem}
  nome: germanico.png
  tamanho: M 
  tags: Art Direction, Design, Project Management
{}

chapeu: Estadão
h4: Designing a System at Scale

<bullet texto='Design Leadership' cor='var(--color-secondary)' /> A high-frequency information product, a multidisciplinary organization, and a visual system balancing consistency, expression, production, and business constraints.

<bullet texto='My Role' cor='var(--color-secondary)' /> I led the full <a href="https://www.estadao.com.br/infograficos/economia,multiplataforma-estadao-renova-e-aprimora-sua-versao-impressa,1199439?srsltid=AfmBOormT2t7Om421rKL3coAJ6rDGkuekNsMJBuO99BxeLVj6DLQAkkT" target="_blank">redesign strategy,</a> managing the intersection of editorial goals, industrial constraints, and commercial viability. This wasn't just a visual update; it was a business restructuring.

<bullet texto='Impact' cor='var(--color-success)' /> The redesign supported operational optimization and a new advertising strategy, with an estimated <strong>R$7 million increase in EBITDA</strong> (2022).

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

A technical B2B environment where specifications, inventory, customer pricing, taxes, approvals, and ERP workflows sit behind everyday commercial decisions.

<bullet texto='Product + Engineering' cor='var(--color-secondary)' /> I designed and built digital products that expose what people need to decide while keeping operational complexity behind the interface.

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

Could a daily briefing become more useful by responding to readers’ interests? At Estadão, I contributed to a cross-functional experiment comparing personalized recommendations with the existing editorial newsletter.

<bullet texto='Experiment' cor='var(--color-secondary)' /> Two recommendation partners, ten audience clusters, and an editorial control group. Eleven versions of Saiba Agora tested how personalization changed reading behavior.

<bullet texto='Learning' cor='var(--color-secondary)' /> Click-through results were close. The value was in learning which audience groups responded, how recommendations matched their interests, and what a longer test needed to establish.

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

In 2010, as tablets were becoming a new consumer platform, we explored how financial news could move beyond the desktop metaphor. The question was not how to shrink a website onto a tablet, but how information should behave when the primary input becomes touch.

<bullet texto='Interaction' cor='var(--color-secondary)' /> Gesture-based navigation and card-like information structures made a continuous financial-news stream browsable by touch.

<bullet texto='Product Thinking' cor='var(--color-secondary)' /> Blue was an R&D prototype for learning what a new device category changed about reading, navigation, hierarchy, and information density.

<a class='sublinks' href='/blue-case'>Read the interaction design case →</a>

{.bloco}
{video}
  nome: fabia.mov
  tamanho: G
  tags: Full-Stack, Code, API, UX/UI, Project Management, Business Strategy
{}

chapeu: fab.IA
h4: An Early Conversational Experiment

A highly experimental prototype exploring whether voice and natural language could offer another way to query ERP data. It remained an initial exploration and was not pursued further.

<bullet texto='Exploration' cor='var(--color-secondary)' /> I experimented with speech recognition, custom language-processing logic, and SQL queries to connect spoken questions with business data and charts.

<bullet texto='Prototype' cor='var(--color-secondary)' /> Built with Svelte, Node.js, and D3.js. The video documents an early test of the idea, not a finished product or an established workflow for managers.
{}

{divisor}

h3: Three decades of craft. Still hands-on.

I lead design at the system level and stay close enough to the work to prototype, build, refine, and ship.

<strong>Understand complexity deeply enough to make the experience feel simple.</strong>

h5: Let's talk.

<a class='sublinks' href='mailto:fabio.sales@me.com'>fabio.sales@me.com →</a>`,showInMenu:!0,menuLabel:"Works"},xn={content:'embedWrapper: <script data-uva-id="16BCURvVTN5T-361PH0AIc9yeCZ8HyqiwtMoLSR8XEUo" src="https://arte.estadao.com.br/arc/scripts/uva-render-01.js"><\/script>',showInMenu:!1,menuLabel:""},En={content:'embedWrapper: <script data-uva-id="1l_jmg5YDdT1FSK12vozVnppMNU7bCPXmASJFl8Fi5Zs" src="https://arte.estadao.com.br/arc/scripts/uva-render-01.js"><\/script>',showInMenu:!1},Sn={content:'embedWrapper: <script data-uva-id="gz5oj3k2v9e3" src="https://arte.estadao.com.br/arc/scripts/uva-render-01.js"><\/script>',showInMenu:!1},Dn={content:"pdf: aitohtml.pdf",showInMenu:!1},Pn={content:"pdf: UvaPages.pdf",showInMenu:!1},Mn={content:"pdf: portfolio.pdf",showInMenu:!1,menuLabel:"Work"},Cn={showInMenu:!0,menuLabel:"Archive",content:`{imagem}
  nome: archive.png
  tamanho: PP
{}

chapeu: Archive
h1: A wider view

A broader selection from three decades of visual journalism, information design, art direction, storytelling, and experimental digital work.

The selected work on the home page is intentionally focused. This archive preserves the wider body of craft behind it.

Across newspapers, visual narratives, and digital experiments, these projects trace an evolving practice: finding the right form for each story, making complex subjects accessible, and giving readers a reason to look closer.

{tagSelector}

{divisor}

{imagem}
  nome: malofiej.png
  tamanho: G
  classes:
  tags: Information Design, Art Direction
  borda: 10px
{}

h3: Malofiej distinctions

Five distinctions at Malofiej, the international information-design awards often described as the “Oscars of Infographics”.

{divisor}

{bloco}
  classes: paladar-pages
  tags: Art Direction, Editorial Design
{imagem}
  nome: paladar/estadao-035-paladar-bibimbap.png
  tamanho: GG
{}
{imagem}
  nome: paladar/estadao-036-paladar-negroni.png
  tamanho: GG
{}
{imagem}
  nome: paladar/estadao-037-paladar-oveva.png
  tamanho: GG
{}
{imagem}
  nome: paladar/estadao-038-paladar-poe-um-ovo-em-cima.png
  tamanho: GG
{}
{imagem}
  nome: paladar/paladar-brasil-simples.jpg
  tamanho: GG
{}
{imagem}
  nome: paladar/paladar-margherita.jpg
  tamanho: GG
{}
{imagem}
  nome: paladar/paladar-sorvete.jpg
  tamanho: GG
{}
{imagem}
  nome: paladar/paladar-capsulas.jpg
  tamanho: GG
{}

chapeu: Paladar
h3: A fresh editorial perspective

I helped create Paladar, shaping its graphic and editorial concept as Estadão sought to modernize its portfolio of newspaper supplements. The project brought food journalism into a new visual and editorial space within the paper.
{}

{divisor}

{imagemTexto}
  imagem: favela_amazonia.png
  alt: Favela Amazônia — projeto visual sobre a urbanização na floresta amazônica
  chapeu: Favela Amazônia
  titulo: Portrait of a New Forest
  texto: Winner of the Inter American Press Association (SIP) Award. A visual investigation into urbanization in the Amazon rainforest, balancing atmosphere, evidence, and complexity without sensationalism.<br><br><a class='sublinks' href='https://infograficos.estadao.com.br/especiais/favela-amazonia/' target='_blank'>View the project →</a>
  tags: Art Direction, Editorial Design, Storytelling
{}

{divisor}

{scrollerVideo}
 intro-title: From evidence to understanding
 intro-text: The reconstruction was not illustration added after the reporting. It turned fragments, measurements, and scientific inference into something readers could understand.
 video: tapui-scrolly.mp4
 video-mobile: tapui-scrolly.mp4
 video-desktop: tapui-scrolly.mp4
 tamanho: GG
 guia: nao
 preload: auto
 altura: 1200vh
 fit: cover
 {.passo}
  posicao: 0.14
  texto: <strong>Fragments become evidence.</strong><span>Measurements connect the surviving pieces and guide the reconstruction.</span>
  classe: destaque tapui-copy
 {}
 {.passo}
  posicao: 0.50
  texto: <strong>Evidence becomes a hypothesis.</strong><span>Design makes scientific inference visible, connecting the fragments into a coherent whole.</span>
  classe: destaque tapui-copy
 {}
 {.passo}
  posicao: 0.84
  texto: <strong>An image becomes understanding.</strong><span>The reconstruction is part of the reporting: a way to explain what the evidence suggests.</span>
  classe: destaque tapui-copy
 {}
{}

{imagemTexto}
  imagem: tapuiassauro.png
  lado: direita
  classes: shadow-1
  alt: Página dupla da reconstrução do Tapuiassauro
  chapeu: Tapuiassauro
  titulo: Malofiej Gold Medal
  texto: A visual reconstruction of a newly discovered Brazilian titanosaur, translating scientific evidence into an accessible visual narrative.<br><br><a class='sublinks' href='https://www.estadao.com.br/infograficos/tapuiassauro-o-novo-dinossauro-do-brasil,ciencia,280832' target='_blank'>View the project →</a>
  tags: Information Design, Art Direction
{}

{divisor}

{imagem}
  nome: cronologia_copa.png
  tamanho: GG
  classes: var(--multiply)
  tags: Information Design, Editorial Design
{}

h3: World Cup 2010 visual timeline

A five-page visual chronology of the 2010 World Cup that assembled into a 1.5-meter-wide panel. Finalist for the Esso Award.

{divisor}

{bloco}
{imagem}
  nome: santos-dumont/dirigivel.svg
  tamanho: M
  tags: Art Direction, Editorial Design, Storytelling
{}

chapeu: Santos-Dumont
h3: Rediscovering the Inventor

An editorial special exploring Santos-Dumont through newly revealed documents, personal objects, and the evolution of his inventions. Visual storytelling connects the inventor’s public image with the experiments and traces he left behind.

<a class='sublinks' href='https://infograficos.estadao.com.br/especiais/a-redescoberta-de-santos-dumont/' target='_blank' rel='noopener noreferrer'>View the project →</a>

{}

{divisor}

{scrollerVideo}
  video: rota-segura-scrolly.mp4
  video-mobile: rota-segura-scrolly-mobile.mp4
  video-desktop: rota-segura-scrolly.mp4
  borda: 10px
  tamanho: G
  fixar: sim
  altura: 200vh
  top: 180
  proporcao: 16 / 9
  fit: contain
  fps: 24
  guia: nao
  vinheta: nao
  preload: auto
  tags: Data Visualization, Interaction Design, Code, Storytelling
{}

h3: Rota +Segura — Safer Route

Data visualization turned into utility: an interactive map helping drivers identify safer routes in São Paulo using crime data filtered by time, vehicle type, and location.

<a class='sublinks' href='https://www.estadao.com.br/sao-paulo/rota-segura-ferramenta-permite-tracar-os-trajetos-com-menos-roubos-de-veiculos/' target='_blank'>View the project →</a>

{divisor}

{imagem}
  nome: speeches.png
  tamanho: M
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
  tags: Editorial Design, Interaction Design, Information Design
{}

h3: Caro Leitor & Supercoluna

A mobile-first daily briefing for political coverage, analysis, and opinion, designed for rapid scanning with links guiding readers through the day's essential stories.

{divisor}

{bloco}
{imagem}
  nome: podcasts/identidade.png
  tamanho: GG
  tags: Art Direction
{}

chapeu: Estadão Podcasts
h3: One Family, Many Voices

A visual identity system for a growing family of podcasts. Shared rules for brand placement, typography, portraits, and color create recognition across listening platforms while giving each show room for its own personality.

News, opinion, and columnists share the institutional blue; Eldorado programs form a related family; specialist shows use a broader visual range. Consistency helps listeners recognize the publisher without making every cover look the same.
{}

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
  nome: movimento_baterista.png
  tamanho: G
  tags: Art Direction, Editorial Design, Information Design
{}

h3: The Drummer's Movement

Complete art direction and layout for André Polvo's instructional methodology, translating rhythm and musical concepts into graphic notation and a coherent learning system.

{divisor}

h3: More from the Archive

A wider selection of newspaper pages, visual stories, and editorial experiments — the craft behind the featured projects, collected across publications and decades.

{slider}
  pasta: samples
  tamanho: GG
  tempo: 3
  espaco: 32px
  padding: 40px
{}
`},Ln={content:`{imagem}
  nome: fabio-sales-about.png
  tamanho: PP
  classes: var(--shadow-2)
  borda: 50%
{}

h1: I design clarity inside complex systems

For three decades, I have worked across <strong>visual design, product, technology, and business</strong> — leading multidisciplinary teams, creating systems, and staying close to the craft.

My career did not move from design to technology. It expanded from designing information to designing the systems, interactions, and software through which people experience it.

h3: Craft is where it started

Visual journalism taught me to make unfamiliar, dense information understandable under real constraints and real deadlines. At Estadão, Diário de Notícias, Correio Braziliense, and through international consulting, I worked across typography, information architecture, data visualization, art direction, interaction, and storytelling — while leading teams responsible for products used by large audiences.

That work earned hundreds of national and international distinctions. More importantly, it taught me that craft scales only when it becomes a shared system rather than the intuition of a few individuals.

h3: Leadership means building the conditions for good work

I believe a design leader has two responsibilities at the same time: <strong>raise the quality bar</strong> and <strong>build an environment in which teams can reach it repeatedly.</strong>

That means creating principles and reusable systems, giving clear direction without prescribing every answer, connecting design decisions to business and technology, and remaining close enough to the work to recognize when the details are not good enough yet.

h3: Technology extended the design surface

Since 2010, I have increasingly worked with software as part of the design process. Today I build with JavaScript, Svelte, React, Python, SQL, APIs, ERP integrations, and AI-assisted workflows.

I do not see engineering as a second career. It gives me another way to prototype ideas, understand constraints, collaborate with technical teams, and take product decisions all the way to production.

h3: Today

At ATBL, I work at the intersection of product, operations, technology, and business transformation. The problems are very different from a newsroom, but the design challenge is familiar: complex rules, fragmented information, specialist knowledge, and users who should not have to understand the infrastructure underneath the experience.

<strong>Understand complexity deeply enough to make the experience feel simple.</strong>

{divisor}

h3: Selected career chapters

<strong>ATBL · 2025–Present</strong><br>Transformation and Innovation leadership. Product strategy, digital operations, ERP integration, AI workflows, and hands-on product development.

<strong>Independent · 2023–2025</strong><br>Product, technology, and business-process consulting; full-stack development and automation.

<strong>Estadão · 2005–2023</strong><br>Executive Art Editor. Led visual culture, redesign, information design, digital experimentation, and multidisciplinary creative teams.

<strong>Diário de Notícias, Portugal · 2003–2005</strong><br>Consultant and Art Director. Led a redesign recognized by SND-e as Best Designed Newspaper in Iberia.

<strong>Consulting & teaching</strong><br>Visual strategy, redesigns, and newsroom training for organizations in Brazil, Portugal, Mexico, and Peru; lectures and workshops at international design and journalism events.

{divisor}

h3: Design leader. Product builder. Still hands-on

I am interested in teams working on consequential products where complexity is unavoidable — but complexity in the user experience is not.

<a class='sublinks' href='/'>See selected work →</a><br><a class='sublinks' href='mailto:fabio.sales@me.com'>fabio.sales@me.com →</a>`,showInMenu:!0,menuLabel:"About"},jn={content:"ai2html: timeline",showInMenu:!1,menuLabel:""},Nn={content:'embedWrapper: <script data-uva-id="1hmrQSCQHmvKXDWXthTyoGPtjIvTyogFNoOZmqPm2NDw" src="https://arte.estadao.com.br/arc/scripts/uva-render-01.js"><\/script>',showInMenu:!1,menuLabel:"Manual"},zn={content:'embedWrapper: <script data-uva-id="1hmrQSCQHmvKXDWXthTyoGPtjIvTyogFNoOZmqPm2NDw" src="https://arte.estadao.com.br/arc/scripts/uva-render-02.js"><\/script>',showInMenu:!1,menuLabel:""},Bn={content:`{carrossel}
  pasta: blue
  tempo: 6s
  fade: 1.5s
  tamanho: G
  classes: shadow-1
  tags: Product Design, UX/UI, Interaction Design
{}

h1: Blue — Designing for a New Interaction Model

<strong>Consumer interaction / Touch interfaces / Information architecture / R&D</strong>

Blue was created in 2010, when the tablet was still an emerging consumer platform. Rather than treat the device as a smaller desktop, the project asked: <strong>what changes when people navigate information primarily with their hands?</strong>

h3: The context

Financial news is continuous, dense, and time-sensitive. A touch device introduced different constraints from desktop: direct manipulation, changing orientation, less visible navigation chrome, and a stronger relationship between gesture and spatial movement.

h3: The interaction hypothesis

We explored gesture-based navigation and card-like structures for moving through the news stream. The goal was to create a spatial model people could understand through touch rather than reproduce the desktop interface.

h3: Designing before the pattern library existed

Today cards, swipes, touch targets, and responsive information blocks are ordinary vocabulary. At the time those conventions were still being negotiated. Blue was R&D as much as interface design: prototype, understand the medium, and establish useful patterns rather than wait for mature conventions to copy.

h3: Why it still matters

The visual language belongs to 2010. <strong>The product question does not:</strong> understand the capabilities and constraints of the platform, then design behavior around people rather than around the previous technology.

<a class='sublinks' href='/'>← Back to selected work</a>`,showInMenu:!1,menuLabel:"Blue Case Study"},Rn={content:`imagem: germanico.png, G

h1: Estadão — Designing a System at Scale

<strong>Design leadership / Information architecture / Visual systems / Organizational change</strong>

A newspaper redesign can look like a graphic-design exercise. The real challenge was systemic: evolve a daily information product while balancing readers, editorial priorities, industrial production, advertising, digital workflows, and business performance.

h3: A high-frequency interface before we called it product design

Every day the content changes completely. The interface cannot. Readers need to recognize hierarchy and scan dense information in seconds; editors need flexibility without rebuilding the language every morning. <strong>Create enough consistency to make the product intuitive, and enough flexibility to keep it expressive.</strong>

h3: My role — direction and craft

I led the redesign strategy across art direction, information architecture, editorial leadership, production constraints, and commercial viability, while remaining close to typography, hierarchy, grids, modules, data visualization, and visual storytelling.

h3: From pages to reusable decisions

The system established reusable principles for typography, hierarchy, modular layouts, recurring patterns, and visual language — boundaries within which teams could make good decisions.

<a class='sublinks' href='https://fhrsales.github.io/design-system-estadao/' target='_blank'>Explore the redesign and design system →</a><br><a class='sublinks' href='/manual' target='_blank'>Explore interactive & multimedia UI components →</a>

h3: Craft and business

The redesign supported production optimization and a new advertising strategy; its business case estimated a <strong>R$7 million increase in EBITDA in 2022</strong>.

<a class='sublinks' href='/pdfs/estadao_ca.pdf' target='_blank'>Read the strategic business case →</a><br><a class='sublinks' href='/pdfs/estadao_comercial.pdf' target='_blank'>See the advertising strategy →</a>

h3: Leadership principle

<strong>A design leader should raise the quality of individual work while building a system that no longer depends on individual heroics.</strong>

<a class='sublinks' href='/'>← Back to selected work</a>`,showInMenu:!1,menuLabel:"Estadão Case Study"},Gn={content:`imagem: atbl-app.png, G

h1: ATBL — Turning Enterprise Complexity into a Usable Product

A commercial transaction sits on top of specifications, inventory, customer pricing, taxes, approvals, ERP processes, documentation, and relationships. The design question was <strong>which complexity users need to see — and which complexity the system should absorb for them.</strong>

h3: Product principles

<bullet texto='Expose decisions, not ERP structure' cor='var(--color-secondary)' /> Show information needed to act, not infrastructure.

<bullet texto='Respect real business rules' cor='var(--color-secondary)' /> Pricing, inventory, taxes, agreements, and status must reflect operational systems.

<bullet texto='Reduce repeated work' cor='var(--color-secondary)' /> Data already known by the ERP should not be reconstructed manually.

<bullet texto='Keep experts on expert problems' cor='var(--color-secondary)' /> Self-service handles routine information; technical salespeople focus on complex work.

h3: The system behind the experience

{imagem}
  nome: atbl-ecosystem.svg
  tamanho: GG
  tags: Product Design, Systems Thinking, Information Architecture
{}

<strong>Complexity stays behind the experience.</strong> Customer-facing journeys connect to live operational data across portal, ERP, billing, and delivery.

h3: Designing for technical B2B

More than <strong>20,000 active products</strong> require structured images, dimensions, attributes, standards, and technical metadata before an interface can make them meaningfully searchable. I designed and built products integrated with Sankhya ERP, keeping product decisions grounded in real inventory, pricing, and operational rules.

h3: From interface to operating model

Digital channels handle first-level service, stock and price checks, and order tracking; technical salespeople remain focused on engineering solutions and strategic negotiations. The company recorded a <strong>12.5% revenue increase</strong> alongside these operational changes; I treat that as business context, not as a claim that interface design alone caused growth.

h3: What this work demonstrates

My role spans product judgment, information architecture, business rules, interaction decisions, technical implementation, and organizational adoption. <strong>Understand complexity deeply enough to make the experience feel simple.</strong>

<a class='sublinks' href='/'>← Back to selected work</a>`,showInMenu:!1,menuLabel:"ATBL Case Study"},qn={showInMenu:!1,menuLabel:"Personalized Newsletters",content:`{imagem}
  nome: newsletters/saiba-agora.jpg
  tamanho: P
{}

h1: Personalized Newsletters — Testing Relevance at Scale

<strong>Product experimentation / Editorial relevance / Cross-functional collaboration</strong>

A daily newsletter gives every reader the same editorial selection. This experiment asked whether recommendations based on reading behavior could make that selection more relevant — and whether the evidence would justify changing the product.



h3: My contribution

I was part of the cross-functional Estadão team behind the InovaBra newsletter experiment, alongside colleagues from editorial, commercial, digital strategy, reader revenue, and technology. The work brought editorial judgment, recommendation systems, and audience measurement into the same product discussion.

h3: An experiment inside an existing habit

The test used Saiba Agora, an established subscriber briefing. Beluga and Itera each created five audience clusters using browsing history and two months of news coverage. Each partner recommended four stories per cluster.

From December 10 to 16, the team sent eleven newsletter versions: five for each partner and one editorial control. Keeping the existing newsletter as a reference made it possible to compare personalization with the experience readers already knew.

h3: Relevance needed more than a click

The evaluation combined click-through rates on recommended stories, bounce rate, and reading time with a qualitative review of the editorial selections. Audience groups behaved differently, and the largest clusters strongly influenced the averages.

{imagem}
  nome: newsletters/resultados.jpg
  tamanho: G
{}

h3: What the results actually showed

Click-through results were close across Beluga, Itera, and Estadão. Some smaller clusters performed better, but the short test did not establish a clear overall uplift. Both partners showed lower bounce rates; reading time was higher for the existing Estadão selection.

The useful signal was more specific: Beluga’s audience groups were more distinct, and its daily recommendations showed stronger affinity with those groups. Delivery processes and clarity of collaboration also mattered when assessing the next step.

h3: The decision was another test

The report recommended a further 30-day round with Beluga, ten refined clusters, and better automated measurement. That was a proposed next phase, not evidence of a completed rollout or a proven long-term gain.

h3: What this work demonstrates

Personalization is a product hypothesis that needs editorial and behavioral evidence. A responsible experiment makes the comparison explicit, exposes uncertainty, and turns mixed results into a better next decision.

<a class='sublinks' href='/'>← Back to selected work</a>`},On={index:Tn,placar:xn,minhocao:En,rota_segura:Sn,ai2html:Dn,uvapages:Pn,portfolio:Mn,archive:Cn,about:Ln,design_system:jn,Teste:Nn,manual:zn,blue_case:Bn,estadao:Rn,atbl:Gn,newsletters:qn},Qn=un(structuredClone(On));function Yn(e,a){return hn+gn(e,a)}export{Kn as a,Qn as b,kn as c,Xn as d,Hn as e,$n as f,bn as g,An as h,Wn as i,On as p,Yn as r,O as s};
