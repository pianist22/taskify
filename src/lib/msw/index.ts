// export async function initMocks() {
//     if (typeof window === 'undefined') {
//       const { server } = await import('./server');
//       server.listen({ onUnhandledRequest: 'bypass' });
//     } else {
//       const { worker } = await import('./browser');
//       await worker.start({ onUnhandledRequest: 'bypass' });
//     }
// }

let started = false;

export async function ensureMocks() {
  if (started) return;
  if (typeof window === 'undefined') return; // only in browser

  const { worker } = await import('./browser');
  await worker.start({
    onUnhandledRequest: 'bypass', // ignore non-API routes/assets
    serviceWorker: { url: '/mockServiceWorker.js' }, // explicit path
    // waitUntilReady is true by default; requests are deferred during registration
  });
  started = true;
}

  