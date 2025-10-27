// app.js — Minimal interactions for VYLOS site
(function(){
  'use strict';
  // Intersection observer for subtle reveal
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ en.target.classList.add('is-visible'); io.unobserve(en.target); }
    });
  },{threshold:0.12});
  document.querySelectorAll('.fade-in').forEach(el=>io.observe(el));

  // Header scroll state (removed header but keep safe)
  const header = document.querySelector('.header');
  const toggleHeader = ()=>{ if(!header) return; if(window.scrollY>36) header.classList.add('header--scrolled'); else header.classList.remove('header--scrolled'); };
  toggleHeader(); window.addEventListener('scroll', toggleHeader, {passive:true});

  // FAQ accordion
  document.querySelectorAll('.faq-toggle').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const is = btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded', String(!is));
      const content = btn.nextElementSibling;
      if(!content) return;
      if(is){ content.style.maxHeight = 0; setTimeout(()=>content.hidden=true,320); }
      else { content.hidden=false; content.style.maxHeight = content.scrollHeight+'px'; }
    });
  });

  // Preorder modal
  const preorderBtn = document.getElementById('preorder-btn');
  const modal = document.getElementById('preorder-modal');
  const modalClose = modal && modal.querySelector('.modal-close');
  let lastFocus = null;
  function openModal(){ if(!modal) return; lastFocus=document.activeElement; modal.hidden=false; modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; const first = modal.querySelector('input,button,select'); if(first) first.focus(); }
  function closeModal(){ if(!modal) return; modal.hidden=true; modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; if(lastFocus) lastFocus.focus(); }
  if(preorderBtn) preorderBtn.addEventListener('click', (e)=>{ e.preventDefault(); openModal(); });
  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(modal){ modal.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); }); document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); }); }

  // Simple join form validation (front-end only)
  const joinForm = document.getElementById('callsign-form');
  if(joinForm){ joinForm.addEventListener('submit', (e)=>{
    const input = joinForm.querySelector('input[type="email"]');
    const status = document.getElementById('join-status');
    status.textContent='';
    if(!input || !input.value || !/\S+@\S+\.\S+/.test(input.value)){
      e.preventDefault(); status.textContent='Please enter a valid email.'; input.focus(); return false;
    }
    // allow submission
  }); }

  // Animated ellipsis for hero title
  const ell = document.querySelector('.title-ellipsis');
  if(ell && window.matchMedia('(prefers-reduced-motion: no-preference)').matches){
    const states = [' .',' ..',' ...',' .',' ..',' ...'];
    let i = 0;
    setInterval(()=>{ ell.textContent = states[i]; i = (i+1) % states.length; }, 520);
  }

  // Smooth scroll + reveal for Project GHOST
  (function(){
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealBox = document.querySelector('#ghost .ghost-reveal');
    if(revealBox) revealBox.classList.add('reveal-init');

    document.addEventListener('click', function(e){
      const a = e.target.closest('a[data-scroll]');
      if(!a) return;
      const href = a.getAttribute('href') || '';
      if(!href.startsWith('#')) return;
      const target = document.querySelector(href);
      if(!target) return;
      e.preventDefault();
      const header = document.querySelector('header.sticky');
      const offset = header ? header.getBoundingClientRect().height : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      if(prefersReduced){ window.scrollTo(0, top); } else { window.scrollTo({ top, behavior: 'smooth' }); }
      // focus for accessibility
      target.setAttribute('tabindex','-1');
      setTimeout(()=> target.focus({preventScroll:true}), prefersReduced ? 0 : 700);
    }, false);

    if('IntersectionObserver' in window && revealBox){
      const ioG = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){ entry.target.classList.add('reveal-in'); ioG.unobserve(entry.target); }
        });
      },{root:null,threshold:0.15});
      ioG.observe(revealBox);
    } else if(revealBox){
      revealBox.classList.remove('reveal-init');
    }
  })();

})();
