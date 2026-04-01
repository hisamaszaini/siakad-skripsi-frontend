const url = process.argv[2] || 'http://127.0.0.1:3000/api/health';
const ctrl = new AbortController();
setTimeout(() => ctrl.abort(), 3000);
fetch(url, { signal: ctrl.signal })
    .then(async (r) => {
        console.log('HTTP', r.status);
        const body = await r.text();
        console.log(body.slice(0, 200));
        process.exit(r.ok ? 0 : 1);
    })
    .catch((e) => {
        console.error('ERR', e.message || e);
        process.exit(1);
    });
