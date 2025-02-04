import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { eliminarLibro } from "../../Api/Api"; // Asegúrate de importar la función eliminarLibro


const TablaLibros = () => {
  const [libros, setLibros] = useState([]); // Estado para almacenar los libros

  // Función para obtener los libros desde la API
  useEffect(() => {
    const obtenerLibros = async () => {
      try {
        const respuesta = await axios.get("http://localhost:5000/api/libros");
        setLibros(respuesta.data); // Almacena los datos en el estado
      } catch (error) {
        console.error("Error al obtener los libros:", error);
      }
    };

    obtenerLibros();
  }, []);

  // Función para eliminar un libro
  const handleEliminarLibro = async (isbn) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este libro?")) {
      try {
        console.log("Eliminando libro con ISBN:", isbn);
        await eliminarLibro(isbn);
        console.log("Libro eliminado con éxito");
        setLibros(libros.filter((libro) => libro.isbn !== isbn));
      } catch (error) {
        console.error("Error al eliminar el libro:", error);
      }
    }
  };


 
  return (
    <div className="gestion-libros">
      <table className="tabla-libros">
        <thead>
          <tr>
            <th>ISBN</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Precio</th>
            
            <th>Acciones</th> {/* Columna para vender y eliminar */}
          </tr>
        </thead>
        <tbody>
          {libros.length > 0 ? (
            libros.map((libro) => (
              <tr key={libro.isbn}>
                <td>{libro.isbn}</td>
                <td>{libro.titulo}</td>
                <td>{libro.autor}</td>
                <td>${libro.precio.toFixed(2)}</td>
                
                <td>
                
                  {/* Botón para eliminar */}
                  <button
                    className="delete-button"
                    onClick={() => handleEliminarLibro(libro.isbn)}
                  >
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay libros disponibles.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaLibros;
