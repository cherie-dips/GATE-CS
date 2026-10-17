import { useEffect, useMemo, useState } from 'react';
import { loadBank, computeStats } from './lib/data.js';
import { loadProgress, useProgress, setSetting } from './lib/progress.js';
import { initCloud, signIn, useCloud } from './lib/cloud.js';
import { useRoute, navigate, href } from './lib/router.js';
import { Icon } from './components/ui.jsx';
import Home from './views/Home.jsx';
import SubjectView from './views/SubjectView.jsx';
import ListView from './views/ListView.jsx';
import Practice from './views/Practice.jsx';
import Papers from './views/Papers.jsx';
import Progress from './views/Progress.jsx';
import TestView from './views/TestView.jsx';

export default function App() {
  const [bank, setBank] = useState(null);
  const [error, setError] = useState(null);
  const progress = useProgress();
  const route = useRoute();
  const settings = progress.settings || {};

  useEffect(() => {
    Promise.all([loadBank(), loadProgress()])
      .then(([b]) => {
        setBank(b);
        initCloud();
      })
      .catch((e) => setError(String(e.message || e)));
  }, []);

  useEffect(() => {
    const t = settings.theme || 'system';
    const root = document.documentElement;
    if (t === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', t);
  }, [settings.theme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.path]);

  const stats = useMemo(() => (bank ? computeStats(bank, progress, settings) : null), [bank, progress, settings]);

  if (error) {
    return (
      <div className="boot">
        <h1>Could not start</h1>
        <p>{error}</p>
        <p>
          Run <code>npm run setup</code> then <code>npm start</code> from the project folder.
        </p>
      </div>
    );
  }
  if (!bank) {
    return (
      <div className="boot">
        <div className="spinner" />
        <p>Loading question bank…</p>
      </div>
    );
  }

  const [section, arg] = route.segments;
  const props = { bank, progress, stats };
  let view;
  if (section === 'subject') view = <SubjectView {...props} id={arg} />;
  else if (section === 'list') view = <ListView {...props} query={route.query} />;
  else if (section === 'review') view = <ListView {...props} query={route.query} review />;
  else if (section === 'q') view = <Practice {...props} id={arg} query={route.query} />;
  else if (section === 'papers') view = <Papers {...props} />;
  else if (section === 'progress' || section === 'tracker') view = <Progress {...props} />;
  else if (section === 'test') view = <TestView key={arg} {...props} paperId={arg} />;
  else view = <Home {...props} />;

  return (
    <div className={`layout${section === 'test' ? ' wide' : ''}`}>
      <Header section={section} theme={settings.theme || 'system'} />
      <main className="page">{view}</main>
    </div>
  );
}

const THEME_NEXT = { system: 'dark', dark: 'light', light: 'system' };
const THEME_ICON = { system: 'monitor', dark: 'moon', light: 'sun' };

function Header({ section, theme }) {
  const [q, setQ] = useState('');
  const links = [
    ['#/', 'Practice', !section || ['subject', 'list', 'q'].includes(section)],
    ['#/papers', 'Papers', section === 'papers' || section === 'test'],
    ['#/review', 'Review', section === 'review'],
    ['#/progress', 'Progress', section === 'progress' || section === 'tracker'],
  ];
  return (
    <header className="header">
      <div className="header-inner">
        <a className="brand" href="#/">
          <span className="brand-mark">G</span>
          GATE CSE
        </a>
        <nav className="nav">
          {links.map(([to, label, on]) => (
            <a key={to} href={to} className={on ? 'active' : ''} aria-current={on ? 'page' : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-tools">
          <form
            className="search"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(href('/list', q.trim() ? `q=${encodeURIComponent(q.trim())}` : ''));
            }}
          >
            <Icon name="search" size={15} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions" aria-label="Search questions" />
          </form>
          <a className="icon-btn search-link" href="#/list" aria-label="Search questions">
            <Icon name="search" size={18} />
          </a>
          <button className="icon-btn" onClick={() => setSetting('theme', THEME_NEXT[theme])} title={`Theme: ${theme} (click to change)`} aria-label={`Theme: ${theme}`}>
            <Icon name={THEME_ICON[theme]} size={18} />
          </button>
          <Account />
        </div>
      </div>
    </header>
  );
}

const SYNC_LABEL = { syncing: 'Syncing…', synced: 'Synced', offline: 'Offline', error: 'Sync problem' };

function Account() {
  const c = useCloud();
  if (c.status === 'off') return null;
  if (!c.user) {
    return (
      <button className="btn small" onClick={signIn} disabled={c.status === 'loading'}>
        Sign in
      </button>
    );
  }
  const who = c.user.email || c.user.name || 'your account';
  const label = SYNC_LABEL[c.status] || '';
  return (
    <a className={`avatar ${c.status}`} href="#/progress" title={`${who} · ${label}`} aria-label={`Signed in as ${who}. ${label}`}>
      {(c.user.name || c.user.email || '?').trim()[0].toUpperCase()}
    </a>
  );
}
