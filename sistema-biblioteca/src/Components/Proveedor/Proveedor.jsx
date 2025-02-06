import  { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import {eliminarProveedor} from "../../Api/Api";// Asegúrate de importar la función eliminarProveedor

const TablaProveedor = () => {
  const [proveedores, setProveedores] = useState([]); // Estado para almacenar los proveedores

  // Función para obtener los proveedores desde la API
  useEffect(() => {
    const obtenerProveedores = async () => {
      try {
        const respuesta = await axios.get("http://localhost:5000/api/proveedores");
        setProveedores(respuesta.data); // Almacena los datos en el estado
      } catch (error) {
        console.error("Error al obtener los proveedores:", error);
      }
    };

    obtenerProveedores();
  }, []);

// Función para eliminar un proveedor
const handleEliminarProveedor = async (id) => {
  if (window.confirm("¿Estás seguro de que deseas eliminar este proveedor?")) {
    try {
      await eliminarProveedor(id);
      setProveedores(proveedores.filter((proveedor) => proveedor.id_proveedor !== id));
    } catch (error) {
      console.error("Error al eliminar el proveedor:", error);
    }
  }
};

  return (
    <div className="gestion-proveedores">
      <table className="tabla-proveedores">
        <thead>
          <tr>
            <th>ID Proveedor</th>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Acciones</th> {/* Columna para las acciones (eliminar) */}
          </tr>
        </thead>
        <tbody>
          {proveedores.length > 0 ? (
            proveedores.map((proveedor) => (
              <tr key={proveedor.id_proveedor}>
                <td>{proveedor.id_proveedor}</td>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.contacto}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleEliminarProveedor(proveedor.id_proveedor)} // Llamada a la función handleEliminarProveedor
                  >
                    <Trash2 size={20} /> {/* Icono de la papelera */}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay proveedores disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaProveedor;
