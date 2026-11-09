import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import {
  ANLAESSE, STIMMUNGEN, MAX_STIMMUNGEN, MAX_FREITEXT, PRAESENZ, RICHTUNG, JAHRESZEITEN, ABNEIGUNGEN, BUDGETS, jahreszeit,
} from './logik.js';
import { berateLokal } from '../lib/lokal.js';

const EASE = [0.2, 0.7, 0.1, 1];
const API_TIMEOUT_MS = 25000;

const SCHRITTE = [
  { key: 'anlass', frage: 'Wofür suchst du ihn?', optionen: ANLAESSE },
  { key: 'stimmung', frage: 'Wie soll er sich anfühlen?', hinweis: `Bis zu ${MAX_STIMMUNGEN} wählen`, optionen: STIMMUNGEN, mehrfach: true },
  { key: 'praesenz', frage: 'Wie präsent darf er sein?', optionen: PRAESENZ },
  { key: 'richtung', frage: 'Welche Richtung magst du?', optionen: RICHTUNG },
  { key: 'feinschliff', frage: 'Noch etwas, das wir wissen sollten?', hinweis: 'Alles freiwillig' },
];

function Haken() {
  return (
    <svg viewBox="0 0 24 24" className="tw-h-3.5 tw-w-3.5" aria-hidden="true">
      <motion.path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
        strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.35, ease: EASE }} />
    </svg>
  );
}

function Karte({ option, index, gewaehlt, onClick }) {
  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <motion.button
      type="button" onClick={onClick} onPointerMove={spot} aria-pressed={gewaehlt}
      initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 + index * 0.06, ease: EASE }}
      whileHover={{ y: -4 }} whileTap={{ scale: 0.98 }}
      className={`azb-karte tw-group tw-relative tw-flex tw-min-h-[132px] tw-flex-col tw-justify-between tw-overflow-hidden tw-rounded-[2px] tw-border tw-p-5 tw-text-left tw-transition-colors tw-duration-300 md:tw-min-h-[168px] md:tw-p-6 ${
        gewaehlt ? 'tw-border-gold' : 'tw-border-creme/10 hover:tw-border-gold/50'
      }`}
    >
      <span className="tw-flex tw-items-start tw-justify-between tw-gap-3">
        <span className="tw-font-sans tw-text-[0.7rem] tw-tracking-[0.18em] tw-text-grau">0{index + 1}</span>
        <span className={`tw-flex tw-h-6 tw-w-6 tw-items-center tw-justify-center tw-rounded-full tw-border tw-transition-colors tw-duration-300 ${
          gewaehlt ? 'tw-border-gold tw-bg-gold tw-text-nacht' : 'tw-border-creme/20 tw-text-transparent'
        }`}>
          {gewaehlt && <Haken />}
        </span>
      </span>
      <span className="tw-mt-6 tw-block">
        <span className={`tw-block tw-font-serif tw-text-[1.45rem] tw-leading-tight md:tw-text-[1.7rem] ${gewaehlt ? 'azb-gold-text' : 'tw-text-creme'}`}>
          {option.label}
        </span>
        <span className="tw-mt-1.5 tw-block tw-text-[0.85rem] tw-text-grau">{option.sub}</span>
      </span>
      {gewaehlt && (
        <motion.span className="tw-pointer-events-none tw-absolute tw-inset-x-0 tw-bottom-0 tw-h-[2px] tw-origin-left tw-bg-gradient-to-r tw-from-golddunkel tw-via-gold2 tw-to-golddunkel"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: EASE }} />
      )}
    </motion.button>
  );
}

function Chip({ aktiv, onClick, children, index = 0 }) {
  return (
    <motion.button type="button" onClick={onClick} aria-pressed={aktiv}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 * index, duration: 0.35, ease: EASE }}
      whileTap={{ scale: 0.96 }}
      className={`tw-rounded-full tw-border tw-px-3.5 tw-py-2 tw-text-[0.85rem] tw-transition-colors tw-duration-300 ${
        aktiv ? 'tw-border-gold tw-bg-gold tw-text-nacht' : 'tw-border-creme/15 tw-text-creme/80 hover:tw-border-gold/60 hover:tw-text-creme'
      }`}>
      {children}
    </motion.button>
  );
}

function Saison({ wert, auto, onChange }) {
  return (
    <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2" role="group" aria-label="Jahreszeit">
      <span className="tw-mr-1 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.16em] tw-text-grau">Jahreszeit</span>
      {JAHRESZEITEN.map((j) => (
        <button key={j} type="button" onClick={() => onChange(j)} aria-pressed={wert === j}
          className={`tw-relative tw-rounded-full tw-px-3 tw-py-1.5 tw-text-[0.8rem] tw-transition-colors tw-duration-300 ${
            wert === j ? 'tw-text-nacht' : 'tw-text-creme/70 hover:tw-text-creme'
          }`}>
          {wert === j && (
            <motion.span layoutId="azb-saison" className="tw-absolute tw-inset-0 tw-rounded-full tw-bg-gold"
              transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
          )}
          <span className="tw-relative">{j}{j === auto ? ' · jetzt' : ''}</span>
        </button>
      ))}
    </div>
  );
}

function Feinschliff({ antworten, setAntworten }) {
  const nicht = antworten.mag_nicht;
  const toggle = (id) => setAntworten((a) => ({ ...a, mag_nicht: a.mag_nicht.includes(id) ? a.mag_nicht.filter((x) => x !== id) : [...a.mag_nicht, id] }));
  return (
    <div className="tw-grid tw-gap-8 md:tw-grid-cols-[3fr_2fr] md:tw-gap-12">
      <div>
        <p className="tw-text-[0.72rem] tw-uppercase tw-tracking-[0.16em] tw-text-grau">Bitte nicht drin</p>
        <div className="tw-mt-3 tw-flex tw-flex-wrap tw-gap-2" role="group" aria-label="Bitte nicht drin">
          {ABNEIGUNGEN.map((o, i) => <Chip key={o.id} index={i} aktiv={nicht.includes(o.id)} onClick={() => toggle(o.id)}>{o.label}</Chip>)}
        </div>
        <p className="tw-mt-8 tw-text-[0.72rem] tw-uppercase tw-tracking-[0.16em] tw-text-grau">Preis für 30 ml</p>
        <div className="tw-mt-3 tw-flex tw-flex-wrap tw-gap-2" role="group" aria-label="Preis für 30 ml">
          {BUDGETS.map((b, i) => (
            <Chip key={String(b.id)} index={i} aktiv={antworten.budget === b.id} onClick={() => setAntworten((a) => ({ ...a, budget: b.id }))}>{b.label}</Chip>
          ))}
        </div>
      </div>
      <label className="tw-block">
        <span className="tw-text-[0.72rem] tw-uppercase tw-tracking-[0.16em] tw-text-grau">In deinen Worten</span>
        <textarea
          value={antworten.freitext}
          maxLength={MAX_FREITEXT}
          rows={5}
          onChange={(e) => setAntworten((a) => ({ ...a, freitext: e.target.value }))}
          placeholder="z. B. „Ich liebe Kaffee, aber bitte nichts zu Süßes.“"
          className="tw-mt-3 tw-block tw-w-full tw-resize-none tw-rounded-[2px] tw-border tw-border-creme/15 tw-bg-nacht2 tw-p-4 tw-text-[0.95rem] tw-text-creme placeholder:tw-text-grau/70 focus:tw-border-gold focus:tw-outline-none"
        />
        <span className="tw-mt-1.5 tw-block tw-text-right tw-text-[0.75rem] tw-text-grau">{antworten.freitext.length}/{MAX_FREITEXT}</span>
      </label>
    </div>
  );
}

function Laden() {
  return (
    <motion.div key="laden" className="tw-flex tw-min-h-[320px] tw-flex-col tw-items-center tw-justify-center tw-text-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status" aria-live="polite">
      <motion.span className="tw-block tw-h-px tw-w-40 tw-bg-gradient-to-r tw-from-transparent tw-via-gold2 tw-to-transparent"
        animate={{ scaleX: [0.2, 1, 0.2], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }} />
      <p className="azb-gold-text tw-mt-6 tw-font-serif tw-text-[1.6rem] md:tw-text-[2rem]">Wir wählen deinen Duft aus …</p>
      <p className="tw-mt-2 tw-text-[0.85rem] tw-text-grau">Wir gleichen Stimmung, Anlass, Intensität und Jahreszeit ab.</p>
    </motion.div>
  );
}

function MatchBadge({ wert, klein }) {
  return (
    <span className={`tw-inline-flex tw-items-baseline tw-gap-1 tw-rounded-full tw-border tw-border-gold/50 ${klein ? 'tw-px-2 tw-py-0.5 tw-text-[0.75rem]' : 'tw-px-3 tw-py-1 tw-text-[0.8rem]'} tw-text-gold2`}
      title="Übereinstimmung mit deinen Angaben, berechnet aus Stimmung, Anlass, Intensität, Jahreszeit und Richtung">
      <strong className="tw-font-semibold">{wert} %</strong> passend
    </span>
  );
}

function Ergebnis({ ergebnis, saison, discovery, onNeu, onZurueck }) {
  const [top, ...alt] = ergebnis.empfehlungen;
  const ki = ergebnis.quelle === 'claude' || ergebnis.quelle === 'cache';

  if (!top) {
    return (
      <motion.div key="leer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} aria-live="polite"
        className="tw-mx-auto tw-max-w-[640px] tw-py-10 tw-text-center">
        <p className="tw-text-[0.72rem] tw-uppercase tw-tracking-[0.18em] tw-text-gold">Ehrlich gesagt</p>
        <h3 className="tw-mt-3 tw-text-[2rem] tw-leading-tight md:tw-text-[2.6rem]">Dafür haben wir gerade keinen Duft, der wirklich passt.</h3>
        <p className="tw-mt-4 tw-text-creme/80">Lieber keine als eine falsche Empfehlung. Lockere eine Angabe – oder teste drei Düfte im Discovery-Set.</p>
        {ergebnis.hinweise?.length > 0 && <ul className="tw-mt-5 tw-list-none tw-p-0 tw-text-[0.9rem] tw-text-grau">{ergebnis.hinweise.map((h) => <li key={h}>{h}</li>)}</ul>}
        <div className="tw-mt-8 tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-gap-x-7 tw-gap-y-4">
          <button type="button" onClick={onZurueck} className="tw-inline-flex tw-min-h-[48px] tw-items-center tw-border tw-border-gold tw-px-7 tw-text-[0.8rem] tw-uppercase tw-tracking-[0.12em] tw-text-gold2 tw-transition-colors hover:tw-bg-gold hover:tw-text-nacht">Angaben ändern</button>
          {discovery && <a href={discovery} className="tw-border-b tw-border-gold/50 tw-pb-1 tw-text-[0.9rem] hover:tw-text-gold2">Discovery-Set ansehen</a>}
        </div>
      </motion.div>
    );
  }

  const text = top.recommendation_explanation || top.fragrance_character;
  const naeher = ergebnis.annaeherung === true;
  return (
    <motion.div key="ergebnis" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} aria-live="polite">
      {naeher && (
        <motion.p className="tw-mb-8 tw-max-w-[60ch] tw-border-l tw-border-gold/60 tw-pl-4 tw-text-[0.95rem] tw-text-creme/85"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          Ganz genau passt keiner unserer Düfte zu allen Angaben. Diese kommen deinem Wunsch am nächsten – was abweicht, steht dabei.
        </motion.p>
      )}
      {ergebnis.kundenwunsch?.zusammenfassung && (
        <motion.p className="tw-mb-8 tw-max-w-[60ch] tw-font-serif tw-text-[1.1rem] tw-italic tw-text-creme/80"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
          So verstehen wir dich: {ergebnis.kundenwunsch.zusammenfassung}
        </motion.p>
      )}
      <div className="tw-grid tw-gap-8 md:tw-grid-cols-[5fr_6fr] md:tw-gap-14">
        <motion.a href={top.url} className="tw-relative tw-block tw-aspect-[4/5] tw-overflow-hidden tw-rounded-[2px] tw-border tw-border-gold/30 tw-bg-nacht2"
          initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, ease: EASE }}>
          {(top.bild || top.bild_klein) && (
            <motion.img src={top.bild || top.bild_klein} alt={top.name} className="tw-h-full tw-w-full tw-object-cover"
              initial={{ scale: 1.12 }} animate={{ scale: 1 }} transition={{ duration: 1.6, ease: EASE }} />
          )}
          <span className="tw-pointer-events-none tw-absolute tw-inset-0 tw-bg-gradient-to-t tw-from-nacht/70 tw-via-transparent" />
        </motion.a>

        <div className="tw-flex tw-flex-col tw-justify-center">
          <motion.div className="tw-flex tw-flex-wrap tw-items-center tw-gap-3"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6, ease: EASE }}>
            <span className="tw-text-[0.72rem] tw-uppercase tw-tracking-[0.18em] tw-text-gold">
              {naeher ? 'Am nächsten dran' : `Dein Duft${saison ? ` für den ${saison}` : ''}`}{top.familie ? ` · ${top.familie}` : ''}
            </span>
            <MatchBadge wert={top.match_score} />
          </motion.div>
          <motion.h3 className="azb-gold-text tw-mt-3 tw-text-[2.6rem] tw-leading-[1.02] md:tw-text-[4rem]"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: EASE }}>
            {top.name}
          </motion.h3>
          {top.hauptnoten?.length > 0 && (
            <motion.p className="tw-mt-4 tw-text-[0.95rem] tw-text-creme/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.6 }}>
              {top.hauptnoten.join(' · ')}
            </motion.p>
          )}
          {text && (
            <motion.p className="tw-mt-4 tw-max-w-[46ch] tw-font-serif tw-text-[1.15rem] tw-italic tw-leading-snug tw-text-creme"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.6 }}>
              {text}
            </motion.p>
          )}
          {top.matching_reasons.length > 0 && (
            <ul className="tw-mt-6 tw-flex tw-list-none tw-flex-wrap tw-gap-2 tw-p-0" aria-label="Warum dieser Duft">
              {top.matching_reasons.map((g, i) => (
                <motion.li key={g} className="tw-rounded-full tw-border tw-border-gold/40 tw-px-3 tw-py-1 tw-text-[0.8rem] tw-text-gold2"
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 + i * 0.07, duration: 0.4, ease: EASE }}>
                  {g}
                </motion.li>
              ))}
            </ul>
          )}
          {top.possible_conflicts.length > 0 && (
            <motion.p className="tw-mt-4 tw-text-[0.85rem] tw-text-grau" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              Gut zu wissen: {top.possible_conflicts.join(' · ')}
            </motion.p>
          )}
          <motion.div className="tw-mt-8 tw-flex tw-flex-wrap tw-items-center tw-gap-x-7 tw-gap-y-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85, duration: 0.5 }}>
            <a href={top.url} className="tw-inline-flex tw-min-h-[52px] tw-items-center tw-justify-center tw-bg-gold tw-px-8 tw-text-[0.8rem] tw-uppercase tw-tracking-[0.12em] tw-text-nacht tw-transition-colors tw-duration-300 hover:tw-bg-gold2">
              Ansehen{top.preis_ab_text ? ` · ab ${top.preis_ab_text}` : ''}
            </a>
            {discovery && (
              <a href={discovery} className="tw-border-b tw-border-gold/50 tw-pb-1 tw-text-[0.9rem] tw-transition-colors hover:tw-border-gold2 hover:tw-text-gold2">
                Erst testen: Discovery-Set
              </a>
            )}
          </motion.div>
        </div>
      </div>

      {alt.length > 0 && (
        <div className="tw-mt-14 tw-border-t tw-border-creme/10 tw-pt-8">
          <p className="tw-text-[0.72rem] tw-uppercase tw-tracking-[0.18em] tw-text-grau">{naeher ? 'Auch nah dran' : 'Passt auch'}</p>
          <div className="tw-mt-4 tw-grid tw-gap-4 sm:tw-grid-cols-2">
            {alt.map((a, i) => (
              <motion.a key={a.product_id} href={a.url}
                className="azb-karte tw-flex tw-items-center tw-gap-4 tw-rounded-[2px] tw-border tw-border-creme/10 tw-p-3 tw-transition-colors hover:tw-border-gold/50"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.1, duration: 0.5, ease: EASE }}
                whileHover={{ y: -3 }}>
                <span className="tw-h-20 tw-w-16 tw-shrink-0 tw-overflow-hidden tw-bg-nacht2">
                  {(a.bild_klein || a.bild) && <img src={a.bild_klein || a.bild} alt="" loading="lazy" className="tw-h-full tw-w-full tw-object-cover" />}
                </span>
                <span className="tw-min-w-0">
                  <span className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                    <span className="tw-font-serif tw-text-[1.25rem] tw-text-creme">{a.name}</span>
                    <MatchBadge wert={a.match_score} klein />
                  </span>
                  <span className="tw-mt-0.5 tw-block tw-truncate tw-text-[0.8rem] tw-text-grau">
                    {[a.familie, a.preis_ab_text && `ab ${a.preis_ab_text}`].filter(Boolean).join(' · ')}
                  </span>
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      )}

      {ergebnis.hinweise?.length > 0 && (
        <ul className="tw-mt-8 tw-list-none tw-p-0 tw-text-[0.85rem] tw-text-grau">{ergebnis.hinweise.map((h) => <li key={h}>{h}</li>)}</ul>
      )}

      <div className="tw-mt-10 tw-flex tw-flex-wrap tw-items-center tw-gap-6">
        <button type="button" onClick={onNeu} className="tw-text-[0.85rem] tw-text-grau tw-transition-colors hover:tw-text-gold2">↺ Neu starten</button>
        <span className="tw-text-[0.75rem] tw-text-grau/70">
          Übereinstimmung berechnet aus deinen Angaben{ki ? ' · Auswahl zusätzlich von KI geprüft' : ''}
        </span>
      </div>
    </motion.div>
  );
}

const LEER = { stimmung: [], mag_nicht: [], budget: null, freitext: '' };

export default function Berater({ produkte, kicker, heading, discovery, api }) {
  const auto = useMemo(() => jahreszeit(), []);
  const [saison, setSaison] = useState(auto);
  const [schritt, setSchritt] = useState(0);
  const [antworten, setAntworten] = useState(LEER);
  const [ergebnis, setErgebnis] = useState(null);
  const [laedt, setLaedt] = useState(false);
  const anfrage = useRef(0);

  const frageRef = useRef(null);
  const erstesMal = useRef(true);
  // Handy: nach jeder Antwort zum Anfang der nächsten Frage, falls man weiter unten ist.
  useEffect(() => {
    if (erstesMal.current) { erstesMal.current = false; return; }
    const el = frageRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [schritt, laedt]);

  const fertig = schritt >= SCHRITTE.length;
  const s = SCHRITTE[schritt];

  async function auswerten() {
    const eingabe = { ...antworten, saison, freitext: antworten.freitext.trim() };
    const nr = ++anfrage.current; // nur die letzte Anfrage zählt (Doppelklick, Zurück)
    setLaedt(true);
    setSchritt(SCHRITTE.length);
    let e = null;
    if (api) {
      try {
        const r = await fetch(api, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eingabe),
          signal: AbortSignal.timeout(API_TIMEOUT_MS),
        });
        if (r.ok) e = await r.json();
      } catch { e = null; }
    }
    if (!e || !Array.isArray(e.empfehlungen)) e = berateLokal(eingabe, produkte, api ? 'server_nicht_erreichbar' : 'lokal');
    if (nr !== anfrage.current) return;
    setErgebnis(e);
    setLaedt(false);
  }

  const weiter = () => setTimeout(() => setSchritt((x) => x + 1), 320);
  const waehle = (opt) => {
    if (s.mehrfach) {
      setAntworten((a) => {
        const liste = a[s.key] || [];
        const neu = liste.includes(opt.id) ? liste.filter((x) => x !== opt.id) : [...liste, opt.id].slice(-MAX_STIMMUNGEN);
        return { ...a, [s.key]: neu };
      });
      return;
    }
    setAntworten((a) => ({ ...a, [s.key]: opt.id }));
    weiter();
  };

  const neu = () => { anfrage.current += 1; setAntworten(LEER); setErgebnis(null); setLaedt(false); setSchritt(0); };
  const zurueckZumFeinschliff = () => { setErgebnis(null); setSchritt(SCHRITTE.length - 1); };
  const fortschritt = Math.min(schritt / SCHRITTE.length, 1);

  return (
    <MotionConfig reducedMotion="user">
      <div className="tw-mx-auto tw-w-full tw-max-w-[1280px] tw-px-4 tw-py-20 md:tw-px-10 md:tw-py-32">
        <header className="tw-flex tw-flex-col tw-gap-6 md:tw-flex-row md:tw-items-end md:tw-justify-between">
          <div>
            {kicker && <p className="tw-text-[0.75rem] tw-uppercase tw-tracking-[0.16em] tw-text-gold">{kicker}</p>}
            {heading && <h2 className="tw-mt-3 tw-text-[2.4rem] tw-leading-[1.05] md:tw-text-[3.4rem]">{heading}</h2>}
          </div>
          <Saison wert={saison} auto={auto} onChange={(j) => { setSaison(j); if (fertig && !laedt) zurueckZumFeinschliff(); }} />
        </header>

        <div className="tw-mt-8 tw-h-px tw-w-full tw-bg-creme/10" aria-hidden="true">
          <motion.div className="tw-h-px tw-origin-left tw-bg-gradient-to-r tw-from-golddunkel tw-to-gold2"
            animate={{ scaleX: fortschritt }} initial={false} transition={{ duration: 0.6, ease: EASE }} />
        </div>

        <div ref={frageRef} className="tw-mt-10 tw-scroll-mt-24 md:tw-mt-14">
          <AnimatePresence mode="wait">
            {!fertig ? (
              <motion.div key={s.key} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: EASE }}>
                <div className="tw-flex tw-flex-wrap tw-items-baseline tw-justify-between tw-gap-3">
                  <h3 className="tw-text-[1.6rem] md:tw-text-[2rem]">
                    <span className="tw-mr-3 tw-font-sans tw-text-[0.8rem] tw-tracking-[0.16em] tw-text-grau">0{schritt + 1} / 0{SCHRITTE.length}</span>
                    {s.frage}
                  </h3>
                  {s.hinweis && <p className="tw-text-[0.85rem] tw-text-grau">{s.hinweis}</p>}
                </div>
                <div className="tw-mt-6">
                  {s.key === 'feinschliff' ? (
                    <Feinschliff antworten={antworten} setAntworten={setAntworten} />
                  ) : (
                    <div className={`tw-grid tw-gap-3 md:tw-gap-4 ${s.optionen.length > 4 ? 'tw-grid-cols-2 lg:tw-grid-cols-4' : 'tw-grid-cols-1 sm:tw-grid-cols-3'}`}>
                      {s.optionen.map((o, i) => {
                        const wert = antworten[s.key];
                        const gewaehlt = s.mehrfach ? (wert || []).includes(o.id) : wert === o.id;
                        return <Karte key={o.id} option={o} index={i} gewaehlt={gewaehlt} onClick={() => waehle(o)} />;
                      })}
                    </div>
                  )}
                </div>
                <div className="tw-mt-8 tw-flex tw-flex-wrap tw-items-center tw-gap-6">
                  {schritt > 0 && (
                    <button type="button" onClick={() => setSchritt((x) => x - 1)} className="tw-text-[0.85rem] tw-text-grau tw-transition-colors hover:tw-text-gold2">
                      ← Zurück
                    </button>
                  )}
                  {s.mehrfach && (
                    <motion.button type="button" onClick={() => setSchritt((x) => x + 1)}
                      disabled={!(antworten[s.key] || []).length}
                      animate={{ opacity: (antworten[s.key] || []).length ? 1 : 0.35 }}
                      className="tw-ml-auto tw-inline-flex tw-min-h-[48px] tw-items-center tw-border tw-border-gold tw-px-7 tw-text-[0.8rem] tw-uppercase tw-tracking-[0.12em] tw-text-gold2 tw-transition-colors hover:tw-bg-gold hover:tw-text-nacht disabled:tw-cursor-not-allowed">
                      Weiter
                    </motion.button>
                  )}
                  {s.key === 'feinschliff' && (
                    <motion.button type="button" onClick={auswerten} whileTap={{ scale: 0.97 }}
                      className="tw-ml-auto tw-inline-flex tw-min-h-[52px] tw-items-center tw-bg-gold tw-px-8 tw-text-[0.8rem] tw-uppercase tw-tracking-[0.12em] tw-text-nacht tw-transition-colors hover:tw-bg-gold2">
                      Duft finden
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ) : laedt || !ergebnis ? (
              <Laden key="laden" />
            ) : (
              <Ergebnis key="ergebnis" ergebnis={ergebnis} saison={saison} discovery={discovery} onNeu={neu} onZurueck={zurueckZumFeinschliff} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}
