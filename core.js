const M = {
  // Layout & Positioning
  d: 'display',
  g: 'gap',
  gtc: 'grid-template-columns',
  gtr: 'grid-template-rows',
  gc: 'grid-column',
  gr: 'grid-row',
  ai: 'align-items',
  jc: 'justify-content',
  as: 'align-self',
  fd: 'flex-direction',
  fw: 'flex-wrap',
  ps: 'position',
  t: 'top',
  b: 'bottom',
  l: 'left',
  r: 'right',
  z: 'z-index',

  // Dimensions & Spacing
  w: 'width',
  h: 'height',
  minw: 'min-width',
  minh: 'min-height',
  maxw: 'max-width',
  maxh: 'max-height',
  p: 'padding',
  pt: 'padding-top',
  pb: 'padding-bottom',
  pl: 'padding-left',
  pr: 'padding-right',
  m: 'margin',
  mt: 'margin-top',
  mb: 'margin-bottom',
  ml: 'margin-left',
  mr: 'margin-right',

  // Typography
  f: 'font-size',
  fweight: 'font-weight',
  lh: 'line-height',
  c: 'color',
  ta: 'text-align',
  td: 'text-decoration',
  ts: 'text-shadow',
  ls: 'letter-spacing',
  ws: 'white-space',

  // Visuals & Borders
  bg: 'background',
  rad: 'border-radius',
  bor: 'border',
  bt: 'border-top',
  bb: 'border-bottom',
  bl: 'border-left',
  br: 'border-right',
  bs: 'box-shadow',
  op: 'opacity',
  cur: 'cursor',
  ov: 'overflow',
  trans: 'transition'
};

const expand = () => {
  document.querySelectorAll('[s]').forEach(el => {
    const rules = el.getAttribute('s').split(';');
    rules.forEach(rule => {
      if (!rule.includes(':')) return;
      let [prop, val] = rule.split(':').map(str => str.trim());
      
      if (M[prop]) {
        // Properties that should NEVER have 'px' automatically added
        const unitless = ['fweight', 'lh', 'op', 'z', 'gc', 'gr', 'fw'].includes(prop);
        
        // Check if the value is a raw number (not already containing %, vh, em, etc.)
        const isRawNum = !isNaN(val) && val !== '';
        
        el.style[M[prop]] = (isRawNum && !unitless) ? val + 'px' : val;
      }
    });
  });
};

// Initial execution
window.addEventListener('DOMContentLoaded', expand);
