// CORRECTED: Point this exactly to your live Render backend URL
const BACKEND_URL = "https://my-proxy-backend-wj52.onrender.com";

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Skip internal operational scripts
  if (requestUrl.pathname.startsWith('/sw.js') || event.request.url.startsWith(BACKEND_URL)) {
    return;
  }

  // Determine if this is a request loading via the proxy frame context
  const isLocalRequest = requestUrl.origin === self.location.origin;
  const isDiscordAsset = requestUrl.hostname.includes('discord.com') || requestUrl.hostname.includes('discordapp.com');

  if (isLocalRequest || isDiscordAsset) {
    let targetDestination = event.request.url;

    // If the browser requests a resource locally on Netlify that doesn't exist,
    // it's a relative path asset originating from a proxied page. Route it back to Discord.
    if (isLocalRequest) {
      targetDestination = "https://discord.com" + requestUrl.pathname + requestUrl.search;
    }

    const proxiedUrl = `${BACKEND_URL}/proxy?url=${encodeURIComponent(targetDestination)}`;

    event.respondWith(
      fetch(proxiedUrl, {
        method: event.request.method,
        headers: event.request.headers,
        // Discord authentication tracking requires standard credential handling profiles
        credentials: 'same-origin' 
      }).catch(err => {
        console.error("SW Proxy fetch failed:", err);
        return fetch(event.request);
      })
    );
  }
});
