import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Orbitron:wght@500;700&family=Roboto+Slab:wght@400;600&display=swap');

  .entry-root {
    margin: 0;
    font-family: "Montserrat", sans-serif;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    color: #f4f1e1;
    overflow: hidden;
    perspective: 1000px;
    background: url("https://techportal.in/wp-content/uploads/2023/11/iit-bombay-768x318.jpg") no-repeat center center/cover;
    transition: background-position 0.3s ease;
    cursor: default;
  }

  .entry-root::before {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    backdrop-filter: blur(6px);
    z-index: 0;
  }

  .entry-root::after {
    content: "";
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.45);
    z-index: 0;
  }

  .entry-container {
    position: relative;
    z-index: 1;
    animation: fadeIn 2s ease;
    transform-style: preserve-3d;
  }

  .entry-h1 {
    font-size: 3.5rem;
    margin-bottom: 0.5rem;
    letter-spacing: 3px;
    font-family: "Orbitron", sans-serif;
    text-shadow: 3px 3px 8px #000;
    color: #f4f1e1;
    animation: float3D 6s infinite ease-in-out;
  }

  .entry-h2 {
    font-size: 1.8rem;
    margin: 1rem auto 2rem auto;
    font-family: "Roboto Slab", serif;
    letter-spacing: 1px;
    text-shadow: 2px 2px 6px #000;
    color: #f4f1e1;
    border-right: 2px solid #f4f1e1;
    white-space: nowrap;
    overflow: hidden;
    width: 0;
    animation: typing 2.5s steps(20, end) forwards, blink 0.75s step-end infinite;
  }

  @keyframes typing {
    from { width: 0; }
    to { width: 20ch; }
  }
  @keyframes blink {
    50% { border-color: transparent; }
  }

  .explore-btn {
    background: #a67c52;
    color: #fff;
    border: none;
    padding: 1rem 2.5rem;
    font-size: 1.3rem;
    border-radius: 12px;
    cursor: pointer;
    transition: transform 0.6s ease, background 0.3s ease, box-shadow 0.3s ease;
    font-family: "Montserrat", sans-serif;
  }

  .explore-btn:hover,
  .explore-btn:focus {
    background: #3b6b3b;
    transform: scale(1.1) rotateY(10deg);
    box-shadow: 0 0 25px rgba(255,255,255,0.7);
    outline: none;
  }

  .explore-btn:active {
    transform: scale(0.95) rotateX(10deg);
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes float3D {
    0% { transform: rotateY(0deg) translateZ(0); }
    50% { transform: rotateY(10deg) translateZ(20px); }
    100% { transform: rotateY(0deg) translateZ(0); }
  }

  .entry-modal {
    position: fixed;
    top: 50%; left: 50%;
    background: #e8dcc2;
    color: #333;
    padding: 3rem;
    border-radius: 20px;
    border: 3px solid #6b4226;
    box-shadow: 0 0 40px rgba(0,0,0,0.6);
    z-index: 1000;
    animation: popUp 0.5s ease forwards;
    width: 450px;
    text-align: center;
    font-family: "Montserrat", sans-serif;
  }

  @keyframes popUp {
    from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }

  .entry-modal h3 {
    margin-top: 0;
    font-family: "Orbitron", sans-serif;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .entry-modal button {
    margin: 0.5rem;
    padding: 0.8rem 1.5rem;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    background: #3b6b3b;
    color: #fff;
    transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
    font-size: 1rem;
    font-family: "Montserrat", sans-serif;
  }

  .entry-modal button:hover {
    transform: scale(1.15) rotateY(5deg);
    background: #a67c52;
    box-shadow: 0 0 15px rgba(0,0,0,0.4);
  }
`;

export default function EntryPage() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      document.querySelector(".entry-root").style.backgroundPosition = `${50 + x}% ${50 + y}%`;
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleRedirect = () => {
    navigate("/landing");
  };

  return (
    <>
      <style>{styles}</style>
      <div className="entry-root">
        <div className="entry-container">
          <h1 className="entry-h1">Smart Move</h1>
          <h2 className="entry-h2">IIT Bombay Navigator</h2>
          <button className="explore-btn" onClick={() => setShowModal(true)}>
            Explore IIT Bombay
          </button>
        </div>

        {showModal && (
          <div className="entry-modal">
            <h3>Welcome! Who is visiting the campus?</h3>
            <button onClick={handleRedirect}>New Student</button>
            <button onClick={handleRedirect}>Visitor</button>
            <button onClick={handleRedirect}>Community Member</button>
          </div>
        )}
      </div>
    </>
  );
}
