const M = {
  // Layout
  d: 'display', g: 'gap', gtc: 'grid-template-columns', gtr: 'grid-template-rows',
  gc: 'grid-column', gr: 'grid-row', ai: 'align-items', jc: 'justify-content',
  as: 'align-self', ji: 'justify-items', ac: 'align-content',
  fd: 'flex-direction', fw: 'flex-wrap', flx: 'flex', fg: 'flex-grow',
  ps: 'position', t: 'top', b: 'bottom', l: 'left', r: 'right', z: 'z-index',

  // Sizing & Spacing
  w: 'width', h: 'height', minw: 'min-width', minh: 'min-height',
  maxw: 'max-width', maxh: 'max-height', p: 'padding', pt: 'padding-top',
  pb: 'padding-bottom', pl: 'padding-left', pr: 'padding-right',
  m: 'margin', mt: 'margin-top', mb: 'margin-bottom', ml: 'margin-left', mr: 'margin-right',

  // Typography
  f: 'font-size', fweight: 'font-weight', lh: 'line-height', c: 'color',
  ta: 'text-align', td: 'text-decoration', ts: 'text-shadow', ls: 'letter-spacing',
  ws: 'white-space',

  // Visuals
  bg: 'background', rad: 'border-radius', bor: 'border', bt: 'border-top',
  bb: 'border-bottom', bl: 'border-left', br: 'border-right',
  bs: 'box-shadow', op: 'opacity', cur: 'cursor', ov: 'overflow', trans: 'transition'
};

const applyStyles = (el) => {
  if (!el.getAttribute || !el.getAttribute('s')) return;
  const rules = el.getAttribute('s').split(';');
  rules.forEach(rule => {
    if (!rule.includes(':')) return;
    let [prop, val] = rule.split(':').map(str => str.trim());
    if (M[prop]) {
      const unitless = ['fweight', 'lh', 'op', 'z', 'gc', 'gr', 'fw', 'fg', 'flx'].includes(prop);
      const isRawNum = !isNaN(val) && val !== '';
      el.style[M[prop]] = (isRawNum && !unitless) ? val + 'px' : val;
    }
  });
};

const expand = () => {
  document.querySelectorAll('[s]').forEach(applyStyles);
};

// Setup Observer to handle dynamic content (D3, etc.)
const observer = new MutationObserver((mutations) => {
  mutations.forEach(m => m.addedNodes.forEach(node => {
    if (node.nodeType === 1) {
      if (node.hasAttribute('s')) applyStyles(node);
      node.querySelectorAll('[s]').forEach(applyStyles);
    }
  }));
});

window.addEventListener('DOMContentLoaded', () => {
  expand();
  observer.observe(document.body, { childList: true, subtree: true });
});
