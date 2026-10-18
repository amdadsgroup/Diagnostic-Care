const https = require('https');

async function checkUrl(url) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - start;
        resolve({
          statusCode: res.statusCode,
          durationMs: duration,
          length: data.length,
          hasCheckingDirectory: data.includes('Checking directory...'),
          hasZeroDoctorsConflict: data.includes('0 Doctors') && data.includes('Loading verified doctors...'),
          hasCardSkeleton: data.includes('skeleton-box') || data.includes('CardSkeleton'),
        });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Testing live production endpoints:');
  const routes = [
    'https://diagnosticcare.vercel.app/doctors',
    'https://diagnosticcare.vercel.app/hospitals',
    'https://diagnosticcare.vercel.app/diagnostic-centers',
    'https://diagnosticcare.vercel.app/diagnostic-tests',
  ];

  for (const url of routes) {
    try {
      const res = await checkUrl(url);
      console.log(`URL: ${url}`);
      console.log(`  Status: ${res.statusCode} | Time: ${res.durationMs}ms | Size: ${res.length} bytes`);
      console.log(`  Zero-doctor conflict avoided: ${!res.hasZeroDoctorsConflict}`);
    } catch (e) {
      console.error(`  Error fetching ${url}:`, e.message);
    }
  }
}

run();
