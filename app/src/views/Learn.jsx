import { useEffect, useMemo, useState } from 'react';
import Content from '../components/Content.jsx';
import { Bar, Icon } from '../components/ui.jsx';
import { href } from '../lib/router.js';
import { toggleLearned } from '../lib/progress.js';
import { lessonHtml, lessonKey, lessonSubjects, loadCourse } from '../lib/lessons.js';
import { sheetIds } from '../lib/sheets.js';
import { CheatsheetIndex } from './Sheets.jsx';

export default function Learn({ bank, progress, segments, query }) {
  const [subjectId, lessonId] = segments;
  const subject = subjectId && bank.subjectById.get(subjectId);
  if (!subjectId) return <LearnIndex bank={bank} progress={progress} />;
  if (!subject || !lessonSubjects.has(subjectId)) return <p className="empty">No lessons for this subject yet.</p>;
  return lessonId ? (
    <Lesson subject={subject} lessonId={lessonId} progress={progress} />
  ) : (
    <Course subject={subject} progress={progress} chapterId={query.get('c')} />
  );
}

function useCourse(subject) {
  const [course, setCourse] = useState(undefined);
  useEffect(() => {
    let live = true;
    loadCourse(subject).then((c) => live && setCourse(c));
    return () => {
      live = false;
    };
  }, [subject]);
  return course;
}

const doneCount = (course, subjectId, learned) => course.lessons.filter((l) => learned[lessonKey(subjectId, l.id)]).length;

function LearnIndex({ bank, progress }) {
  const subjects = bank.subjects.filter((s) => lessonSubjects.has(s.id));
  return (
    <div>
      <div className="page-head">
        <div>
          <h1>Learn</h1>
          <p className="sub">Step-by-step lessons, and cheatsheets for quick revision.</p>
        </div>
      </div>
      {subjects.length > 0 && (
        <>
          <div className="section-head">
            <h2>Lessons</h2>
          </div>
          <div className="rows">
            {subjects.map((s) => (
              <CourseRow key={s.id} subject={s} learned={progress.learned || {}} />
            ))}
          </div>
        </>
      )}
      <div className="section">
        <div className="section-head">
          <h2>Cheatsheets</h2>
        </div>
        <CheatsheetIndex bank={bank} />
      </div>
    </div>
  );
}

function CourseRow({ subject, learned }) {
  const course = useCourse(subject);
  const done = course ? doneCount(course, subject.id, learned) : 0;
  return (
    <a className="row" href={href(`/learn/${subject.id}`)}>
      <span className="row-main">
        <span>
          <span className="row-title">{subject.name}</span>
          {course && <span className="row-meta">{course.chapters.map((c) => c.title).join(' · ')}</span>}
        </span>
      </span>
      {course && (
        <span className="row-end">
          <Bar value={done} total={course.lessons.length} />
          <span className="count">
            {done} / {course.lessons.length} lessons
          </span>
        </span>
      )}
    </a>
  );
}

function Course({ subject, progress, chapterId }) {
  const course = useCourse(subject);
  const learned = progress.learned || {};

  useEffect(() => {
    if (course && chapterId) document.getElementById(`learn-${chapterId}`)?.scrollIntoView();
  }, [course, chapterId]);

  if (course === undefined) return <p className="empty">Loading…</p>;
  const done = doneCount(course, subject.id, learned);
  const next = course.lessons.find((l) => !learned[lessonKey(subject.id, l.id)]);

  return (
    <div>
      <a className="back" href={href('/learn')}>
        <Icon name="left" size={14} /> Learn
      </a>
      <div className="page-head">
        <div>
          <h1>{subject.name}</h1>
          <p className="sub">
            {course.lessons.length} {course.lessons.length === 1 ? 'lesson' : 'lessons'} · {done} done
          </p>
        </div>
        <div className="actions">
          {sheetIds.has(subject.id) && (
            <a className="btn" href={href(`/sheets/${subject.id}`)}>
              Cheatsheet
            </a>
          )}
          {next && (
            <a className="btn primary" href={href(`/learn/${subject.id}/${next.id}`)}>
              <Icon name="play" size={14} /> {done ? 'Continue' : 'Start'}
            </a>
          )}
        </div>
      </div>

      {course.chapters.map((c) => (
        <section key={c.id} className="learn-chapter" id={`learn-${c.id}`}>
          <div className="section-head">
            <h2>{c.title}</h2>
            <a className="link small" href={href('/list', `s=${subject.id}&c=${c.id}`)}>
              Questions
            </a>
          </div>
          {c.intro && <Content md={c.intro} className="learn-intro" />}
          <div className="rows">
            {c.lessons.map((l, k) => {
              const isDone = !!learned[lessonKey(subject.id, l.id)];
              return (
                <a key={l.id} className="row lesson-row" href={href(`/learn/${subject.id}/${l.id}`)}>
                  <span className={`lesson-num${isDone ? ' done' : ''}`} aria-label={isDone ? 'Done' : undefined}>
                    {isDone ? <Icon name="check" size={13} /> : k + 1}
                  </span>
                  <span className="row-main">
                    <span>
                      <span className="row-title">{l.title}</span>
                      {l.summary && (
                        <span className="row-meta">
                          <Content md={l.summary} inline />
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="row-end">{l.minutes} min</span>
                </a>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

function Lesson({ subject, lessonId, progress }) {
  const course = useCourse(subject);
  const html = useMemo(() => {
    const l = course?.lessons.find((x) => x.id === lessonId);
    return l ? lessonHtml(l.md) : '';
  }, [course, lessonId]);

  if (course === undefined) return <p className="empty">Loading…</p>;
  const i = course.lessons.findIndex((l) => l.id === lessonId);
  if (i < 0) return <p className="empty">Lesson not found.</p>;
  const lesson = course.lessons[i];
  const chapter = course.chapters.find((c) => c.id === lesson.chapterId);
  const inChapter = chapter.lessons.indexOf(lesson);
  const prev = course.lessons[i - 1];
  const next = course.lessons[i + 1];
  const key = lessonKey(subject.id, lesson.id);
  const done = !!(progress.learned || {})[key];
  const lessonHref = (l) => href(`/learn/${subject.id}/${l.id}`);

  return (
    <article className="lesson">
      <a className="back" href={href(`/learn/${subject.id}`, `c=${chapter.id}`)}>
        <Icon name="left" size={14} /> {subject.name}
      </a>
      <header className="lesson-head">
        <p className="lesson-eyebrow">
          {chapter.title} · Lesson {inChapter + 1} of {chapter.lessons.length} · {lesson.minutes} min
        </p>
        <h1>{lesson.title}</h1>
        {lesson.summary && (
          <p className="lesson-lead">
            <Content md={lesson.summary} inline />
          </p>
        )}
        {lesson.sections.length > 2 && (
          <nav className="lesson-toc" aria-label="In this lesson">
            {lesson.sections.map((s, k) => (
              <button key={k} onClick={() => document.getElementById(`lesson-s${k}`)?.scrollIntoView({ behavior: 'smooth' })}>
                <Content md={s} inline />
              </button>
            ))}
          </nav>
        )}
      </header>

      <Content html={html} className="lesson-body" />

      <div className="lesson-done">
        <button className={`btn${done ? '' : ' primary'}`} onClick={() => toggleLearned(key)}>
          <Icon name="check" size={14} /> {done ? 'Marked as done' : 'Mark as done'}
        </button>
        <a className="btn" href={href('/list', `s=${subject.id}&c=${chapter.id}`)}>
          Practise {chapter.title} questions
        </a>
      </div>

      <nav className="lesson-pager">
        {prev ? (
          <a href={lessonHref(prev)}>
            <span className="lesson-pager-dir">
              <Icon name="left" size={13} /> Previous
            </span>
            <span className="lesson-pager-title">{prev.title}</span>
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a className="next" href={lessonHref(next)}>
            <span className="lesson-pager-dir">
              Next <Icon name="right" size={13} />
            </span>
            <span className="lesson-pager-title">{next.title}</span>
          </a>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
