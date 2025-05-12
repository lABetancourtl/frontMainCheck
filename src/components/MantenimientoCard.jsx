import '../App.css';
import { useState, useEffect } from 'react';

export function MantenimientoCard({ 
    id, 
    nombre, 
    descripcion, 
    fecha_inicio, 
    fecha_fin, 
    estado, 
    responsable, 
    actividades = [], 
    observaciones = [] 
}) {
    const [nuevaObservacionMantenimiento, setNuevaObservacionMantenimiento] = useState('');
    const [observacionesActividades, setObservacionesActividades] = useState({});
    const [observacionesMantenimiento, setObservacionesMantenimiento] = useState(observaciones);
    const [editandoObservacion, setEditandoObservacion] = useState(null);
    const [editandoObservacionActividad, setEditandoObservacionActividad] = useState({ actividadId: null, observacionId: null });
    const [textoEditable, setTextoEditable] = useState('');
    const [loading, setLoading] = useState(false);
    const [, setError] = useState(null);
    const [actividadExpandida, setActividadExpandida] = useState(null);
    const [mantenimientoExpandido, setMantenimientoExpandido] = useState(false);
    const [actividadesState, setActividadesState] = useState(actividades);

    useEffect(() => {
        const interval = setInterval(() => {
            const hayActividadesEnProgreso = actividadesState.some(
                act => act.fecha_inicio && !act.fecha_fin
            );

            if (hayActividadesEnProgreso) {
                setActividadesState(prev => [...prev]);
            }
        }, 60000);

        return () => clearInterval(interval);
    }, [actividadesState]);

    const registrarInicioActividad = async (actividadId) => {
        try {
            setLoading(true);
            const fechaInicio = new Date().toISOString();

            const response = await fetch(`https://backmaincheck.onrender.com/tasks/api/v1/actividades/${actividadId}/inicio-fin/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fecha_inicio: fechaInicio, fecha_fin: null }),
            });

            if (response.ok) {
                setActividadesState(actividadesState.map(act =>
                    act.id === actividadId
                        ? { ...act, fecha_inicio: fechaInicio, fecha_fin: null }
                        : act
                ));
                alert('Inicio de la actividad registrado correctamente.');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al registrar el inicio de la actividad.');
            }
        } catch (error) {
            console.error('Error al registrar el inicio de la actividad:', error);
            setError(error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const registrarFinActividad = async (actividadId) => {
        try {
            setLoading(true);
            const fechaFin = new Date().toISOString();

            const response = await fetch(`https://backmaincheck.onrender.com/tasks/api/v1/actividades/${actividadId}/inicio-fin/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fecha_fin: fechaFin }),
            });

            if (response.ok) {
                setActividadesState(actividadesState.map(act =>
                    act.id === actividadId
                        ? { ...act, fecha_fin: fechaFin }
                        : act
                ));
                alert('Fin de la actividad registrado correctamente.');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al registrar el fin de la actividad.');
            }
        } catch (error) {
            console.error('Error al registrar el fin de la actividad:', error);
            setError(error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    

    const registrarInicio = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://backmaincheck.onrender.com/tasks/api/v1/mantenimientos/${id}/inicio-fin/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fecha_inicio: new Date().toISOString() }),
            });
            if (response.ok) {
                alert('Inicio del mantenimiento registrado correctamente.');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al registrar el inicio del mantenimiento.');
            }
        } catch (error) {
            console.error('Error al registrar el inicio:', error);
            setError(error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    

    const registrarFin = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://backmaincheck.onrender.com/tasks/api/v1/mantenimientos/${id}/inicio-fin/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fecha_fin: new Date().toISOString() }),
            });
            if (response.ok) {
                alert('Fin del mantenimiento registrado correctamente.');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al registrar el fin del mantenimiento.');
            }
        } catch (error) {
            console.error('Error al registrar el fin:', error);
            setError(error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const agregarObservacionMantenimiento = async () => {
        if (!nuevaObservacionMantenimiento.trim()) {
            alert('La observación no puede estar vacía');
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`https://backmaincheck.onrender.com/tasks/api/v1/mantenimientos/${id}/observaciones/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ texto: nuevaObservacionMantenimiento }),
            });

            if (response.ok) {
                const nuevaObservacion = await response.json();
                setObservacionesMantenimiento([...observacionesMantenimiento, nuevaObservacion]);
                setNuevaObservacionMantenimiento('');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al agregar la observación.');
            }
        } catch (error) {
            console.error('Error al agregar la observación:', error);
            setError(error.message);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const editarObservacionMantenimiento = async (observacionId, nuevoTexto) => {
        try {
            setLoading(true);
            const response = await fetch(`https://backmaincheck.onrender.com/tasks/api/v1/observaciones/${observacionId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ texto: nuevoTexto }),
            });

            if (response.ok) {
                const observacionActualizada = await response.json();
                setObservacionesMantenimiento(prevObs =>
                    prevObs.map(obs => obs.id === observacionId ? observacionActualizada : obs)
                );
                setEditandoObservacion(null);
            } else {
                throw new Error('Error al editar la observación.');
            }
        } catch (error) {
            console.error('Error al editar la observación:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const agregarObservacionActividad = async (actividadId) => {
        const nuevaObservacion = observacionesActividades[actividadId] || '';
        if (!nuevaObservacion.trim()) {
            alert('La observación no puede estar vacía');
            return;
        }
        try {
            setLoading(true);
            const response = await fetch(`https://backmaincheck.onrender.com/tasks/api/v1/actividades/${actividadId}/observaciones/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ texto: nuevaObservacion }),
            });

            if (response.ok) {
                const observacionCreada = await response.json();
                setObservacionesActividades(prev => ({
                    ...prev,
                    [actividadId]: '',
                }));
                alert('Observación agregada correctamente.');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al agregar la observación.');
            }
        } catch (error) {
            console.error('Error al agregar la observación:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const editarObservacionActividad = async (actividadId, observacionId, nuevoTexto) => {
        try {
            setLoading(true);
            const response = await fetch(`https://backmaincheck.onrender.com/tasks/api/v1/actividades/${actividadId}/observaciones/${observacionId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ texto: nuevoTexto }),
            });

            if (response.ok) {
                alert('Observación editada correctamente.');
                setEditandoObservacionActividad({ actividadId: null, observacionId: null });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al editar la observación.');
            }
        } catch (error) {
            console.error('Error al editar la observación:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleActividadExpandida = (id) => {
        setActividadExpandida(prevId => (prevId === id ? null : id));
    };

    const toggleMantenimientoExpandido = () => {
        setMantenimientoExpandido(prevState => !prevState);
    };
    

    const renderActividades = () => {
        if (!actividades || !Array.isArray(actividades)) {
            return <p>No hay actividades disponibles</p>;
        }

        return actividades.map((actividad) => {
            const estaExpandida = actividadExpandida === actividad.id;

            return (
                <li key={actividad.id} className="actividad-item">
                    <div className="actividad-header" onClick={() => toggleActividadExpandida(actividad.id)}>
                        <strong>{actividad.nombre}</strong>
                        <span style={{ float: 'right' }}>{estaExpandida ? '▲' : '▼'}</span>
                    </div>

                    {estaExpandida && (
                        <div className="actividad-detalles">
                            <p>Descripción: {actividad.descripcion}</p>
                            <p>Fecha de inicio: {actividad.fecha_inicio ? new Date(actividad.fecha_inicio).toLocaleString() : "No registrada"}</p>
                            <p>Fecha de fin: {actividad.fecha_fin ? new Date(actividad.fecha_fin).toLocaleString() : "No registrada"}</p>
                            <button onClick={() => registrarInicioActividad(actividad.id)} disabled={loading} className="inicio-button">
                                Registrar Inicio de la Actividad
                            </button>
                            <button onClick={() => registrarFinActividad(actividad.id)} disabled={loading} className="fin-button">
                                Registrar Fin de la Actividad
                            </button>
                            <h4>Observaciones:</h4>
                            <ul>
                                {actividad.observaciones?.map((obs) => (
                                    <li key={obs.id}>
                                        {editandoObservacionActividad.actividadId === actividad.id && editandoObservacionActividad.observacionId === obs.id ? (
                                            <>
                                                <input
                                                    type="text"
                                                    value={textoEditable}
                                                    onChange={(e) => setTextoEditable(e.target.value)}
                                                />
                                                <button onClick={() => editarObservacionActividad(actividad.id, obs.id, textoEditable)} className="guardar-button">
                                                    Guardar
                                                </button>
                                                <button onClick={() => {
                                                    setEditandoObservacionActividad({ actividadId: null, observacionId: null });
                                                    setTextoEditable('');
                                                }} className="cancelar-button">
                                                    Cancelar
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {obs.texto}
                                                <button onClick={() => {
                                                    setEditandoObservacionActividad({ actividadId: actividad.id, observacionId: obs.id });
                                                    setTextoEditable(obs.texto);
                                                }} className="editar-button">
                                                    Editar
                                                </button>
                                            </>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <textarea
                                value={observacionesActividades[actividad.id] || ''}
                                onChange={(e) => setObservacionesActividades(prev => ({ ...prev, [actividad.id]: e.target.value }))}
                                placeholder="Agregar nueva observación"
                                disabled={loading}
                            />
                            <button onClick={() => agregarObservacionActividad(actividad.id)} disabled={loading} className="inicio-button">
                                Agregar Observación
                            </button>
                        </div>
                    )}
                </li>
            );
        });
    };

    return (
        <div className="mantenimiento-card">
        <h2>
            <span onClick={toggleMantenimientoExpandido} style={{ cursor: 'pointer' }}>
                {nombre} {mantenimientoExpandido ? '▲' : '▼'}
            </span>
        </h2>
        {mantenimientoExpandido && (
            <>
                <p><strong>Descripción:</strong> {descripcion}</p>
                <p><strong>Estado:</strong> {estado}</p>
                <p><strong>Responsable:</strong> {responsable}</p>
                <p><strong>Fecha de inicio:</strong> {fecha_inicio ? new Date(fecha_inicio).toLocaleString() : "No registrada"}</p>
                <p><strong>Fecha de fin:</strong> {fecha_fin ? new Date(fecha_fin).toLocaleString() : "No registrada"}</p>
    
                <button onClick={registrarInicio} disabled={loading} className="inicio-button">
                    Registrar Inicio del Mantenimiento
                </button>
                <button onClick={registrarFin} disabled={loading} className="fin-button">
                    Registrar Fin del Mantenimiento
                </button>
    
                <h3>Observaciones del mantenimiento:</h3>
                <ul>
                    {observacionesMantenimiento.map((obs) => (
                        <li key={obs.id}>
                            {editandoObservacion === obs.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={textoEditable}
                                        onChange={(e) => setTextoEditable(e.target.value)}
                                    />
                                    <button onClick={() => editarObservacionMantenimiento(obs.id, textoEditable)} className="guardar-button">
                                        Guardar
                                    </button>
                                    <button onClick={() => {
                                        setEditandoObservacion(null);
                                        setTextoEditable('');
                                    }} className="cancelar-button">
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <>
                                    {obs.texto}
                                    <button onClick={() => {
                                        setEditandoObservacion(obs.id);
                                        setTextoEditable(obs.texto);
                                    }} className="editar-button">
                                        Editar
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
    
                <textarea
                    value={nuevaObservacionMantenimiento}
                    onChange={(e) => setNuevaObservacionMantenimiento(e.target.value)}
                    placeholder="Agregar nueva observación"
                    disabled={loading}
                />
                <button onClick={agregarObservacionMantenimiento} disabled={loading} className="inicio-button">
                    Agregar Observación
                </button>
            </>
        )}
    
        <h3>Actividades:</h3>
        <ul className="actividades-list">
            {renderActividades()}
        </ul>

        <div>
    <h2>Progreso en tiempo real</h2>
    <div className="progreso-actividades">
        {actividades.map((actividad) => {
            let estado = "No iniciada";
            let duracion = "";
            let contador = "";

            if (actividad.fecha_inicio) {
                const inicio = new Date(actividad.fecha_inicio);
                
                if (actividad.fecha_fin) {
                    // Actividad finalizada - mostrar duración total
                    const fin = new Date(actividad.fecha_fin);
                    const diffMs = fin - inicio;
                    const minutos = Math.floor(diffMs / 60000);
                    const horas = Math.floor(minutos / 60);
                    const minsRestantes = minutos % 60;
                    
                    duracion = `Duración total: ${horas > 0 ? `${horas}h ` : ''}${minsRestantes}m`;
                    estado = "Finalizada";
                } else {
                    // Actividad en progreso - mostrar contador en tiempo real
                    const ahora = new Date();
                    const diffMs = ahora - inicio;
                    const minutos = Math.floor(diffMs / 60000);
                    const horas = Math.floor(minutos / 60);
                    const minsRestantes = minutos % 60;
                    
                    contador = `Tiempo transcurrido: ${horas > 0 ? `${horas}h ` : ''}${minsRestantes}m`;
                    estado = "En progreso";
                }
            }

            return (
                <div key={actividad.id} className="actividad-progreso">
                    <h4>{actividad.nombre}</h4>
                    <p><strong>Estado:</strong> {estado}</p>
                    
                    {estado === "En progreso" && contador && (
                        <p className="contador-tiempo">{contador}</p>
                    )}
                    
                    {estado === "Finalizada" && duracion && (
                        <p className="duracion-final">{duracion}</p>
                    )}
                    
                    <div className="botones-actividad">
                        {estado !== "En progreso" && (
                            <button 
                                onClick={() => registrarInicioActividad(actividad.id)}
                                disabled={loading}
                                className="inicio-button"
                            >
                                {estado === "Finalizada" ? "Reiniciar Actividad" : "Registrar Inicio"}
                            </button>
                        )}
                        
                        {estado === "En progreso" && (
                            <button 
                                onClick={() => registrarFinActividad(actividad.id)}
                                disabled={loading}
                                className="fin-button"
                            >
                                Registrar Fin
                            </button>
                        )}
                    </div>
                </div>
            );
        })}
    </div>
</div>
    </div>
    
    );
}