import { useState } from 'react';
import '../App.css';

export function MantenimientoFormPage() {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);

    const validateDates = (mantenimiento) => {
        if (new Date(mantenimiento.fecha_inicio) >= new Date(mantenimiento.fecha_fin)) {
            return `Error en mantenimiento "${mantenimiento.nombre}": La fecha de inicio debe ser anterior a la fecha de fin`;
        }
        if (mantenimiento.actividades && mantenimiento.actividades.length > 0) {
            for (const actividad of mantenimiento.actividades) {
                if (!actividad.fecha_inicio || !actividad.fecha_fin) continue;

                const actividadInicio = new Date(actividad.fecha_inicio);
                const actividadFin = new Date(actividad.fecha_fin);
                const mantenimientoInicio = new Date(mantenimiento.fecha_inicio);
                const mantenimientoFin = new Date(mantenimiento.fecha_fin);

                if (actividadInicio >= actividadFin) {
                    return `Error en actividad "${actividad.nombre}": La fecha de inicio debe ser anterior a la fecha de fin`;
                }
                if (actividadInicio < mantenimientoInicio) {
                    return `Error en actividad "${actividad.nombre}": No puede comenzar antes que el mantenimiento`;
                }
                if (actividadFin > mantenimientoFin) {
                    return `Error en actividad "${actividad.nombre}": No puede terminar después que el mantenimiento`;
                }
            }
        }

        return null;
    };

    const validateMantenimientos = (mantenimientos) => {
        if (!Array.isArray(mantenimientos)) {
            return "El archivo debe contener un array de mantenimientos";
        }

        for (const mantenimiento of mantenimientos) {
            if (!mantenimiento.nombre || !mantenimiento.fecha_inicio || !mantenimiento.fecha_fin) {
                return `Error en mantenimiento: Faltan campos requeridos (nombre, fecha_inicio, fecha_fin)`;
            }

            const dateError = validateDates(mantenimiento);
            if (dateError) return dateError;
        }

        return null;
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError(null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (!file) {
            setError("Por favor, selecciona un archivo.");
            return;
        }
    
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = JSON.parse(e.target.result);
                const validationError = validateMantenimientos(data);
                if (validationError) {
                    setError(validationError);
                    return;
                }

                const response = await fetch('http://localhost:8000/tasks/api/v1/mantenimientos/cargar/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
    
                if (response.ok) {
                    alert("Mantenimientos cargados exitosamente.");
                } else {
                    const errorData = await response.json();
                    console.error("Errores del backend:", errorData);
                    setError(errorData.error || "Error al cargar los mantenimientos");
                }
            } catch (error) {
                console.error("Error al procesar el archivo:", error);
                setError("El archivo no tiene un formato JSON válido");
            }
        };
    
        reader.readAsText(file);
    };

    return (
        <div className="container">
            <h1 className="title">Cargar Carta Gantt</h1>
            {error && (
                <div className="error">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="input-file"
                />
                <button type="submit" disabled={!file} className="submit-button">
                    Cargar
                </button>
            </form>
        </div>
    );
}
