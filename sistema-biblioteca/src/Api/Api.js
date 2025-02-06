import axios from 'axios';

const API_URL = 'http://localhost:5000/api/';

// Función para obtener libros
export const getLibros = async () => {
  try {
    const response = await axios.get(`${API_URL}libros`); // Obtiene todos los libros
    return response.data;
  } catch (error) {
    console.error("Error al obtener los libros:", error.response ? error.response.data : error.message);
    throw error;
  }
};


// Función para agregar un libro
export const handleAddLibros = async (libro) => {
  // Validar datos antes de enviar
  const { isbn, titulo, autor, precio } = libro;
  if (!isbn || !titulo || !autor || !precio) {
    throw new Error('Todos los campos son obligatorios.');
  }

  // Verificar formato de ISBN
  const isbnPattern = /^[0-9]{13}$/;  // ISBN de 13 dígitos numéricos
  if (!isbnPattern.test(isbn)) {
    throw new Error('El ISBN debe ser de 13 dígitos numéricos.');
  }

  try {
    const response = await axios.post(`${API_URL}libros`, libro);
    return response.data;
  } catch (error) {
    console.error('Error al agregar el libro:', error.response ? error.response.data : error.message);
    throw error;
  }
};


// Función para eliminar un libro
export const eliminarLibro = async (isbn) => {
  if (!isbn || !/^[0-9]{13}$/.test(isbn)) {
    throw new Error('El ISBN debe ser de 13 dígitos numéricos para eliminar un libro.');
  }

  try {
    const response = await axios.delete(`${API_URL}libros/${isbn}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el libro:", error.response ? error.response.data : error.message);
    throw error;
  }
};

//CLIENTE-------------------------------------------------------------------------------

// Función para obtener clientes de Quito
export const getClientes = async () => {
  try {
    const response = await axios.get(`${API_URL}clientes`); // Obtiene clientes de Quito
    return response.data;
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    throw error;
  }
};

// Función para agregar un cliente (opcional, si es necesario)
export const handleAddClientes = async (cliente) => {
  // Validar los datos del cliente antes de enviarlos
  if (!cliente.idSucursal || cliente.idSucursal.length !== 4) {
    console.error("El ID de sucursal debe tener exactamente 4 caracteres.");
    return;
  }

  if (!cliente.nombre || !cliente.telefono) {
    console.error("El nombre y teléfono son obligatorios.");
    return;
  }

  try {
    const response = await axios.post(`${API_URL}clientes`, cliente);
    console.log("cliente agregado:", cliente);
    return response.data;
  } catch (error) {
    console.error("Error al agregar el cliente:", error);
    throw error;
  }
};


//funcion para eliminar 
export const eliminarCliente = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}clientes/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
    throw error;
  }
};


// Función para obtener todas las sucursales
export const getSucursales = async () => {
  try {
    const response = await axios.get(`${API_URL}sucursales`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las sucursales:", error);
    throw error;
  }
};

// Función para agregar una nueva sucursal
export const handleAddSucursales = async (sucursal) => {
  try {
    const response = await axios.post(`${API_URL}sucursales`, sucursal);
    return response.data;
  } catch (error) {
    console.error("Error al agregar la sucursal:", error);
    throw error;
  }
};

// Función para obtener todos los empleados
export const getEmpleados = async () => {
  try {
    const response = await axios.get(`${API_URL}empleados`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los empleados:", error);
    throw error;
  }
};

// Función para agregar un nuevo empleado
export const handleAddEmpleados = async (empleado) => {
  try {
    const response = await axios.post(`${API_URL}empleados`, empleado);
    return response.data;
  } catch (error) {
    console.error("Error al agregar el empleado:", error);
    throw error;
  }
};

// Función para eliminar un empleado
export const eliminarEmpleado = async (id) => {
  try {
    // Realiza la solicitud DELETE a la API
    await axios.delete(`${API_URL}empleados/${id}`);
  } catch (error) {
    console.error("Error al eliminar el empleado:", error);
    throw error; // Lanza el error para manejarlo en el componente
  }
};

// Función para obtener todas las ventas
export const getVentas = async () => {
  try {
    const response = await axios.get(`${API_URL}ventas`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    throw error;
  }
};

// Función para agregar una nueva venta
export const handleAddVentas = async (venta) => {
  try {
    const response = await axios.post(`${API_URL}ventas`, venta);
    return response.data;
  } catch (error) {
    console.error("Error al agregar la venta:", error);
    throw error;
  }
};

// Función para eliminar una venta
export const handleEliminarVenta = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}ventas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar la venta:", error);
    throw error;
  }
};


// Función para obtener el stock
export const getStock = async () => {
  try {
    const response = await axios.get(`${API_URL}stock`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el stock:", error);
    throw error;
  }
};

// Función para eliminar un registro de stock
export const handleEliminarStock = async (id_sucursal, isbn) => {
  try {
    const response = await axios.delete(`${API_URL}stock/${id_sucursal}/${isbn}`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar el registro de stock:", error);
    throw error;
  }
};

//SUMINISTRO-------------------------------------------------------------------------------

// Función para obtener los suministros
export const getSuministros = async () => {
  try {
    const response = await axios.get(`${API_URL}suministros`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los suministros:", error);
    throw error;
  }
};


// Función para agregar un nuevo registro de suministro
export const handleAddSuministros = async (suministro) => {
  try {
    const response = await axios.post(`${API_URL}suministros`, suministro);
    return response.data;
  } catch (error) {
    console.error("Error al agregar el suministro:", error);
    throw error;
  }
};


//PROVEEDORES------------------------------------------------------------------------

// Función para obtener los proveedores
export const getProveedores = async () => {
  try {
    const response = await axios.get(`${API_URL}proveedores`);  // URL de la API para obtener proveedores
    return response.data;  // Retorna los proveedores obtenidos
  } catch (error) {
    console.error("Error al obtener los proveedores:", error);
    throw error;  // Lanza el error para ser manejado en el componente o lugar donde se llame
  }
};


// Función para agregar un nuevo proveedor
export const handleAddProveedores = async (proveedor) => {
  try {
    const response = await axios.post(`${API_URL}proveedores`, proveedor);  // Enviar datos del proveedor
    return response.data;  // Devuelve la respuesta de la API, usualmente un mensaje de éxito
  } catch (error) {
    console.error("Error al agregar el proveedor:", error);
    throw error;  // Lanza el error para manejo posterior
  }
};


// Función para eliminar un proveedor
export const eliminarProveedor = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}proveedores/${id}`);  // Eliminar proveedor por ID
    return response.data;  // Devuelve el mensaje de éxito al eliminar
  } catch (error) {
    console.error("Error al eliminar el proveedor:", error);
    throw error;  // Lanza el error para ser manejado en el componente o lugar donde se llame
  }
};







