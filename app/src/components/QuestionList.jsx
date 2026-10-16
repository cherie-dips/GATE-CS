import { useEffect, useState } from 'react';
import { TYPE_LABELS } from '../lib/data.js';
import { statusOf } from '../lib/progress.js';
import { href } from '../lib/router.js';
import { Icon, StatusDot, Tag } from './ui.jsx';

const PAGE = 60;

/** One-line preview; scan-only questions have no text of their own, so describe them by their topic tags. */
export function preview(q) {
  if (q.scanOnly) return `Question shown as the original scan${q.tags?.length ? ` · ${q.tags.slice(0, 3).join(', ')}` : ''}`;
  return q._preview || '(figure-based question)';
}

/** Question rows linking into practice mode; `qs` is the filter query that practice navigates within. */
export default function QuestionList({ bank, progress, list, qs, showChapter = true, empty }) {
  const [limit, setLimit] = useState(PAGE);
  useEffect(() => {
    setLimit(PAGE);
  }, [qs]);

  if (!list.length) return <p className="empty">{empty || 'No questions match.'}</p>;
  return (
    <div className="qlist">
      {list.slice(0, limit).map((q) => (
        <a key={q.id} className="qrow" href={href(`/q/${q.id}`, qs)}>
          <StatusDot status={statusOf(progress, q.id)} />
          <span className="qrow-body">
            <span className="qrow-text">{preview(q)}</span>
            <span className="qrow-meta">
              <span>
                {q.p.replace(/^GATE /, '')}
                {q.n ? ` · Q${q.n}` : ''}
              </span>
              <span>{TYPE_LABELS[q.t] || q.t}</span>
              {q.m ? <span>{q.m} mark{q.m === 1 ? '' : 's'}</span> : null}
              {showChapter && <span>{bank.chapterById.get(q.c)?.name}</span>}
              {q.oos && <Tag tone="warn">Old syllabus</Tag>}
              {progress.bookmarks[q.id] && <Icon name="star" size={13} />}
              {progress.revise[q.id] && <Icon name="flag" size={13} />}
            </span>
          </span>
        </a>
      ))}
      {limit < list.length && (
        <button className="btn more" onClick={() => setLimit((l) => l + PAGE * 2)}>
          Show more ({(list.length - limit).toLocaleString()} left)
        </button>
      )}
    </div>
  );
}
