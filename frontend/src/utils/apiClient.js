export const fetchJson = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get('content-type') || '';
    const rawText = await response.text();

    console.log('[fetchJson] Response status:', response.status, 'URL:', url);

    let data = null;
    if (rawText) {
      if (contentType.includes('application/json')) {
        try {
          data = JSON.parse(rawText);
        } catch (error) {
          console.error('[fetchJson] JSON parse error:', error, 'Response text:', rawText.substring(0, 200));
          throw new Error('Invalid JSON response from server.');
        }
      } else {
        const looksLikeHtml = rawText.trim().startsWith('<!DOCTYPE') || rawText.trim().startsWith('<html');
        if (looksLikeHtml) {
          const hint = `Received HTML instead of JSON from ${url}. Check REACT_APP_API_URL and backend deployment routes.`;
          console.error('[fetchJson] HTML response when JSON expected:', hint);
          throw new Error(hint);
        }
        console.warn('[fetchJson] Unexpected response format. Content-Type:', contentType);
        throw new Error(`Unexpected response format from ${url}.`);
      }
    }

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || `Request failed with status ${response.status}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.response = data;
      console.error('[fetchJson] Request failed:', { status: response.status, message: errorMsg, url });
      throw error;
    }

    console.log('[fetchJson] Success:', url, 'Data sample:', JSON.stringify(data).substring(0, 100));
    return { data, status: response.status };
  } catch (err) {
    // Network errors (no response at all)
    if (err instanceof TypeError && err.message.includes('fetch')) {
      console.error('[fetchJson] Network error - cannot reach server:', {
        message: err.message,
        url,
        hint: 'Check if backend is running and REACT_APP_API_URL is correct'
      });
      const networkError = new Error(`Network request failed: ${err.message}. Check backend URL: ${url}`);
      networkError.status = 0;
      throw networkError;
    }
    // Re-throw and ensure it has debugging info
    err.debugInfo = { url, method: options.method || 'GET' };
    throw err;
  }
};
