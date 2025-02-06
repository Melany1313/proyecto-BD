import  { useEffect, useState } from "react";
import axios from "axios";

const TablaSucursales = () => {
  const [sucursales, setSucursales] = useState([]); // Estado para almacenar las sucursales

  useEffect(() => {
    // Llamada a la API para obtener los datos de la tabla Sucursales
    const obtenerSucursales = async () => {
      try {
        const respuesta = await axios.get("http://localhost:5000/api/sucursales"); 
        setSucursales(respuesta.data);
      } catch (error) {
        console.error("Error al obtener las sucursales:", error);
      }
    };

    obtenerSucursales();
  }, []);

  return (
    <div className="gestion-sucursales">
      <table className="tabla-sucursales">
        <thead>
          <tr>
            <th>ID Sucursal</th>
            <th>Nombre</th>
            <th>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {sucursales.length > 0 ? (
            sucursales.map((sucursal) => (
              <tr key={sucursal.id_sucursal}>
                <td>{sucursal.id_sucursal}</td>
                <td>{sucursal.nombre}</td>
                <td>{sucursal.ubicacion}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay sucursales disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaSucursales;