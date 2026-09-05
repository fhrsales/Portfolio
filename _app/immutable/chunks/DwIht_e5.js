import{j as Ue,h as S,d as je,v as j,Z as ze,az as Fe,_ as ce,n as K,s as O,o as H,C as Ve,aQ as He,aF as ue,V as G,i as Y,aX as P,k as z,aY as qe,X as Ge,a8 as We,ar as ne,aP as ae,aZ as Xe,a_ as $e,x as Ke,a5 as de,a$ as Ye,a4 as Qe,R as Ie,U as Ae,b0 as Q,b1 as Ze,aN as Je,W as en,T as W,l as nn,p as an,b2 as Ee,as as Se,b3 as tn,b4 as Pe,e as te,b5 as fe,b6 as he,O as rn,b7 as sn,b8 as Ce,b9 as on,ba as ln,bb as cn,bc as un,bd as dn,be as fn,bf as hn,bg as gn,al as $,bh as pn,bi as vn,bj as mn,bk as bn,c as yn,aT as wn,aq as ge,ap as pe,u as _n,bl as kn,K as Tn,ac as In}from"./DWMLugUo.js";import{i as An,d as En,a as Sn,c as Pn,n as Cn,b as Ln}from"./6fwn_5k2.js";import{b as Dn}from"./Cg1unmH1.js";import{r as Mn}from"./lQG_lTkG.js";import{w as Nn}from"./Ck_loToL.js";function ba(e,a){return a}function xn(e,a,n){for(var t=[],r=a.length,s,i=a.length,l=0;l<r;l++){let p=a[l];Ae(p,()=>{if(s){if(s.pending.delete(p),s.done.add(p),s.pending.size===0){var f=e.outrogroups;ee(e,ae(s.done)),f.delete(s),f.size===0&&(e.outrogroups=null)}}else i-=1},!1)}if(i===0){var u=t.length===0&&n!==null&&e.pending.size===0;if(u){var d=n,o=d.parentNode;Je(o),o.append(d),e.items.clear()}ee(e,a,!u)}else s={pending:new Set(a),done:new Set},(e.outrogroups??(e.outrogroups=new Set)).add(s)}function ee(e,a,n=!0){var t;if(e.pending.size>0){t=new Set;for(const i of e.pending.values())for(const l of i)t.add(e.items.get(l).e)}for(var r=0;r<a.length;r++){var s=a[r];if(t!=null&&t.has(s)){s.f|=P;const i=document.createDocumentFragment();en(s,i)}else W(a[r],n)}}var ve;function ya(e,a,n,t,r,s=null){var i=e,l=new Map,u=(a&Ee)!==0;if(u){var d=e;i=S?K(an(d)):d.appendChild(Y())}S&&je();var o=null,p=We(()=>{var _=n();return ne(_)?_:_==null?[]:ae(_)}),f,y=new Map,v=!0;function I(_){(w.effect.f&Qe)===0&&(w.pending.delete(_),w.fallback=o,Rn(w,f,i,a,t),o!==null&&(f.length===0?(o.f&P)===0?Ie(o):(o.f^=P,B(o,null,i)):Ae(o,()=>{o=null})))}function c(_){w.pending.delete(_)}var m=Ue(()=>{f=j(p);var _=f.length;let b=!1;if(S){var M=ze(i)===Fe;M!==(_===0)&&(i=ce(),K(i),O(!1),b=!0)}for(var g=new Set,h=G,T=Ge(),A=0;A<_;A+=1){S&&H.nodeType===Ve&&H.data===He&&(i=H,b=!0,O(!1));var k=f[A],C=t(k,A),E=v?null:l.get(C);E?(E.v&&ue(E.v,k),E.i&&ue(E.i,A),T&&h.unskip_effect(E.e)):(E=Bn(l,v?i:ve??(ve=Y()),k,C,A,r,a,n),v||(E.e.f|=P),l.set(C,E)),g.add(C)}if(_===0&&s&&!o&&(v?o=z(()=>s(i)):(o=z(()=>s(ve??(ve=Y()))),o.f|=P)),_>g.size&&qe(),S&&_>0&&K(ce()),!v)if(y.set(h,g),T){for(const[F,V]of l)g.has(F)||h.skip_effect(V.e);h.oncommit(I),h.ondiscard(c)}else I(h);b&&O(!0),j(p)}),w={effect:m,items:l,pending:y,outrogroups:null,fallback:o};v=!1,S&&(i=H)}function x(e){for(;e!==null&&(e.f&Ze)===0;)e=e.next;return e}function Rn(e,a,n,t,r){var k,C,E,F,V,re,se,ie,oe;var s=(t&tn)!==0,i=a.length,l=e.items,u=x(e.effect.first),d,o=null,p,f=[],y=[],v,I,c,m;if(s)for(m=0;m<i;m+=1)v=a[m],I=r(v,m),c=l.get(I).e,(c.f&P)===0&&((C=(k=c.nodes)==null?void 0:k.a)==null||C.measure(),(p??(p=new Set)).add(c));for(m=0;m<i;m+=1){if(v=a[m],I=r(v,m),c=l.get(I).e,e.outrogroups!==null)for(const L of e.outrogroups)L.pending.delete(c),L.done.delete(c);if((c.f&Q)!==0&&(Ie(c),s&&((F=(E=c.nodes)==null?void 0:E.a)==null||F.unfix(),(p??(p=new Set)).delete(c))),(c.f&P)!==0)if(c.f^=P,c===u)B(c,null,n);else{var w=o?o.next:u;c===e.effect.last&&(e.effect.last=c.prev),c.prev&&(c.prev.next=c.next),c.next&&(c.next.prev=c.prev),D(e,o,c),D(e,c,w),B(c,w,n),o=c,f=[],y=[],u=x(o.next);continue}if(c!==u){if(d!==void 0&&d.has(c)){if(f.length<y.length){var _=y[0],b;o=_.prev;var M=f[0],g=f[f.length-1];for(b=0;b<f.length;b+=1)B(f[b],_,n);for(b=0;b<y.length;b+=1)d.delete(y[b]);D(e,M.prev,g.next),D(e,o,M),D(e,g,_),u=_,o=g,m-=1,f=[],y=[]}else d.delete(c),B(c,u,n),D(e,c.prev,c.next),D(e,c,o===null?e.effect.first:o.next),D(e,o,c),o=c;continue}for(f=[],y=[];u!==null&&u!==c;)(d??(d=new Set)).add(u),y.push(u),u=x(u.next);if(u===null)continue}(c.f&P)===0&&f.push(c),o=c,u=x(c.next)}if(e.outrogroups!==null){for(const L of e.outrogroups)L.pending.size===0&&(ee(e,ae(L.done)),(V=e.outrogroups)==null||V.delete(L));e.outrogroups.size===0&&(e.outrogroups=null)}if(u!==null||d!==void 0){var h=[];if(d!==void 0)for(c of d)(c.f&Q)===0&&h.push(c);for(;u!==null;)(u.f&Q)===0&&u!==e.fallback&&h.push(u),u=x(u.next);var T=h.length;if(T>0){var A=(t&Ee)!==0&&i===0?n:null;if(s){for(m=0;m<T;m+=1)(se=(re=h[m].nodes)==null?void 0:re.a)==null||se.measure();for(m=0;m<T;m+=1)(oe=(ie=h[m].nodes)==null?void 0:ie.a)==null||oe.fix()}xn(e,h,A)}}s&&Se(()=>{var L,le;if(p!==void 0)for(c of p)(le=(L=c.nodes)==null?void 0:L.a)==null||le.apply()})}function Bn(e,a,n,t,r,s,i,l){var u=(i&Xe)!==0?(i&$e)===0?Ke(n,!1,!1):de(n):null,d=(i&Ye)!==0?de(r):null;return{v:u,i:d,e:z(()=>(s(a,u??n,d??r,l),()=>{e.delete(t)}))}}function B(e,a,n){if(e.nodes)for(var t=e.nodes.start,r=e.nodes.end,s=a&&(a.f&P)===0?a.nodes.start:n;t!==null;){var i=nn(t);if(s.before(t),t===r)return;t=i}}function D(e,a,n){a===null?e.effect.first=n:a.next=n,n===null?e.effect.last=a:n.prev=a}function On(e,a){var n=void 0,t;Pe(()=>{n!==(n=a())&&(t&&(W(t),t=null),n&&(t=z(()=>{te(()=>n(e))})))})}function Le(e){var a,n,t="";if(typeof e=="string"||typeof e=="number")t+=e;else if(typeof e=="object")if(Array.isArray(e)){var r=e.length;for(a=0;a<r;a++)e[a]&&(n=Le(e[a]))&&(t&&(t+=" "),t+=n)}else for(n in e)e[n]&&(t&&(t+=" "),t+=n);return t}function Un(){for(var e,a,n=0,t="",r=arguments.length;n<r;n++)(e=arguments[n])&&(a=Le(e))&&(t&&(t+=" "),t+=a);return t}function jn(e){return typeof e=="object"?Un(e):e??""}const me=[...` 	
\r\f \v\uFEFF`];function zn(e,a,n){var t=e==null?"":""+e;if(a&&(t=t?t+" "+a:a),n){for(var r of Object.keys(n))if(n[r])t=t?t+" "+r:r;else if(t.length)for(var s=r.length,i=0;(i=t.indexOf(r,i))>=0;){var l=i+s;(i===0||me.includes(t[i-1]))&&(l===t.length||me.includes(t[l]))?t=(i===0?"":t.substring(0,i))+t.substring(l+1):i=l}}return t===""?null:t}function be(e,a=!1){var n=a?" !important;":";",t="";for(var r of Object.keys(e)){var s=e[r];s!=null&&s!==""&&(t+=" "+r+": "+s+n)}return t}function Z(e){return e[0]!=="-"||e[1]!=="-"?e.toLowerCase():e}function Fn(e,a){if(a){var n="",t,r;if(Array.isArray(a)?(t=a[0],r=a[1]):t=a,e){e=String(e).replaceAll(/\/\*.*?\*\//g,"").trim();var s=!1,i=0,l=!1,u=[];t&&u.push(...Object.keys(t).map(Z)),r&&u.push(...Object.keys(r).map(Z));var d=0,o=-1;const I=e.length;for(var p=0;p<I;p++){var f=e[p];if(l?f==="/"&&e[p-1]==="*"&&(l=!1):s?s===f&&(s=!1):f==="/"&&e[p+1]==="*"?l=!0:f==='"'||f==="'"?s=f:f==="("?i++:f===")"&&i--,!l&&s===!1&&i===0){if(f===":"&&o===-1)o=p;else if(f===";"||p===I-1){if(o!==-1){var y=Z(e.substring(d,o).trim());if(!u.includes(y)){f!==";"&&p++;var v=e.substring(d,p).trim();n+=" "+v+";"}}d=p+1,o=-1}}}}return t&&(n+=be(t)),r&&(n+=be(r,!0)),n=n.trim(),n===""?null:n}return e==null?null:String(e)}function Vn(e,a,n,t,r,s){var i=e[fe];if(S||i!==n||i===void 0){var l=zn(n,t,s);(!S||l!==e.getAttribute("class"))&&(l==null?e.removeAttribute("class"):a?e.className=l:e.setAttribute("class",l)),e[fe]=n}else if(s&&r!==s)for(var u in s){var d=!!s[u];(r==null||d!==!!r[u])&&e.classList.toggle(u,d)}return s}function J(e,a={},n,t){for(var r in n){var s=n[r];a[r]!==s&&(n[r]==null?e.style.removeProperty(r):e.style.setProperty(r,s,t))}}function Hn(e,a,n,t){var r=e[he];if(S||r!==a){var s=Fn(a,t);(!S||s!==e.getAttribute("style"))&&(s==null?e.removeAttribute("style"):e.style.cssText=s),e[he]=a}else t&&(Array.isArray(t)?(J(e,n==null?void 0:n[0],t[0]),J(e,n==null?void 0:n[1],t[1],"important")):J(e,n,t));return t}function De(e,a){a?e.hasAttribute("selected")||e.setAttribute("selected",""):e.removeAttribute("selected")}function ye(e,a){var n=!("__defaultValue"in e);!n&&e.__defaultValue===a||(e.__defaultValue=a,Me(e,!n||"__value"in e))}function Me(e,a){var n=e.__defaultValue,t=e.multiple,r=t?n??[]:null;if(!(t&&!ne(r))){var s=e.selectedIndex,i=a&&t?new Set(e.selectedOptions):null;for(var l of e.options){var u=N(l);De(l,t?r.includes(u):Ce(u,n))}if(a)if(i!==null)for(l of e.options){var d=i.has(l);l.selected!==d&&(l.selected=d)}else e.selectedIndex!==s&&(e.selectedIndex=s)}}function X(e,a,n=!1){if(e.multiple){if(a==null)return;if(!ne(a))return on();for(var t of e.options)t.selected=a.includes(N(t));return}for(t of e.options){var r=N(t);if(Ce(r,a)){t.selected=!0;return}}(!n||a!==void 0)&&(e.selectedIndex=-1)}function qn(e){var a=new MutationObserver(n=>{n.every(Gn)||("__defaultValue"in e&&Me(e,!1),"__value"in e&&X(e,e.__value))});a.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),rn(()=>{a.disconnect()})}function wa(e,a,n=a){var t=new WeakSet,r=!0;sn(e,"change",s=>{var i=s?"[selected]":":checked",l;if(e.multiple)l=[].map.call(e.querySelectorAll(i),N);else{var u=e.querySelector(i)??e.querySelector("option:not([disabled])");l=u&&N(u)}n(l),e.__value=l,G!==null&&t.add(G)}),te(()=>{var s=a();if(e===document.activeElement){var i=G;if(t.has(i))return}if(X(e,s,r),r&&s===void 0){var l=e.querySelector(":checked");l!==null&&(s=N(l),n(s))}e.__value=s,r=!1})}function N(e){return"__value"in e?e.__value:e.value}function Gn(e){if(e.target.closest("selectedcontent")!==null)return!0;if(e.type==="childList"){var a=[...e.addedNodes,...e.removedNodes];return a.length>0&&a.every(n=>n.nodeName==="SELECTEDCONTENT")}return!1}const q=Symbol("class"),R=Symbol("style"),Ne=Symbol("is custom element"),xe=Symbol("is html"),Wn=$?"link":"LINK",we=$?"input":"INPUT",Xn=$?"option":"OPTION",Re=$?"select":"SELECT";function $n(e){if(S){var a=!1,n=()=>{if(!a){if(a=!0,e.hasAttribute("value")){var t=e.value;U(e,"value",null),e.value=t}if(e.hasAttribute("checked")){var r=e.checked;U(e,"checked",null),e.checked=r}}};e[mn]=n,Se(n),bn()}}function U(e,a,n,t){var r=Be(e);S&&(r[a]=e.getAttribute(a),a==="src"||a==="srcset"||a==="href"&&e.nodeName===Wn)||r[a]!==(r[a]=n)&&(a==="loading"&&(e[cn]=n),n==null?e.removeAttribute(a):typeof n!="string"&&Oe(e).has(a)?e[a]=n:e.setAttribute(a,n))}function Kn(e,a,n,t,r=!1,s=!1){S&&r&&e.nodeName===we&&("defaultValue"in n||"defaultChecked"in n||$n(e));var i=Be(e),l=i[Ne],u=!i[xe];let d=S&&l;d&&O(!1);var o=a||{},p=e.nodeName===Xn,f=e.nodeName===Re;for(var y in a)!(y in n)&&y[0]+y[1]!=="$$"&&(n[y]=null);n.class?n.class=jn(n.class):n.class=null,n[R]&&(n.style??(n.style=null));var v=Oe(e);if(e.nodeName===we&&"type"in n&&("value"in n||"__value"in n)){var I=n.type;(I!==o.type||I===void 0&&e.hasAttribute("type"))&&(o.type=I,U(e,"type",I))}for(const g in n){let h=n[g];if(p&&g==="value"&&h==null){e.value=e.__value="",o[g]=h;continue}if(g==="class"){var c=e.namespaceURI==="http://www.w3.org/1999/xhtml";Vn(e,c,h,t,a==null?void 0:a[q],n[q]),o[g]=h,o[q]=n[q];continue}if(g==="style"){Hn(e,h,a==null?void 0:a[R],n[R]),o[g]=h,o[R]=n[R];continue}var m=o[g];if(!(h===m&&!(h===void 0&&e.hasAttribute(g)))){o[g]=h;var w=g[0]+g[1];if(w!=="$$")if(w==="on"){const T={},A="$$"+g;let k=g.slice(2);var _=Ln(k);if(An(k)&&(k=k.slice(0,-7),T.capture=!0),!_&&m){if(h!=null)continue;e.removeEventListener(k,o[A],T),o[A]=null}if(_)En(k,e,h),Sn([k]);else if(h!=null){let C=function(E){o[g].call(this,E)};o[A]=Pn(k,e,C,T)}}else if(g==="style")U(e,g,h);else if(g==="autofocus")pn(e,!!h);else if(!l&&(g==="__value"||g==="value"&&h!=null))e.value=e.__value=h;else if(g==="selected"&&p)De(e,h);else{var b=g;u||(b=Cn(b));var M=b==="defaultValue"||b==="defaultChecked";if(f&&b==="defaultValue")continue;if(h==null&&!l&&!M)if(i[g]=null,b==="value"||b==="checked"){let T=e;const A=a===void 0;if(b==="value"){let k=T.defaultValue;T.removeAttribute(b),T.defaultValue=k,T.value=T.__value=A?k:null}else{let k=T.defaultChecked;T.removeAttribute(b),T.defaultChecked=k,T.checked=A?k:!1}}else e.removeAttribute(g);else M||(l||typeof h!="string")&&v.has(b)?(e[b]=h,b in i&&(i[b]=vn)):typeof h!="function"&&U(e,b,h)}}}return d&&O(!0),o}function _a(e,a,n=[],t=[],r=[],s,i=!1,l=!1){ln(r,n,t,u=>{var d=void 0,o={},p=e.nodeName===Re,f=!1;if(Pe(()=>{var v=a(...u.map(j)),I=Kn(e,d,v,s,i,l);if(f&&p){var c=e;"defaultValue"in v&&ye(c,v.defaultValue),"value"in v&&X(c,v.value)}for(let w of Object.getOwnPropertySymbols(o))v[w]||W(o[w]);for(let w of Object.getOwnPropertySymbols(v)){var m=v[w];w.description===hn&&(!d||m!==d[w])&&(o[w]&&W(o[w]),o[w]=z(()=>On(e,()=>m))),I[w]=m}d=I}),p){var y=e;te(()=>{var v=d;"defaultValue"in v&&ye(y,v.defaultValue),X(y,v.value,!0),qn(y)})}f=!0})}function Be(e){var a;return e[a=un]??(e[a]={[Ne]:e.nodeName.includes("-"),[xe]:e.namespaceURI===dn})}var _e=new Map;function Oe(e){var a=e.getAttribute("is")||e.nodeName,n=_e.get(a);if(n)return n;_e.set(a,n=new Set);for(var t,r=e,s=Element.prototype;s!==r;){t=gn(r);for(var i in t)t[i].set&&i!=="innerHTML"&&i!=="textContent"&&i!=="innerText"&&n.add(i);r=fn(r)}return n}function ka(e=!1){const a=yn,n=a.l.u;if(!n)return;let t=()=>Tn(a.s);if(e){let r=0,s={};const i=In(()=>{let l=!1;const u=a.s;for(const d in u)u[d]!==s[d]&&(s[d]=u[d],l=!0);return l&&r++,r});t=()=>j(i)}n.b.length&&wn(()=>{ke(a,t),pe(n.b)}),ge(()=>{const r=_n(()=>n.m.map(kn));return()=>{for(const s of r)typeof s=="function"&&s()}}),n.a.length&&ge(()=>{ke(a,t),pe(n.a)})}function ke(e,a){if(e.l.s)for(const n of e.l.s)j(n);a()}const Yn="";function Ta(...e){if(!e[0].startsWith("/"))throw new Error(`Cannot use \`resolve(...)\` with a non-absolute pathname or route ID (got "${e[0]}"). \`resolve\` is only for internal pathnames and route IDs; external URLs should be used directly.`);return Dn+Yn+Mn(e[0],e[1])}const Qn={content:`{intro}
  fundo_1: color-mix(in srgb, var(--color-primary) 55%, transparent)
  altura_1:
  texto_1: Hi, I'm <strong>Fabio Sales</strong>, a <strong>Design Leader</strong> & <strong>Product Builder</strong> turning complex information and systems into experiences people can understand and use.
  fundo_2: var(--color-secondary)
  altura_2: 100vh
  texto_2: My work connects <strong>visual craft, product thinking, technology,</strong> and <strong>business</strong> — from information architecture and design systems to shipped software.
{}

{tagSelector}

h3: Selected Product & Design Work

Four projects, four different kinds of complexity: a design system used at editorial scale, an enterprise product connected to live operations, an early consumer touch-interface experiment, and a conversational interface for business data.

Across them, the principle is the same: <strong>understand the system deeply enough to make the experience feel simple.</strong>

{.bloco}
{imagem}
  nome: germanico.png
  tamanho: P 
  tags: Art Direction, Design, Project Management
{}

h4: 01 — Estadão: Designing a System at Scale

<bullet texto='Design Leadership' cor='var(--color-secondary)' /> A high-frequency information product, a multidisciplinary organization, and a visual system balancing consistency, expression, production, and business constraints.

<bullet texto='My Role' cor='var(--color-secondary)' /> I led the full <a href="https://www.estadao.com.br/infograficos/economia,multiplataforma-estadao-renova-e-aprimora-sua-versao-impressa,1199439?srsltid=AfmBOormT2t7Om421rKL3coAJ6rDGkuekNsMJBuO99BxeLVj6DLQAkkT" target="_blank">redesign strategy,</a> managing the intersection of editorial goals, industrial constraints, and commercial viability. This wasn't just a visual update; it was a business restructuring.

<bullet texto='Impact' cor='var(--color-success)' /> The redesign supported operational optimization and a new advertising strategy, with an estimated <strong>R$7 million increase in EBITDA</strong> (2022).

<a class='sublinks' href='/estadao'>Read the full design case study →</a>

<a class='sublinks' href='https://fhrsales.github.io/design-system-estadao/' target='_blank'>Explore the redesign case study & design system →</a><br><a class='sublinks' href='/manual' target='_blank'>Explore the interactive & multimedia UI components →</a><br><a class='sublinks' href='/pdfs/estadao_ca.pdf' target='_blank'>Read the strategic business case: Board approval →</a><br><a class='sublinks' href='/pdfs/estadao_comercial.pdf' target='_blank'>Advertising strategy & monetization impact →</a>

{}

{divisor}

{.bloco}
{imagem}
  nome: atbl-app.png
  tamanho: G 
  tags: Full-Stack, Code, API, UX/UI, Project Management, Business Strategy
{}

h4: 02 — ATBL: Turning Enterprise Complexity into a Usable Product

A technical B2B environment where specifications, inventory, customer pricing, taxes, approvals, and ERP workflows sit behind everyday commercial decisions.

<bullet texto='Product + Engineering' cor='var(--color-secondary)' /> I designed and built digital products that expose what people need to decide while keeping operational complexity behind the interface.

<a class='sublinks' href='/atbl'>Read the full product design case study →</a>
{}

{divisor}

{imagem}
  nome: blue/tela02.png
  nome_mobile: blue/tela02.png
  tamanho: M
  classes: shadow-1
  tags: Product Design, UX/UI, Interaction Design
{}

h4: 03 — Blue: Designing for a New Interaction Model

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

h4: 04 — fab.IA: Making Enterprise Data Conversational
A proprietary voice-activated assistant that queries the company's ERP. Instead of generic wrappers, I engineered a semantic engine that translates natural language directly into execution-ready <strong>SQL</strong>.

<bullet texto='Tech Stack' cor='var(--color-secondary)' /> Svelte, Node.js, Speech-to-Text, custom NLP logic, and <strong>D3.js</strong> for data visualization.

<bullet texto='Result' cor='var(--color-success)' /> Managers access revenue and performance metrics instantly via audio, receiving dynamic charts instead of static spreadsheets.
{}

{divisor}

h3: Three decades of craft. Still hands-on.

I lead design at the system level and stay close enough to the work to prototype, build, refine, and ship.

<strong>Understand complexity deeply enough to make the experience feel simple.</strong>

h5: Let's talk.

<a class='sublinks' href='mailto:fabio.sales@me.com'>fabio.sales@me.com →</a>`,showInMenu:!0,menuLabel:"Works & Projects"},Zn={content:'embedWrapper: <script data-uva-id="16BCURvVTN5T-361PH0AIc9yeCZ8HyqiwtMoLSR8XEUo" src="https://arte.estadao.com.br/arc/scripts/uva-render-01.js"><\/script>',showInMenu:!1,menuLabel:""},Jn={content:'embedWrapper: <script data-uva-id="1l_jmg5YDdT1FSK12vozVnppMNU7bCPXmASJFl8Fi5Zs" src="https://arte.estadao.com.br/arc/scripts/uva-render-01.js"><\/script>',showInMenu:!1},ea={content:'embedWrapper: <script data-uva-id="gz5oj3k2v9e3" src="https://arte.estadao.com.br/arc/scripts/uva-render-01.js"><\/script>',showInMenu:!1},na={content:"pdf: aitohtml.pdf",showInMenu:!1},aa={content:"pdf: UvaPages.pdf",showInMenu:!1},ta={content:"pdf: portfolio.pdf",showInMenu:!1,menuLabel:"Work"},ra={content:`imagem: fabio_sales.png, PP

h1: I design clarity inside complex systems.

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

h3: Design leader. Product builder. Still hands-on.

I am interested in teams working on consequential products where complexity is unavoidable — but complexity in the user experience is not.

<a class='sublinks' href='/'>See selected work →</a><br><a class='sublinks' href='mailto:fabio.sales@me.com'>fabio.sales@me.com →</a>`,showInMenu:!0,menuLabel:"About"},sa={content:"ai2html: timeline",showInMenu:!1,menuLabel:""},ia={content:'embedWrapper: <script data-uva-id="1hmrQSCQHmvKXDWXthTyoGPtjIvTyogFNoOZmqPm2NDw" src="https://arte.estadao.com.br/arc/scripts/uva-render-01.js"><\/script>',showInMenu:!1,menuLabel:"Manual"},oa={content:'embedWrapper: <script data-uva-id="1hmrQSCQHmvKXDWXthTyoGPtjIvTyogFNoOZmqPm2NDw" src="https://arte.estadao.com.br/arc/scripts/uva-render-02.js"><\/script>',showInMenu:!1,menuLabel:""},la={content:`{carrossel}
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

<a class='sublinks' href='/'>← Back to selected work</a>`,showInMenu:!1,menuLabel:"Blue Case Study"},ca={content:`imagem: germanico.png, G

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

<a class='sublinks' href='/'>← Back to selected work</a>`,showInMenu:!1,menuLabel:"Estadão Case Study"},ua={content:`imagem: atbl-app.png, G

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

<a class='sublinks' href='/'>← Back to selected work</a>`,showInMenu:!1,menuLabel:"ATBL Case Study"},da={index:Qn,placar:Zn,minhocao:Jn,rota_segura:ea,ai2html:na,uvapages:aa,portfolio:ta,about:ra,design_system:sa,Teste:ia,manual:oa,blue_case:la,estadao:ca,atbl:ua};async function Te(){return typeof window>"u"?{}:da}function fa(){const{subscribe:e,set:a,update:n}=Nn({});return typeof window<"u"&&Te().then(t=>a(t)).catch(()=>{}),{subscribe:e,set:t=>a(t),update:t=>n(r=>t(r)),reload:async()=>{if(typeof window<"u")try{const t=await Te();return a(t),t}catch(t){throw console.error("Failed to reload ArchiePages:",t),t}}}}const Ia=fa();export{_a as a,Ia as b,Vn as c,qn as d,ya as e,wa as f,$n as g,ba as h,ka as i,jn as j,Hn as k,da as p,Ta as r,U as s};
