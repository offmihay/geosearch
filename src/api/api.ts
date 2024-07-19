const BASE_URL = import.meta.env.VITE_BACKEND_API;

export async function sendJson(req: {
  url: string;
  method: "GET" | "POST";
  urlParams?: Record<string, string>;
  payload?: object;
}): Promise<any> {
  const { url, method, urlParams, payload } = req;

  let fullUrl = `${BASE_URL}/${url}`;
  if (urlParams) {
    const queryString = new URLSearchParams(urlParams).toString();
    fullUrl += `?${queryString}`;
  }

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(fullUrl, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getJson(url: string, urlParams?: Record<string, string>) {
  return sendJson({ url, urlParams, method: "GET" });
}

export async function postJson(url: string, payload?: object, urlParams?: Record<string, string>) {
  return sendJson({ url, urlParams, payload, method: "POST" });
}
