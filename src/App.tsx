import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://rickandmortyapi.com/api/character";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
  origin: { name: string };
  location: { name: string };
}

export default function App() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchCharacters() {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (!cancelled) setCharacters(data.results ?? []);
      } catch (err) {
        if (!cancelled) {
          const error = err as Error;
          setErrorMsg(error?.message || "Error desconocido");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCharacters();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container">
      <header className="header"> 
        {/* <img 
          src="https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUya2t5eHJ3aDA5OGpiMDhscHk0a3Zub3hlcm5vNXFjcHpnbGNpczVnMCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Nx0rz3jtxtEre/source.gif" 
          alt="Rick and Morty" 
          className="header-gif"
        /> */}
        
        <h1>Rick & Morty Characters</h1>
      </header>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p className="state">Cargando personajes...</p>
        </div>
      )}

      {!loading && errorMsg && (
        <div className="error-container">
          <p className="state error">Error: {errorMsg}</p>
        </div>
      )}

      {!loading && !errorMsg && (
        <div className="grid">
          {characters.map((c) => (
            <article className="card" key={c.id}>
              <div className="card-image-wrapper">
                <img className="avatar" src={c.image} alt={c.name} />
                <div className={`status-indicator status-${c.status.toLowerCase()}`}></div>
              </div>
              <div className="cardBody">
                <h2 className="name">{c.name}</h2>
                <div className="meta">
                  <span className={`pill pill-${c.status.toLowerCase()}`}>{c.status}</span>
                  <span className="pill pill-species">{c.species}</span>
                </div>
                <div className="info-section">
                  <p className="info-item">
                    <span className="info-label">Origen:</span>
                    <span className="info-value">{c.origin?.name || "Desconocido"}</span>
                  </p>
                  <p className="info-item">
                    <span className="info-label">Ubicación:</span>
                    <span className="info-value">{c.location?.name || "Desconocido"}</span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
