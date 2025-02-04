import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react"; // Icono de la papelera

const TablaStock = () => {
  const [stock, setStock] = useState([]); // Estado para almacenar el stock

  useEffect(() => {
    // Llamada a la API para obtener los datos de stock
    const obtenerStock = async () => {
      try {
        const respuesta = await axios.get("http://localhost:5000/api/stock");
        setStock(respuesta.data); // Almacena los datos en el estado
      } catch (error) {
        console.error("Error al obtener el stock:", error);
      }
    };

    obtenerStock();
  }, []);

  // Función para eliminar un registro de stock
  const handleEliminar = async (id_sucursal, isbn) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este registro de stock?")) {
      try {
        // Realizar la eliminación de stock aquí
        const response = await axios.delete(`http://localhost:5000/api/stock/${id_sucursal}/${isbn}`);
        setStock(stock.filter((registro) => registro.id_sucursal !== id_sucursal || registro.isbn !== isbn)); // Elimina el registro de la lista
        console.log("Registro eliminado con éxito");
      } catch (error) {
        console.error("Error al eliminar el registro de stock:", error);
      }
    }
  };

  return (
    <div className="gestion-stock">
      <table className="tabla-stock">
        <thead>
          <tr>
            <th>ID Sucursal</th>
            <th>ISBN</th>
            <th>Cantidad</th>
            <th>Acciones</th> {/* Columna para las acciones (eliminar) */}
          </tr>
        </thead>
        <tbody>
          {stock.map((registro) => (
            <tr key={`${registro.id_sucursal}-${registro.isbn}`}>
              <td>{registro.id_sucursal}</td>
              <td>{registro.isbn}</td>
              <td>{registro.cantidad}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleEliminar(registro.id_sucursal, registro.isbn)} // Llamada a la función para eliminar
                >
                  <Trash2 size={20} /> {/* Icono de la papelera */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaStock;
