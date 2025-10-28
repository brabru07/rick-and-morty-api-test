import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce'; // 🧩 Importamos debounce desde lodash
import './App.css';

function App() {
  // 🧠 Estados principales
  const [personajes, setPersonajes] = useState([]);   // Lista de personajes
  const [cargando, setCargando] = useState(true);     // Indicador de carga
  const [error, setError] = useState(null);           // Manejo de errores
  const [paginaActual, setPaginaActual] = useState(1); // Página actual
  const [busqueda, setBusqueda] = useState('');        // Texto de búsqueda
  const [totalPaginas, setTotalPaginas] = useState(null); // Total de páginas

  // 🕒 Función con debounce (espera 500 ms antes de buscar)
  const handleBusquedaChange = debounce((valor) => {
    setBusqueda(valor);
    setPaginaActual(1); // Reinicia la paginación al cambiar la búsqueda
  }, 500);

  // 🔍 useEffect para cargar los personajes desde la API
  useEffect(() => {
    setCargando(true);
    setError(null);

    // Creamos la URL según haya o no búsqueda activa
    const url = busqueda
      ? `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(busqueda)}&page=${paginaActual}`
      : `https://rickandmortyapi.com/api/character/?page=${paginaActual}`;

    // Llamada a la API
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
        setPersonajes([]); // Si hay error, limpiamos resultados
        setCargando(false);
      });
  }, [paginaActual, busqueda]);

  // 🧹 Cancelamos el debounce al desmontar el componente
  useEffect(() => {
    return () => {
      handleBusquedaChange.cancel();
    };
  }, []);

  // 🧭 Renderizado condicional (mientras carga o hay error)
  if (cargando) return <p style={{ textAlign: 'center' }}>Cargando personajes...</p>;
  if (error) {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <p style={{ fontSize: '18px', color: '#e74c3c' }}>Error: {error}</p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '15px',
          padding: '10px 20px',
          backgroundColor: '#3498db',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Recargar página
      </button>
    </div>
  );
}


  // 🎨 Interfaz de usuario
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>Rick and Morty - Personajes</h1>

      {/* 🔎 Campo de búsqueda */}
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Buscar personaje por nombre..."
          onChange={(e) => handleBusquedaChange(e.target.value)} // 👈 Usamos debounce aquí
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '300px',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
      </div>

      {/* 📄 Paginación superior */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}
      >
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

        <span style={{ paddingTop: '10px' }}>
          Página {paginaActual} de {totalPaginas}
        </span>

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

      {/* 🧱 Grid de personajes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px'
        }}
      >
        {personajes.length === 0 ? (
          // 🟥 Si no hay resultados, mostramos botón para recargar
          <div style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
            <p>No se encontraron personajes.</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '10px',
                padding: '10px 20px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Recargar página
            </button>
          </div>
        ) : (
          // 🟩 Si hay resultados, renderizamos las tarjetas
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

      {/* 📄 Paginación inferior */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          margin: '20px 0'
        }}
      >
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

        <span style={{ paddingTop: '10px' }}>
          Página {paginaActual} de {totalPaginas}
        </span>

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
    </div>
  );
}

export default App;
