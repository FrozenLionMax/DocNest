/**
 * Instant Search Engine Indexing Dispatcher
 * Submits all production pharmacy & clinical URLs to IndexNow / Bing / Yandex / Search Engines.
 */

const https = require('https');

const HOST = 'www.drugs.systems';
const KEY = 'acsakhil2026indexnow';
const KEY_LOCATION = `https://${HOST}/acsakhil2026indexnow.txt`;

const URL_LIST = [
  `https://${HOST}/`,
  `https://${HOST}/pharmacy`,
  `https://${HOST}/pharmacy/deoria-drug-house`,
  `https://${HOST}/pharmacy/akhil-deoria`,
  `https://${HOST}/pharmacy/maa-vindhyavasini-medicos-deoria`,
  `https://${HOST}/pharmacy/kushwaha-medical-store-deoria`,
  `https://${HOST}/pharmacy/raghav-chemist-deoria`,
  `https://${HOST}/pharmacy/ganga-medical-hall-kanpur`,
  `https://${HOST}/pharmacy/awadh-care-chemist-lucknow`,
  `https://${HOST}/patient/book`,
  `https://${HOST}/login`,
  `https://${HOST}/privacy`,
  `https://${HOST}/terms`,
];

const ENGINES = [
  { name: 'IndexNow Central Hub', hostname: 'api.indexnow.org', path: '/indexnow' },
  { name: 'Microsoft Bing', hostname: 'www.bing.com', path: '/indexnow' },
  { name: 'Yandex Search', hostname: 'yandex.com', path: '/indexnow' },
];

const payload = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: URL_LIST,
});

console.log(`\n🚀 Submitting ${URL_LIST.length} Production URLs to Search Engine Crawlers...`);

ENGINES.forEach((eng) => {
  const req = https.request(
    {
      hostname: eng.hostname,
      port: 443,
      path: eng.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
      },
    },
    (res) => {
      let body = '';
      res.on('data', (d) => {
        body += d;
      });
      res.on('end', () => {
        const isSuccess = res.statusCode === 200 || res.statusCode === 202;
        console.log(
          `[${eng.name}] -> HTTP ${res.statusCode} ${
            isSuccess ? '✅ (ACCEPTED: Pushed to crawler index queue)' : '⚠️'
          }`
        );
      });
    }
  );

  req.on('error', (e) => {
    console.error(`[${eng.name}] Connection Error:`, e.message);
  });

  req.write(payload);
  req.end();
});
