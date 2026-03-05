const express = require('express');
const router = express.Router();
const SecurityService = require('../services/securityService');

const securityService = new SecurityService(
  process.env.VIRUSTOTAL_API_KEY,
  process.env.RAPIDAPI_KEY
);

// 1. Check Email
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    
    const result = await securityService.comprehensiveEmailCheck(email);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Check Password
router.post('/check-password', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password required' });
    
    const result = await securityService.checkPassword(password);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Scan Domain
router.post('/scan-domain', async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain) return res.status(400).json({ error: 'Domain required' });
    
    const result = await securityService.scanDomainVirusTotal(domain);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Get IP Location
router.get('/my-ip', async (req, res) => {
  try {
    const result = await securityService.getIPGeolocation();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Get Security News
router.get('/security-news', async (req, res) => {
  try {
    const result = await securityService.getSecurityNews();
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Get API Usage Stats
router.get('/api-usage', async (req, res) => {
  try {
    const usage = await securityService.getApiUsage();
    res.json({ success: true, usage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;