import { useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './App.css';
import './index.css';

function App() {
  // ================== ESTADOS ==================
  const [personajes, setPersonajes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);

  const [inputBusqueda, setInputBusqueda] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const [totalPaginas, setTotalPaginas] = useState(null);

  // ================== DEBOUNCE ==================
  const debouncedSetBusqueda = useMemo(
    () =>
      debounce((valor) => {
        setBusqueda(valor);
        setPaginaActual(1);
      }, 500),
    []
  );

  // ================== INPUT ==================
  const onBusquedaChange = (e) => {
    const valor = e.target.value;
    setInputBusqueda(valor);
    debouncedSetBusqueda(valor);
  };

  // ================== FETCH ==================
  useEffect(() => {
    setCargando(true);
    setError(null);

    const url = busqueda
      ? `https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(
          busqueda
        )}&page=${paginaActual}`
      : `https://rickandmortyapi.com/api/character/?page=${paginaActual}`;

    fetch(url)
      .then((res) => {
        if (res.status === 404)
          throw new Error('No se encontraron personajes.');
        if (!res.ok) throw new Error('Error al cargar datos.');
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

  // ================== CLEANUP ==================
  useEffect(() => {
    return () => debouncedSetBusqueda.cancel();
  }, [debouncedSetBusqueda]);

  // ================== RENDER ==================
  if (cargando) {
    return (
      <p style={{ textAlign: 'center', fontSize: '24px', marginTop: '50px' }}>
        Cargando personajes...
      </p>
    );
  }

  if (error && personajes.length === 0) {
    return (
      <p style={{ textAlign: 'center', fontSize: '22px', marginTop: '50px' }}>
        {error}
      </p>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Rick and Morty - Personajes</h1>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Buscar personaje..."
          value={inputBusqueda}
          onChange={onBusquedaChange}
          style={{
            padding: '10px',
            width: '350px',
            fontSize: '18px',
            borderRadius: '8px',
          }}
        />
      </div>

      <div className="paginacion-contenedor">
        <button
          className="btn-paginacion"
          onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
          disabled={paginaActual === 1}
        >
          &lt; Anterior
        </button>

        <span className="texto-paginacion">
          Página {paginaActual} de {totalPaginas}
        </span>

        <button
          className="btn-paginacion"
          onClick={() =>
            setPaginaActual((p) => Math.min(p + 1, totalPaginas))
          }
          disabled={paginaActual === totalPaginas}
        >
          Siguiente &gt;
        </button>
      </div>

      <div className="personajes-grid">
        {personajes.map((p) => (
          <div key={p.id} className="tarjeta-personaje">
            <img src={p.image} alt={p.name} />
            <h3>{p.name}</h3>
            <p>{p.species}</p>
            <p>{p.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
