import { createRoot } from 'react-dom/client';
import Berater from './Berater.jsx';
import './index.css';

// Sucht jeden Berater-Container im Theme (Section azizam-berater.liquid) und hängt die React-Insel ein.
// Liest die Produktdaten aus dem JSON-Block, den Liquid aus den Metafeldern erzeugt.
const roots = new WeakMap();

function mount(el) {
  if (roots.has(el)) return;
  let produkte = [];
  try {
    produkte = JSON.parse(el.querySelector('script[data-produkte]')?.textContent || '[]');
  } catch (e) {
    console.warn('[Azizam Berater] Produktdaten nicht lesbar', e);
  }
  const ziel = el.querySelector('[data-berater-app]') || el;
  const root = createRoot(ziel);
  roots.set(el, root);
  root.render(
    <Berater produkte={produkte} kicker={el.dataset.kicker} heading={el.dataset.heading} discovery={el.dataset.discovery} />,
  );
}

function unmount(el) {
  roots.get(el)?.unmount();
  roots.delete(el);
}

function scan(scope = document) {
  scope.querySelectorAll('[data-azizam-berater]').forEach(mount);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => scan());
else scan();

// Theme-Editor: Section neu geladen bzw. entfernt.
document.addEventListener('shopify:section:load', (e) => scan(e.target));
document.addEventListener('shopify:section:unload', (e) => e.target.querySelectorAll('[data-azizam-berater]').forEach(unmount));
