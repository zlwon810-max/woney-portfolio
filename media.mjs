export function mediaKind(source) {
  if (typeof source !== 'string' || !source || /^\s*(javascript|data):/i.test(source)) return null;
  const ext = source.split(/[?#]/)[0].split('.').pop().toLowerCase();
  if (['mp4', 'webm', 'mov'].includes(ext)) return 'video';
  if (['gif', 'png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext)) return 'image';
  return null;
}
export function createMedia(source, {alt = '', poster = ''} = {}) {
  const kind = mediaKind(source);
  if (!kind) return null;
  const node = document.createElement(kind === 'video' ? 'video' : 'img');
  if (kind === 'video') {
    node.controls = true; node.playsInline = true; node.preload = 'metadata';
    if (poster) node.poster = poster;
    node.setAttribute('aria-label', alt);
  } else { node.alt = alt; node.loading = 'lazy'; }
  node.src = source;
  return node;
}
