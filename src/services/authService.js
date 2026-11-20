import { INITIAL_USER } from '../data/initialData.js';

const ACCOUNTS_KEY = 'clearline_auth_accounts_v3';
const SESSION_KEY = 'clearline_auth_session_v3';

export const DEFAULT_DEMO_ACCOUNT = {
  email: 'hasnain.ahmed@clearline.app',
  password: 'Clearline@2026',
  profile: INITIAL_USER,
};

let cachedSession = undefined;

function readSessionFromStorage() {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeSessionToStorage(session) {
  try {
    if (session) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // Ignore storage errors
  }
  cachedSession = session;
}

function getStoredAccounts() {
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) {
      window.localStorage.setItem(
        ACCOUNTS_KEY,
        JSON.stringify([DEFAULT_DEMO_ACCOUNT])
      );
      return [DEFAULT_DEMO_ACCOUNT];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [DEFAULT_DEMO_ACCOUNT];
    }
    return parsed;
  } catch {
    return [DEFAULT_DEMO_ACCOUNT];
  }
}

function saveStoredAccounts(accounts) {
  try {
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {
    // Ignore storage errors
  }
}

function makeToken() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `cl_tok_${crypto.randomUUID()}`;
  }
  return `cl_tok_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export const authService = {
  getSession() {
    if (cachedSession !== undefined) return cachedSession;
    cachedSession = readSessionFromStorage();
    return cachedSession;
  },

  signIn(emailInput, passwordInput) {
    const email = String(emailInput || '').trim().toLowerCase();
    const password = String(passwordInput || '');

    if (!email || !password) {
      return { ok: false, error: 'Please enter both your email and password.' };
    }

    const accounts = getStoredAccounts();
    const match = accounts.find((acc) => acc.email.toLowerCase() === email);

    if (!match || match.password !== password) {
      return {
        ok: false,
        error:
          'Wrong email or password. Please check and try again, or create a new account.',
      };
    }

    const session = {
      token: makeToken(),
      email: match.email,
      signedInAt: new Date().toISOString(),
      profile: match.profile,
    };

    writeSessionToStorage(session);
    return { ok: true, session };
  },

  register({ name, role, department, email, password }) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanName = String(name || '').trim();
    const cleanRole = String(role || '').trim() || 'Staff Member';

    if (!cleanName || !cleanEmail || String(password || '').length < 6) {
      return {
        ok: false,
        error:
          'Please enter your name, email, and a password with at least 6 characters.',
      };
    }

    const accounts = getStoredAccounts();
    if (accounts.some((acc) => acc.email.toLowerCase() === cleanEmail)) {
      return {
        ok: false,
        error: 'This email is already registered. Please sign in.',
      };
    }

    const profile = {
      name: cleanName,
      role: cleanRole,
      email: cleanEmail,
      department: department || 'Operations',
      timezone: 'UTC+05:00',
    };

    const newAccount = { email: cleanEmail, password, profile };
    saveStoredAccounts([newAccount, ...accounts]);

    const session = {
      token: makeToken(),
      email: cleanEmail,
      signedInAt: new Date().toISOString(),
      profile,
    };

    writeSessionToStorage(session);
    return { ok: true, session };
  },

  updateActiveProfile(updated) {
    const accounts = getStoredAccounts();
    const currentSession = this.getSession();
    const targetEmail = (currentSession?.email ?? updated.email).toLowerCase();

    const nextAccounts = accounts.map((acc) =>
      acc.email.toLowerCase() === targetEmail
        ? { ...acc, email: updated.email.toLowerCase(), profile: updated }
        : acc
    );
    saveStoredAccounts(nextAccounts);

    if (currentSession) {
      writeSessionToStorage({
        ...currentSession,
        email: updated.email.toLowerCase(),
        profile: updated,
      });
    }
  },

  signOut() {
    writeSessionToStorage(null);
  },
};