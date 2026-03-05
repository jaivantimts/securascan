const axios = require('axios');

class SecurityService {
  constructor(virustotalKey, rapidapiKey) {
    this.virustotalKey = virustotalKey;
    this.rapidapiKey = rapidapiKey;
    
    // Track API usage
    this.usage = {
      virustotal: { used: 0, limit: 4 },
      breachdirectory: { used: 0, limit: 50 },
      ipgeo: { used: 0, limit: 100 }
    };
  }

  // ==================== EMAIL CHECKING ====================

  // 1. HIBP Public API (Free, no key)
  async checkEmailHIBP(email) {
    try {
      await this.delay(1600);
      
      const response = await axios.get(
        `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}`,
        {
          headers: {
            'User-Agent': 'PwnWatch-Security-App'
          }
        }
      );
      
      return {
        source: 'Have I Been Pwned',
        icon: '🔐',
        breached: true,
        breaches: response.data,
        count: response.data.length,
        apiUsed: 'HIBP Public'
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          source: 'Have I Been Pwned',
          icon: '✅',
          breached: false,
          breaches: [],
          count: 0,
          apiUsed: 'HIBP Public'
        };
      }
      return {
        source: 'Have I Been Pwned',
        icon: '⚠️',
        breached: false,
        error: 'Service error',
        apiUsed: 'HIBP Public'
      };
    }
  }

  // 2. BreachDirectory (Your RapidAPI)
  async checkEmailBreachDirectory(email) {
    if (!this.rapidapiKey) {
      return {
        source: 'BreachDirectory',
        icon: '🔍',
        breached: false,
        error: 'API key missing'
      };
    }

    if (this.usage.breachdirectory.used >= this.usage.breachdirectory.limit) {
      return {
        source: 'BreachDirectory',
        icon: '⏳',
        breached: false,
        error: `Daily limit reached (${this.usage.breachdirectory.limit}/day)`
      };
    }

    try {
      this.usage.breachdirectory.used++;
      
      const response = await axios.get(
        'https://breachdirectory.p.rapidapi.com/',
        {
          params: { func: 'auto', term: email },
          headers: {
            'X-RapidAPI-Key': this.rapidapiKey,
            'X-RapidAPI-Host': 'breachdirectory.p.rapidapi.com'
          }
        }
      );
      
      if (response.data?.success && response.data?.result) {
        return {
          source: 'BreachDirectory',
          icon: '🔍',
          breached: true,
          breaches: response.data.result,
          count: response.data.result.length,
          apiUsed: 'BreachDirectory'
        };
      }
      
      return {
        source: 'BreachDirectory',
        icon: '✅',
        breached: false,
        breaches: [],
        apiUsed: 'BreachDirectory'
      };
    } catch (error) {
      return {
        source: 'BreachDirectory',
        icon: '⚠️',
        breached: false,
        error: error.response?.status === 429 ? 'Rate limited' : 'API error',
        apiUsed: 'BreachDirectory'
      };
    }
  }

  // ==================== VIRUSTOTAL ====================

  // 3. VirusTotal Domain Scan
  async scanDomainVirusTotal(domain) {
    if (!this.virustotalKey) {
      return {
        source: 'VirusTotal',
        icon: '🛡️',
        error: 'API key missing'
      };
    }

    if (this.usage.virustotal.used >= this.usage.virustotal.limit) {
      return {
        source: 'VirusTotal',
        icon: '⏳',
        error: `Daily limit reached (${this.usage.virustotal.limit}/day)`
      };
    }

    try {
      this.usage.virustotal.used++;
      
      const response = await axios.get(
        `https://www.virustotal.com/api/v3/domains/${domain}`,
        {
          headers: {
            'x-apikey': this.virustotalKey
          }
        }
      );
      
      const stats = response.data.data.attributes.last_analysis_stats;
      const total = stats.harmless + stats.malicious + stats.suspicious + stats.undetected;
      const maliciousPercent = total > 0 ? (stats.malicious / total) * 100 : 0;
      
      let reputation = 'Clean';
      let icon = '🟢';
      if (maliciousPercent > 20) {
        reputation = 'Malicious';
        icon = '🔴';
      } else if (maliciousPercent > 0) {
        reputation = 'Suspicious';
        icon = '🟡';
      }
      
      return {
        source: 'VirusTotal',
        icon: icon,
        domain: domain,
        reputation: reputation,
        malicious: stats.malicious,
        suspicious: stats.suspicious,
        harmless: stats.harmless,
        totalEngines: total,
        maliciousPercent: maliciousPercent.toFixed(1),
        apiUsed: 'VirusTotal'
      };
    } catch (error) {
      return {
        source: 'VirusTotal',
        icon: '⚠️',
        error: error.response?.status === 404 ? 'Domain not found' : 'API error',
        apiUsed: 'VirusTotal'
      };
    }
  }

  // ==================== IP GEOLOCATION ====================

  // 4. IP Geolocation
  async getIPGeolocation(ip = '') {
    if (!this.rapidapiKey) {
      return {
        source: 'IP Geolocation',
        icon: '🌍',
        error: 'API key missing'
      };
    }

    if (this.usage.ipgeo.used >= this.usage.ipgeo.limit) {
      return {
        source: 'IP Geolocation',
        icon: '⏳',
        error: `Monthly limit reached (${this.usage.ipgeo.limit}/month)`
      };
    }

    try {
      this.usage.ipgeo.used++;
      
      const ipToCheck = ip || await this.getUserIP();
      
      const response = await axios.get(
        'https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/',
        {
          params: { ip: ipToCheck },
          headers: {
            'X-RapidAPI-Key': this.rapidapiKey,
            'X-RapidAPI-Host': 'ip-geolocation-ipwhois-io.p.rapidapi.com'
          }
        }
      );
      
      return {
        source: 'IP Geolocation',
        icon: '🌍',
        ip: response.data.ip,
        country: response.data.country,
        city: response.data.city,
        isp: response.data.isp,
        latitude: response.data.latitude,
        longitude: response.data.longitude,
        timezone: response.data.timezone,
        apiUsed: 'IP Geolocation'
      };
    } catch (error) {
      return {
        source: 'IP Geolocation',
        icon: '⚠️',
        error: 'Failed to get location',
        apiUsed: 'IP Geolocation'
      };
    }
  }

  // ==================== PASSWORD CHECK ====================

  // 5. Password Check (Free)
  async checkPassword(password) {
    try {
      const crypto = require('crypto');
      const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
      const prefix = sha1.substring(0, 5);
      const suffix = sha1.substring(5);
      
      const response = await axios.get(
        `https://api.pwnedpasswords.com/range/${prefix}`,
        {
          headers: { 'User-Agent': 'PwnWatch' }
        }
      );
      
      const hashes = response.data.split('\n');
      for (const line of hashes) {
        const [hashSuffix, count] = line.split(':');
        if (hashSuffix === suffix) {
          return {
            pwned: true,
            count: parseInt(count),
            source: 'PwnedPasswords',
            icon: '🔴',
            message: `Found ${parseInt(count)} times in breaches`
          };
        }
      }
      
      // Calculate strength
      const strength = this.calculatePasswordStrength(password);
      
      return {
        pwned: false,
        count: 0,
        source: 'PwnedPasswords',
        icon: '✅',
        strength: strength,
        message: 'Not found in breaches'
      };
    } catch (error) {
      return {
        pwned: false,
        error: 'Service unavailable',
        icon: '⚠️'
      };
    }
  }

  // ==================== SECURITY NEWS ====================

  // 6. Security News (Free)
  async getSecurityNews() {
    try {
      const response = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
      const storyIds = response.data.slice(0, 10);
      
      const stories = await Promise.all(
        storyIds.map(async (id) => {
          const storyRes = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
          return storyRes.data;
        })
      );
      
      const securityStories = stories.filter(story => 
        story.title && (
          story.title.toLowerCase().includes('security') ||
          story.title.toLowerCase().includes('breach') ||
          story.title.toLowerCase().includes('hack') ||
          story.title.toLowerCase().includes('cyber')
        )
      ).slice(0, 5);
      
      return {
        source: 'HackerNews',
        icon: '📰',
        stories: securityStories,
        total: securityStories.length
      };
    } catch (error) {
      return {
        source: 'HackerNews',
        icon: '⚠️',
        stories: [],
        error: 'Failed to fetch news'
      };
    }
  }

  // ==================== HELPER METHODS ====================

  async getUserIP() {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      return response.data.ip;
    } catch {
      return '8.8.8.8';
    }
  }

  calculatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return { level: 'Weak', score, color: 'red' };
    if (score <= 4) return { level: 'Moderate', score, color: 'orange' };
    return { level: 'Strong', score, color: 'green' };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==================== MAIN METHODS ====================

  async comprehensiveEmailCheck(email) {
    const results = await Promise.all([
      this.checkEmailHIBP(email),
      this.checkEmailBreachDirectory(email)
    ]);
    
    const allBreaches = [];
    results.forEach(result => {
      if (result.breached && result.breaches) {
        allBreaches.push(...result.breaches);
      }
    });
    
    return {
      email: email,
      breached: allBreaches.length > 0,
      totalBreaches: allBreaches.length,
      sourcesChecked: results.length,
      results: results,
      breaches: allBreaches,
      apiUsage: this.usage
    };
  }

  async getApiUsage() {
    return this.usage;
  }
}

module.exports = SecurityService;