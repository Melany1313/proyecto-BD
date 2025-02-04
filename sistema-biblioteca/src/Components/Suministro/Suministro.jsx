import React, { useEffect, useState } from "react";
import axios from "axios";

const TablaSuministro = () => {
  const [suministros, setSuministros] = useState([]); // Estado para almacenar los suministros

  useEffect(() => {
    // Llamada a la API para obtener los datos de suministro
    const obtenerSuministros = async () => {
      try {
        const respuesta = await axios.get("http://localhost:5000/api/suministros");
        setSuministros(respuesta.data); // Almacena los datos en el estado
      } catch (error) {
        console.error("Error al obtener los suministros:", error);
      }
    };

    obtenerSuministros();
  }, []);

  return (
    <div className="gestion-suministros">
      <table className="tabla-suministros">
        <thead>
          <tr>
            <th>ID Proveedor</th>
            <th>ID Sucursal</th>
            <th>ISBN</th>
            <th>Cantidad</th>
            <th>Fecha Suministro</th>
          </tr>
        </thead>
        <tbody>
          {suministros.map((suministro) => (
            <tr key={`${suministro.id_proveedor}-${suministro.isbn}`}>
              <td>{suministro.id_proveedor}</td>
              <td>{suministro.id_sucursal}</td>
              <td>{suministro.isbn}</td>
              <td>{suministro.cantidad}</td>
              <td>{new Date(suministro.fecha_suministro).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaSuministro;
