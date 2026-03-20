export const fetchJson = async (url, options = {}) => {
  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();

  let data = null;
  if (rawText) {
    if (contentType.includes('application/json')) {
      try {
        data = JSON.parse(rawText);
      } catch (error) {
        throw new Error('Invalid JSON response from server.');
      }
    } else {
      const looksLikeHtml = rawText.trim().startsWith('<!DOCTYPE') || rawText.trim().startsWith('<html');
      if (looksLikeHtml) {
        const hint = `Received HTML instead of JSON from ${url}. Check REACT_APP_API_URL and backend deployment routes.`;
        throw new Error(hint);
      }
      throw new Error(`Unexpected response format from ${url}.`);
    }
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with status ${response.status}`);
  }

  return { data, status: response.status };
};
