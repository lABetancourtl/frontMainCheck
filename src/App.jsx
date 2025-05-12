import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MantenimientoPage } from './pages/MantenimientoPage';
import { MantenimientoFormPage } from './pages/MantenimientoFormPage';
import { ActividadPage } from './pages/ActividadPage';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/mantenimiento" element={<MantenimientoPage />} />
        <Route path="/mantenimiento-create" element={<MantenimientoFormPage />} />
        <Route path="/actividad" element={<ActividadPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;