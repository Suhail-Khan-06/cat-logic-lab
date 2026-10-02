import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, Bookmark, Check, ChevronDown, ChevronUp, Clock3, RotateCcw, TimerReset, X } from 'lucide-react';
import './styles.css';
import { gamesChapter, type ChapterData, type Question, type SetData } from './data';
import { genericSets, genericQuestions } from './genericData';
import { roundRobinChapter } from './roundRobinData';

const genericChapter: ChapterData = {
  id: 'generic-puzzles-l1',
  title: 'Generic Puzzles',
  level: 'Level 1',
  description: 'Generic Puzzles — Level 1',
  sets: genericSets,
  questions: genericQuestions,
};

const chapters: ChapterData[] = [gamesChapter, genericChapter, roundRobinChapter];
const STORAGE = 'cat-logic-lab-v2';

type ChapterStore = {
  bookmarks: string[];
  mistakes: string[];
  practiceAnswers: Record<string, string>;
  lastResult?: ResultData;
};
type RootStore = { chapters: Record<string, ChapterStore> };
type Mode = 'home' | 'chapter' | 'practice' | 'test' | 'results' | 'mistakes' | 'bookmarks' | 'retry';
type ResultData = { mode: 'test' | 'practice' | 'mistakes'; answers: Record<string, string>; submittedAt: number; elapsed: number; chapterId: string };

const emptyChapterStore = (): ChapterStore => ({ bookmarks: [], mistakes: [], practiceAnswers: {} });
const emptyStore: RootStore = { chapters: {} };

function loadStore(): RootStore {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE) || 'null');
    if (raw?.chapters) return raw as RootStore;

    // Migrate the original single-chapter store so existing Games & Tournaments
    // progress, bookmarks and mistakes survive the chapter expansion.
    const legacyRaw = localStorage.getItem('cat-logic-lab-v1');
    const legacy = legacyRaw ? JSON.parse(legacyRaw) : (raw && Array.isArray(raw.bookmarks) ? raw : null);
    if (legacy && Array.isArray(legacy.bookmarks)) {
      return { chapters: { [gamesChapter.id]: {
        bookmarks: legacy.bookmarks || [],
        mistakes: legacy.mistakes || [],
        practiceAnswers: legacy.practiceAnswers || {},
        lastResult: legacy.lastResult ? { ...legacy.lastResult, chapterId: gamesChapter.id } : undefined,
      } } };
    }
  } catch { /* use empty store */ }
  return emptyStore;
}

function saveStore(s: RootStore) { try { localStorage.setItem(STORAGE, JSON.stringify(s)); } catch { /* storage unavailable or full: keep running in memory */ } }
function normalize(s: string) { return s.trim().toLowerCase().replace(/₹/g, '').replace(/,/g, '').replace(/\s+/g, ' '); }

// Splits "A, D or E" / "Seed 12 or 117" into a comparable set of tokens.
function answerTokens(s: string) {
  return s.toLowerCase().replace(/₹/g, '').split(/[\s,/&]+|\bor\b|\band\b|\bseed\b/).map(t => t.trim()).filter(Boolean).sort().join('|');
}

// Structured answers (Round Robin Q8/Q11) are stored as a JSON array of cell strings.
function parseCells(value: string): string[] | null {
  try { const c = JSON.parse(value); return Array.isArray(c) && c.every(x => typeof x === 'string') ? c : null; } catch { return null; }
}
function structuredRows(q: Question, cells: string[]) {
  const n = q.structured!.labels.length;
  const rows: string[][] = [];
  for (let i = 0; i < cells.length; i += n) rows.push(cells.slice(i, i + n));
  return rows;
}
function structuredMatches(q: Question, value: string) {
  const st = q.structured!;
  const cells = parseCells(value);
  if (!cells) return false;
  const isInt = (c: string) => /^\d+$/.test(c.trim());
  if (st.kind === 'records') {
    // Expected records are parsed from the answer key text, e.g. "(5W,0D,2L), (4W,2D,1L), (3W,4D,0L)".
    const expected = [...q.answer.matchAll(/\((\d+)W,\s*(\d+)D,\s*(\d+)L\)/g)].map(m => `${+m[1]}-${+m[2]}-${+m[3]}`).sort();
    const filled = structuredRows(q, cells).filter(r => r.some(c => c.trim()));
    if (filled.some(r => !r.every(isInt))) return false;
    const given = filled.map(r => r.map(c => +c).join('-')).sort();
    return given.length === expected.length && given.every((g, i) => g === expected[i]);
  }
  if (st.kind === 'booleanFields') {
    let expected: string[] = [];
    if (q.id === 'round-robin-q47') {
      // These three fields are a direct, structured representation of the existing source answer.
      expected = ['Yes', 'Yes', 'Yes'];
    } else {
      expected = (q.answer.match(/(?:\b[a-z]\)|:)\s*(Yes|No)/gi) || []).map(x => x.match(/(Yes|No)/i)![1]);
    }
    return cells.length === expected.length && cells.every((c, i) => c === expected[i]);
  }
  // 'fields': numbers in the answer key, in label order (e.g. "3 draws; 30 points" -> 3, 30).
  const expected = (q.answer.match(/\d+/g) || []).map(Number);
  return cells.length === expected.length && cells.every((c, i) => isInt(c) && +c === expected[i]);
}
// Human-readable form of a stored answer for the review screen.
function formatAnswer(q: Question, value: string) {
  if (!q.structured) return value;
  const cells = parseCells(value);
  if (!cells) return value;
  if (q.structured.kind === 'records') {
    const rows = structuredRows(q, cells).filter(r => r.some(c => c.trim()));
    return rows.map(r => `(${r[0] || '?'}W, ${r[1] || '?'}D, ${r[2] || '?'}L)`).join(', ');
  }
  return q.structured.labels.map((l, i) => `${l}: ${(cells[i] || '').trim() || '?'}`).join('; ');
}

// Single evaluation path used by Results and Retry Incorrect (and therefore by manual submit and timer expiry).
type Evaluated = { q: Question; v: string; status: 'correct' | 'incorrect' | 'unanswered' };
function evaluateAnswers(chapter: ChapterData, answers: Record<string, string>): Evaluated[] {
  return chapter.questions.map(q => {
    const v = answers[q.id] || '';
    return { q, v, status: !v.trim() ? 'unanswered' : answerMatches(q, v) ? 'correct' : 'incorrect' };
  });
}

function answerMatches(q: Question, value: string) {
  if (!value.trim()) return false;
  if (q.structured) return structuredMatches(q, value);
  const v = normalize(value);
  const a = normalize(q.answer);
  if (q.answerType === 'mc') return v === a;
  if (q.id === 'Q19') return /^(seed\s*)?5$/.test(v);
  if (q.id === 'Q20') return /^(seed\s*)?8$/.test(v);
  if (q.id === 'Q21' && (v === 'seed 12 or 117' || v === '12 or 117' || v === '12/117')) return true;
  if (v === a) return true;
  // Numeric TITA answers may be stored with a source unit (e.g. "78 points").
  // Accept the bare numeric value when the source answer contains exactly one number.
  const sourceNumbers = a.match(/\d+(?:\.\d+)?/g) || [];
  if (/^\d+(?:\.\d+)?$/.test(v) && sourceNumbers.length === 1 && sourceNumbers[0] === v) return true;
  // Multi-value answers (e.g. "A, D or E", "Seed 12 or 117"): accept any order/separator.
  if (/,|\bor\b|\band\b|\//i.test(q.answer)) return answerTokens(value) === answerTokens(q.answer);
  return false;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function App() {
  const [store, setStore] = useState<RootStore>(loadStore);
  const [mode, setMode] = useState<Mode>('home');
  const [chapterId, setChapterId] = useState<string>(gamesChapter.id);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [testSeconds, setTestSeconds] = useState(0);
  const [testStart, setTestStart] = useState<number | null>(null);
  const [testFinished, setTestFinished] = useState(false);
  const [result, setResult] = useState<ResultData | null>(null);
  const [openInfo, setOpenInfo] = useState<Record<string, boolean>>({});
  const [sessionIds, setSessionIds] = useState<string[] | null>(null);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  const chapter = chapters.find(c => c.id === chapterId) || gamesChapter;
  const chapterStore: ChapterStore = { ...emptyChapterStore(), ...store.chapters[chapter.id] };
  // Mistake Bank / Bookmarks / Retry use a list snapshotted when the session starts, so answering or
  // un-bookmarking a question never removes it from under the user mid-session.
  const currentQuestions = useMemo(() => {
    if (mode === 'mistakes' || mode === 'bookmarks' || mode === 'retry') return chapter.questions.filter(q => (sessionIds || []).includes(q.id));
    return chapter.questions;
  }, [chapter, sessionIds, mode]);
  const current = currentQuestions[index];

  useEffect(() => { saveStore(store); }, [store]);
  useEffect(() => {
    if (mode !== 'test' || testFinished || testStart === null) return;
    const total = chapter.questions.length * 60;
    // Derive remaining time from the wall clock so throttled/background tabs cannot drift the timer.
    const tick = () => {
      const left = Math.max(0, total - Math.floor((Date.now() - testStart) / 1000));
      setTestSeconds(left);
      if (left === 0) setTestFinished(true);
    };
    const timer = window.setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', tick); };
  }, [mode, testFinished, testStart, chapter]);
  useEffect(() => {
    if (mode !== 'test' || testFinished) return;
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [mode, testFinished]);
  useEffect(() => {
    if (!zoomSrc) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoomSrc(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [zoomSrc]);
  useEffect(() => {
    if (mode === 'test' && testFinished) finalizeTest();
  }, [testFinished]);

  function setChapter(id: string) {
    setChapterId(id);
    setMode('chapter');
    setIndex(0);
    setAnswers({});
    setSubmitted({});
    setResult(null);
    setSessionIds(null);
  }

  function updateChapterStore(next: Partial<ChapterStore>) {
    setStore(s => {
      const currentStore = s.chapters[chapter.id] || emptyChapterStore();
      return { ...s, chapters: { ...s.chapters, [chapter.id]: { ...currentStore, ...next } } };
    });
  }

  function toggleBookmark(id: string) {
    const list = chapterStore.bookmarks.includes(id)
      ? chapterStore.bookmarks.filter(x => x !== id)
      : [...chapterStore.bookmarks, id];
    updateChapterStore({ bookmarks: list });
  }

  function startPractice(ids?: string[]) {
    setMode(ids ? 'retry' : 'practice');
    setSessionIds(ids ? [...ids] : null);
    setIndex(0);
    setAnswers(ids ? {} : { ...chapterStore.practiceAnswers });
    setSubmitted({});
    setResult(null);
  }

  function startFiltered(modeName: 'mistakes' | 'bookmarks') {
    setSessionIds([...(modeName === 'mistakes' ? chapterStore.mistakes : chapterStore.bookmarks)]);
    setMode(modeName);
    setIndex(0);
    setAnswers({});
    setSubmitted({});
    setResult(null);
  }

  function startTest() {
    const seconds = chapter.questions.length * 60;
    setSessionIds(null);
    setMode('test');
    setIndex(0);
    setAnswers({});
    setSubmitted({});
    setTestSeconds(seconds);
    setTestStart(Date.now());
    setTestFinished(false);
    setResult(null);
  }

  function finishTest(manual = true) {
    const unanswered = chapter.questions.filter(q => !(answers[q.id] || '').trim()).length;
    const note = unanswered ? `${unanswered} of ${chapter.questions.length} questions are unanswered. ` : 'All questions are answered. ';
    if (manual && !window.confirm(`${note}Submit the timed test now? You cannot change answers afterwards.`)) return;
    setTestFinished(true);
  }

  function finishPractice() {
    const r: ResultData = { mode: 'practice', answers, submittedAt: Date.now(), elapsed: 0, chapterId: chapter.id };
    const evaluated = evaluateAnswers(chapter, answers);
    const wrongIds = evaluated.filter(x => x.status === 'incorrect').map(x => x.q.id);
    const existingMistakes = new Set(chapterStore.mistakes);
    wrongIds.forEach(id => existingMistakes.add(id));
    evaluated.filter(x => x.status === 'correct').forEach(x => existingMistakes.delete(x.q.id));
    updateChapterStore({ mistakes: [...existingMistakes], lastResult: r });
    setResult(r);
    setMode('results');
  }

  function finalizeTest() {
    const total = chapter.questions.length * 60;
    const elapsed = testStart === null ? 0 : Math.min(total, Math.max(0, Math.floor((Date.now() - testStart) / 1000)));
    const r: ResultData = { mode: 'test', answers, submittedAt: Date.now(), elapsed, chapterId: chapter.id };
    setResult(r);
    updateChapterStore({ lastResult: r });
    setMode('results');
  }

  function submitPractice() {
    if (!current) return;
    const value = answers[current.id] || '';
    if (!value.trim()) return;
    const correct = answerMatches(current, value);
    setSubmitted(s => ({ ...s, [current.id]: true }));
    const mistakes = correct
      ? chapterStore.mistakes.filter(id => id !== current.id)
      : value.trim() && !chapterStore.mistakes.includes(current.id)
        ? [...chapterStore.mistakes, current.id]
        : chapterStore.mistakes;
    updateChapterStore({ mistakes, practiceAnswers: { ...chapterStore.practiceAnswers, [current.id]: value } });
  }

  function nav(delta: number) {
    setIndex(i => Math.min(Math.max(0, i + delta), currentQuestions.length - 1));
  }

  const practicedCount = chapter.questions.filter(q => Boolean(chapterStore.practiceAnswers[q.id])).length;
  const progress = Math.round((practicedCount / chapter.questions.length) * 100);

  if (mode === 'home') {
    return <ChapterPicker chapters={chapters} onSelect={setChapter} />;
  }

  if (mode === 'chapter') {
    return <ChapterHome
      chapter={chapter}
      progress={progress}
      mistakes={chapterStore.mistakes.length}
      bookmarks={chapterStore.bookmarks.length}
      onHome={() => setMode('home')}
      onPractice={() => startPractice()}
      onTest={startTest}
      onMistakes={() => startFiltered('mistakes')}
      onBookmarks={() => startFiltered('bookmarks')}
    />;
  }

  if (mode === 'results' && result) {
    return <Results
      chapter={chapter}
      result={result}
      onHome={() => setMode('chapter')}
      onRetryIncorrect={() => {
        const ids = evaluateAnswers(chapter, result.answers).filter(r => r.status === 'incorrect').map(r => r.q.id);
        if (!ids.length) { setMode('chapter'); return; }
        startPractice(ids);
      }}
    />;
  }

  if ((mode === 'mistakes' || mode === 'bookmarks') && currentQuestions.length === 0) {
    return <EmptyState mode={mode} chapter={chapter} onHome={() => setMode('chapter')} />;
  }
  if (!current) return null;

  const set = chapter.sets.find(s => s.id === current.setId)!;
  const displayNumber = chapter.id === 'round-robin-master' ? chapter.questions.findIndex(q => q.id === current.id) + 1 : current.number;
  const isTest = mode === 'test';
  const isPractice = mode === 'practice' || mode === 'mistakes' || mode === 'bookmarks' || mode === 'retry';
  const infoOpen = openInfo[set.id] !== false;
  const answeredCount = currentQuestions.filter(q => (answers[q.id] || '').trim()).length;
  const optionList = current.choices || current.options;
  const visuals = (set.visuals || []).filter(v => current.visualIds?.includes(v.id));
  const isSubmitted = !!submitted[current.id];
  const value = answers[current.id] || '';

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand-button" onClick={() => setMode('chapter')}>
        <span className="brand-mark">CL</span>
        <span><b>CAT Logic Lab</b><small>{chapter.title} · {chapter.level}</small></span>
      </button>
      <div className="top-actions">
        {isTest && <span className={testSeconds < 60 ? 'timer urgent' : 'timer'} role="status" aria-live="polite"><Clock3 size={16}/>{formatTime(testSeconds)}</span>}
        {isTest && !testFinished && <button className="secondary" onClick={() => finishTest()} >Submit test</button>}
        <button className="ghost-button" onClick={() => {
          if (isTest && !testFinished) {
            if (window.confirm('Leave this timed test? Your current test will be discarded.')) setMode('chapter');
          } else setMode('chapter');
        }}><ArrowLeft size={16}/> Back to chapter</button>
      </div>
    </header>
    <main className="solver">
      <div className="solver-meta">
        <div><span className="eyebrow">{isTest ? 'TIMED TEST' : mode === 'mistakes' ? 'MISTAKE BANK' : mode === 'bookmarks' ? 'BOOKMARKS' : mode === 'retry' ? 'RETRY INCORRECT' : 'PRACTICE'}</span><span className="set-label">Set {set.number} · Question {displayNumber}</span></div>
        <div className="question-counter">{index + 1} / {currentQuestions.length}{isTest && ` · ${answeredCount} answered`}</div>
      </div>
      <div className="progress-line"><span style={{ width: `${((index + 1) / currentQuestions.length) * 100}%` }}/></div>
      <div className="question-grid">
        <aside className="caselet-card">
          <button className="caselet-toggle" aria-expanded={infoOpen} onClick={() => setOpenInfo(o => ({ ...o, [set.id]: o[set.id] === false }))}>
            <span>{set.commonInformation ? 'Common information' : 'Question information'}</span>
            {infoOpen ? <ChevronUp size={18}/> : <ChevronDown size={18}/>} 
          </button>
          <div className={infoOpen ? 'caselet-body open' : 'caselet-body'}>
            {set.directions && <p className="directions">{set.directions}</p>}
            {set.commonInformation && <div className="caselet-text">{set.commonInformation.split('\n').map((x, i) => <p key={i}>{x}</p>)}</div>}
            {!set.commonInformation && <p className="caselet-text">Standalone question. No separate common caselet information.</p>}
          </div>
        </aside>
        <section className="question-card">
          <div className="q-number">Question {displayNumber}</div>
          <h1>{current.questionText}</h1>
          {visuals.map(v => <div className="visual-wrap" key={v.id}><div className="visual-head"><span>{v.description}</span><button onClick={() => setZoomSrc(v.src)}>Enlarge</button></div><img src={v.src} alt={v.description} onClick={() => setZoomSrc(v.src)} /></div>)}
          {current.choices && <div className="statements">{current.options.map(o => <p key={o.label}><b>({o.label})</b>{o.text}</p>)}</div>}
          {current.structured ? <StructuredInput key={current.id} q={current} value={value} disabled={isSubmitted && isPractice} onChange={v => setAnswers(a => ({ ...a, [current.id]: v }))} onEnter={() => { if (isPractice && !isSubmitted && value.trim()) submitPractice(); }} /> : current.answerType === 'mc' ? <div className="options" role="group" aria-label="Answer options">{optionList.map(o => {
            const selected = value === o.label;
            const correct = isSubmitted && o.label === current.answer;
            const wrong = isSubmitted && selected && !correct;
            return <button key={o.label} aria-pressed={selected} disabled={isSubmitted && isPractice} className={`option ${selected ? 'selected' : ''} ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`} onClick={() => setAnswers(a => ({ ...a, [current.id]: o.label }))}>
              <span className="option-label">{o.label}</span><span>{o.text}</span>{correct && <Check size={17}/>} {wrong && <X size={17}/>} 
            </button>;
          })}</div> : <div className="tita"><label htmlFor="tita-input">Enter your answer</label><input id="tita-input" value={value} disabled={isSubmitted && isPractice} autoComplete="off" autoCapitalize="off" spellCheck={false} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAnswers(a => ({ ...a, [current.id]: e.target.value }))} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter' && isPractice && !isSubmitted && value.trim()) submitPractice(); }} placeholder="Type the answer" /></div>}
          {isSubmitted && isPractice && <div className={`feedback ${answerMatches(current, value) ? 'good' : 'bad'}`}><span>{answerMatches(current, value) ? 'Correct' : 'Incorrect'}</span><span>Source answer: {current.answer}</span></div>}
          <div className="question-footer">
            <button className={`icon-button ${chapterStore.bookmarks.includes(current.id) ? 'bookmarked' : ''}`} onClick={() => toggleBookmark(current.id)} aria-pressed={chapterStore.bookmarks.includes(current.id)} aria-label={chapterStore.bookmarks.includes(current.id) ? 'Remove bookmark' : 'Bookmark this question'} title={chapterStore.bookmarks.includes(current.id) ? 'Remove bookmark' : 'Bookmark this question'}><Bookmark size={18} fill={chapterStore.bookmarks.includes(current.id) ? 'currentColor' : 'none'}/></button>
            <div className="footer-actions">
              {index > 0 && <button className="secondary" onClick={() => nav(-1)}><ArrowLeft size={16}/> Previous</button>}
              {isPractice && !isSubmitted && <button className="primary" disabled={!value.trim()} onClick={submitPractice}>Check answer</button>}
              {index < currentQuestions.length - 1 ? <button className="primary" onClick={() => nav(1)}>Next <ArrowRight size={16}/></button> : isTest ? <button className="primary" onClick={() => finishTest()}>Submit test</button> : <button className="primary" onClick={finishPractice}>Finish <Check size={16}/></button>}
            </div>
          </div>
        </section>
      </div>
      <div className="navigator"><span>Question map</span><div>{currentQuestions.map((q, i) => <button key={q.id} aria-label={`Question ${chapter.id === 'round-robin-master' ? chapter.questions.findIndex(x => x.id === q.id) + 1 : q.number}${(answers[q.id] || '').trim() ? ', answered' : ''}${chapterStore.bookmarks.includes(q.id) ? ', bookmarked' : ''}`} aria-current={i === index ? 'true' : undefined} className={`${i === index ? 'active' : ''} ${(answers[q.id] || '').trim() ? 'answered' : ''} ${chapterStore.bookmarks.includes(q.id) ? 'marked' : ''}`} onClick={() => setIndex(i)}>{chapter.id === 'round-robin-master' ? chapter.questions.findIndex(x => x.id === q.id) + 1 : q.number}</button>)}</div></div>
    </main>
    {zoomSrc && <div className="modal" role="dialog" aria-modal="true" aria-label="Source image" onClick={() => setZoomSrc(null)}><div className="modal-inner" onClick={e => e.stopPropagation()}><button className="modal-close" aria-label="Close image" onClick={() => setZoomSrc(null)}><X size={18}/></button><img src={zoomSrc} alt="Original source page" /></div></div>}
  </div>;
}

function ChapterPicker({ chapters, onSelect }: { chapters: ChapterData[]; onSelect: (id: string) => void }) {
  const total = chapters.reduce((n, c) => n + c.questions.length, 0);
  return <div className="home"><header className="home-header"><div className="brand-lockup"><span className="brand-mark large">CL</span><div><span className="eyebrow">PERSONAL CAT PREP</span><h1>CAT Logic Lab</h1></div></div><div className="chapter-chip">{chapters.length} chapters <b>{total} questions</b></div></header><main className="home-main"><section className="hero picker-hero"><div><span className="eyebrow">LOGICAL REASONING</span><h2>Choose your<br/><em>chapter</em></h2><p>A focused local practice lab for CAT Logical Reasoning. Each chapter keeps its own sets, progress, bookmarks and mistake bank.</p></div><div className="hero-note"><span>01</span><strong>Level 1 library</strong><small>{total} questions across {chapters.length} chapters</small></div></section><section className="chapter-grid">{chapters.map((c, i) => <button className="chapter-card" key={c.id} onClick={() => onSelect(c.id)}><div className="chapter-card-top"><span className="set-no">{String(i + 1).padStart(2, '0')}</span><span className="eyebrow">{c.level}</span></div><h3>{c.title}</h3><p>{c.description}</p><div className="chapter-card-meta"><span>{c.sets.length} sets</span><span>{c.questions.length} questions</span><ArrowRight size={17}/></div></button>)}</section></main></div>;
}

function ChapterHome({ chapter, progress, mistakes, bookmarks, onHome, onPractice, onTest, onMistakes, onBookmarks }: { chapter: ChapterData; progress: number; mistakes: number; bookmarks: number; onHome: () => void; onPractice: () => void; onTest: () => void; onMistakes: () => void; onBookmarks: () => void }) {
  const practiced = Math.round(progress * chapter.questions.length / 100);
  const displayQuestionNumber = (number: number) => chapter.id === 'round-robin-master' ? chapter.questions.findIndex(q => q.number === number) + 1 : number;
  return <div className="home"><header className="home-header"><div className="brand-lockup"><span className="brand-mark large">CL</span><div><span className="eyebrow">PERSONAL CAT PREP</span><h1>CAT Logic Lab</h1></div></div><button className="chapter-chip chapter-switch" onClick={onHome}>All chapters</button></header><main className="home-main"><section className="hero"><div><span className="eyebrow">LOGICAL REASONING</span><h2>{chapter.title.includes(' & ')?<>{chapter.title.split(' & ')[0]} &amp;<br/><em>{chapter.title.split(' & ')[1]}</em></>:<><em>{chapter.title}</em></>}</h2><p>{chapter.description}. {chapter.questions.length} questions. Built for deliberate practice, clean review, and fast repetition.</p><div className="hero-actions"><button className="primary big" onClick={onPractice}>Practice <ArrowRight size={18}/></button><button className="secondary big" onClick={onTest}><TimerReset size={18}/> Timed test</button></div></div><div className="hero-note"><span>01</span><strong>{chapter.level}</strong><small>{chapter.sets.length} sets · {chapter.questions.length} questions</small></div></section><section className="dashboard-grid"><button className="stat-card action" onClick={onMistakes}><div><span className="eyebrow">MISTAKE BANK</span><strong>{mistakes}</strong><small>questions to revisit</small></div><RotateCcw size={20}/></button><button className="stat-card action" onClick={onBookmarks}><div><span className="eyebrow">BOOKMARKS</span><strong>{bookmarks}</strong><small>saved questions</small></div><Bookmark size={20}/></button><div className="stat-card"><span className="eyebrow">CHAPTER PROGRESS</span><div className="progress-number">{progress}%</div><div className="mini-bar"><span style={{ width: `${progress}%` }}/></div><small>{practiced} of {chapter.questions.length} practiced</small></div></section><section className="set-list"><div className="section-heading"><div><span className="eyebrow">THE CHAPTER</span><h3>{chapter.sets.length} problem sets</h3></div><span>{chapter.questions.length} questions</span></div><div className="sets">{chapter.sets.map(s => <div className="set-row" key={s.id}><span className="set-no">{String(s.number).padStart(2, '0')}</span><div><strong>{s.title}</strong><small>{s.questionNumbers ? `Questions ${s.questionNumbers.map(n => displayQuestionNumber(n)).join(', ')}` : `Questions ${s.questionRange[0]}${s.questionRange[1] !== s.questionRange[0] ? `–${s.questionRange[1]}` : ''}`}</small></div><span className="set-topic">{s.topic}</span></div>)}</div></section></main></div>;
}

function Results({ chapter, result, onHome, onRetryIncorrect }: { chapter: ChapterData; result: ResultData; onHome: () => void; onRetryIncorrect: () => void }) {
  const rows = evaluateAnswers(chapter, result.answers);
  const correct = rows.filter(r => r.status === 'correct').length;
  const incorrectCount = rows.filter(r => r.status === 'incorrect').length;
  const unanswered = rows.filter(r => r.status === 'unanswered').length;
  const label = { correct: 'Correct', incorrect: 'Incorrect', unanswered: 'Unanswered' } as const;
  const cls = { correct: 'ok', incorrect: 'bad', unanswered: 'na' } as const;
  return <div className="results"><header className="topbar"><button className="brand-button" onClick={onHome}><span className="brand-mark">CL</span><span><b>CAT Logic Lab</b><small>{chapter.title} · {chapter.level}</small></span></button></header><main className="results-main"><span className="eyebrow">RESULTS</span><h1>{correct}<small> / {chapter.questions.length}</small></h1><p className="result-lead">{correct} correct · {incorrectCount} incorrect · {unanswered} unanswered</p><div className="result-stats"><div><span>Correct</span><b>{correct}</b></div><div><span>Incorrect</span><b>{incorrectCount}</b></div><div><span>Unanswered</span><b>{unanswered}</b></div><div><span>Time used</span><b>{formatTime(result.elapsed)}</b></div></div><div className="review-list"><div className="section-heading"><div><span className="eyebrow">REVIEW</span><h3>Question by question</h3></div></div>{rows.map((r, i) => <div className={`review-row ${cls[r.status]}`} key={r.q.id}><span>Q{chapter.id === 'round-robin-master' ? i + 1 : r.q.number}</span><span><strong>{r.status === 'unanswered' ? '—' : formatAnswer(r.q, r.v)}</strong><small>{r.status === 'unanswered' ? 'Not answered · ' : r.status === 'incorrect' ? 'Your answer is shown above · ' : ''}Correct answer: {r.q.answer}</small></span><span>{label[r.status]}</span></div>)}</div><div className="result-actions"><button className="secondary" onClick={onHome}>Back to chapter</button><button className="primary" disabled={incorrectCount === 0} onClick={onRetryIncorrect}>Retry incorrect{incorrectCount ? ` (${incorrectCount})` : ''}</button></div></main></div>;
}

function StructuredInput({ q, value, disabled, onChange, onEnter }: { q: Question; value: string; disabled: boolean; onChange: (v: string) => void; onEnter: () => void }) {
  const st = q.structured!;
  const rows = st.kind === 'records' ? (st.rows || 1) : 1;
  const total = rows * st.labels.length;
  const stored = parseCells(value) || [];
  const cells = Array.from({ length: total }, (_, i) => stored[i] || '');
  const setCell = (i: number, v: string) => {
    const next = cells.slice();
    next[i] = v;
    onChange(next.some(c => c.trim()) ? JSON.stringify(next) : '');
  };
  const numericInput = (i: number, label: string, id: string) => <input id={id} inputMode="numeric" aria-label={label} value={cells[i]} disabled={disabled} autoComplete="off" placeholder="0" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCell(i, e.target.value.replace(/[^0-9]/g, ''))} onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') onEnter(); }} />;
  if (st.kind === 'records') {
    return <div className="tita structured" role="group" aria-label="Answer records">
      <label>Enter {rows > 1 ? `all ${rows} possible records` : 'the possible record'} (Wins · Draws · Losses). Order does not matter.</label>
      {Array.from({ length: rows }, (_, r) => <div className="record-row" key={r}><span className="record-no">{rows > 1 ? `Record ${r + 1}` : 'Record'}</span>{st.labels.map((l, c) => <div className="record-cell" key={l}><small>{l}</small>{numericInput(r * st.labels.length + c, `${l}`, `st-${r}-${c}`)}</div>)}</div>)}
    </div>;
  }
  if (st.kind === 'booleanFields') {
    const choices = st.choices || ['Yes', 'No'];
    return <div className="tita structured boolean-fields" role="group" aria-label="Answer fields">
      <label>Select an answer for each statement.</label>
      {st.labels.map((label, i) => <div className="boolean-row" key={label}><span>{label}</span><div className="boolean-options">{choices.map(choice => <button type="button" key={choice} disabled={disabled} className={cells[i] === choice ? 'selected' : ''} aria-pressed={cells[i] === choice} onClick={() => setCell(i, choice)}>{choice}</button>)}</div></div>)}
    </div>;
  }
  return <div className="tita structured" role="group" aria-label="Answer fields">
    <label>Enter both values</label>
    <div className="record-row">{st.labels.map((l, c) => <div className="record-cell" key={l}><small>{l}</small>{numericInput(c, l, `st-${c}`)}</div>)}</div>
  </div>;
}
function EmptyState({ mode, chapter, onHome }: { mode: Mode; chapter: ChapterData; onHome: () => void }) {
  return <div className="empty"><span className="brand-mark large">CL</span><span className="eyebrow">{mode === 'mistakes' ? 'MISTAKE BANK' : 'BOOKMARKS'}</span><h1>Nothing here yet.</h1><p>No {mode === 'mistakes' ? 'mistakes' : 'bookmarks'} in {chapter.title} yet. {mode === 'mistakes' ? 'Questions you answer incorrectly in Practice are collected here.' : 'Tap the bookmark icon on any question to save it here.'}</p><button className="primary" onClick={onHome}>Back to chapter</button></div>;
}

createRoot(document.getElementById('root')!).render(<App />);
