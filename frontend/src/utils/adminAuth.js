const ADMIN_AUTH_KEY = 'adminAuth';

export const getAdminAuth = () => {
  try {
    const raw = localStorage.getItem(ADMIN_AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
};

export const setAdminAuth = (auth) => {
  localStorage.setItem(ADMIN_AUTH_KEY, JSON.stringify(auth));
};

export const clearAdminAuth = () => {
  localStorage.removeItem(ADMIN_AUTH_KEY);
};

export const getAdminToken = () => getAdminAuth()?.token || null;

export const getAdminHeaders = () => {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
