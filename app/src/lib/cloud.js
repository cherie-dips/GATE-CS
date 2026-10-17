// Optional cross-device sync: sign in with Google (Firebase Auth) and keep the progress document in Firestore at
// progress/{uid}. Firebase is only downloaded when a config is set (lib/firebase-config.js).
import { useSyncExternalStore } from 'react';
import { firebaseConfig } from './firebase-config.js';
import { getState, mergeProgress, normalize, onLocalChange, replaceState } from './progress.js';

// test builds (VITE_FIREBASE_EMULATOR=1) talk to the local Firebase emulators with a throwaway demo project
const EMULATOR = import.meta.env.VITE_FIREBASE_EMULATOR === '1';
const CONFIG = EMULATOR ? { apiKey: 'demo-key', authDomain: 'demo-gate.firebaseapp.com', projectId: 'demo-gate', appId: 'demo-app' } : firebaseConfig;
export const cloudAvailable = !!(CONFIG && CONFIG.apiKey && CONFIG.projectId);

const SYNCED_KEY = 'gate-pyq-cloud-synced-v1'; // per account: updatedAt of the copy this device and the cloud last agreed on

let fb = null;
let cloud = { status: cloudAvailable ? 'loading' : 'off', user: null, error: null, lastSync: 0 };
const listeners = new Set();

function set(patch) {
  cloud = { ...cloud, ...patch };
  for (const l of listeners) l();
}

function subscribe(l) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useCloud() {
  return useSyncExternalStore(subscribe, () => cloud);
}

async function load() {
  if (fb) return fb;
  const [appMod, authMod, fsMod] = await Promise.all([import('firebase/app'), import('firebase/auth'), import('firebase/firestore')]);
  const app = appMod.initializeApp(CONFIG);
  const auth = authMod.getAuth(app);
  const db = fsMod.getFirestore(app);
  if (EMULATOR) {
    authMod.connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    fsMod.connectFirestoreEmulator(db, '127.0.0.1', 8080);
  }
  fb = { auth, db, authMod, fsMod };
  return fb;
}

function readSynced(uid) {
  try {
    return JSON.parse(localStorage.getItem(SYNCED_KEY) || '{}')[uid] || 0;
  } catch {
    return 0;
  }
}

function writeSynced(uid, at) {
  try {
    const all = JSON.parse(localStorage.getItem(SYNCED_KEY) || '{}');
    all[uid] = at;
    localStorage.setItem(SYNCED_KEY, JSON.stringify(all));
  } catch {
    /* without storage the next sync simply merges both copies again */
  }
}

// The document is stored gzip-compressed (Firestore documents are capped at 1 MiB).
async function encode(p) {
  const json = JSON.stringify(p);
  if (typeof CompressionStream !== 'function') return { v: 1, updatedAt: p.updatedAt || 0, json };
  const stream = new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'));
  const bytes = new Uint8Array(await new Response(stream).arrayBuffer());
  return { v: 1, updatedAt: p.updatedAt || 0, gz: fb.fsMod.Bytes.fromUint8Array(bytes) };
}

async function decode(d) {
  if (!d) return null;
  let json = d.json;
  if (d.gz) {
    const stream = new Blob([d.gz.toUint8Array()]).stream().pipeThrough(new DecompressionStream('gzip'));
    json = await new Response(stream).text();
  }
  return json ? normalize(JSON.parse(json)) : null;
}

function friendly(e) {
  const code = e?.code || '';
  if (code === 'auth/unauthorized-domain') return 'This website is not on the list of authorized domains in Firebase (Authentication → Settings).';
  if (code === 'auth/network-request-failed' || code === 'unavailable') return 'Could not reach the sync service. Check your connection.';
  if (code === 'permission-denied') return 'The cloud database refused access. Check the Firestore security rules.';
  if (code === 'auth/popup-blocked') return 'The sign-in window was blocked. Allow pop-ups for this site and try again.';
  return e?.message || String(e);
}

let timer = null;
let running = false;
let again = false;

function schedule() {
  if (!cloud.user) return;
  clearTimeout(timer);
  timer = setTimeout(syncNow, 1500);
}

/** Bring this device and the cloud copy together: push, pull, or merge when both changed since they last agreed. */
export async function syncNow() {
  if (!fb || !cloud.user) return;
  if (running) {
    again = true;
    return;
  }
  running = true;
  const uid = cloud.user.uid;
  set({ status: 'syncing' });
  try {
    const { db, fsMod } = fb;
    const ref = fsMod.doc(db, 'progress', uid);
    const base = readSynced(uid);
    const local = getState();
    const out = await fsMod.runTransaction(db, async (tx) => {
      const snap = await tx.get(ref);
      const remote = snap.exists() ? await decode(snap.data()) : null;
      const localChanged = (local.updatedAt || 0) !== base;
      const remoteChanged = !!remote && (remote.updatedAt || 0) !== base;
      if (!remote || (localChanged && !remoteChanged)) {
        tx.set(ref, await encode(local));
        return { doc: local, adopt: false };
      }
      if (!localChanged) return { doc: remote, adopt: remoteChanged };
      const merged = { ...mergeProgress(local, remote), updatedAt: Date.now() };
      tx.set(ref, await encode(merged));
      return { doc: merged, adopt: true };
    });
    if (cloud.user?.uid !== uid) return; // signed out meanwhile
    writeSynced(uid, out.doc.updatedAt || 0);
    if (out.adopt) {
      const now = getState();
      if (now === local) replaceState(out.doc);
      else {
        // progress changed on this device while syncing: fold those changes in and push them next
        replaceState({ ...mergeProgress(now, out.doc), updatedAt: Date.now() });
        again = true;
      }
    } else if (getState() !== local) again = true;
    set({ status: 'synced', lastSync: Date.now(), error: null });
  } catch (e) {
    set({ status: navigator.onLine === false ? 'offline' : 'error', error: friendly(e) });
  } finally {
    running = false;
    if (again) {
      again = false;
      schedule();
    }
  }
}

export async function initCloud() {
  if (!cloudAvailable) return;
  try {
    const { auth, authMod } = await load();
    authMod.onAuthStateChanged(auth, (u) => {
      if (u) {
        set({ user: { uid: u.uid, email: u.email, name: u.displayName, photo: u.photoURL }, error: null });
        syncNow();
      } else set({ user: null, status: 'signed-out' });
    });
    onLocalChange(schedule);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') syncNow();
    });
    window.addEventListener('online', () => syncNow());
  } catch (e) {
    set({ status: 'error', error: friendly(e) });
  }
}

export async function signIn() {
  set({ error: null });
  try {
    const { auth, authMod } = await load();
    const provider = new authMod.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await authMod.signInWithPopup(auth, provider);
  } catch (e) {
    if (e?.code !== 'auth/popup-closed-by-user' && e?.code !== 'auth/cancelled-popup-request') set({ error: friendly(e) });
  }
}

/** Signing out keeps this device's copy of the progress; it just stops syncing. */
export async function signOutCloud() {
  if (!fb) return;
  clearTimeout(timer);
  await fb.authMod.signOut(fb.auth);
}
