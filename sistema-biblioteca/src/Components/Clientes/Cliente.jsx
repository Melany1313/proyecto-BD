import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { eliminarCliente } from '../../Api/Api'; // Importamos la función de eliminación

const TablaClientes = () => {
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const respuesta = await axios.get("http://localhost:5000/api/clientes");
        setClientes(respuesta.data);
      } catch (error) {
        console.error("Error al obtener los clientes:", error);
      }
    };

    obtenerClientes();
  }, []);

  const handleEliminarCliente = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        await eliminarCliente(id);
        setClientes(clientes.filter((cliente) => cliente.id_cliente !== id));
      } catch (error) {
        console.error("Error al eliminar el cliente:", error);
      }
    }
  };

  return (
    <div className="gestion-clientes">
      <table className="tabla-clientes">
        <thead>
          <tr>
            <th>ID Cliente</th>
            <th>ID Sucursal</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <tr key={cliente.id_cliente}>
                <td>{cliente.id_cliente}</td>
                <td>{cliente.id_sucursal}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.telefono}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleEliminarCliente(cliente.id_cliente)}
                  >
                    <Trash2 size={20} color="red" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay clientes disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaClientes;
