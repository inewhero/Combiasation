import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY
  || import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  || '';
const supabaseTable = import.meta.env.VITE_SUPABASE_TABLE || 'survey_responses';
const supabaseTimeoutMs = Number(import.meta.env.VITE_SUPABASE_TIMEOUT_MS || '10000');

const hasSupabaseConfig = () => supabaseUrl.trim().length > 0 && supabaseAnonKey.trim().length > 0;

const supabase = hasSupabaseConfig()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    })
  : null;

const makeError = (message, code, status, details) => {
  const err = new Error(message);
  err.code = code;
  if (status) err.status = status;
  if (details) err.details = details;
  return err;
};

const isMissingColumnError = (error) => {
  return String(error?.code || '').toUpperCase() === 'PGRST204'
    || String(error?.message || '').includes('Could not find the');
};

const toSupabaseCompatiblePayload = (payload) => {
  return {
    uuid: payload?.uuid,
    ip: payload?.ip,
    answers: payload?.answers,
    useragent: payload?.userAgent ?? payload?.useragent,
    language: payload?.language,
    duration: payload?.duration,
    clienttimestamp: payload?.clientTimestamp ?? payload?.clienttimestamp,
    submitprimary: payload?.submitPrimary ?? payload?.submitprimary,
    submitbackend: payload?.submitBackend ?? payload?.submitbackend,
    submitfallbackused: payload?.submitFallbackUsed ?? payload?.submitfallbackused,
  };
};

export const isSupabaseConfigured = () => !!supabase;

export const isSupabaseDuplicateError = (error) => {
  const code = String(error?.code || '').toLowerCase();
  const message = String(error?.message || '').toLowerCase();
  return code === '23505' || code === 'duplicate-submission' || message.includes('duplicate key');
};

export const submitToSupabasePrimary = async (payload) => {
  if (!supabase) {
    throw makeError('Supabase is not configured', 'supabase-not-configured');
  }

  const timeout = Number.isFinite(supabaseTimeoutMs) && supabaseTimeoutMs > 0 ? supabaseTimeoutMs : 10000;
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(makeError('Supabase request timed out', 'supabase-timeout'));
    }, timeout);
  });

  const runInsertWithTimeout = async (data) => {
    const submitPromise = supabase
      .from(supabaseTable)
      .insert([data]);
    return Promise.race([submitPromise, timeoutPromise]);
  };

  let result;
  try {
    result = await runInsertWithTimeout(payload);
  } catch (error) {
    if (isSupabaseDuplicateError(error)) {
      throw makeError('Duplicate submission in Supabase', 'duplicate-submission', 409, error);
    }

    if (isMissingColumnError(error)) {
      result = await runInsertWithTimeout(toSupabaseCompatiblePayload(payload));
    } else {
      throw error;
    }
  }

  if (result?.error) {
    if (isSupabaseDuplicateError(result.error)) {
      throw makeError('Duplicate submission in Supabase', 'duplicate-submission', 409, result.error);
    }

    if (isMissingColumnError(result.error)) {
      const retryResult = await runInsertWithTimeout(toSupabaseCompatiblePayload(payload));
      if (!retryResult?.error) {
        return {
          ok: true,
          backend: 'supabase',
        };
      }
      if (isSupabaseDuplicateError(retryResult.error)) {
        throw makeError('Duplicate submission in Supabase', 'duplicate-submission', 409, retryResult.error);
      }
      throw makeError(
        `Supabase retry insert failed: ${retryResult.error.message || 'unknown error'}`,
        retryResult.error.code || 'supabase-insert-failed',
        retryResult.status,
        retryResult.error
      );
    }

    throw makeError(
      `Supabase insert failed: ${result.error.message || 'unknown error'}`,
      result.error.code || 'supabase-insert-failed',
      result.status,
      result.error
    );
  }

  return {
    ok: true,
    backend: 'supabase',
  };
};
