(async () => {
  try {
    const res = await fetch('http://localhost:3000/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test@example.com', service: 'Dry Van Freight', details: 'Test payload' })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Body:', text);
  } catch (err) {
    console.error('Request failed:', err);
  }
})();
