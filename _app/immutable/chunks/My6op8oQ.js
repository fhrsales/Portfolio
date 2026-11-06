import{ak as Pe,aQ as Ce,aF as Ne,T as q,o as T,q as me,_ as ee,a0 as P,a1 as ge,a3 as fe,a6 as x,a2 as ve,a5 as be,aR as we,Y as J,aj as Be,g as Z,D as Me,V as Le,W as Oe,X as le,Z as B,ad as Ge,az as Re,aS as W,aT as V,aU as de,m as ze,H as ce,aC as ye,au as _e,a4 as ke,aV as Fe,aW as X,A as qe,aE as L,aX as We,ae as Ve,aY as Ue,aB as He,aZ as Je,F as Xe,y as ae,a_ as $e,a$ as Ye,a7 as Qe,al as Ze,b0 as Ke,b1 as ea,b2 as aa,b3 as na,b4 as ta,b5 as oa,b6 as ra,b7 as sa,b8 as ia}from"./DCoBOzI6.js";import{i as la,j as da,k as ca,n as ha,l as pa,w as ua}from"./CdKkCPUp.js";import{b as ma,r as ga}from"./DWQ1fZcr.js";function Xa(e,n,a){T&&me();var t=e,o=ve,r,s,i=null,w=Pe()?Ce:Ne;function h(){r&&be(r),i!==null&&(i.lastChild.remove(),t.before(i),i=null),r=s}q(()=>{if(w(o,o=n())){var f=t,_=fe();_&&(i=document.createDocumentFragment(),i.append(f=ee())),s=P(()=>a(f)),_?ge.add_callback(h):h()}}),T&&(t=x)}function $a(e,n){return n}function fa(e,n,a){for(var t=e.items,o=[],r=n.length,s=0;s<r;s++)Ue(n[s].e,o,!0);var i=r>0&&o.length===0&&a!==null;if(i){var w=a.parentNode;He(w),w.append(a),t.clear(),D(e,n[0].prev,n[r-1].next)}Je(o,()=>{for(var h=0;h<r;h++){var f=n[h];i||(t.delete(f.k),D(e,f.prev,f.next)),L(f.e,!i)}})}function Ya(e,n,a,t,o,r=null){var s=e,i={flags:n,items:new Map,first:null},w=(n&we)!==0;if(w){var h=e;s=T?J(Be(h)):h.appendChild(ee())}T&&me();var f=null,_=!1,v=new Map,I=Me(()=>{var m=a();return _e(m)?m:m==null?[]:ye(m)}),c,p;function y(){va(p,c,i,v,s,o,n,t,a),r!==null&&(c.length===0?f?ke(f):f=P(()=>r(s)):f!==null&&be(f,()=>{f=null}))}q(()=>{p??(p=Xe),c=Z(I);var m=c.length;if(_&&m===0)return;_=m===0;let k=!1;if(T){var u=Le(s)===Oe;u!==(m===0)&&(s=le(),J(s),B(!1),k=!0)}if(T){for(var g=null,b,l=0;l<m;l++){if(x.nodeType===Ge&&x.data===Re){s=x,k=!0,B(!1);break}var d=c[l],A=t(d,l);b=K(x,i,g,null,d,A,l,o,n,a),i.items.set(A,b),g=b}m>0&&J(le())}if(T)m===0&&r&&(f=P(()=>r(s)));else if(fe()){var j=new Set,O=ge;for(l=0;l<m;l+=1){d=c[l],A=t(d,l);var S=i.items.get(A)??v.get(A);S?(n&(W|V))!==0&&Ae(S,d,l,n):(b=K(null,i,null,null,d,A,l,o,n,a,!0),v.set(A,b)),j.add(A)}for(const[E,G]of i.items)j.has(E)||O.skipped_effects.add(G.e);O.add_callback(y)}else y();k&&B(!0),Z(I)}),T&&(s=x)}function va(e,n,a,t,o,r,s,i,w){var te,oe,re,se;var h=(s&We)!==0,f=(s&(W|V))!==0,_=n.length,v=a.items,I=a.first,c=I,p,y=null,m,k=[],u=[],g,b,l,d;if(h)for(d=0;d<_;d+=1)g=n[d],b=i(g,d),l=v.get(b),l!==void 0&&((te=l.a)==null||te.measure(),(m??(m=new Set)).add(l));for(d=0;d<_;d+=1){if(g=n[d],b=i(g,d),l=v.get(b),l===void 0){var A=t.get(b);if(A!==void 0){t.delete(b),v.set(b,A);var j=y?y.next:c;D(a,y,A),D(a,A,j),$(A,j,o),y=A}else{var O=c?c.e.nodes_start:o;y=K(O,a,y,y===null?a.first:y.next,g,b,d,r,s,w)}v.set(b,y),k=[],u=[],c=y.next;continue}if(f&&Ae(l,g,d,s),(l.e.f&X)!==0&&(ke(l.e),h&&((oe=l.a)==null||oe.unfix(),(m??(m=new Set)).delete(l))),l!==c){if(p!==void 0&&p.has(l)){if(k.length<u.length){var S=u[0],E;y=S.prev;var G=k[0],U=k[k.length-1];for(E=0;E<k.length;E+=1)$(k[E],S,o);for(E=0;E<u.length;E+=1)p.delete(u[E]);D(a,G.prev,U.next),D(a,y,G),D(a,U,S),c=S,y=U,d-=1,k=[],u=[]}else p.delete(l),$(l,c,o),D(a,l.prev,l.next),D(a,l,y===null?a.first:y.next),D(a,y,l),y=l;continue}for(k=[],u=[];c!==null&&c.k!==b;)(c.e.f&X)===0&&(p??(p=new Set)).add(c),u.push(c),c=c.next;if(c===null)continue;l=c}k.push(l),y=l,c=l.next}if(c!==null||p!==void 0){for(var C=p===void 0?[]:ye(p);c!==null;)(c.e.f&X)===0&&C.push(c),c=c.next;var H=C.length;if(H>0){var Se=(s&we)!==0&&_===0?o:null;if(h){for(d=0;d<H;d+=1)(re=C[d].a)==null||re.measure();for(d=0;d<H;d+=1)(se=C[d].a)==null||se.fix()}fa(a,C,Se)}}h&&qe(()=>{var ie;if(m!==void 0)for(l of m)(ie=l.a)==null||ie.apply()}),e.first=a.first&&a.first.e,e.last=y&&y.e;for(var xe of t.values())L(xe.e);t.clear()}function Ae(e,n,a,t){(t&W)!==0&&de(e.v,n),(t&V)!==0?de(e.i,a):e.i=a}function K(e,n,a,t,o,r,s,i,w,h,f){var _=(w&W)!==0,v=(w&Fe)===0,I=_?v?ze(o,!1,!1):ce(o):o,c=(w&V)===0?s:ce(s),p={i:c,v:I,k:r,a:null,e:null,prev:a,next:t};try{if(e===null){var y=document.createDocumentFragment();y.append(e=ee())}return p.e=P(()=>i(e,I,c,h),T),p.e.prev=a&&a.e,p.e.next=t&&t.e,a===null?f||(n.first=p):(a.next=p,a.e.next=p.e),t!==null&&(t.prev=p,t.e.prev=p.e),p}finally{}}function $(e,n,a){for(var t=e.next?e.next.e.nodes_start:a,o=n?n.e.nodes_start:a,r=e.e.nodes_start;r!==null&&r!==t;){var s=Ve(r);o.before(r),r=s}}function D(e,n,a){n===null?e.first=a:(n.next=a,n.e.next=a&&a.e),a!==null&&(a.prev=n,a.e.prev=n&&n.e)}function ba(e,n){var a=void 0,t;q(()=>{a!==(a=n())&&(t&&(L(t),t=null),a&&(t=P(()=>{ae(()=>a(e))})))})}function Te(e){var n,a,t="";if(typeof e=="string"||typeof e=="number")t+=e;else if(typeof e=="object")if(Array.isArray(e)){var o=e.length;for(n=0;n<o;n++)e[n]&&(a=Te(e[n]))&&(t&&(t+=" "),t+=a)}else for(a in e)e[a]&&(t&&(t+=" "),t+=a);return t}function wa(){for(var e,n,a=0,t="",o=arguments.length;a<o;a++)(e=arguments[a])&&(n=Te(e))&&(t&&(t+=" "),t+=n);return t}function ya(e){return typeof e=="object"?wa(e):e??""}const he=[...` 	
\r\f \v\uFEFF`];function _a(e,n,a){var t=e==null?"":""+e;if(n&&(t=t?t+" "+n:n),a){for(var o in a)if(a[o])t=t?t+" "+o:o;else if(t.length)for(var r=o.length,s=0;(s=t.indexOf(o,s))>=0;){var i=s+r;(s===0||he.includes(t[s-1]))&&(i===t.length||he.includes(t[i]))?t=(s===0?"":t.substring(0,s))+t.substring(i+1):s=i}}return t===""?null:t}function pe(e,n=!1){var a=n?" !important;":";",t="";for(var o in e){var r=e[o];r!=null&&r!==""&&(t+=" "+o+": "+r+a)}return t}function Y(e){return e[0]!=="-"||e[1]!=="-"?e.toLowerCase():e}function ka(e,n){if(n){var a="",t,o;if(Array.isArray(n)?(t=n[0],o=n[1]):t=n,e){e=String(e).replaceAll(/\s*\/\*.*?\*\/\s*/g,"").trim();var r=!1,s=0,i=!1,w=[];t&&w.push(...Object.keys(t).map(Y)),o&&w.push(...Object.keys(o).map(Y));var h=0,f=-1;const p=e.length;for(var _=0;_<p;_++){var v=e[_];if(i?v==="/"&&e[_-1]==="*"&&(i=!1):r?r===v&&(r=!1):v==="/"&&e[_+1]==="*"?i=!0:v==='"'||v==="'"?r=v:v==="("?s++:v===")"&&s--,!i&&r===!1&&s===0){if(v===":"&&f===-1)f=_;else if(v===";"||_===p-1){if(f!==-1){var I=Y(e.substring(h,f).trim());if(!w.includes(I)){v!==";"&&_++;var c=e.substring(h,_).trim();a+=" "+c+";"}}h=_+1,f=-1}}}}return t&&(a+=pe(t)),o&&(a+=pe(o,!0)),a=a.trim(),a===""?null:a}return e==null?null:String(e)}function Aa(e,n,a,t,o,r){var s=e.__className;if(T||s!==a||s===void 0){var i=_a(a,t,r);(!T||i!==e.getAttribute("class"))&&(i==null?e.removeAttribute("class"):n?e.className=i:e.setAttribute("class",i)),e.__className=a}else if(r&&o!==r)for(var w in r){var h=!!r[w];(o==null||h!==!!o[w])&&e.classList.toggle(w,h)}return r}function Q(e,n={},a,t){for(var o in a){var r=a[o];n[o]!==r&&(a[o]==null?e.style.removeProperty(o):e.style.setProperty(o,r,t))}}function Ta(e,n,a,t){var o=e.__style;if(T||o!==n){var r=ka(n,t);(!T||r!==e.getAttribute("style"))&&(r==null?e.removeAttribute("style"):e.style.cssText=r),e.__style=n}else t&&(Array.isArray(t)?(Q(e,a==null?void 0:a[0],t[0]),Q(e,a==null?void 0:a[1],t[1],"important")):Q(e,a,t));return t}function z(e,n,a=!1){if(e.multiple){if(n==null)return;if(!_e(n))return $e();for(var t of e.options)t.selected=n.includes(M(t));return}for(t of e.options){var o=M(t);if(Ye(o,n)){t.selected=!0;return}}(!a||n!==void 0)&&(e.selectedIndex=-1)}function Ie(e){var n=new MutationObserver(()=>{z(e,e.__value)});n.observe(e,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["value"]}),Qe(()=>{n.disconnect()})}function Qa(e,n,a=n){var t=!0;Ze(e,"change",o=>{var r=o?"[selected]":":checked",s;if(e.multiple)s=[].map.call(e.querySelectorAll(r),M);else{var i=e.querySelector(r)??e.querySelector("option:not([disabled])");s=i&&M(i)}a(s)}),ae(()=>{var o=n();if(z(e,o,t),t&&o===void 0){var r=e.querySelector(":checked");r!==null&&(o=M(r),a(o))}e.__value=o,t=!1}),Ie(e)}function M(e){return"__value"in e?e.__value:e.value}const R=Symbol("class"),N=Symbol("style"),Ee=Symbol("is custom element"),De=Symbol("is html");function Za(e){if(T){var n=!1,a=()=>{if(!n){if(n=!0,e.hasAttribute("value")){var t=e.value;F(e,"value",null),e.value=t}if(e.hasAttribute("checked")){var o=e.checked;F(e,"checked",null),e.checked=o}}};e.__on_r=a,sa(a),ia()}}function Ka(e,n){var a=ne(e);a.value===(a.value=n??void 0)||e.value===n&&(n!==0||e.nodeName!=="PROGRESS")||(e.value=n??"")}function Ia(e,n){n?e.hasAttribute("selected")||e.setAttribute("selected",""):e.removeAttribute("selected")}function F(e,n,a,t){var o=ne(e);T&&(o[n]=e.getAttribute(n),n==="src"||n==="srcset"||n==="href"&&e.nodeName==="LINK")||o[n]!==(o[n]=a)&&(n==="loading"&&(e[ea]=a),a==null?e.removeAttribute(n):typeof a!="string"&&je(e).includes(n)?e[n]=a:e.setAttribute(n,a))}function Ea(e,n,a,t,o=!1){var r=ne(e),s=r[Ee],i=!r[De];let w=T&&s;w&&B(!1);var h=n||{},f=e.tagName==="OPTION";for(var _ in n)_ in a||(a[_]=null);a.class?a.class=ya(a.class):a.class=null,a[N]&&(a.style??(a.style=null));var v=je(e);for(const u in a){let g=a[u];if(f&&u==="value"&&g==null){e.value=e.__value="",h[u]=g;continue}if(u==="class"){var I=e.namespaceURI==="http://www.w3.org/1999/xhtml";Aa(e,I,g,t,n==null?void 0:n[R],a[R]),h[u]=g,h[R]=a[R];continue}if(u==="style"){Ta(e,g,n==null?void 0:n[N],a[N]),h[u]=g,h[N]=a[N];continue}var c=h[u];if(!(g===c&&!(g===void 0&&e.hasAttribute(u)))){h[u]=g;var p=u[0]+u[1];if(p!=="$$")if(p==="on"){const b={},l="$$"+u;let d=u.slice(2);var y=pa(d);if(la(d)&&(d=d.slice(0,-7),b.capture=!0),!y&&c){if(g!=null)continue;e.removeEventListener(d,h[l],b),h[l]=null}if(g!=null)if(y)e[`__${d}`]=g,ca([d]);else{let A=function(j){h[u].call(this,j)};h[l]=da(d,e,A,b)}else y&&(e[`__${d}`]=void 0)}else if(u==="style")F(e,u,g);else if(u==="autofocus")ra(e,!!g);else if(!s&&(u==="__value"||u==="value"&&g!=null))e.value=e.__value=g;else if(u==="selected"&&f)Ia(e,g);else{var m=u;i||(m=ha(m));var k=m==="defaultValue"||m==="defaultChecked";if(g==null&&!s&&!k)if(r[u]=null,m==="value"||m==="checked"){let b=e;const l=n===void 0;if(m==="value"){let d=b.defaultValue;b.removeAttribute(m),b.defaultValue=d,b.value=b.__value=l?d:null}else{let d=b.defaultChecked;b.removeAttribute(m),b.defaultChecked=d,b.checked=l?d:!1}}else e.removeAttribute(u);else k||v.includes(m)&&(s||typeof g!="string")?(e[m]=g,m in r&&(r[m]=ve)):typeof g!="function"&&F(e,m,g)}}}return w&&B(!0),h}function en(e,n,a=[],t=[],o,r=!1){Ke(a,t,s=>{var i=void 0,w={},h=e.nodeName==="SELECT",f=!1;if(q(()=>{var v=n(...s.map(Z)),I=Ea(e,i,v,o,r);f&&h&&"value"in v&&z(e,v.value);for(let p of Object.getOwnPropertySymbols(w))v[p]||L(w[p]);for(let p of Object.getOwnPropertySymbols(v)){var c=v[p];p.description===ta&&(!i||c!==i[p])&&(w[p]&&L(w[p]),w[p]=P(()=>ba(e,()=>c))),I[p]=c}i=I}),h){var _=e;ae(()=>{z(_,i.value,!0),Ie(_)})}f=!0})}function ne(e){return e.__attributes??(e.__attributes={[Ee]:e.nodeName.includes("-"),[De]:e.namespaceURI===aa})}var ue=new Map;function je(e){var n=ue.get(e.nodeName);if(n)return n;ue.set(e.nodeName,n=[]);for(var a,t=e,o=Element.prototype;o!==t;){a=oa(t);for(var r in a)a[r].set&&n.push(r);t=na(t)}return n}function an(e){return function(...n){var a=n[0];return a.stopPropagation(),e==null?void 0:e.apply(this,n)}}function nn(e){return function(...n){var a=n[0];return a.preventDefault(),e==null?void 0:e.apply(this,n)}}const Da=JSON.parse(`{"content":"{abertura}\\n  titulo: I’m Fabio Sales. I lead design teams and still write the code.\\n{}\\n\\n{faixa}\\n  pasta: faixa\\n  tempo: 90\\n  imagem_1: console-3w.jpg | Console 3W, a proof of concept for Petrobras\\n  imagem_2: paladar-margherita.jpg | Paladar cover, Estadão\\n  imagem_3: rota_segura.jpg | Rota Segura, Estadão\\n  imagem_4: capa.jpg | Santos-Dumont cover\\n  imagem_5: estadao-036-paladar-negroni.jpg | Paladar cover, Estadão\\n  imagem_6: ofi-14.jpg | Hose assembly in the ATBL workshop app\\n  imagem_7: movimento_baterista.jpg | The Drummer's Movement\\n{}\\n\\nI design complex products and build them. At <a href='https://atbl.com.br' target='_blank' rel='noopener noreferrer'>ATBL</a> I design and program the apps the company runs on: shipping, the hose workshop, stock and counter sales, all tied to the ERP. I also help run the company.\\n\\nBefore that I spent two decades leading art and graphics teams at <a href='https://www.estadao.com.br' target='_blank' rel='noopener noreferrer'>Estadão</a>, <a href='https://www.correiobraziliense.com.br' target='_blank' rel='noopener noreferrer'>Correio Braziliense</a>, and <a href='https://www.dn.pt' target='_blank' rel='noopener noreferrer'>Diário de Notícias</a>. The job was the same in another medium: make something complicated easy to read.\\n\\n{divisor}\\n\\n{celular}\\n  pasta: atbl\\n  entrada: login.jpg\\n  entrada_alt: Sign-in screen of the ATBL shipping app\\n  alt: A phone showing the ATBL sign-in screen, with three app screens sliding out beside it\\n  tela_1: exp-05.jpg | Delivery routes\\n  tela_2: ofi-01.jpg | Workshop panel\\n  tela_3: exp-03.jpg | Order checking\\n{}\\n\\nchapeu: Now · ATBL\\nh3: The apps a company runs on\\n\\nShipping, workshop, and stock, designed and programmed by me. Three screens here; the case study shows all eight.\\n\\n{numeros}\\n  numero_1: 6,359 | Deliveries recorded since July 2024\\n  numero_2: 97% | Of confirmed deliveries have the proof of delivery attached\\n  numero_3: 9,269 | Hoses completed in the workshop since February 2025\\n  numero_4: 26,484 | Active products in the catalogue\\n  nota: Company records, as of October 13, 2026.\\n{}\\n\\n{telas}\\n  pasta: atbl\\n  imagem_1: exp-10.jpg\\n  chapeu_1: Shipping\\n  titulo_1: Proof of delivery, photographed\\n  texto_1: The driver photographs the signed receipt, and it goes back to the ERP attached to the invoice.\\n  imagem_2: ofi-19.jpg\\n  chapeu_2: Workshop\\n  titulo_2: The certificate, straight from the assembly\\n  texto_2: The test certificate is generated from what was recorded during assembly and inspection, ready to print.\\n  imagem_3: prod-06.jpg\\n  chapeu_3: Stock\\n  titulo_3: Every product has an address\\n  texto_3: On arrival, each item is scanned to a shelf position. The location is written to the product record. <a class='sublinks' href='/atbl'>Read the full product design case study →</a>\\n{}\\n\\n{divisor}\\n\\nchapeu: Proposal · Petrobras\\nh3: A control room for offshore wells, built on open data\\n\\nConsole 3W is a proof of concept I designed and programmed for a Petrobras innovation tender. It shows where offshore production is falling below normal, takes you to the platform and the well, and replays real well events to show the whole loop: detect, explain, learn.\\n\\n{telas}\\n  pasta: console-3w\\n  formato: desktop\\n  imagem_1: frota.jpg\\n  chapeu_1: Fleet\\n  titulo_1: The whole offshore fleet on one globe\\n  texto_1: 76 installations from 4.7°S to 26.5°S, drawn from public ANP data that refreshes every week. Each circle is a platform; click one to open its record.\\n  imagem_2: mes.jpg\\n  chapeu_2: Fleet\\n  titulo_2: Each well against its own normal\\n  texto_2: A well is compared with its own daily average over the previous eight months, not with a fixed target. In September 2026, 56 of 839 wells were below 70% of that normal.\\n  imagem_3: campos.jpg\\n  chapeu_3: Fleet\\n  titulo_3: Columns as tall as the oil\\n  texto_3: Up close, each platform becomes a 3D column whose height is its oil per day. The Campos basin: 36 installations, 832 thousand barrels a day.\\n  imagem_4: santos.jpg\\n  chapeu_4: Fleet\\n  titulo_4: From the map to the alarm room\\n  texto_4: The Santos basin carries 82% of the oil produced at sea. In yellow, the platforms with a replay in the alarm room, one click away.\\n  imagem_5: replay.jpg\\n  chapeu_5: Alarm room\\n  titulo_5: Real cases, replayed\\n  texto_5: Live well sensors are not public, so the room replays historical cases from 3W, Petrobras's open dataset (2013 to 2023), at 30, 120 or 600 times their speed: pressures, temperatures, and an anomaly index over time.\\n  imagem_6: alerta.jpg\\n  chapeu_6: Alarm room\\n  titulo_6: An alert that explains itself\\n  texto_6: When a well leaves its own normal, the alert says which signals changed and by how much, and what it might be, with similar cases from the past. The operator confirms it or marks a false alarm, and that answer becomes a label for the next training. <a class='sublinks' href='https://fhrsales.github.io/console-3w/' target='_blank'>Open Console 3W →</a>\\n{}\\n\\n{divisor}\\n\\n{imagem}\\n  nome: germanico.png\\n  tamanho: G\\n  legenda: Front page of O Estado de S. Paulo, April 14, 2021.\\n{}\\n\\nchapeu: Estadão\\nh3: A daily newspaper redesigned as a system\\n\\nI led the redesign across editorial, production, and advertising. Its business case estimated a R$7 million increase in EBITDA in 2022.\\n\\n<a class='sublinks' href='/estadao'>Read the full design case study →</a>\\n\\n{fragmento}\\n  nome: fragmentos/anatomia.jpg\\n  alt: Detail of the spread that explained the new Estadão to its readers\\n  legenda: Detail from “A anatomia do novo Estadão”, October 17, 2021: the spread that walked readers through the redesign, from standard to Berliner format.\\n{}\\n\\n{bloco}\\n  classes: secao-escura\\nh2: Graphics desk\\n\\nTwo decades of visual journalism came before the apps. The newsroom is where I learned to be rigorous with information and to design systems for a large audience, on a daily deadline. This is work made with the teams I led, from the printed page to digital specials.\\n\\n{imagem}\\n  nome: tapuiassauro.png\\n  tamanho: G\\n  legenda: The Tapuiassauro infographic, as printed in Estadão.\\n{}\\n\\nchapeu: Tapuiassauro\\nh3: From fossil fragments to a hypothesis you can see\\n\\nGold medal at Malofiej in 2011. Fragments, measurements, and scientific inference turned into something a reader can see.\\n\\n<a class='sublinks' href='/archive#tapuiassauro'>Scroll through the reconstruction in the archive →</a>\\n{}\\n\\n{bloco}\\n  fundo: #e8edf1\\n{imagem}\\n  nome: malofiej.png\\n  tamanho: G\\n  legenda: Digital projects from the Estadão graphics desk.\\n  classes:\\n  tags: Information Design, Art Direction\\n  borda: 10px\\n{}\\n\\nh3: Malofiej distinctions\\n\\nFive distinctions at Malofiej, the international information-design awards often described as the “Oscars of Infographics”.\\n\\n<a class='sublinks' href='/archive'>See the full archive →</a>\\n{}\\n\\n{divisor}\\n\\nchapeu: Tools\\nh3: The tools behind the pages\\n\\nA graphics desk publishes faster when designers don’t have to wait for a developer. I designed and programmed the tools that made that possible at Estadão, and this site runs on the same idea.\\n\\n{lista}\\n  item_1: Uva Pages 2.0 | A visual-story editor for the newsroom, fully optimized to work directly from a Google Docs document. Since 2023, every story published by Estadão’s multimedia team has been made with it.\\n  item_2: ai2html and Uva Charts | The route from an Illustrator file to a responsive graphic on the web, set up as a standard process for the art team. Development carried out by the team under my supervision.\\n  item_3: This site’s editor | The same notation, with a live preview and publishing to GitHub from a phone.\\n{}\\n\\n<a class='sublinks' href='/uvapages'>See how Uva Pages works →</a><br><a class='sublinks' href='/ai2html'>See how the ai2html process works →</a>\\n\\n{imagem}\\n  nome: ferramentas/editor.jpg\\n  tamanho: G\\n  classes: tela\\n  legenda: The editor of this site: the text with its markup on the left, the page as a phone shows it on the right.\\n{}\\n\\n{trajetoria}\\n  titulo: Where the work happened, and what it earned\\n  nota: Each dot is a distinction, a published mention, or a jury invitation, for my work or work I directed. Only what the record confirms is counted.\\n  inicio: 1997\\n  fim: 2026\\n  periodo_1: 1997-2000 | O Dia and O Globo\\n  periodo_2: 2000-2003 | Correio Braziliense\\n  periodo_3: 2003-2005 | Diário de Notícias, Lisbon\\n  periodo_4: 2005-2023 | Estadão\\n  periodo_5: 2023-2025 | Independent\\n  periodo_6: 2025-2026 | ATBL\\n  marco_1: 1997 | 1 | Society for News Design mention, an O Dia sports page\\n  marco_2: 2000 | 8 | Three SND silver medals and five awards of excellence\\n  marco_3: 2001 | 36 | 36 SND awards for Correio Braziliense pages of 2001, announced in 2002: three silver medals and 33 awards of excellence. The most awarded Latin American newspaper\\n  marco_4: 2002 | 9 | Six SND awards of excellence and three Prêmio Esso finalists, Correio Braziliense\\n  marco_5: 2003 | 2 | SND award of excellence for a front page; Prisma Awards mention, Portugal\\n  marco_6: 2004 | 4 | SND award of excellence and three European Newspaper Award mentions\\n  marco_7: 2005 | 3 | Three SND awards of excellence, opinion and food pages\\n  marco_8: 2009 | 1 | Malofiej jury\\n  marco_9: 2010 | 6 | Five SND awards of excellence; Prêmio Esso finalist with the World Cup timeline\\n  marco_10: 2011 | 9 | Malofiej gold for Tapuiassauro, plus one silver and three bronzes; three SND awards; Inter American Press Association award\\n  marco_11: 2012 | 4 | Four SND awards of excellence\\n  marco_12: 2015 | 8 | Vladimir Herzog twice, Esso regional for Favela Amazônia, five SND awards of excellence\\n  marco_13: 2016 | 5 | Three SND digital awards, Vladimir Herzog for Terra Bruta, Prêmio Allianz\\n  marco_14: 2018 | 5 | Three SND bronze medals for election coverage and two awards of excellence for the World Cup\\n  marco_15: 2019 | 2 | SND digital award of excellence, the inaugural speeches; Information is Beautiful, best non-English language entry, for the adoption simulation\\n  marco_16: 2020 | 3 | Malofiej silver and bronze, Inter American Press Association data journalism award\\n  marco_17: 2021 | 1 | Aberje Media of the Year, for the newspaper’s new format\\n{}\\n\\n{divisor}\\n\\n{.bloco}\\n{video}\\n  nome: fabia.mov\\n  tamanho: G\\n  tags: Full-Stack, Code, API, UX/UI, Project Management, Business Strategy\\n{}\\n\\nh3: Experiments\\n\\nfab.IA asks ERP data questions by voice, built with Svelte, Node.js, and D3.js.\\n\\nIn addition, two earlier experiments I would highlight:<br>• Personalized news recommendations<br>• Reading designed for touch\\n\\n<a class='sublinks' href='/newsletters'>Read the personalization case study →</a><br><a class='sublinks' href='/blue_case'>Read the interaction design case →</a>\\n{}\\n\\n{divisor}\\n\\nh2: Want to talk?\\n\\n<a class='sublinks' href='mailto:fabio.sales@me.com'>fabio.sales@me.com →</a>","showInMenu":true,"menuLabel":"Works"}`),ja={content:'embedWrapper: <script data-uva-id="16BCURvVTN5T-361PH0AIc9yeCZ8HyqiwtMoLSR8XEUo" src="https://arte.estadao.com.br/arc/scripts/uva-render-01.js"><\/script>',showInMenu:!1,menuLabel:""},Sa={content:'embedWrapper: <script data-uva-id="1l_jmg5YDdT1FSK12vozVnppMNU7bCPXmASJFl8Fi5Zs" src="https://arte.estadao.com.br/arc/scripts/uva-render-01.js"><\/script>',showInMenu:!1},xa={content:'embedWrapper: <script data-uva-id="gz5oj3k2v9e3" src="https://arte.estadao.com.br/arc/scripts/uva-render-01.js"><\/script>',showInMenu:!1},Pa={content:`h1: ai2html and Uva Charts — From Illustrator to the web without a developer

The art team draws charts and maps in Illustrator. I set up ai2html and Uva Charts as the team’s standard route from that file to a responsive graphic on the web, with no developer in between. Development carried out by the team under my supervision.

The deck below presents the process, in Spanish.

pdf: aitohtml.pdf`,showInMenu:!1},Ca={content:`h1: Uva Pages 2.0 — The story editor the newsroom runs on its own

<bullet texto='Role' cor='var(--color-primary)' /> Design and programming

<bullet texto='Period' cor='var(--color-primary)' /> In use at Estadão since 2023

<bullet texto='The problem' cor='var(--color-secondary)' /> Each visual story needed a developer to put the page together, so the graphics desk waited.

<bullet texto='What I did' cor='var(--color-secondary)' /> I designed and programmed Uva Pages 2.0, fully optimized to work directly from a Google Docs document. The story is written there, a custom menu inserts images, charts, quizzes, and scrollytelling, and the page is built from components that already exist.

<bullet texto='In use' cor='var(--color-success)' /> Since 2023, every story published by <a href='https://www.estadao.com.br' target='_blank' rel='noopener noreferrer'>Estadão</a>’s multimedia team has been made with it.

{fluxo}
  titulo: How Uva Pages builds a story
  titulo_esquerda: The newsroom
  esquerda_1: Google Docs | The reporter or designer writes the story there
  esquerda_2: Markup | A custom menu inserts images, charts, and scrollytelling
  esquerda_3: page.json | ArchieML turns the document into structured data
  titulo_direita: The code
  direita_1: Svelte components | One for each kind of block
  direita_2: bundle.js | Compiled once, shared by every story
  fim_1: Render
  fim_2: The published page
{}

The deck below presents the tool, in Spanish.

pdf: UvaPages.pdf`,showInMenu:!1},Na={content:"pdf: portfolio.pdf",showInMenu:!1,menuLabel:"Work"},Ba=JSON.parse(`{"showInMenu":true,"menuLabel":"Archive","content":"{imagem}\\n  nome: capitulos/snd-1997-restaurado.jpg\\n  tamanho: PP\\n  classes: legenda-lado\\n  legenda: In 1997 the Society for News Design printed this O Dia sports page under the heading “What? No award!” and called it “a great piece of work”. It was the first international mention of my work.\\n{}\\n\\nchapeu: Archive\\nh1: A wider view\\n\\nA broader selection from three decades of visual journalism, information design, art direction, storytelling, and experimental digital work.\\n\\nThe selected work on the home page is intentionally focused. This archive preserves the wider body of craft behind it.\\n\\nAcross newspapers, visual narratives, and digital experiments, these projects trace an evolving practice: finding the right form for each story, making complex subjects accessible, and giving readers a reason to look closer.\\n\\n{fragmento}\\n  nome: fragmentos/legado-olimpico.jpg\\n  alt: Cutaway drawings of two Olympic arenas, from an Estadão spread\\n  legenda: Detail from “Rio bets on efficient projects”, Estadão, 2015. Infographic by the graphics desk.\\n{}\\n\\n{tagSelector}\\n\\n{divisor}\\n\\n{video}\\n  nome: aldeia-velha.mp4\\n  tamanho: P\\n  tags: Product Design, UX/UI, Code\\n{}\\n\\nchapeu: Aldeia Velha · 2026\\nh3: A family country house, run from one app\\n\\nCalendar, bookings, notices, and monthly accounts for a family country house in Aldeia Velha, in the state of Rio de Janeiro, designed and programmed by me on fab.IO, the same design system behind the ATBL apps. Each family books its weekends with no overlaps, notices are written in a text editor and shared to the family group by link, and the monthly accounts are published for every co-owner to approve.\\n\\nIt scores 100 in all four Lighthouse categories in production. The video uses test data.\\n\\n<a class='sublinks' href='https://atbl.com.br/aldeia/' target='_blank'>Open Aldeia Velha (the app asks for a family login) →</a>\\n\\n{divisor}\\n\\n{imagem}\\n  nome: voto-a-voto.jpg\\n  tamanho: G\\n  alt: Voto a voto: the Chamber of Deputies drawn as 513 dots, with the latest roll-call vote, 252 to 176\\n  classes:\\n  tags: Information Design, Data Visualization, Code\\n  borda: 10px\\n{}\\n\\nchapeu: Voto a voto · 2026\\nh3: Every roll-call vote in Congress, member by member\\n\\nEvery roll-call vote in Brazil’s Chamber of Deputies and Federal Senate, with the result and how each member voted. The data comes from the official open-data services of both houses and refreshes twice a day. Each vote is drawn as the plenary itself, one dot per seat, and readers can browse by month or by member.\\n\\nA reader can also write to a deputy about a specific vote: the email opens already addressed, with the bill, the date and how that deputy voted. I designed and programmed it.\\n\\n<a class='sublinks' href='https://fhrsales.github.io/votacoes-camara-api/' target='_blank'>Open Voto a voto →</a>\\n\\n{divisor}\\n\\n{bloco}\\n  classes: paladar-pages\\n  tags: Art Direction, Editorial Design\\n{imagem}\\n  nome: paladar/estadao-035-paladar-bibimbap.png\\n  tamanho: GG\\n{}\\n{imagem}\\n  nome: paladar/estadao-036-paladar-negroni.png\\n  tamanho: GG\\n{}\\n{imagem}\\n  nome: paladar/estadao-037-paladar-oveva.png\\n  tamanho: GG\\n{}\\n{imagem}\\n  nome: paladar/estadao-038-paladar-poe-um-ovo-em-cima.png\\n  tamanho: GG\\n{}\\n{imagem}\\n  nome: paladar/paladar-brasil-simples.jpg\\n  tamanho: GG\\n{}\\n{imagem}\\n  nome: paladar/paladar-margherita.jpg\\n  tamanho: GG\\n{}\\n{imagem}\\n  nome: paladar/paladar-sorvete.jpg\\n  tamanho: GG\\n{}\\n{imagem}\\n  nome: paladar/paladar-capsulas.jpg\\n  tamanho: GG\\n{}\\n\\nchapeu: Paladar\\nh3: A fresh editorial perspective\\n\\nI helped create Paladar, shaping its graphic and editorial concept as <a href='https://www.estadao.com.br' target='_blank' rel='noopener noreferrer'>Estadão</a> sought to modernize its portfolio of newspaper supplements. The project brought food journalism into a new visual and editorial space within the paper.\\n{}\\n\\n{divisor}\\n\\n{imagemTexto}\\n  imagem: favela_amazonia.png\\n  alt: Favela Amazônia — projeto visual sobre a urbanização na floresta amazônica\\n  chapeu: Favela Amazônia\\n  titulo: Portrait of a New Forest\\n  texto: Winner of the Inter American Press Association (SIP) Award. A visual investigation into urbanization in the Amazon rainforest, balancing atmosphere, evidence, and complexity without sensationalism.<br><br><a class='sublinks' href='https://infograficos.estadao.com.br/especiais/favela-amazonia/' target='_blank'>View on estadao.com.br ↗</a>\\n  tags: Art Direction, Editorial Design, Storytelling\\n{}\\n\\n{divisor}\\n\\n{scrollerVideo}\\n ancora: tapuiassauro\\n intro-title: From evidence to understanding\\n intro-text: The reconstruction was not illustration added after the reporting. It turned fragments, measurements, and scientific inference into something readers could understand.\\n video: tapui-scrolly.mp4\\n video-mobile: tapui-scrolly-mobile.mp4\\n video-desktop: tapui-scrolly.mp4\\n tamanho: GG\\n guia: nao\\n preload: auto\\n altura: 1200vh\\n fit: cover\\n {.passo}\\n  posicao: 0.14\\n  texto: <strong>Fragments become evidence.</strong><span>Measurements connect the surviving pieces and guide the reconstruction.</span>\\n  classe: destaque tapui-copy\\n {}\\n {.passo}\\n  posicao: 0.50\\n  texto: <strong>Evidence becomes a hypothesis.</strong><span>Design makes scientific inference visible, connecting the fragments into a coherent whole.</span>\\n  classe: destaque tapui-copy\\n {}\\n {.passo}\\n  posicao: 0.84\\n  texto: <strong>An image becomes understanding.</strong><span>The reconstruction is part of the reporting: a way to explain what the evidence suggests.</span>\\n  classe: destaque tapui-copy\\n {}\\n{}\\n\\n{imagemTexto}\\n  imagem: tapuiassauro.png\\n  lado: direita\\n  classes: shadow-1 dupla\\n  alt: Página dupla da reconstrução do Tapuiassauro\\n  chapeu: Tapuiassauro\\n  titulo: Malofiej Gold Medal\\n  texto: A visual reconstruction of a newly discovered Brazilian titanosaur, translating scientific evidence into an accessible visual narrative. The interactive version was built in Flash and no longer runs; this is the printed spread.<br><br><a class='sublinks' href='https://doi.org/10.5151/designpro-CIDI2015-cidi_175' target='_blank'>Studied in an information-design paper (CIDI, 2015) ↗</a>\\n  tags: Information Design, Art Direction\\n{}\\n\\n{divisor}\\n\\n{imagem}\\n  nome: cronologia_copa.png\\n  tamanho: GG\\n  classes: var(--multiply)\\n  tags: Information Design, Editorial Design\\n{}\\n\\nh3: World Cup 2010 visual timeline\\n\\nA five-page visual chronology of the 2010 World Cup that assembled into a 1.5-meter-wide panel. Finalist for the Esso Award.\\n\\n{divisor}\\n\\n{bloco}\\n{imagem}\\n  nome: santos-dumont/dirigivel.svg\\n  tamanho: M\\n  tags: Art Direction, Editorial Design, Storytelling\\n{}\\n\\nchapeu: Santos-Dumont\\nh3: Rediscovering the Inventor\\n\\nAn editorial special exploring Santos-Dumont through newly revealed documents, personal objects, and the evolution of his inventions. Visual storytelling connects the inventor’s public image with the experiments and traces he left behind.\\n\\n<a class='sublinks' href='https://infograficos.estadao.com.br/especiais/a-redescoberta-de-santos-dumont/' target='_blank' rel='noopener noreferrer'>View on estadao.com.br ↗</a>\\n\\n{}\\n\\n{divisor}\\n\\n{scrollerVideo}\\n  video: rota-segura-scrolly.mp4\\n  video-mobile: rota-segura-scrolly-mobile.mp4\\n  video-desktop: rota-segura-scrolly.mp4\\n  borda: 10px\\n  tamanho: G\\n  fixar: sim\\n  altura: 200vh\\n  top: 180\\n  proporcao: 16 / 9\\n  fit: contain\\n  fps: 24\\n  guia: nao\\n  vinheta: nao\\n  preload: auto\\n  tags: Data Visualization, Interaction Design, Code, Storytelling\\n{}\\n\\nh3: Rota +Segura — Safer Route\\n\\nData visualization turned into utility: an interactive map helping drivers identify safer routes in São Paulo using crime data filtered by time, vehicle type, and location.\\n\\n<a class='sublinks' href='https://www.estadao.com.br/sao-paulo/rota-segura-ferramenta-permite-tracar-os-trajetos-com-menos-roubos-de-veiculos/' target='_blank'>View on estadao.com.br ↗</a>\\n\\n{divisor}\\n\\n{imagem}\\n  nome: speeches.png\\n  tamanho: M\\n  classes: var(--multiply)\\n  tags: Art Direction\\n{}\\n\\nh3: The Semantics of Power\\n\\nVisual analysis of Brazilian presidential inaugural speeches after redemocratization, using vocabulary size and keyword frequency to reveal political shifts.\\n\\n<a class='sublinks' href='https://www.estadao.com.br/infograficos/politica,graficos-mostram-temas-dos-discursos-de-posse-desde-volta-das-diretas,955154' target='_blank'>View on estadao.com.br ↗</a>\\n\\n{divisor}\\n\\n{imagem}\\n  nome: caro_leitor.png\\n  nome_mobile: caro_leitor-celular.jpg\\n  tamanho: GG\\n  classes: var(--multiply)\\n  tags: Editorial Design, Interaction Design, Information Design\\n{}\\n\\nh3: Caro Leitor & Supercoluna\\n\\nA mobile-first daily briefing for political coverage, analysis, and opinion, designed for rapid scanning with links guiding readers through the day's essential stories.\\n\\n{divisor}\\n\\n{bloco}\\n{imagem}\\n  nome: podcasts/identidade.png\\n  tamanho: GG\\n  tags: Art Direction\\n{}\\n\\nchapeu: Estadão Podcasts\\nh3: One Family, Many Voices\\n\\nA visual identity system for a growing family of podcasts. Shared rules for brand placement, typography, portraits, and color create recognition across listening platforms while giving each show room for its own personality.\\n\\nNews, opinion, and columnists share the institutional blue; Eldorado programs form a related family; specialist shows use a broader visual range. Consistency helps listeners recognize the publisher without making every cover look the same.\\n{}\\n\\n{divisor}\\n\\n{video}\\n  nome: green_hydrogen.mov\\n  tamanho: M\\n  tags: Motion, Art Direction, Storytelling\\n{}\\n\\nh3: Economia Verde\\n\\nA motion explainer on green hydrogen and Brazil's potential role in the transition to a low-carbon economy, part of a broader visual series on the green economy.\\n\\n{divisor}\\n\\n{imagem}\\n  nome: movimento_baterista.png\\n  tamanho: G\\n  classes: papel\\n  tags: Art Direction, Editorial Design, Information Design\\n{}\\n\\nh3: The Drummer's Movement\\n\\nComplete art direction and layout for André Polvo's instructional methodology, translating rhythm and musical concepts into graphic notation and a coherent learning system.\\n\\n<a class='sublinks' href='/pdfs/o-movimento-do-baterista.pdf' target='_blank'>Open the book (PDF, 136 pages) ↗</a>\\n\\n{divisor}\\n\\nh3: More from the Archive\\n\\nA wider selection of newspaper pages, visual stories, and editorial experiments — the craft behind the featured projects, collected across publications and decades.\\n\\nh4: Estadão, 2005–2023\\n\\n{slider}\\n  pasta: samples\\n  publicacao: estadao\\n  tamanho: GG\\n  tempo: 3\\n  espaco: 32px\\n  padding: 40px\\n{}\\n\\n{divisor}\\n\\nh4: Correio Braziliense, 2000–2003\\n\\n{slider}\\n  pasta: samples\\n  publicacao: correio\\n  tamanho: GG\\n  tempo: 3\\n  espaco: 32px\\n  padding: 40px\\n{}\\n\\n{divisor}\\n\\nh4: O Dia and O Globo, 1997–2000\\n\\n{slider}\\n  pasta: samples\\n  publicacao: o-dia, o-globo\\n  tamanho: GG\\n  tempo: 3\\n  espaco: 32px\\n  padding: 40px\\n{}\\n"}`),Ma={content:`{imagem}
  nome: fabio-sales-about.jpg
  alt: Portrait of Fabio Sales
  tamanho: PP
  classes: var(--shadow-2)
  borda: 50%
{}

h1: I design clarity inside complex systems

For three decades, I have worked across <strong>visual design, product, technology, and business</strong> — leading multidisciplinary teams, creating systems, and staying close to the craft.

My career did not move from design to technology. It expanded from designing information to designing the systems, interactions, and software through which people experience it.

{faixa}
  pasta: faixa-about
  tempo: 100
  imagem_1: atbl-giro.jpg | Stock turnover and reordering in the ATBL products app
  imagem_2: estadao-tsunami-2011.jpg | Earthquake and tsunami in Japan, Estadão, March 12, 2011
  imagem_3: atbl-vale.jpg | A hose assembly order in the ATBL workshop app
  imagem_4: estadao-arena-2012.jpg | Arena Corinthians infographic, Estadão, December 2, 2012
  imagem_5: estadao-tetra-2014.jpg | Sports cover on the World Cup final, Estadão, July 14, 2014
  imagem_6: correio-2002.jpg | “Enfim, lá!”, Correio Braziliense, 2002
  imagem_7: atbl-movimentacao.jpg | Stock movements in the ATBL products app
{}

h3: Craft is where it started

Visual journalism taught me to make unfamiliar, dense information understandable under real constraints and real deadlines. At <a href='https://www.estadao.com.br' target='_blank' rel='noopener noreferrer'>Estadão</a>, <a href='https://www.dn.pt' target='_blank' rel='noopener noreferrer'>Diário de Notícias</a>, <a href='https://www.correiobraziliense.com.br' target='_blank' rel='noopener noreferrer'>Correio Braziliense</a>, and through international consulting, I worked across typography, information architecture, data visualization, art direction, interaction, and storytelling — while leading teams responsible for products used by large audiences.

That work earned hundreds of national and international distinctions for the teams I led; the timeline on the home page plots only the ones I could confirm in public records.

h3: Leadership means building the conditions for good work

I believe a design leader has two responsibilities at the same time: <strong>raise the quality bar</strong> and <strong>build an environment in which teams can reach it repeatedly.</strong>

h3: Technology extended the design surface

Since 2010, I have increasingly worked with software as part of the design process. Today I build with JavaScript, Svelte, React, Python, SQL, APIs, ERP integrations, and AI-assisted workflows. It lets me prototype ideas and take product decisions all the way to production.

h3: Today

At <a href='https://atbl.com.br' target='_blank' rel='noopener noreferrer'>ATBL</a> I lead the digital transformation and help run the company: people management, the reorganization of the sales department around a new team of salespeople, finance, and stock. The problems are very different from a newsroom, but the design challenge is familiar: complex rules, fragmented information, and users who should not have to understand the infrastructure underneath.

{divisor}

{capitulos}
  titulo: Selected career chapters
  capitulo_1: ATBL | 2025–Present | Transformation and Innovation leadership, and company administration. Product strategy, digital operations, ERP integration, AI workflows, and hands-on product development.
  imagem_1: capitulos/atbl-telas.png
  legenda_1: Delivery routes, the workshop panel, and stock put-away in the ATBL apps.
  capitulo_2: Independent | 2023–2025 | Product, technology, and business-process consulting; full-stack development and automation.
  capitulo_3: Estadão | 2005–2023 | Executive Art Editor. Led visual culture, redesign, information design, digital experimentation, and multidisciplinary creative teams.
  imagem_3: capitulos/estadao-niemeyer.jpg
  papel_3: sim
  legenda_3: Front page of December 6, 2012, the day after Oscar Niemeyer died.
  capitulo_4: Diário de Notícias, Portugal | 2003–2005 | Consultant and Art Director. Led a redesign recognized by SND-e as Best Designed Newspaper in Iberia.
  imagem_4: capitulos/dn-estrada.jpg
  legenda_4: “Estrada mata 1390 pessoas”, a spread on road deaths in 2003, Diário de Notícias.
  papel_4: sim
  capitulo_5: Correio Braziliense | 2000–2003 | Art editor, then head of the art department. Front pages built on one strong image and one headline. In 2002 the paper won 36 Society for News Design awards, more than in any other year of its history, and was the most awarded Latin American newspaper in the competition.
  imagem_5: capitulos/correio-capa-2001.jpg
  legenda_5: “Os selvagens venceram”, front page of December 9, 2001.
  papel_5: sim
  capitulo_6: O Dia and O Globo | 1997–2000 | Designer, later deputy art editor. In 1997 the Society for News Design singled out one of my sports pages.
  imagem_6: capitulos/odia-ataque.jpg
  papel_6: sim
  legenda_6: Cover of Ataque, the sports supplement of O Dia, June 2000.
  capitulo_7: Consulting & teaching | Throughout | Redesigns and newsroom training abroad: <a href='https://www.milenio.com' target='_blank' rel='noopener noreferrer'>Grupo Milenio</a> in Mexico (2023), with eight workshops on infographics and visual storytelling; <a href='https://gestion.pe' target='_blank' rel='noopener noreferrer'>Gestión</a> and <a href='https://larepublica.pe' target='_blank' rel='noopener noreferrer'>La República</a> in Peru; and, with the Barcelona studio Cases i Associats, the redesigns of <a href='https://www.dn.pt' target='_blank' rel='noopener noreferrer'>Diário de Notícias</a> and of Ataque, O Dia’s sports supplement. <a href='https://snd-e.com/en/malofiej' target='_blank' rel='noopener noreferrer'>Malofiej</a> judge and speaker (2009) and <a href='https://www.snd.org' target='_blank' rel='noopener noreferrer'>Society for News Design</a> speaker (2003). Taught at <a href='https://www.espm.br' target='_blank' rel='noopener noreferrer'>ESPM</a>, São Paulo (2017–2019).
  imagem_7: capitulos/redacao.jpg
  marca_7: 53.5 55 15
  legenda_7: Going through printed pages with a newsroom, October 2022.
{}

{lista}
  titulo: Recognition
  texto: For work I directed or led with my teams.
  item_1: Malofiej | Jury member in 2009. Gold medal in 2011 for Tapuiassauro, among other distinctions.
  item_2: Society for News Design | Awards of excellence and bronze medals for print and digital work, from 2005 to 2020. Earlier, in 2002, Correio Braziliense was the most awarded Latin American newspaper.
  item_3: Prêmio Esso | Finalist in graphic design in 2010. Regional award for Favela Amazônia in 2015.
  item_4: Prêmio Vladimir Herzog | Favela Amazônia and Rota 66 in 2015, Terra Bruta in 2016.
  item_5: Inter American Press Association | Data journalism award in 2020.
  item_6: Information is Beautiful | Best non-English language entry in 2019.
{}

{lista}
  titulo: Written about this work
  texto: Research and articles by others that discuss projects I led.
  item_1: Joelma Melo, LinkedIn, 2021 | <a href='https://www.linkedin.com/pulse/quando-o-jornal-vira-not%C3%ADcia-joelma-melo/' target='_blank'>“Quando o jornal vira notícia”</a>: a UX researcher on how the new print Estadão was tested with readers before launch.
  item_2: Dúnya Azevedo, ESDI/UERJ, 2007 | <a href='https://www.bdtd.uerj.br:8443/bitstream/1/9136/1/Parte%201.pdf' target='_blank'>“A reinvenção de um jornal”</a>: a master’s dissertation on the Correio Braziliense front pages of 1996 to 2002, including my years as art director.
  item_3: Lima, Andrade, Monat and Spinillo, CIDI, 2015 | <a href='https://doi.org/10.5151/designpro-CIDI2015-cidi_175' target='_blank'>“A adaptação de infográficos jornalísticos”</a>: on the print and online versions of news graphics, with Tapuiassauro as an example.
  item_4: Cabral and Lucas, Intercom, 2025 | <a href='https://sistemas.intercom.org.br/pdf/submissao/regional/19/3898/05052025234149681976ed08ac9.pdf' target='_blank'>“Produção infográfica no jornalismo brasileiro em destaque no cenário internacional”</a>: records Estadão’s Information is Beautiful award for the adoption simulation.
{}

{divisor}

h3: Design leader. Product builder. Still hands-on

I am interested in teams working on consequential products where complexity is unavoidable — but complexity in the user experience is not.

<a class='sublinks' href='/'>See selected work →</a><br><a class='sublinks' href='mailto:fabio.sales@me.com'>fabio.sales@me.com →</a>`,showInMenu:!0,menuLabel:"About"},La={content:"ai2html: timeline",showInMenu:!1,menuLabel:""},Oa={content:'embedWrapper: <script data-uva-id="1hmrQSCQHmvKXDWXthTyoGPtjIvTyogFNoOZmqPm2NDw" src="https://arte.estadao.com.br/arc/scripts/uva-render-01.js"><\/script>',showInMenu:!1,menuLabel:"Manual"},Ga={content:'embedWrapper: <script data-uva-id="1hmrQSCQHmvKXDWXthTyoGPtjIvTyogFNoOZmqPm2NDw" src="https://arte.estadao.com.br/arc/scripts/uva-render-02.js"><\/script>',showInMenu:!1,menuLabel:""},Ra={content:`{imagem}
  nome: blue/tablet.png
  tamanho: M
  alt: The Blue prototype on a tablet, with the section bar across the top and a story below
  tags: Product Design, UX/UI, Interaction Design
{}

h1: Blue — Designing for a New Interaction Model

<bullet texto='Role' cor='var(--color-primary)' /> Interface design and prototype

<bullet texto='Period' cor='var(--color-primary)' /> 2010

Blue was created in 2010, when the tablet was still an emerging consumer platform. Rather than treat the device as a smaller desktop, the project asked: <strong>what changes when people navigate information primarily with their hands?</strong>

h3: The context

Financial news is continuous, dense, and time-sensitive. A touch device introduced different constraints from desktop: direct manipulation, changing orientation, less visible navigation chrome, and a stronger relationship between gesture and spatial movement.

h3: The interaction hypothesis

We explored gesture-based navigation and card-like structures for moving through the news stream. The goal was to create a spatial model people could understand through touch rather than reproduce the desktop interface.

h3: Designing before the pattern library existed

Today cards, swipes, touch targets, and responsive information blocks are ordinary vocabulary. At the time those conventions were still being negotiated. Blue was R&D as much as interface design: prototype, understand the medium, and establish useful patterns rather than wait for mature conventions to copy.

h3: Why it still matters

The visual language belongs to 2010. <strong>The product question does not:</strong> understand the capabilities and constraints of the platform, then design behavior around people rather than around the previous technology.

<a class='sublinks' href='/'>← Back to selected work</a>`,showInMenu:!1,menuLabel:"Blue Case Study"},za={content:`h1: Estadão — Designing a System at Scale

<bullet texto='Role' cor='var(--color-primary)' /> Executive Art Editor, lead of the redesign

<bullet texto='Team' cor='var(--color-primary)' /> Over 18 years at the company, at times I coordinated about 75 people across these roles: designers, photographers, infographic artists, illustrators, and data journalists

<bullet texto='Period' cor='var(--color-primary)' /> 2021, in an 18-year tenure

{antesDepois}
  antes: estadao/formato-standard.jpg
  depois: estadao/formato-berliner.jpg
  rotulo_antes: Standard, 2018
  rotulo_depois: Berliner, 2021
  alt: Two Estadão front pages at the same scale: the standard format of 2018 and the smaller Berliner format of 2021
  legenda: Front pages of January 25, 2018 and October 26, 2021, at the same scale. Drag to compare: the new page is 13 centimetres shorter and one column narrower.
  tamanho: P
{}

A newspaper redesign can look like a graphic-design exercise. The real challenge was systemic: evolve a daily information product while balancing readers, editorial priorities, industrial production, advertising, digital workflows, and business performance.

{numeros}
  numero_1: 18 | Years at the paper, from 2005 to 2023
  numero_2: R$7 million | Estimated EBITDA increase in 2022, according to the business case
  numero_3: 3 | Fronts the redesign had to serve at once: editorial, production, and advertising
{}

h3: A high-frequency interface before we called it product design

Every day the content changes completely. The interface cannot. Readers need to recognize hierarchy and scan dense information in seconds; editors need flexibility without rebuilding the language every morning. <strong>Create enough consistency to make the product intuitive, and enough flexibility to keep it expressive.</strong>

{imagem}
  nome: estadao/novo-estadao-capa.jpg
  tamanho: GG
  legenda: The special section that presented the new Estadão to readers, October 17, 2021.
{}

h3: The format was decided with readers

I led the redesign across editorial, production, and advertising. The first thing to settle was the format. In the last of five surveys over eleven months, we sent three printed prototypes to 100 subscribers and interviewed them by video call. <strong>89% preferred the Berliner format</strong>; all of them found it easier to hold, and 88% found it more comfortable to read. The new page kept practically the same column width, with larger type and more space between lines, and the launch edition walked readers through what was new.

{imagem}
  nome: estadao/pesquisa-recorte.jpg
  tamanho: GG
  legenda: The research as the paper published it on October 17, 2021.
{}

<a class='sublinks' href='https://www.linkedin.com/pulse/quando-o-jornal-vira-not%C3%ADcia-joelma-melo/' target='_blank'>A UX researcher on this process: “Quando o jornal vira notícia” (LinkedIn) ↗</a>

h3: From pages to reusable decisions

The page became 13 centimetres shorter and one column narrower. Typography, hierarchy, and the recurring modules were redrawn for the new grid, so editors build each page from known parts instead of starting from zero every morning.

<a class='sublinks' href='https://fhrsales.github.io/design-system-estadao/' target='_blank'>Explore the redesign and design system ↗</a><br><a class='sublinks' href='/manual' target='_blank'>Explore interactive & multimedia UI components →</a>

{imagem}
  nome: estadao/anatomia.jpg
  tamanho: GG
  legenda: “A anatomia do novo Estadão”, October 17, 2021. The spread explained the new format, sections, and typography to readers.
{}

h3: Craft and business

The redesign supported production optimization and a new advertising strategy; its business case estimated a <strong>R$7 million increase in EBITDA in 2022</strong>.

<a class='sublinks' href='/pdfs/estadao_ca.pdf' target='_blank'>Read the strategic business case (PDF) ↗</a><br><a class='sublinks' href='/pdfs/estadao_comercial.pdf' target='_blank'>See the advertising strategy (PDF) ↗</a>

The new format in print: front pages from its first weeks and prototype pages.

{faixa}
  pasta: faixa-estadao
  tempo: 120
  papel: sim
  imagem_1: capa-2021-10-24.jpg | Front page, October 24, 2021
  imagem_2: prototipo-afundo-1.jpg | Prototype spread for the A Fundo section, 2021
  imagem_3: prototipo-sextou.jpg | Prototype page for Sextou!, the weekend guide, 2021
  imagem_4: capa-2021-10-26.jpg | Front page, October 26, 2021
  imagem_5: prototipo-afundo-2.jpg | Prototype spread for the A Fundo section, 2021
  imagem_6: prototipo-reportagem.jpg | Prototype spread for special reports, 2021
  imagem_7: prototipo-alias.jpg | Prototype spread for Aliás, 2021
  imagem_8: capa-2021-11-04.jpg | Front page, November 4, 2021
  imagem_9: prototipo-bem-estar.jpg | Prototype cover for the Bem-estar supplement, 2021
  imagem_10: capa-2021-11-09.jpg | Front page, November 9, 2021
{}

<a class='sublinks' href='/'>← Back to selected work</a>`,showInMenu:!1,menuLabel:"Estadão Case Study"},Fa={content:`{celular}
  pasta: atbl
  entrada: login.jpg
  entrada_alt: Sign-in screen of the ATBL shipping app
  alt: A phone showing the ATBL sign-in screen, with three app screens sliding out beside it
  tela_1: exp-02.jpg | The day's orders
  tela_2: ofi-14.jpg | Hose assembly
  tela_3: prod-06.jpg | Stock put-away
{}

h1: ATBL — Turning Enterprise Complexity into a Usable Product

<bullet texto='Role' cor='var(--color-primary)' /> Transformation and Innovation lead; product design and programming

<bullet texto='Period' cor='var(--color-primary)' /> 2025–present

A commercial transaction sits on top of specifications, inventory, customer pricing, taxes, approvals, ERP processes, documentation, and relationships. The design question was <strong>which complexity users need to see — and which complexity the system should absorb for them.</strong>

h3: One decision, followed through: shipping

<bullet texto='What I saw' cor='var(--color-secondary)' /> Orders were checked on paper. Labels were typed in Word, printed, and cut out by hand. Signed delivery receipts went into paper folders, filed by month and year; when a customer asked for one, finding it could take hours.

<bullet texto='What I decided' cor='var(--color-secondary)' /> Put the whole path on the phone and let the order in the ERP be the only source. Items are scanned against it, labels print from it, and the driver photographs the signed receipt at the door.

<bullet texto='What happened' cor='var(--color-success)' /> We estimate that dispatching goods now takes at least half the time it did. Every receipt sits in a digital archive, attached to its invoice, and when a customer asks for proof we send a link.

Eight screens from the shipping, workshop, and stock apps, as they are used today.

{telas}
  pasta: atbl
  imagem_1: exp-02.jpg
  chapeu_1: Shipping
  titulo_1: The day's orders on one screen
  texto_1: How many orders are waiting, checked, labelled, and out for delivery. The shipping team opens the day here.
  imagem_2: exp-03.jpg
  chapeu_2: Shipping
  titulo_2: Checking against the order
  texto_2: Each item is scanned against the order from the ERP. A difference shows up before the box is closed, not at the customer.
  imagem_3: exp-05.jpg
  chapeu_3: Shipping
  titulo_3: The route, stop by stop
  texto_3: Deliveries are grouped by driver, with distance, time on the road, and the order of the stops.
  imagem_4: exp-10.jpg
  chapeu_4: Shipping
  titulo_4: Proof of delivery, photographed
  texto_4: The driver photographs the signed receipt, and it goes back to the ERP attached to the invoice.
  imagem_5: ofi-01.jpg
  chapeu_5: Workshop
  titulo_5: What the hose workshop produced
  texto_5: Pieces assembled and inspected, approval rate, and assembly time, by day, week, or month.
  imagem_6: ofi-14.jpg
  chapeu_6: Workshop
  titulo_6: Assembly, measured
  texto_6: The assembler records each crimping measurement against the tolerance. The app times the job without anyone pressing a stopwatch.
  imagem_7: ofi-19.jpg
  chapeu_7: Workshop
  titulo_7: The certificate, straight from the assembly
  texto_7: The test certificate is generated from what was recorded during assembly and inspection, ready to print.
  imagem_8: prod-06.jpg
  chapeu_8: Stock
  titulo_8: Every product has an address
  texto_8: On arrival, each item is scanned to a shelf position. The location is written to the product record.
{}

h3: The system behind the experience

{sistema}
  titulo_cima: What people see
  visivel_1: Customer | A technical need and a commercial context.
  visivel_2: Portal and apps | Catalogue, stock, price, documents, and order status, on one screen.
  visivel_3: Delivery | Tracking and proof of delivery come back to the same place.
  titulo_baixo: What the system absorbs
  oculto_1: Inventory | by location, live from the ERP
  oculto_2: Customer pricing | agreements and price tables
  oculto_3: Taxes | calculated per order
  oculto_4: Approvals | credit and commercial rules
  oculto_5: Billing | the approved order, without retyping
  oculto_6: Records | what the app wrote, and when
  nota: Show what a decision needs. Absorb the rest.
{}

h3: Designing for technical B2B

More than <strong>26,000 active products</strong> require structured images, dimensions, attributes, standards, and technical metadata before an interface can make them meaningfully searchable. I designed and built products integrated with <a href='https://www.sankhya.com.br' target='_blank' rel='noopener noreferrer'>Sankhya ERP</a>, keeping product decisions grounded in real inventory, pricing, and operational rules.

h3: From interface to operating model

Digital channels handle first-level service, stock and price checks, and order tracking; technical salespeople remain focused on engineering solutions and strategic negotiations. The company recorded a <strong>12.5% revenue increase</strong> alongside these operational changes; I treat that as business context, not as a claim that interface design alone caused growth.

h3: What is running today

{numeros}
  numero_1: 6,359 | Deliveries recorded since July 2024
  numero_2: 97% | Of confirmed deliveries have the proof of delivery attached
  numero_3: 9,269 | Hoses completed in the workshop since February 2025
  numero_4: 99.9% | Of inspected hoses with a satisfactory result
  numero_5: 26,484 | Active products in the catalogue
  numero_6: 84% | Of the products sold online have a photo
  nota: Company records, as of October 13, 2026.
{}

The apps share one design system and the same foundations, and they read from and write to the ERP.

<a class='sublinks' href='/'>← Back to selected work</a>`,showInMenu:!1,menuLabel:"ATBL Case Study"},qa={showInMenu:!1,menuLabel:"Personalized Newsletters",content:`{imagem}
  nome: newsletters/saiba-agora.jpg
  tamanho: P
{}

h1: Personalized Newsletters — Testing Relevance at Scale

<bullet texto='Role' cor='var(--color-primary)' /> Lead of the <a href='https://www.estadao.com.br' target='_blank' rel='noopener noreferrer'>Estadão</a> team

<bullet texto='Team' cor='var(--color-primary)' /> Editorial, commercial, digital strategy, reader revenue, and technology, with the startups Beluga and Itera

<bullet texto='Period' cor='var(--color-primary)' /> 2020

A daily newsletter gives every reader the same editorial selection. This experiment asked whether recommendations based on reading behavior could make that selection more relevant — and whether the evidence would justify changing the product.

h3: My contribution

In 2020 I led the <a href='https://www.estadao.com.br' target='_blank' rel='noopener noreferrer'>Estadão</a> team behind the InovaBra newsletter experiment and represented the newspaper with Beluga and Itera, the two startups Bradesco had selected for the program. The team brought together colleagues from editorial, commercial, digital strategy, reader revenue, and technology, and put editorial judgment, recommendation systems, and audience measurement into the same product discussion.

h3: An experiment inside an existing habit

The test used Saiba Agora, an established subscriber briefing. Beluga and Itera each created five audience clusters using browsing history and two months of news coverage. Each partner recommended four stories per cluster.

From December 10 to 16, 2020, the team sent eleven newsletter versions: five for each partner and one editorial control. Keeping the existing newsletter as a reference made it possible to compare personalization with the experience readers already knew.

{numeros}
  numero_1: 11 | Newsletter versions sent: five for each partner and one editorial control
  numero_2: 10 | Audience clusters, five built by each partner
  numero_3: 4 | Stories recommended to each cluster
  numero_4: 7 | Days of testing, December 10 to 16
{}

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

<a class='sublinks' href='/'>← Back to selected work</a>`},Wa={content:`chapeu: Rascunho
h1: Blocos de movimento

Página de demonstração, fora do menu. Os textos abaixo são marcadores de lugar: troque pelas suas notas.

{divisor}

h3: Visita guiada

{visita}
  nome: estadao/anatomia.jpg
  alt: Página dupla “A anatomia do novo Estadão”
  legenda: “A anatomia do novo Estadão”, 17 de outubro de 2021.
  passo_1: 26 30 2.2 | <strong>[Nota 1]</strong>Escreva aqui a decisão de desenho deste trecho da página.
  passo_2: 72 34 2.4 | <strong>[Nota 2]</strong>Escreva aqui a decisão de desenho deste trecho da página.
  passo_3: 50 76 2 | <strong>[Nota 3]</strong>Escreva aqui a decisão de desenho deste trecho da página.
{}

{divisor}

h3: Antes e depois

{antesDepois}
  antes: estadao/novo-estadao-pesquisa.jpg
  depois: estadao/novo-estadao-capa.jpg
  rotulo_antes: Imagem A
  rotulo_depois: Imagem B
  alt: Duas páginas do caderno que apresentou o novo Estadão
  legenda: Exemplo com duas páginas do mesmo caderno. Troque por uma página antiga e a nova, no mesmo formato.
  tamanho: G
{}
`,showInMenu:!1,menuLabel:""},Va={index:Da,placar:ja,minhocao:Sa,rota_segura:xa,ai2html:Pa,uvapages:Ca,portfolio:Na,archive:Ba,about:Ma,design_system:La,Teste:Oa,manual:Ga,blue_case:Ra,estadao:za,atbl:Fa,newsletters:qa,movimento:Wa},tn=ua(structuredClone(Va));function on(e,n){return ma+ga(e,n)}export{en as a,Ta as b,Aa as c,tn as d,Ya as e,nn as f,an as g,Za as h,Ka as i,Qa as j,Xa as k,$a as l,ya as m,Va as p,on as r,F as s};
