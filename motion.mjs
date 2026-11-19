// Scroll work is coalesced into one frame; no permanent animation loop.
export function initMotion() {
  const root = document.documentElement;
  const hero = document.querySelector('.hero');
  const folders = document.querySelector('#folders');
  const toggle = document.querySelector('.motion-toggle');
  const transition = document.querySelector('.world-transition');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let enabled = !preference.matches;
  let frame = 0;
  let portalTimer;
  let entering = false;
  function paint() {
    frame = 0;
    const viewport = innerHeight;
    const r = hero.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -r.top / r.height));
    const folderRect = folders.getBoundingClientRect();
    const drift = Math.max(-1, Math.min(1, (viewport * .5 - folderRect.top - folderRect.height * .5) / viewport));
    root.style.setProperty('--reading', String(Math.max(0, Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - viewport)))));
    root.style.setProperty('--scene', enabled ? String(progress) : '0');
    root.style.setProperty('--folder-drift', enabled ? `${drift * 30}px` : '0px');
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(paint); }
  function apply() {
    root.classList.toggle('motion-off', !enabled);
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.disabled = preference.matches;
    toggle.title = preference.matches ? '기기의 동작 줄이기 설정을 따릅니다.' : '움직임 효과 켜기 / 끄기';
    toggle.firstChild.textContent = enabled ? '모션 ON ' : '모션 OFF ';
    if (!enabled) {
      hero.style.setProperty('--pointer-x', '0px');
      hero.style.setProperty('--pointer-y', '0px');
      document.querySelectorAll('.will-reveal').forEach(node => node.classList.add('visible'));
      if (entering) { clearTimeout(portalTimer); arrive(); }
    }
    schedule();
  }
  toggle.hidden = false;
  toggle.addEventListener('click', () => { enabled = !enabled; apply(); });
  preference.addEventListener('change', e => { enabled = !e.matches; apply(); });
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  hero.addEventListener('pointermove', e => {
    if (!enabled || !finePointer.matches) return;
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--pointer-x', `${((e.clientX - r.left) / r.width - .5) * 18}px`);
    hero.style.setProperty('--pointer-y', `${((e.clientY - r.top) / r.height - .5) * 12}px`);
  });
  hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--pointer-x', '0px');
    hero.style.setProperty('--pointer-y', '0px');
  });
  function arrive() {
    if (location.hash !== '#folders') history.pushState(null, '', '#folders');
    folders.scrollIntoView({behavior:'instant', block:'start'});
    document.querySelector('#folder-title').focus({preventScroll:true});
    transition.classList.remove('is-entering');
    entering = false;
    schedule();
  }
  document.querySelectorAll('.enter-world').forEach(link => link.addEventListener('click', e => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (entering) return;
    if (!enabled) { arrive(); return; }
    entering = true;
    transition.classList.add('is-entering');
    portalTimer = setTimeout(arrive, 680);
  }));
  document.querySelectorAll('.folder-link').forEach(link => {
    link.addEventListener('pointermove', e => {
      if (!enabled || !finePointer.matches) return;
      const r = link.getBoundingClientRect();
      link.style.setProperty('--tilt', `${((e.clientX - r.left) / r.width - .5) * 18}deg`);
    });
    link.addEventListener('pointerleave', () => link.style.setProperty('--tilt', '0deg'));
  });
  addEventListener('pagehide', () => { clearTimeout(portalTimer); cancelAnimationFrame(frame); });
  addEventListener('pageshow', () => { transition.classList.remove('is-entering'); entering = false; schedule(); });
  apply();
}
