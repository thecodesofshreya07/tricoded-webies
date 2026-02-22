import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const campusData = {
  buildings: [
    { id: "main-building", name: "Main Building", description: "Central administrative offices", color: "#8B4513", icon: "fa-building" },
    { id: "sjmsom", name: "SJMSOM", description: "School of Management", color: "#E07A5F", icon: "fa-briefcase" },
    { id: "library", name: "Central Library", description: "24/7 study spaces", color: "#81B29A", icon: "fa-book" },
    { id: "lc", name: "Lecture Complex", description: "Main lecture halls", color: "#F4A261", icon: "fa-chalkboard-teacher" },
    { id: "vmcc", name: "Victor Menezes Convention Centre", description: "Events and conferences", color: "#3D5A40", icon: "fa-calendar" },
  ],
};

function adjustColor(color, amount) {
  return "#" + color.replace(/^#/, "").replace(/../g, (c) =>
    ("0" + Math.min(255, Math.max(0, parseInt(c, 16) + amount)).toString(16)).slice(-2)
  );
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Montserrat:wght@600;700;800&display=swap');
  @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

  :root {
    --earth-brown: #8B4513; --deep-earth: #654321; --terracotta: #E07A5F;
    --sand: #F4A261; --sage: #81B29A; --forest: #3D5A40;
    --clay: #D4A574; --stone: #A8A196; --cream: #F9F5F0;
    --charcoal: #2D3142; --white: #FFFFFF;
  }

  .landing-root * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

  .landing-root {
    font-family: 'Poppins', sans-serif;
    overflow-x: hidden;
    background: #1a1a1a;
    min-height: 100vh;
    position: relative;
  }

  .background-wrapper {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    z-index: 0; overflow: hidden;
  }
  .background-image { width: 100%; height: 100%; object-fit: cover; object-position: center; }
  .background-overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(135deg, rgba(139,69,19,0.85) 0%, rgba(101,67,33,0.75) 50%, rgba(61,90,64,0.85) 100%);
    backdrop-filter: blur(3px);
  }

  .header {
    position: fixed; top: 0; left: 0; right: 0; height: 90px;
    background: rgba(255,255,255,0.15); backdrop-filter: blur(25px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3); z-index: 1000;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 50px; border-bottom: 3px solid rgba(212,165,116,0.3);
  }

  .logo-section { display: flex; align-items: center; gap: 18px; }

  .logo-icon {
    width: 60px; height: 60px;
    background: linear-gradient(135deg, var(--earth-brown), var(--terracotta));
    border-radius: 15px; display: flex; align-items: center; justify-content: center;
    box-shadow: 0 8px 25px rgba(139,69,19,0.5), inset 0 -3px 10px rgba(0,0,0,0.3);
    animation: logo-pulse 3s ease-in-out infinite; position: relative;
  }
  .logo-icon::before {
    content: ''; position: absolute; inset: -5px;
    background: conic-gradient(from 0deg, var(--terracotta), var(--sand), var(--sage), var(--terracotta));
    border-radius: 18px; z-index: -1; opacity: 0.6; filter: blur(15px);
    animation: rotateAnim 4s linear infinite;
  }
  @keyframes logo-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  @keyframes rotateAnim { 100% { transform: rotate(360deg); } }

  .logo-icon i { font-size: 28px; color: white; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3)); }

  .logo-text h1 {
    font-family: 'Montserrat', sans-serif; font-size: 32px; font-weight: 800;
    background: linear-gradient(135deg, #fff, var(--clay));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    text-shadow: none; letter-spacing: -0.5px;
  }
  .logo-text p { font-size: 12px; color: rgba(255,255,255,0.8); font-weight: 600; text-transform: uppercase; letter-spacing: 2px; }

  .login-button {
    padding: 14px 35px;
    background: linear-gradient(135deg, var(--terracotta), var(--sand));
    color: white; border: none; border-radius: 50px; font-size: 15px;
    font-weight: 700; cursor: pointer; transition: all 0.4s ease;
    box-shadow: 0 8px 25px rgba(224,122,95,0.4); position: relative; overflow: hidden;
    text-transform: uppercase; letter-spacing: 1px;
  }
  .login-button::before {
    content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0;
    border-radius: 50%; background: rgba(255,255,255,0.3);
    transform: translate(-50%,-50%); transition: width 0.6s, height 0.6s;
  }
  .login-button:hover::before { width: 300px; height: 300px; }
  .login-button:hover { transform: translateY(-3px); box-shadow: 0 12px 35px rgba(224,122,95,0.6); }
  .login-button i { margin-right: 10px; }

  .main-container { position: relative; width: 100%; min-height: 100vh; padding-top: 90px; z-index: 1; }

  .hero-section { padding: 60px 50px 40px; text-align: center; margin-bottom: 50px; }
  .hero-title {
    font-family: 'Montserrat', sans-serif; font-size: 56px; font-weight: 800; color: white;
    margin-bottom: 20px; text-shadow: 0 5px 20px rgba(0,0,0,0.6); letter-spacing: -1px;
    animation: fadeInDown 0.8s ease-out;
  }
  @keyframes fadeInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
  .hero-subtitle {
    font-size: 22px; color: rgba(255,255,255,0.9); font-weight: 500;
    max-width: 700px; margin: 0 auto 15px; text-shadow: 0 3px 12px rgba(0,0,0,0.5);
    animation: fadeInUp 0.8s ease-out 0.2s both;
  }
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

  .iit-badge {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.2); backdrop-filter: blur(15px);
    padding: 12px 30px; border-radius: 50px; border: 2px solid rgba(255,255,255,0.3);
    color: white; font-weight: 600; font-size: 14px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.3); animation: fadeInUp 0.8s ease-out 0.4s both;
    text-decoration: none; cursor: pointer; transition: all 0.3s ease;
  }
  .iit-badge:hover { background: rgba(255,255,255,0.3); border-color: rgba(255,255,255,0.5); transform: translateY(-3px); box-shadow: 0 12px 35px rgba(0,0,0,0.4); }
  .iit-badge i { font-size: 18px; }

  .search-section { max-width: 800px; margin: 0 auto 50px; padding: 0 50px; animation: fadeInUp 0.8s ease-out 0.8s both; }
  .search-container {
    background: rgba(255,255,255,0.15); backdrop-filter: blur(25px);
    border-radius: 25px; padding: 8px; border: 2px solid rgba(255,255,255,0.3);
    box-shadow: 0 15px 50px rgba(0,0,0,0.4); transition: all 0.3s ease;
  }
  .search-container:focus-within { border-color: var(--terracotta); box-shadow: 0 20px 60px rgba(224,122,95,0.4); background: rgba(255,255,255,0.2); }
  .search-input-wrapper { display: flex; align-items: center; padding: 12px 20px; }
  .search-input-wrapper i { font-size: 22px; color: white; margin-right: 15px; }
  .search-input { flex: 1; background: transparent; border: none; outline: none; font-size: 18px; color: white; font-weight: 500; font-family: 'Poppins', sans-serif; }
  .search-input::placeholder { color: rgba(255,255,255,0.6); }
  .search-results { max-height: 400px; overflow-y: auto; margin-top: 8px; }
  .search-result-item {
    background: rgba(255,255,255,0.1); backdrop-filter: blur(15px); padding: 18px 20px;
    margin-bottom: 8px; border-radius: 15px; cursor: pointer; transition: all 0.3s ease;
    border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; gap: 15px;
  }
  .search-result-item:hover { background: rgba(255,255,255,0.2); border-color: var(--terracotta); transform: translateX(8px); }
  .result-icon { width: 50px; height: 50px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .result-icon i { color: white; font-size: 22px; }
  .result-content h4 { color: white; font-size: 16px; font-weight: 600; margin-bottom: 5px; }
  .result-content p { color: rgba(255,255,255,0.7); font-size: 13px; }

  .blocks-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 35px; padding: 0 50px 60px; max-width: 1600px; margin: 0 auto; }
  .block-card {
    background: rgba(255,255,255,0.12); backdrop-filter: blur(25px);
    border-radius: 30px; padding: 45px 35px; border: 2px solid rgba(255,255,255,0.2);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
    transition: all 0.5s cubic-bezier(0.4,0,0.2,1); cursor: pointer;
    position: relative; overflow: hidden; animation: slideInUp 0.8s ease-out both;
  }
  .block-card:nth-child(1) { animation-delay: 0.2s; }
  .block-card:nth-child(2) { animation-delay: 0.4s; }
  .block-card:nth-child(3) { animation-delay: 0.6s; }
  @keyframes slideInUp { from { opacity: 0; transform: translateY(60px); } to { opacity: 1; transform: translateY(0); } }
  .block-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 5px; background: linear-gradient(90deg, var(--terracotta), var(--sand), var(--sage)); opacity: 0; transition: opacity 0.3s ease; }
  .block-card:hover::before { opacity: 1; }
  .block-card:hover { transform: translateY(-15px) scale(1.02); background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.4); box-shadow: 0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 50px rgba(224,122,95,0.2); }

  .block-icon { width: 90px; height: 90px; margin: 0 auto 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 15px 40px rgba(224,122,95,0.4), inset 0 -3px 10px rgba(0,0,0,0.2); position: relative; animation: float 4s ease-in-out infinite; }
  .block-card:nth-child(1) .block-icon { background: linear-gradient(135deg, #E07A5F, #F4A261); }
  .block-card:nth-child(2) .block-icon { background: linear-gradient(135deg, #81B29A, #3D5A40); animation-delay: 0.5s; }
  .block-card:nth-child(3) .block-icon { background: linear-gradient(135deg, #8B4513, #654321); animation-delay: 1s; }
  @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 25% { transform: translateY(-10px) rotate(5deg); } 50% { transform: translateY(-5px) rotate(0deg); } 75% { transform: translateY(-10px) rotate(-5deg); } }
  .block-icon::before { content: ''; position: absolute; inset: -8px; background: inherit; border-radius: 50%; filter: blur(20px); opacity: 0.5; z-index: -1; }
  .block-icon i { font-size: 42px; color: white; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.3)); }

  .block-title { font-family: 'Montserrat', sans-serif; font-size: 26px; font-weight: 700; color: white; margin-bottom: 15px; text-align: center; text-shadow: 0 3px 12px rgba(0,0,0,0.5); }
  .block-description { font-size: 15px; color: rgba(255,255,255,0.85); text-align: center; line-height: 1.7; margin-bottom: 25px; text-shadow: 0 2px 8px rgba(0,0,0,0.4); }
  .block-stats { display: flex; justify-content: space-around; margin-top: 30px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.2); }
  .stat-item { text-align: center; }
  .stat-number { font-size: 32px; font-weight: 700; color: white; margin-bottom: 5px; text-shadow: 0 3px 10px rgba(0,0,0,0.5); }
  .stat-label { font-size: 12px; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }

  .block-action {
    width: 100%; padding: 16px; background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);
    border: 2px solid rgba(255,255,255,0.3); border-radius: 15px; color: white; font-size: 15px;
    font-weight: 700; cursor: pointer; transition: all 0.3s ease; margin-top: 25px;
    text-transform: uppercase; letter-spacing: 1px; display: block; text-align: center; text-decoration: none;
  }
  .block-action:hover { background: rgba(255,255,255,0.25); border-color: rgba(255,255,255,0.5); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.3); color: white; }
  .block-action i { margin-left: 8px; transition: transform 0.3s ease; }
  .block-action:hover i { transform: translateX(5px); }

  .login-modal-overlay {
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(10px);
    z-index: 2000; display: flex; align-items: center; justify-content: center;
    animation: fadeInModal 0.3s ease-out;
  }
  @keyframes fadeInModal { from { opacity: 0; } to { opacity: 1; } }
  .login-box {
    background: rgba(255,255,255,0.95); border-radius: 30px; padding: 50px 45px;
    max-width: 450px; width: 90%; box-shadow: 0 30px 90px rgba(0,0,0,0.5);
    border: 3px solid rgba(212,165,116,0.5); animation: scaleIn 0.4s ease-out; position: relative;
  }
  @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .close-modal { position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border: none; background: rgba(224,122,95,0.15); border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
  .close-modal:hover { background: var(--terracotta); transform: rotate(90deg); }
  .close-modal i { color: var(--terracotta); font-size: 18px; }
  .close-modal:hover i { color: white; }
  .login-header { text-align: center; margin-bottom: 35px; }
  .login-header h2 { font-family: 'Montserrat', sans-serif; font-size: 32px; font-weight: 800; background: linear-gradient(135deg, var(--earth-brown), var(--terracotta)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 10px; }
  .login-header p { font-size: 14px; color: var(--stone); font-weight: 500; }
  .input-group { margin-bottom: 22px; }
  .input-group label { display: block; font-size: 13px; font-weight: 700; color: var(--charcoal); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  .input-wrapper { position: relative; }
  .input-wrapper i { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: var(--stone); font-size: 16px; }
  .input-wrapper input { width: 100%; padding: 15px 20px 15px 50px; border: 2px solid var(--clay); border-radius: 12px; font-size: 15px; font-family: 'Poppins', sans-serif; transition: all 0.3s ease; background: rgba(249,245,240,0.7); }
  .input-wrapper input:focus { outline: none; border-color: var(--terracotta); background: white; box-shadow: 0 5px 20px rgba(224,122,95,0.2); }
  .login-submit { width: 100%; padding: 16px; border: none; border-radius: 12px; background: linear-gradient(135deg, var(--earth-brown), var(--terracotta)); color: white; font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.3s ease; font-family: 'Poppins', sans-serif; box-shadow: 0 8px 25px rgba(139,69,19,0.3); margin-top: 10px; text-transform: uppercase; letter-spacing: 1px; }
  .login-submit:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(139,69,19,0.4); }

  @media (max-width: 1200px) {
    .blocks-container { grid-template-columns: repeat(2, 1fr); }
    .block-card:nth-child(3) { grid-column: 1 / -1; max-width: 600px; margin: 0 auto; }
  }
  @media (max-width: 768px) {
    .header { padding: 0 25px; height: 80px; }
    .logo-text h1 { font-size: 24px; }
    .hero-title { font-size: 38px; }
    .hero-subtitle { font-size: 18px; }
    .blocks-container { grid-template-columns: 1fr; gap: 25px; padding: 0 25px 50px; }
    .block-card:nth-child(3) { grid-column: 1; }
    .search-section { padding: 0 25px; }
    .hero-section { padding: 40px 25px 30px; }
  }
`;

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const filteredResults = searchQuery.length >= 2
    ? campusData.buildings.filter(
        (b) =>
          b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    alert("🎉 Login successful!\nWelcome to Smart Move Navigation System");
    setShowLogin(false);
  };

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <div className="landing-root">
        <div className="background-wrapper">
          <img src="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2000" alt="IIT Bombay Campus" className="background-image" />
          <div className="background-overlay"></div>
        </div>

        <header className="header">
          <div className="logo-section">
            <div className="logo-icon">
              <i className="fas fa-location-arrow"></i>
            </div>
            <div className="logo-text">
              <h1>Smart Move</h1>
              <p>IIT Bombay Navigator</p>
            </div>
          </div>
          <button className="login-button" onClick={() => setShowLogin(true)}>
            <i className="fas fa-user-circle"></i>
            Login
          </button>
        </header>

        <div className="main-container">
          <section className="hero-section">
            <h1 className="hero-title">Navigate IIT Bombay Campus</h1>
            <p className="hero-subtitle">Real-time maps. Live occupancy. Instant essentials. Find exactly what you need, exactly where you are</p>
            <a onClick={() => navigate("/iit-bombay")} className="iit-badge" title="History & Achievements of IIT Bombay">
              <i className="fas fa-university"></i>
              Indian Institute of Technology Bombay
            </a>
          </section>

          <div className="search-section">
            <div className="search-container">
              <div className="search-input-wrapper">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search buildings, departments, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {filteredResults.length > 0 && (
                <div className="search-results">
                  {filteredResults.map((building) => (
                    <div
                      key={building.id}
                      className="search-result-item"
                      onClick={() => {
                        alert(`Selected: ${building.name}\nNavigating to this location...`);
                        setSearchQuery("");
                      }}
                    >
                      <div
                        className="result-icon"
                        style={{ background: `linear-gradient(135deg, ${building.color}, ${adjustColor(building.color, -20)})` }}
                      >
                        <i className={`fas ${building.icon}`}></i>
                      </div>
                      <div className="result-content">
                        <h4>{building.name}</h4>
                        <p>{building.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="blocks-container">
            <div className="block-card">
              <div className="block-icon"><i className="fas fa-map-marked-alt"></i></div>
              <h2 className="block-title">Interactive Campus Map</h2>
              <p className="block-description">Explore IIT Bombay's 365-acre campus with our interactive 3D map. Find buildings, departments, and facilities with precise location tracking.</p>
              <div className="block-stats">
                <div className="stat-item"><div className="stat-number">50+</div><div className="stat-label">Buildings</div></div>
                <div className="stat-item"><div className="stat-number">365</div><div className="stat-label">Acres</div></div>
              </div>
              <a onClick={() => navigate("/campus-map")} className="block-action">
                Explore Map <i className="fas fa-arrow-right"></i>
              </a>
            </div>

            <div className="block-card">
              <div className="block-icon"><i className="fas fa-route"></i></div>
              <h2 className="block-title">Smart Navigation</h2>
              <p className="block-description">Get turn-by-turn directions with landmark-based guidance. Choose step-free routes and avoid crowded areas during peak hours.</p>
              <div className="block-stats">
                <div className="stat-item"><div className="stat-number">GPS</div><div className="stat-label">Enabled</div></div>
                <div className="stat-item"><div className="stat-number">Live</div><div className="stat-label">Updates</div></div>
              </div>
              <button className="block-action" onClick={() => navigate("/navigation")}>
                Start Navigation <i className="fas fa-arrow-right"></i>
              </button>
            </div>

            <div className="block-card">
              <div className="block-icon"><i className="fas fa-building"></i></div>
              <h2 className="block-title">Campus Services</h2>
              <p className="block-description">Check real-time availability of printers, study rooms, labs, and other facilities. Book resources and plan your day efficiently.</p>
              <div className="block-stats">
                <div className="stat-item"><div className="stat-number">24/7</div><div className="stat-label">Access</div></div>
                <div className="stat-item"><div className="stat-number">Real-time</div><div className="stat-label">Status</div></div>
              </div>
              <button className="block-action" onClick={() => navigate("/campus-services")}>
                View Services <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        {showLogin && (
          <div className="login-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}>
            <div className="login-box">
              <button className="close-modal" onClick={() => setShowLogin(false)}>
                <i className="fas fa-times"></i>
              </button>
              <div className="login-header">
                <h2>Welcome to Smart Move</h2>
                <p>Login to access personalized navigation</p>
              </div>
              <form onSubmit={handleLoginSubmit}>
                <div className="input-group">
                  <label>Email or Username</label>
                  <div className="input-wrapper">
                    <i className="fas fa-envelope"></i>
                    <input type="text" placeholder="Enter your email" required />
                  </div>
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <i className="fas fa-lock"></i>
                    <input type="password" placeholder="Enter your password" required />
                  </div>
                </div>
                <button type="submit" className="login-submit">Login Now</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
