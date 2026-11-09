import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { JAHRESZEITEN, MAX_FREITEXT, NACHJUSTIEREN, jahreszeit } from './logik.js';
import { naechsteFrage, antwortUebernehmen } from '../lib/gespraech.js';
import { produktProfil } from '../lib/profil.js';
import { anpassen } from '../lib/matching.js';
import { berateLokal } from '../lib/lokal.js';

// Adaptive Beratung (Muster nach 21st.dev „Questionnaire“): eine Frage pro Schritt, große Antwortzeilen,
// eigene Worte direkt bei der Frage, Zurück jederzeit. Welche Frage kommt, entscheidet die Engine (lib/gespraech.js).
const EASE = [0.2, 0.7, 0.1, 1];
const API_TIMEOUT_MS = 15000;

function Zeile({ option, gewaehlt, onClick, index }) {
  return (
    <motion.button type="button" onClick={onClick} aria-pressed={gewaehlt}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: index * 0.03, ease: EASE }}
      whileTap={{ scale: 0.99 }}
      className={`azb-karte tw-flex tw-min-h-[64px] tw-w-full tw-items-center tw-gap-4 tw-rounded-[3px] tw-border tw-px-5 tw-py-4 tw-text-left tw-transition-colors tw-duration-200 ${
        gewaehlt ? 'tw-border-gold tw-bg-gold/10' : 'tw-border-creme/15 hover:tw-border-gold/60'
      }`}>
      <span aria-hidden="true" className={`tw-flex tw-h-6 tw-w-6 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-full tw-border-2 ${gewaehlt ? 'tw-border-gold tw-bg-gold' : 'tw-border-creme/30'}`}>
        {gewaehlt && <span className="tw-h-2 tw-w-2 tw-rounded-full tw-bg-nacht" />}
      </span>
      <span className="tw-min-w-0">
        <span className={`tw-block tw-text-[1.12rem] tw-leading-snug md:tw-text-[1.2rem] ${gewaehlt ? 'tw-text-gold2' : 'tw-text-creme'}`}>{option.label}</span>
        {option.sub && <span className="tw-mt-0.5 tw-block tw-text-[0.92rem] tw-text-grau">{option.sub}</span>}
      </span>
    </motion.button>
  );
}

function Fortschritt({ anzahl, fastFertig }) {
  return (
    <div className="tw-flex tw-items-center tw-gap-3 tw-text-[0.85rem] tw-text-grau" aria-live="polite">
      <span className="tw-flex tw-gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`tw-h-1.5 tw-w-6 tw-rounded-full tw-transition-colors tw-duration-300 ${i < anzahl ? 'tw-bg-gold' : i === anzahl ? 'tw-bg-gold/50' : 'tw-bg-creme/15'}`} />
        ))}
      </span>
      <span>{fastFertig ? 'Fast geschafft' : `Frage ${anzahl + 1}`}</span>
    </div>
  );
}

function Frage({ frage, onAntwort, onZurueck, kannZurueck }) {
  const [auswahl, setAuswahl] = useState([]);
  const [text, setText] = useState('');
  const mehrfach = Boolean(frage.mehrfach);
  const weiter = () => onAntwort(mehrfach ? auswahl : null, text.trim());
  return (
    <motion.div key={frage.id} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25, ease: EASE }}>
      <h3 className="tw-max-w-[28ch] tw-text-[1.75rem] tw-leading-tight md:tw-text-[2.3rem]">{frage.frage}</h3>
      {frage.hinweis && <p className="tw-mt-2 tw-text-[0.95rem] tw-text-grau">{frage.hinweis}</p>}
      <div className={`tw-mt-6 tw-grid tw-gap-3 ${frage.optionen.length > 4 ? 'md:tw-grid-cols-2' : 'md:tw-max-w-[640px]'}`} role={mehrfach ? 'group' : 'radiogroup'} aria-label={frage.frage}>
        {frage.optionen.map((o, i) => (
          <Zeile key={o.id} option={o} index={i} gewaehlt={mehrfach ? auswahl.includes(o.id) : false}
            onClick={() => (mehrfach ? setAuswahl((a) => (a.includes(o.id) ? a.filter((x) => x !== o.id) : [...a, o.id])) : onAntwort(o.id, text.trim()))} />
        ))}
      </div>
      {frage.freitext && (
        <label className="tw-mt-6 tw-block md:tw-max-w-[640px]">
          <span className="tw-text-[0.95rem] tw-text-creme/85">{frage.id === 'stil' ? 'Oder sag es in deinen Worten' : 'Sonst noch etwas, das du nicht magst?'}</span>
          <textarea value={text} maxLength={MAX_FREITEXT} rows={2} onChange={(e) => setText(e.target.value)}
            placeholder={frage.id === 'stil' ? 'z. B. „Etwas Warmes für den Abend, nicht zu süß“' : 'z. B. „Kein Oud, bitte nichts Blumiges“'}
            className="tw-mt-2 tw-block tw-w-full tw-resize-none tw-rounded-[3px] tw-border tw-border-creme/20 tw-bg-nacht2 tw-p-4 tw-text-[1rem] tw-text-creme placeholder:tw-text-grau/70 focus:tw-border-gold focus:tw-outline-none" />
        </label>
      )}
      <div className="tw-mt-7 tw-flex tw-flex-wrap tw-items-center tw-gap-x-6 tw-gap-y-3">
        {(mehrfach || (frage.freitext && text.trim())) && (
          <button type="button" onClick={weiter}
            className="tw-inline-flex tw-min-h-[52px] tw-items-center tw-bg-gold tw-px-8 tw-text-[0.95rem] tw-font-medium tw-text-nacht tw-transition-colors hover:tw-bg-gold2">
            {mehrfach && !auswahl.length && !text.trim() ? 'Nein, nichts davon' : 'Weiter'}
          </button>
        )}
        {kannZurueck && <button type="button" onClick={onZurueck} className="tw-min-h-[44px] tw-text-[0.95rem] tw-text-grau hover:tw-text-gold2">← Zurück</button>}
      </div>
    </motion.div>
  );
}

function Laden() {
  return (
    <motion.div key="laden" className="tw-flex tw-min-h-[260px] tw-flex-col tw-items-center tw-justify-center tw-text-center" role="status"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.span className="tw-block tw-h-px tw-w-40 tw-bg-gradient-to-r tw-from-transparent tw-via-gold2 tw-to-transparent"
        animate={{ scaleX: [0.2, 1, 0.2] }} transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }} />
      <p className="tw-mt-5 tw-font-serif tw-text-[1.6rem]">Wir suchen deinen Duft …</p>
    </motion.div>
  );
}

function Ergebnis({ ergebnis, discovery, onJustieren, onNeu, onZurueck, justiert }) {
  const [top, ...alt] = ergebnis.empfehlungen;
  if (!top) {
    return (
      <motion.div key="leer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tw-max-w-[640px] tw-py-6" aria-live="polite">
        <h3 className="tw-text-[1.9rem] tw-leading-tight">Dafür haben wir gerade keinen passenden Duft.</h3>
        <p className="tw-mt-3 tw-text-[1.05rem] tw-text-creme/85">Lieber keine als eine falsche Empfehlung. Ändere eine Antwort – oder probier drei Düfte im Discovery Set.</p>
        {ergebnis.hinweise?.length > 0 && <ul className="tw-mt-4 tw-list-none tw-p-0 tw-text-[0.95rem] tw-text-grau">{ergebnis.hinweise.map((h) => <li key={h}>{h}</li>)}</ul>}
        <div className="tw-mt-7 tw-flex tw-flex-wrap tw-gap-x-6 tw-gap-y-3">
          <button type="button" onClick={onZurueck} className="tw-inline-flex tw-min-h-[52px] tw-items-center tw-border tw-border-gold tw-px-7 tw-text-[0.95rem] tw-text-gold2 hover:tw-bg-gold hover:tw-text-nacht">Antwort ändern</button>
          {discovery && <a href={discovery} className="tw-inline-flex tw-min-h-[52px] tw-items-center tw-text-[0.95rem] tw-underline tw-decoration-gold/60 tw-underline-offset-4">Discovery Set ansehen</a>}
        </div>
      </motion.div>
    );
  }
  const naeher = ergebnis.annaeherung === true;
  const begruendung = top.recommendation_explanation || top.warum;
  return (
    <motion.div key={`ergebnis-${top.product_id}-${justiert}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} aria-live="polite">
      <p className="tw-text-[0.85rem] tw-uppercase tw-tracking-[0.14em] tw-text-gold">
        {naeher ? 'Am nächsten an deinem Wunsch' : 'Wir haben einen Duft gefunden, der gut zu dir passt'}
      </p>
      <div className="tw-mt-5 tw-grid tw-gap-6 md:tw-grid-cols-[5fr_6fr] md:tw-gap-12">
        <a href={top.url} className="tw-relative tw-block tw-aspect-square tw-overflow-hidden tw-rounded-[3px] tw-border tw-border-gold/40 tw-bg-nacht2">
          {(top.bild || top.bild_klein) && <img src={top.bild || top.bild_klein} alt={top.name} className="tw-h-full tw-w-full tw-object-cover" />}
        </a>
        <div className="tw-flex tw-min-w-0 tw-flex-col tw-justify-center">
          <span className="tw-inline-flex tw-w-fit tw-rounded-full tw-border tw-border-gold/50 tw-px-3 tw-py-1 tw-text-[0.85rem] tw-text-gold2">{top.stufe?.text}</span>
          <h3 className="azb-gold-text tw-mt-3 tw-text-[2.6rem] tw-leading-[1.02] md:tw-text-[3.6rem]">{top.name}</h3>
          <p className="tw-mt-2 tw-text-[1rem] tw-text-creme/80">
            {[top.familie, top.preis_ab_text && `ab ${top.preis_ab_text}`].filter(Boolean).join(' · ')}
          </p>
          {top.fragrance_character && <p className="tw-mt-4 tw-font-serif tw-text-[1.2rem] tw-italic tw-leading-snug">{top.fragrance_character}</p>}
          {begruendung && (
            <div className="tw-mt-5 tw-border-l-2 tw-border-gold/60 tw-pl-4">
              <p className="tw-text-[0.85rem] tw-uppercase tw-tracking-[0.12em] tw-text-grau">Warum wir ihn empfehlen</p>
              <p className="tw-mt-1 tw-text-[1.02rem] tw-leading-relaxed tw-text-creme/90">{begruendung}</p>
            </div>
          )}
          <div className="tw-mt-6 tw-flex tw-flex-wrap tw-items-center tw-gap-3">
            <a href={top.url} className="tw-inline-flex tw-min-h-[52px] tw-items-center tw-bg-gold tw-px-7 tw-text-[0.95rem] tw-font-medium tw-text-nacht hover:tw-bg-gold2">Duft ansehen</a>
            {top.probe && (
              <a href={top.probe.url} className="tw-inline-flex tw-min-h-[52px] tw-items-center tw-border tw-border-gold tw-px-6 tw-text-[0.95rem] tw-text-gold2 hover:tw-bg-gold hover:tw-text-nacht">
                Erst 10 ml testen · {top.probe.text}
              </a>
            )}
          </div>
        </div>
      </div>

      {alt.length > 0 && (
        <div className="tw-mt-10 tw-grid tw-gap-3 md:tw-grid-cols-2">
          {alt.map((a) => (
            <a key={a.product_id} href={a.url} className="azb-karte tw-flex tw-gap-4 tw-rounded-[3px] tw-border tw-border-creme/15 tw-p-3 hover:tw-border-gold/50">
              <span className="tw-h-24 tw-w-20 tw-shrink-0 tw-overflow-hidden tw-bg-nacht2">
                {(a.bild_klein || a.bild) && <img src={a.bild_klein || a.bild} alt="" loading="lazy" className="tw-h-full tw-w-full tw-object-cover" />}
              </span>
              <span className="tw-min-w-0">
                <span className="tw-block tw-font-serif tw-text-[1.35rem] tw-text-creme">{a.name}</span>
                <span className="tw-mt-1 tw-block tw-text-[0.95rem] tw-text-creme/80">{a.unterschied}</span>
                {a.preis_ab_text && <span className="tw-mt-1 tw-block tw-text-[0.85rem] tw-text-grau">ab {a.preis_ab_text}</span>}
              </span>
            </a>
          ))}
        </div>
      )}

      <div className="tw-mt-10">
        <p className="tw-text-[1rem] tw-text-creme/90">Noch nicht ganz? Sag uns, in welche Richtung:</p>
        <div className="tw-mt-3 tw-flex tw-flex-wrap tw-gap-2">
          {NACHJUSTIEREN.map((n) => (
            <button key={n.id} type="button" onClick={() => onJustieren(n.id)}
              className="tw-min-h-[44px] tw-rounded-full tw-border tw-border-creme/25 tw-px-4 tw-text-[0.95rem] tw-text-creme/90 hover:tw-border-gold hover:tw-text-gold2">
              {n.label}
            </button>
          ))}
        </div>
      </div>
      {ergebnis.hinweise?.length > 0 && <ul className="tw-mt-6 tw-list-none tw-p-0 tw-text-[0.9rem] tw-text-grau">{ergebnis.hinweise.map((h) => <li key={h}>{h}</li>)}</ul>}
      <div className="tw-mt-8 tw-flex tw-flex-wrap tw-gap-x-6 tw-gap-y-2 tw-text-[0.9rem] tw-text-grau">
        {discovery && <a href={discovery} className="tw-underline tw-decoration-gold/50 tw-underline-offset-4 hover:tw-text-gold2">Lieber drei Düfte testen: Discovery Set</a>}
        <button type="button" onClick={onNeu} className="hover:tw-text-gold2">Von vorn beginnen</button>
      </div>
    </motion.div>
  );
}

export default function Berater({ produkte, kicker, heading, discovery, api }) {
  const auto = useMemo(() => jahreszeit(), []);
  const profile = useMemo(() => produkte.map(produktProfil).filter((p) => p.id && p.name), [produkte]);
  const start = { saison: auto };
  // verlauf: alle bisherigen Zustände (für „Zurück“); jeder Zustand speichert die vollständige Eingabe.
  const [verlauf, setVerlauf] = useState([{ eingabe: start, gefragt: [] }]);
  const [ergebnis, setErgebnis] = useState(null);
  const [laedt, setLaedt] = useState(false);
  const [justiert, setJustiert] = useState(0);
  const anfrage = useRef(0);
  const oben = useRef(null);
  const zustand = verlauf[verlauf.length - 1];
  const frage = useMemo(() => (ergebnis || laedt ? null : naechsteFrage(profile, zustand)), [profile, zustand, ergebnis, laedt]);

  useEffect(() => {
    const el = oben.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [verlauf.length, ergebnis, justiert]);

  async function auswerten(eingabe) {
    const nr = ++anfrage.current;
    setLaedt(true);
    let e = null;
    if (api) {
      try {
        const r = await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eingabe), signal: AbortSignal.timeout(API_TIMEOUT_MS) });
        if (r.ok) e = await r.json();
      } catch { e = null; }
    }
    if (!e || !Array.isArray(e.empfehlungen)) e = berateLokal(eingabe, produkte, api ? 'server_nicht_erreichbar' : 'lokal');
    if (nr !== anfrage.current) return;
    setErgebnis(e);
    setLaedt(false);
  }

  // Keine weitere Frage nötig → Ergebnis holen
  useEffect(() => {
    if (!frage && !ergebnis && !laedt) auswerten(zustand.eingabe);
  }, [frage, ergebnis, laedt]); // eslint-disable-line react-hooks/exhaustive-deps

  const antworten = (antwort, text) => {
    const eingabe = antwortUebernehmen(zustand.eingabe, frage.id, antwort, { ...(frage.extra || {}), ...(text ? { freitext: text } : {}) });
    setVerlauf((v) => [...v, { eingabe, gefragt: [...zustand.gefragt, frage.id] }]);
  };
  const zurueck = () => { anfrage.current += 1; setErgebnis(null); setLaedt(false); setVerlauf((v) => (v.length > 1 ? v.slice(0, -1) : v)); };
  const neu = () => { anfrage.current += 1; setErgebnis(null); setLaedt(false); setVerlauf([{ eingabe: start, gefragt: [] }]); };

  // Nachjustieren: Profil anpassen und im Browser neu rechnen – alle Antworten bleiben erhalten.
  const justieren = (art) => {
    const shown = ergebnis.empfehlungen.map((x) => x.product_id);
    const bezug = profile.find((p) => p.id === shown[0]);
    const vorher = zustand.eingabe;
    const eingabe = art === 'andere' ? { ...vorher, ohne: [...new Set([...(vorher.ohne || []), ...shown])] } : anpassen(vorher, art, bezug);
    setVerlauf((v) => [...v, { eingabe, gefragt: zustand.gefragt }]);
    const e = berateLokal(eingabe, produkte, 'nachjustiert');
    setErgebnis(e);
    setJustiert((n) => n + 1);
  };

  const saison = zustand.eingabe.saison;
  return (
    <MotionConfig reducedMotion="user">
      <div ref={oben} className="tw-mx-auto tw-w-full tw-max-w-[1180px] tw-scroll-mt-24 tw-px-4 tw-py-16 md:tw-px-10 md:tw-py-24">
        <header className="tw-flex tw-flex-col tw-gap-4 md:tw-flex-row md:tw-items-end md:tw-justify-between">
          <div>
            {kicker && <p className="tw-text-[0.85rem] tw-uppercase tw-tracking-[0.14em] tw-text-gold">{kicker}</p>}
            {heading && <h2 className="tw-mt-2 tw-text-[2.2rem] tw-leading-[1.05] md:tw-text-[3rem]">{heading}</h2>}
          </div>
          <label className="tw-flex tw-items-center tw-gap-2 tw-text-[0.9rem] tw-text-grau">
            Für
            <select value={saison} onChange={(e) => { const s = e.target.value; setVerlauf((v) => [...v.slice(0, -1), { ...zustand, eingabe: { ...zustand.eingabe, saison: s } }]); if (ergebnis) setErgebnis(berateLokal({ ...zustand.eingabe, saison: s }, produkte, 'nachjustiert')); }}
              className="tw-rounded-[3px] tw-border tw-border-creme/20 tw-bg-nacht2 tw-px-2 tw-py-1.5 tw-text-creme">
              {JAHRESZEITEN.map((j) => <option key={j} value={j}>{j === auto ? `${j} (jetzt)` : j}</option>)}
            </select>
          </label>
        </header>

        <div className="tw-mt-8 md:tw-mt-10">
          {!ergebnis && !laedt && frage && <Fortschritt anzahl={zustand.gefragt.length} fastFertig={frage.id === 'abneigung' || frage.id === 'unterscheidung'} />}
          <div className="tw-mt-6">
            <AnimatePresence mode="wait">
              {laedt ? <Laden key="laden" />
                : ergebnis ? <Ergebnis key="ergebnis" ergebnis={ergebnis} discovery={discovery} onJustieren={justieren} onNeu={neu} onZurueck={zurueck} justiert={justiert} />
                  : frage ? <Frage key={`${frage.id}-${verlauf.length}`} frage={frage} onAntwort={antworten} onZurueck={zurueck} kannZurueck={verlauf.length > 1} />
                    : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
