import React, { useState, useEffect } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend status
  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      setBackendStatus('online');
    } catch (error) {
      setBackendStatus('offline');
    }
  };

  const handleSubmit = async (type) => {
    if (loading) return;
    
    setLoading(true);
    const endpoint = `/api/security/${type === 'email' ? 'check-email' : 
                          type === 'password' ? 'check-password' : 'scan-domain'}`;
    
    const body = type === 'email' ? { email } :
                 type === 'password' ? { password } :
                 { domain };

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      setResults(prev => ({ ...prev, [type]: data }));
    } catch (error) {
      setResults(prev => ({ ...prev, [type]: { error: 'Failed to check' } }));
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const styles = {
    app: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #fdf2f8 0%, #fff5f7 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", sans-serif',
    },
    
    // Header
    header: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(236, 72, 153, 0.1)',
      padding: '1.5rem 0',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '1.875rem',
      fontWeight: 800,
      color: 'var(--pink-600)',
      textDecoration: 'none',
    },
    
    // Navigation
    nav: {
      display: 'flex',
      gap: '0.25rem',
      background: 'rgba(252, 231, 243, 0.5)',
      padding: '0.375rem',
      borderRadius: '9999px',
      border: '1px solid rgba(236, 72, 153, 0.1)',
    },
    
    navButton: {
      padding: '0.625rem 1.5rem',
      borderRadius: '9999px',
      border: 'none',
      background: 'transparent',
      color: 'var(--pink-700)',
      fontSize: '0.875rem',
      fontWeight: 500,
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    
    navButtonActive: {
      background: 'white',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      color: 'var(--pink-600)',
    },
    
    // Main Content
    main: {
      padding: '2rem 0 4rem',
    },
    
    hero: {
      textAlign: 'center',
      marginBottom: '3rem',
      maxWidth: '48rem',
      margin: '0 auto 3rem',
    },
    
    heroTitle: {
      fontSize: '3rem',
      fontWeight: 800,
      background: 'linear-gradient(135deg, var(--pink-500) 0%, var(--pink-700) 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '1rem',
      lineHeight: 1.1,
    },
    
    heroSubtitle: {
      fontSize: '1.25rem',
      color: 'var(--pink-600)',
      marginBottom: '2rem',
      opacity: 0.8,
    },
    
    // Cards
    card: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid rgba(236, 72, 153, 0.1)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s',
    },
    
    cardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 20px 25px -5px rgba(236, 72, 153, 0.1), 0 10px 10px -5px rgba(236, 72, 153, 0.04)',
    },
    
    // Input Section
    inputSection: {
      background: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      border: '1px solid rgba(236, 72, 153, 0.1)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
      marginBottom: '2rem',
    },
    
    inputLabel: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: 'var(--pink-700)',
      marginBottom: '0.5rem',
    },
    
    input: {
      width: '100%',
      padding: '0.875rem 1rem',
      borderRadius: '0.75rem',
      border: '2px solid var(--pink-200)',
      fontSize: '1rem',
      color: 'var(--gray-800)',
      transition: 'all 0.2s',
      outline: 'none',
    },
    
    inputFocus: {
      borderColor: 'var(--pink-400)',
      boxShadow: '0 0 0 3px rgba(236, 72, 153, 0.1)',
    },
    
    // Button
    button: {
      background: 'linear-gradient(135deg, var(--pink-500) 0%, var(--pink-600) 100%)',
      color: 'white',
      border: 'none',
      padding: '0.875rem 1.75rem',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(236, 72, 153, 0.3)',
    },
    
    buttonHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 10px 15px -3px rgba(236, 72, 153, 0.4)',
    },
    
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none',
    },
    
    // Results
    resultCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '1rem',
      padding: '1.5rem',
      border: '1px solid rgba(236, 72, 153, 0.2)',
      marginTop: '1.5rem',
      animation: 'fadeIn 0.6s ease-out',
    },
    
    resultGood: {
      borderLeft: '4px solid #10b981',
    },
    
    resultBad: {
      borderLeft: '4px solid #ef4444',
    },
    
    resultWarning: {
      borderLeft: '4px solid #f59e0b',
    },
    
    // Status Badge
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.375rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 500,
    },
    
    statusOnline: {
      background: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981',
    },
    
    statusOffline: {
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
    },
    
    // Footer
    footer: {
      background: 'rgba(255, 255, 255, 0.9)',
      borderTop: '1px solid rgba(236, 72, 153, 0.1)',
      padding: '2rem 0',
      marginTop: '3rem',
    },
    
    // Icons
    icon: {
      width: '1.25rem',
      height: '1.25rem',
    },
    
    // Features Grid
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    
    // Feature Title
    featureTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      marginBottom: '0.75rem',
      color: 'var(--pink-700)',
      position: 'relative',
      paddingBottom: '0.5rem',
    },
    
    featureTitleUnderline: {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '40px',
      height: '3px',
      background: 'var(--pink-400)',
      borderRadius: '2px',
    },
  };

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a href="/" style={styles.logo}>
              <svg style={styles.icon} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              SecuraScan
            </a>
            
            <div style={styles.nav}>
              {['email', 'password', 'domain'].map((tab) => (
                <button
                  key={tab}
                  style={{
                    ...styles.navButton,
                    ...(activeTab === tab ? styles.navButtonActive : {})
                  }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'email' && '?? Email'}
                  {tab === 'password' && '?? Password'}
                  {tab === 'domain' && '?? Domain'}
                </button>
              ))}
            </div>
            
            <div style={{
              ...styles.statusBadge,
              ...(backendStatus === 'online' ? styles.statusOnline : styles.statusOffline)
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: backendStatus === 'online' ? '#10b981' : '#ef4444'
              }} />
              {backendStatus === 'online' ? 'API Online' : 'API Offline'}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        <div className="container">
          {/* Hero Section */}
          <div style={styles.hero}>
            <h1 style={styles.heroTitle}>Check Your Digital Security</h1>
            <p style={styles.heroSubtitle}>
              Protect your online presence with real-time breach checking
            </p>
          </div>

          {/* Input Section */}
          <div style={styles.inputSection}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--pink-700)' }}>
              {activeTab === 'email' && '?? Check Email Breaches'}
              {activeTab === 'password' && '?? Audit Password Security'}
              {activeTab === 'domain' && '?? Scan Domain Reputation'}
            </h2>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={styles.inputLabel}>
                {activeTab === 'email' && 'Enter your email address'}
                {activeTab === 'password' && 'Enter your password'}
                {activeTab === 'domain' && 'Enter domain (e.g., example.com)'}
              </label>
              <input
                type={activeTab === 'password' ? 'password' : 'text'}
                value={activeTab === 'email' ? email : activeTab === 'password' ? password : domain}
                onChange={(e) => {
                  if (activeTab === 'email') setEmail(e.target.value);
                  if (activeTab === 'password') setPassword(e.target.value);
                  if (activeTab === 'domain') setDomain(e.target.value);
                }}
                placeholder={
                  activeTab === 'email' ? 'you@example.com' :
                  activeTab === 'password' ? 'Enter password to check...' :
                  'example.com'
                }
                style={styles.input}
                onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
                onBlur={(e) => e.target.style.borderColor = 'var(--pink-200)'}
              />
            </div>
            
            <button
              onClick={() => handleSubmit(activeTab)}
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading && styles.buttonDisabled)
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = styles.buttonHover.transform)}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'none')}
            >
              {loading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid white',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Checking...
                </>
              ) : (
                <>
                  {activeTab === 'email' && 'Check Email Breaches'}
                  {activeTab === 'password' && 'Audit Password'}
                  {activeTab === 'domain' && 'Scan Domain'}
                </>
              )}
            </button>

            {/* Results Display */}
            {results[activeTab] && !results[activeTab].error && (
              <div style={{
                ...styles.resultCard,
                ...(results[activeTab].breached === false || results[activeTab].pwned === false ? 
                  styles.resultGood : 
                  results[activeTab].breached || results[activeTab].pwned ? 
                  styles.resultBad : 
                  styles.resultWarning)
              }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {activeTab === 'email' && (
                    results[activeTab].breached ? 
                    `?? Found in ${results[activeTab].count} breach(es)` : 
                    '? Email is secure'
                  )}
                  {activeTab === 'password' && (
                    results[activeTab].pwned ? 
                    '?? Password compromised' : 
                    '? Password is secure'
                  )}
                  {activeTab === 'domain' && (
                    results[activeTab].reputation === 'Clean' ?
                    '? Domain is clean' :
                    '?? Domain needs attention'
                  )}
                </h3>
                
                {activeTab === 'email' && (
                  <>
                    <p style={{ marginBottom: '0.5rem' }}>
                      <strong>Email:</strong> {results[activeTab].email}
                    </p>
                    {results[activeTab].breached && results[activeTab].breaches?.length > 0 && (
                      <div style={{ marginTop: '1rem' }}>
                        <p style={{ fontWeight: 500, marginBottom: '0.5rem' }}>Breach details:</p>
                        {results[activeTab].breaches.map((breach, idx) => (
                          <div key={idx} style={{
                            padding: '0.75rem',
                            background: 'rgba(244, 114, 182, 0.05)',
                            borderRadius: '0.5rem',
                            marginBottom: '0.5rem'
                          }}>
                            <strong>{breach.Name}</strong>
                            <div style={{ fontSize: '0.875rem', color: 'var(--pink-600)' }}>
                              {breach.BreachDate && `Date: ${breach.BreachDate}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
                
                {activeTab === 'password' && results[activeTab].strength && (
                  <p><strong>Strength:</strong> {results[activeTab].strength}</p>
                )}
                
                {activeTab === 'domain' && results[activeTab].domain && (
                  <p><strong>Domain:</strong> {results[activeTab].domain}</p>
                )}
                
                <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--pink-500)' }}>
                  Checked at: {new Date(results[activeTab].timestamp || Date.now()).toLocaleTimeString()}
                </div>
              </div>
            )}
            
            {results[activeTab]?.error && (
              <div style={{ ...styles.resultCard, ...styles.resultWarning }}>
                <p style={{ color: '#ef4444' }}>? {results[activeTab].error}</p>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div style={styles.featuresGrid}>
            {[
              {
                title: 'Data Privacy First',
                desc: 'Your information is processed in real-time and never stored on our servers.',
              },
              {
                title: 'Verified Security Sources',
                desc: 'Powered by official databases and secure verification methods for accurate results.',
              },
              {
                title: 'User-Centric Experience',
                desc: 'Designed with clarity and accessibility for users at all technical skill levels.',
              }
            ].map((feature, idx) => (
              <div 
                key={idx} 
                style={styles.card}
                onMouseEnter={(e) => e.currentTarget.style.transform = styles.cardHover.transform}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
              >
                <div style={{ position: 'relative' }}>
                  <h3 style={styles.featureTitle}>
                    {feature.title}
                    <div style={styles.featureTitleUnderline}></div>
                  </h3>
                </div>
                <p style={{ color: 'var(--pink-600)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--pink-600)', marginBottom: '1rem' }}>
              ?? SecuraScan
            </div>
            <p style={{ color: 'var(--pink-500)', marginBottom: '0.5rem' }}>
              Cybersecurity breach checking tool
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--pink-400)' }}>
              Powered by HIBP API • For educational purposes
            </p>
          </div>
        </div>
      </footer>

      {/* Add spin animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default App;



