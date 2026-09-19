const https = require('https');
const { URL } = require('url');
const target = new URL('https://truck-website-grg672e16-uzair20.vercel.app');

function fetchPage(url, redirectCount = 0) {
  if (redirectCount > 5) {
    console.error('Too many redirects');
    process.exit(1);
  }
  https.get(url, res => {
    console.log('STATUS:' + res.statusCode);
    for (const [key, value] of Object.entries(res.headers)) {
      if (['location', 'content-type'].includes(key)) {
        console.log(`${key.toUpperCase()}: ${value}`);
      }
    }
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      const next = new URL(res.headers.location, url);
      console.log('REDIRECT:' + next.href);
      fetchPage(next.href, redirectCount + 1);
      return;
    }
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      const match = body.match(/<title>([^<]*)<\/title>/i);
      console.log('TITLE:' + (match ? match[1] : 'unknown'));
    });
  }).on('error', err => {
    console.error('ERROR:' + err.message);
    process.exit(1);
  });
}

fetchPage(target.href);
