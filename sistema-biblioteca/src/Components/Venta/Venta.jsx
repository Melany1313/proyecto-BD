import  { useEffect, useState } from "react";
import axios from "axios";
import { format } from 'date-fns'; // Para formatear la fecha
import { Trash2 } from "lucide-react"; // Importa el icono de la papelera
import { handleEliminarVenta } from "../../Api/Api";


const TablaVentas = () => {
  const [ventas, setVentas] = useState([]); // Estado para almacenar las ventas
  const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos

  useEffect(() => {
    // Llamada a la API para obtener los datos de la tabla Ventas
    const obtenerVentas = async () => {
      try {
        const respuesta = await axios.get("http://localhost:5000/api/ventas");
        setVentas(respuesta.data);
      } catch (error) {
        console.error("Error al obtener las ventas:", error);
      } finally {
        setLoading(false); // Marcar como cargado
      }
    };

    obtenerVentas();
  }, []);

  // Función para eliminar una venta
  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta venta?")) {
      try {
        await handleEliminarVenta(id);
        setVentas(ventas.filter((venta) => venta.id_venta !== id)); // Elimina la venta de la lista
        console.log("Venta eliminada con éxito");
      } catch (error) {
        console.error("Error al eliminar la venta:", error);
      }
    }
  };

  // Mostrar mensaje de carga mientras se obtienen los datos
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="gestion-ventas">
      <table className="tabla-ventas">
        <thead>
          <tr>
            <th scope="col">ID Venta</th>
            <th scope="col">Fecha Venta</th>
            <th scope="col">ID Empleado</th>
            <th scope="col">ID Cliente</th>
            <th scope="col">ISBN</th>
            <th scope="col">Cantidad</th>
            <th scope="col">Precio Unitario</th>
            <th scope="col">Subtotal</th>
            <th scope="col">Total</th>
            <th scope="col">Acciones</th> {/* Columna para las acciones (eliminar) */}
          </tr>
        </thead>
        <tbody>
          {ventas.length > 0 ? (
            ventas.map((venta) => (
              <tr key={venta.id_venta}>
                <td>{venta.id_venta}</td>
                <td>{format(new Date(venta.fechaVenta), 'dd/MM/yyyy HH:mm')}</td>
                <td>{venta.id_empleado}</td>
                <td>{venta.id_cliente}</td>
                <td>{venta.isbn}</td>
                <td>{venta.cantidad}</td>
                <td>{venta.precioUnitario}</td>
                <td>{venta.subtotal}</td>
                <td>{venta.total}</td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => handleEliminar(venta.id_venta)} // Llamada a la función para eliminar
                  >
                    <Trash2 size={20} /> {/* Icono de la papelera */}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No hay ventas disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaVentas;
