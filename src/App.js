import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [personajes, setPersonajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [totalPaginas, setTotalPaginas] = useState(null);

  // useEffect para cargar personajes, con filtro por nombre y paginación
  useEffect(() => {
    setCargando(true);
    setError(null);

    // Usamos la URL de la API según si hay filtro de búsqueda o no
    const url = busqueda
      ? `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(busqueda)}&page=${paginaActual}`
      : `https://rickandmortyapi.com/api/character/?page=${paginaActual}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('No se encontraron personajes');
        return res.json();
      })
      .then((data) => {
        setPersonajes(data.results);
        setTotalPaginas(data.info.pages);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setPersonajes([]); // Limpiamos si no hay resultados
        setCargando(false);
      });
  }, [paginaActual, busqueda]);

  if (cargando) return <p style={{ textAlign: 'center' }}>Cargando personajes...</p>;
  if (error) return <p style={{ textAlign: 'center' }}>Error: {error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>Rick and Morty - Personajes</h1>

      {/* Búsqueda */}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Buscar personaje por nombre..."
          value={busqueda}
          onChange={(e) => {
            setBusqueda(e.target.value);
            setPaginaActual(1); // Reset a la página 1 al buscar
          }}
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '300px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      {/* Paginación */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          style={{
            padding: '10px 20px',
            backgroundColor: '#8e44ad',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: paginaActual === 1 ? 'not-allowed' : 'pointer'
          }}
        >
          Anterior
        </button>

        <span style={{ paddingTop: '10px' }}>Página {paginaActual} de {totalPaginas}</span>

        <button
          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
          style={{
            padding: '10px 20px',
            backgroundColor: '#27ae60',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer'
          }}
        >
          Siguiente
        </button>
      </div>

      {/* Grid de personajes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}
      >
        {personajes.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center' }}>No se encontraron personajes.</p>
        ) : (
          personajes.map((personaje) => (
            <div
              key={personaje.id}
              style={{
                backgroundColor: '#f0f0f0',
                padding: '15px',
                borderRadius: '10px',
                textAlign: 'center',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              <img
                src={personaje.image}
                alt={personaje.name}
                style={{
                  borderRadius: '50%',
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover'
                }}
              />
              <h3 style={{ margin: '10px 0 5px' }}>{personaje.name}</h3>
              <p style={{ margin: 0 }}>{personaje.species}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                {personaje.status}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
