document.documentElement.classList.add('js');
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('nav');
toggle.hidden=false;
function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();toggle.focus();}});
document.getElementById('year').textContent=new Date().getFullYear();
const dialog=document.getElementById('lightbox');
document.querySelectorAll('.gallery-link').forEach(link=>link.addEventListener('click',event=>{
 if(typeof dialog.showModal!=='function')return;
 event.preventDefault();const img=dialog.querySelector('img');img.src=link.href;img.alt=link.querySelector('img').alt;
 dialog.querySelector('p').textContent=link.dataset.caption;dialog.showModal();document.body.classList.add('modal-open');
}));
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
