import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
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

  const submitPromise = supabase
    .from(supabaseTable)
    .insert([payload]);

  let result;
  try {
    result = await Promise.race([submitPromise, timeoutPromise]);
  } catch (error) {
    if (isSupabaseDuplicateError(error)) {
      throw makeError('Duplicate submission in Supabase', 'duplicate-submission', 409, error);
    }
    throw error;
  }

  if (result?.error) {
    if (isSupabaseDuplicateError(result.error)) {
      throw makeError('Duplicate submission in Supabase', 'duplicate-submission', 409, result.error);
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
