import { useEffect, useState } from 'react';
import { MantenimientoCard } from './MantenimientoCard';

export function ListaMantenimiento() {
    const [mantenimientos, setMantenimientos] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMantenimientos() {
            try {
                const response = await fetch('http://localhost:8000/tasks/api/v1/mantenimiento/');
                if (!response.ok) {
                    throw new Error('Error al obtener los mantenimientos');
                }
                const data = await response.json();
                setMantenimientos(data);
            } catch (error) {
                setError(error.message);
            }
        }

        fetchMantenimientos();
    }, []);

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!mantenimientos.length) {
        return <p>Cargando mantenimientos...</p>;
    }

    return (
        <div>
            {mantenimientos.map((mantenimiento) => (
                <MantenimientoCard key={mantenimiento.id} {...mantenimiento} />
            ))}
        </div>
    );
}