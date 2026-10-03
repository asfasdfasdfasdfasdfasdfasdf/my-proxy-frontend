const BACKEND_URL = "https://onrender.com";

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Catch absolute navigation attempts routed straight to Discord domains inside the frame execution context
  const isDiscordAsset = requestUrl.hostname.includes('discord.com') || requestUrl.hostname.includes('discordapp.com');
  const isLocalRequest = requestUrl.origin === self.location.origin;

  if ((isLocalRequest || isDiscordAsset) && !requestUrl.pathname.startsWith('/sw.js') && !event.request.url.startsWith(BACKEND_URL)) {
    
    // Normalize target generation pathing structures
    let targetPath = requestUrl.pathname + requestUrl.search;
    const discordTarget = "https://discord.com" + targetPath;
    const proxiedUrl = `${BACKEND_URL}/proxy?url=${encodeURIComponent(discordTarget)}`;

    event.respondWith(
      fetch(proxiedUrl, {
        method: event.request.method,
        headers: event.request.headers,
        credentials: 'omit'
      })
    );
  }
});
