import { useEffect, useMemo, useState } from 'react';
import { loadBank, computeStats, pct } from './lib/data.js';
import { loadProgress, useProgress, useSaveStatus, setSetting } from './lib/progress.js';
import { useRoute, navigate, href } from './lib/router.js';
import { Icon } from './components/ui.jsx';
import Dashboard from './views/Dashboard.jsx';
import SubjectView from './views/SubjectView.jsx';
import ListView from './views/ListView.jsx';
import Practice from './views/Practice.jsx';
import Papers from './views/Papers.jsx';
import Tracker from './views/Tracker.jsx';
import TestView from './views/TestView.jsx';

export default function App() {
  const [bank, setBank] = useState(null);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const progress = useProgress();
  const route = useRoute();
  const settings = progress.settings || {};

  useEffect(() => {
    Promise.all([loadBank(), loadProgress()])
      .then(([b]) => {
        setBank(b);
        setReady(true);
      })
      .catch((e) => setError(String(e.message || e)));
  }, []);

  // theme
  useEffect(() => {
    const t = settings.theme || 'system';
    const root = document.documentElement;
    if (t === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', t);
  }, [settings.theme]);

  useEffect(() => setNavOpen(false), [route.hash]);

  const stats = useMemo(() => (bank ? computeStats(bank, progress, settings) : null), [bank, progress, settings]);

  if (error) {
    return (
      <div className="boot">
        <h1>Could not start</h1>
        <p>{error}</p>
        <p>Run <code>npm run setup</code> then <code>npm start</code> from the project folder.</p>
      </div>
    );
  }
  if (!ready || !bank) {
    return (
      <div className="boot">
        <div className="spinner" />
        <p>Loading question bank…</p>
      </div>
    );
  }

  const [section] = route.segments;
  let view;
  if (!section) view = <Dashboard bank={bank} progress={progress} stats={stats} />;
  else if (section === 'subject') view = <SubjectView bank={bank} progress={progress} stats={stats} id={route.segments[1]} />;
  else if (section === 'list') view = <ListView bank={bank} progress={progress} query={route.query} />;
  else if (section === 'q') view = <Practice bank={bank} progress={progress} id={route.segments[1]} query={route.query} />;
  else if (section === 'papers') view = <Papers bank={bank} progress={progress} stats={stats} />;
  else if (section === 'tracker') view = <Tracker bank={bank} progress={progress} stats={stats} />;
  else if (section === 'test') view = <TestView key={route.segments[1]} bank={bank} progress={progress} paperId={route.segments[1]} />;
  else view = <Dashboard bank={bank} progress={progress} stats={stats} />;

  return (
    <div className={`layout ${navOpen ? 'nav-open' : ''}`}>
      <Sidebar bank={bank} stats={stats} section={section} route={route} />
      <div className="main">
        <Topbar onMenu={() => setNavOpen((v) => !v)} settings={settings} />
        <main className="page">{view}</main>
      </div>
      {navOpen && <div className="scrim" onClick={() => setNavOpen(false)} />}
    </div>
  );
}

function Sidebar({ bank, stats, section, route }) {
  const sid = section === 'subject' ? route.segments[1] : route.query.get('s');
  const { overall } = stats;
  return (
    <aside className="sidebar">
      <a className="brand" href="#/">
        <span className="brand-mark">G</span>
        <span>
          <strong>GATE CSE</strong>
          <small>PYQ Bank · 1987–2026</small>
        </span>
      </a>
      <div className="side-progress" title={`${overall.attempted} of ${overall.total} attempted`}>
        <div className="side-progress-row">
          <span>Overall</span>
          <span>
            {overall.attempted}/{overall.total}
          </span>
        </div>
        <div className="mini-bar">
          <span style={{ width: `${pct(overall.attempted, overall.total)}%` }} />
        </div>
      </div>
      <nav className="nav">
        <a className={!section ? 'active' : ''} href="#/">
          <Icon name="home" /> Dashboard
        </a>
        <a className={section === 'papers' || section === 'test' ? 'active' : ''} href="#/papers">
          <Icon name="calendar" /> Papers &amp; mock tests
        </a>
        <a className={section === 'list' && !sid ? 'active' : ''} href="#/list">
          <Icon name="list" /> All questions
        </a>
        <a className={section === 'tracker' ? 'active' : ''} href="#/tracker">
          <Icon name="chart" /> Progress tracker
        </a>
      </nav>
      <div className="nav-heading">Subjects</div>
      <nav className="nav nav-subjects">
        {bank.subjects.map((s) => {
          const st = stats.bySubject.get(s.id);
          if (!st) return null;
          return (
            <a key={s.id} className={sid === s.id ? 'active' : ''} href={`#/subject/${s.id}`}>
              <span className="nav-subject-name">{s.short || s.name}</span>
              <span className="nav-count">{pct(st.attempted, st.total)}%</span>
            </a>
          );
        })}
      </nav>
      <div className="nav-heading">Review</div>
      <nav className="nav">
        <a href={href('/list', 'st=wrong')}>
          <Icon name="x" /> Mistakes
        </a>
        <a href={href('/list', 'st=bookmarked')}>
          <Icon name="star" /> Bookmarks
        </a>
        <a href={href('/list', 'st=revise')}>
          <Icon name="flag" /> To revise
        </a>
      </nav>
    </aside>
  );
}

function Topbar({ onMenu, settings }) {
  const [q, setQ] = useState('');
  const { saveStatus, serverOk } = useSaveStatus();
  const theme = settings.theme || 'system';
  const nextTheme = theme === 'system' ? 'dark' : theme === 'dark' ? 'light' : 'system';
  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label="Open navigation">
        <Icon name="menu" size={20} />
      </button>
      <form
        className="search"
        onSubmit={(e) => {
          e.preventDefault();
          navigate(href('/list', q.trim() ? `q=${encodeURIComponent(q.trim())}` : ''));
        }}
      >
        <Icon name="search" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions (e.g. LRU page fault, B+ tree order, 2019)" aria-label="Search questions" />
      </form>
      <span
        className="save-pill"
        title={
          serverOk === false
            ? 'Progress is stored in this browser (local storage). Back it up from Progress tracker → Export progress.'
            : 'Progress is saved to data/progress.json by the local server'
        }
      >
        {saveStatus === 'pending' ? 'Saving…' : serverOk === false ? 'Saved in this browser' : 'Saved'}
      </span>
      <button className="icon-btn" onClick={() => setSetting('theme', nextTheme)} aria-label={`Theme: ${theme}`} title={`Theme: ${theme} (click to change)`}>
        <Icon name={theme === 'dark' ? 'moon' : 'sun'} size={18} />
      </button>
    </header>
  );
}
