import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react"; // Importa el icono de la papelera
import { eliminarEmpleado } from "../../Api/Api";

const TablaEmpleados = () => {
  const [empleados, setEmpleados] = useState([]); // Estado para almacenar los empleados

  // Función para obtener los empleados desde la API
  useEffect(() => {
    const obtenerEmpleados = async () => {
      try {
        const respuesta = await axios.get("http://localhost:5000/api/empleados");
        setEmpleados(respuesta.data); // Almacena los datos en el estado
      } catch (error) {
        console.error("Error al obtener los empleados:", error);
      }
    };

    obtenerEmpleados();
  }, []);

  // Función para eliminar un empleado
  const handleEliminarEmpleado = async (id_empleado) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      try {
        await eliminarEmpleado(id_empleado); // Aquí llamas a la función para eliminar el empleado
        console.log("Empleado eliminado con éxito");
        setEmpleados(empleados.filter((empleado) => empleado.id_empleado !== id_empleado)); // Filtras el empleado eliminado
      } catch (error) {
        console.error("Error al eliminar el empleado:", error);
      }
    }
  };
  
  return (
    <div className="gestion-empleados">
      <table className="tabla-empleados">
        <thead>
          <tr>
            <th>ID Empleado</th>
            <th>Nombre</th>
            <th>Salario</th>
            <th>ID Sucursal</th>
            <th>Acciones</th> {/* Columna para las acciones (eliminar) */}
          </tr>
        </thead>
        <tbody>
          {empleados.length > 0 ? (
            empleados.map((empleado) => (
              <tr key={empleado.id_empleado}>
                <td>{empleado.id_empleado}</td>
                <td>{empleado.nombre}</td>
                <td>{empleado.salario}</td>
                <td>{empleado.id_sucursal}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleEliminarEmpleado(empleado.id_empleado)} // Llamada a la función para eliminar
                  >
                    <Trash2 size={20} /> {/* Icono de la papelera */}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No hay empleados disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaEmpleados;
