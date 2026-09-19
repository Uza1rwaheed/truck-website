module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, service, details } = req.body || {};

  if (!name || !email || !service || !details) {
    return res.status(400).json({ message: 'Please complete all required fields.' });
  }

  return res.status(200).json({ message: 'Your request has been received. We will contact you shortly.' });
};