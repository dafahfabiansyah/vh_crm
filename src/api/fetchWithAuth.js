// fetchWithAuth.js
// Helper fetch wrapper untuk auto refresh token dan auto logout jika unauthorized
import store from '../redux/store';
import { refresh, logout } from '../redux/authSlice';
import { config } from '../config';

export async function fetchWithAuth(url, options = {}) {
  // Pastikan URL memiliki protocol http/https
  let finalUrl = url;
  if (typeof url === 'string' && !url.startsWith('http')) {
    finalUrl = `http://${config.HOST}:${config.PORT}${url}`;
  }

  let state = store.getState();
  let token = state.auth.token;
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  };

  let response = await fetch(finalUrl, { ...options, headers });

  // Jika token expired (401/403), coba refresh token sekali
  if ((response.status === 401 || response.status === 403) && state.auth.refreshToken) {
    // Coba refresh token
    await store.dispatch(refresh());
    // Ambil token baru
    state = store.getState();
    token = state.auth.token;
    if (token) {
      // Coba ulangi request dengan token baru
      const retryHeaders = {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      response = await fetch(finalUrl, { ...options, headers: retryHeaders });
      // Jika masih unauthorized, logout
      if (response.status === 401 || response.status === 403) {
        store.dispatch(logout());
      }
    } else {
      // Refresh gagal, logout
      store.dispatch(logout());
    }
  } else if (response.status === 401 || response.status === 403) {
    // Tidak ada refresh token, langsung logout
    store.dispatch(logout());
  }

  return response;
}
