import nodeFetch from 'node-fetch';

export function httpPost({ url, body, headers }) {
  return nodeFetch(url, {
    method: 'POST',
    body,
    headers: {
      ...headers,
      'Content-Type': 'text/plain',
    },
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.arrayBuffer();
  });
}
