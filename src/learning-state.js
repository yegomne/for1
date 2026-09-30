// 기존 저장 키와 내보내기 형식을 유지합니다. 오래되거나 손상된 값만 안전하게 읽습니다.
export const STORAGE_KEY = 'build90-v1';
export function normalizeState(value) {
  const state = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const day = Number.isInteger(state.day) && state.day >= 1 && state.day <= 90 ? state.day : 1;
  const completed = Array.isArray(state.completed) ? [...new Set(state.completed.filter(n => Number.isInteger(n) && n >= 1 && n <= 90))] : [];
  const notes = state.notes && typeof state.notes === 'object' && !Array.isArray(state.notes) ? Object.fromEntries(Object.entries(state.notes).filter(([,note]) => typeof note === 'string')) : {};
  return {day, completed, notes};
}
export function readState(storage) {
  try { return normalizeState(JSON.parse((storage ?? globalThis.localStorage).getItem(STORAGE_KEY))); }
  catch { return normalizeState(null); }
}
