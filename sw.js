const BACKEND_URL = "https://my-proxy-backend-wj52.onrender.com";

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // If the asset request is targeted at our proxy frontend domain rather than a local asset,
  // it means a proxied web application is trying to fetch internal assets natively.
  if (requestUrl.origin === self.location.origin && !requestUrl.pathname.startsWith('/sw.js')) {
    
    // We reconstruct the real destination target pointing back to Discord
    const discordTarget = "https://discord.com" + requestUrl.pathname + requestUrl.search;
    const proxiedUrl = `${BACKEND_URL}/proxy?url=${encodeURIComponent(discordTarget)}`;

    event.respondWith(
      fetch(proxiedUrl, {
        method: event.request.method,
        headers: event.request.headers,
        credentials: 'omit' // This keeps login sessions bounded to the frame context execution
      })
    );
  }
});
