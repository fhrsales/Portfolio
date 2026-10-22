(async () => {
 const bar = document.createElement('section');
 bar.style.cssText = 'position:sticky;top:0;z-index:5;background:#fff;padding:16px;margin-bottom:20px;border-bottom:2px solid #31158b';
 const save = document.createElement('button');
 save.textContent = 'Salvar seleção';
 save.style.cssText = 'background:#31158b;color:white;border:0;padding:12px 20px;cursor:pointer';
 const status = document.createElement('span');
 status.setAttribute('role', 'status'); status.style.marginLeft = '16px';
 bar.append(save, status); document.querySelector('main').before(bar);
 if (!['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) {
  save.disabled = true; status.textContent = 'Abra este índice no ambiente local para administrar as páginas.'; return;
 }
 try {
  const response = await fetch('./manifest.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('Não foi possível carregar a seleção.');
  let original = await response.json();
  const controls = [];
  const dateControls = [];
  const update = () => { status.textContent = `${controls.filter(c => c.checked).length} de ${controls.length} páginas selecionadas. Clique em Salvar seleção para aplicar.`; };
  for (const item of original.files) {
   const article = document.querySelector(`article[data-id="${CSS.escape(item.id)}"]`);
   if (!article) throw new Error('Índice desatualizado. Recarregue a página.');
   document.querySelector('main').append(article);
   const dateLabel = document.createElement('label');
   dateLabel.style.cssText = 'display:block;margin-bottom:12px';
   const date = document.createElement('input');
   date.type = 'date'; date.value = item.date || ''; date.dataset.id = item.id;
   dateLabel.append('Data da publicação ', date);
   const note = document.createElement('small');
   note.style.display = 'block';
   note.textContent = item.dateSource === 'ocr' ? 'Lida da imagem automaticamente; confira.' : item.date ? '' : 'Sem data: fica ao final do jornal.';
   dateLabel.append(note); article.prepend(dateLabel); dateControls.push(date);
   date.addEventListener('change', update);
   const label = document.createElement('label');
   label.style.cssText = 'display:block;margin-bottom:12px;font-weight:600;cursor:pointer';
   const checkbox = document.createElement('input');
   checkbox.type = 'checkbox'; checkbox.checked = !item.hidden; checkbox.dataset.id = item.id;
   label.append(checkbox, ' Mostrar no Archive'); article.prepend(label); controls.push(checkbox);
   const paint = () => { article.style.opacity = checkbox.checked ? '1' : '.5'; };
   paint(); checkbox.addEventListener('change', () => { paint(); update(); });
  }
  update();
  save.addEventListener('click', async () => {
   save.disabled = true; [...controls, ...dateControls].forEach(c => c.disabled = true); status.textContent = 'Salvando…';
   try {
    const response = await fetch('/__editor/samples', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ original, hiddenIds: controls.filter(c => !c.checked).map(c => c.dataset.id), dates: Object.fromEntries(dateControls.map(c => [c.dataset.id, c.value])) }) });
    const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Não foi possível salvar.');
    original = result.data;
    for (const item of original.files) document.querySelector('main').append(document.querySelector(`article[data-id="${CSS.escape(item.id)}"]`));
    status.textContent = 'Seleção salva. Volte à aba do Archive para conferir. Os arquivos foram preservados.';
   } catch (error) { status.textContent = error.message; }
   finally { save.disabled = false; [...controls, ...dateControls].forEach(c => c.disabled = false); }
  });
 } catch (error) { save.disabled = true; status.textContent = error.message; }
})();
