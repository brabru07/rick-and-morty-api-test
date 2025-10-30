import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.css';
import './index.css'; // ✅ este sí va
// ❌ No pongas etiquetas <img> fuera del componente

function App() {
  // 🧠 ---------------------- ESTADOS PRINCIPALES ----------------------
  const [personajes, setPersonajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const [totalPaginas, setTotalPaginas] = useState(null);

  // 🕒 ---------------------- DEBOUNCE PARA LA BÚSQUEDA ----------------------
  const handleBusquedaChange = debounce((valor) => {
    setBusqueda(valor);
    setPaginaActual(1);
  }, 500);

  // 🔍 ---------------------- EFECTO PRINCIPAL: CARGAR PERSONAJES ----------------------
  useEffect(() => {
    setCargando(true);
    setError(null);

    const url = busqueda
      ? `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(busqueda)}&page=${paginaActual}`
      : `https://rickandmortyapi.com/api/character/?page=${paginaActual}`;

    fetch(url)
      .then((res) => {
        if (res.status === 404) throw new Error('No se encontraron personajes con ese nombre.');
        if (!res.ok) throw new Error('Error al cargar los datos.');
        return res.json();
      })
      .then((data) => {
        setPersonajes(data.results);
        setTotalPaginas(data.info.pages);
        setCargando(false);
      })
      .catch((err) => {
        setError(err.message);
        setPersonajes([]);
        setCargando(false);
      });
  }, [paginaActual, busqueda]);

  // 🧹 ---------------------- LIMPIEZA DEL DEBOUNCE ----------------------
  useEffect(() => {
    return () => {
      handleBusquedaChange.cancel();
    };
  }, []);

  // 🌀 ---------------------- ESTADOS DE RENDERIZADO ----------------------
  if (cargando)
    return (
      <p style={{ textAlign: 'center', fontSize: '24px', color: '#c5f850', marginTop: '50px' }}>
        Cargando personajes...
      </p>
    );

  if (error && personajes.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p
          style={{
            fontSize: '22px',
            color: '#ff66d0',
            textShadow: '0 0 5px rgba(255, 102, 208, 0.5)',
          }}
        >
          ¡Wubba Lubba Dub Dub! Error: {error}
        </p>

        <button
          onClick={() => {
            setBusqueda('');
            setPaginaActual(1);
            setError(null);
          }}
          className="btn-reload"
          style={{ marginTop: '15px' }}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  // 🎨 ---------------------- INTERFAZ PRINCIPAL ----------------------
  return (
    <div style={{ padding: '20px' }}>
      {/* 🖼️ LOGO Y TÍTULO */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img
          src="/logo.jpg" // ✅ logo desde public
          alt="Rick and Morty Logo"
          style={{ width: '150px', height: 'auto', marginBottom: '10px' }}
        />
        <h1>Rick and Morty - Personajes</h1>
      </div>

      {/* 🔎 CAMPO DE BÚSQUEDA */}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Buscar personaje por nombre..."
          value={busqueda}
          onChange={(e) => handleBusquedaChange(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '18px',
            width: '350px',
            borderRadius: '8px',
          }}
        />
      </div>

      {/* 📄 PAGINACIÓN SUPERIOR */}
      <div className="paginacion-contenedor">
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          className="btn-paginacion"
        >
          &lt; Anterior
        </button>

        <span className="texto-paginacion">
          Página {paginaActual} de {totalPaginas}
        </span>

        <button
          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
          className="btn-paginacion"
        >
          Siguiente &gt;
        </button>
      </div>

      {/* 🧱 GRID DE PERSONAJES */}
      <div className="personajes-grid">
        {personajes.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <p style={{ fontSize: '20px', color: '#ff66d0' }}>
              Nadie coincide con esa búsqueda en este universo.
            </p>
          </div>
        ) : (
          personajes.map((personaje) => (
            <div key={personaje.id} className="tarjeta-personaje">
              <img src={personaje.image} alt={personaje.name} />
              <h3>{personaje.name}</h3>
              <p>{personaje.species}</p>
              <p
                style={{
                  fontSize: '14px',
                  color: '#c5f850',
                  fontWeight: 'bold',
                }}
              >
                {personaje.status}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 📄 PAGINACIÓN INFERIOR */}
      <div className="paginacion-contenedor">
        <button
          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
          disabled={paginaActual === 1}
          className="btn-paginacion"
        >
          &lt; Anterior
        </button>

        <span className="texto-paginacion">
          Página {paginaActual} de {totalPaginas}
        </span>

        <button
          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas}
          className="btn-paginacion"
        >
          Siguiente &gt;
        </button>
      </div>
    </div>
  );
}

export default App;
