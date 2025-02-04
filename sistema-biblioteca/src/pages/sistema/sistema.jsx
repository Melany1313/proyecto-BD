import React, { useState } from 'react';
import './sistema.css';
import TablaLibros from '../../Components/Libros/libros';
import TablaClientes from '../../Components/Clientes/Cliente';
import TablaSucursales from '../../Components/Sucursal/Sucursales';
import TablaEmpleados from '../../Components/Empleados/Empleados';
import TablaVentas from '../../Components/Venta/Venta';
import TablaStock from '../../Components/Stock/Stock';
import TablaSuministro from '../../Components/Suministro/Suministro';
import TablaProveedor from '../../Components/Proveedor/Proveedor';
import { handleAddLibros, handleAddClientes, handleAddEmpleados, handleAddProveedores, handleAddVentas } from '../../Api/Api';
import { Trash2 } from "lucide-react"; // Importamos el icono de basurero

const Sistema = () => {
  const [activeSection, setActiveSection] = useState('Libros');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  
  

// Estados para nuevos registros
  const [newBook, setNewBook] = useState({ isbn: '', titulo: '', autor: '', precio: '' });
  const [newClient, setNewClient] = useState({ idSucursal: '', nombre: '', telefono: '' });
  const [newEmployee, setNewEmployee] = useState({ nombre: '', idSucursal: '' ,salario: ''});
  const [newProvider, setNewProvider] = useState({nombre: '',contacto: '',telefono: ''});
  const [newSale, setNewSale] = useState({ fechaVenta: '', id_empleado: '', id_cliente: '', isbn: '', cantidad: '', precioUnitario: '', total: '' });
  const [libros, setLibros] = useState([]); // Estado dinámico para libros
  const [clientes, setClientes] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [ventas, setVentas] = useState([]); 
  const [stock, setStock] = useState([]);
  const [suministros, setSuministros] = useState([]); 
  const [proveedores, setProveedores] = useState([]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);
  

  const handleSubmitBook = async () => {
    await handleAddLibros(newBook);
    setShowBookModal(false);
  };

  const handleSubmitClient = async () => {
    await handleAddClientes(newClient);
    setShowClientModal(false);
  };

  const handleSubmitEmployee = async () => {
    await handleAddEmpleados(newEmployee);
    setShowEmployeeModal(false);
  };

  const handleSubmitProvider = async () => {
    await handleAddProveedores(newProvider);
    setShowProviderModal(false);
  };

  const handleSubmitSale = async () => {
    await handleAddVentas(newSale);
    setShowSaleModal(false);  
  };
  

  const renderSection = () => {
    switch (activeSection) {
      case 'Libros':
        return (
          <div className="management-section">
            <h2>Gestión de Libros</h2>
              <button className="new-book-button" onClick={() => setShowBookModal(true)}>
                Nuevo Libro
              </button>
            <div className="table-container">
              <table>
                
                <tbody>
                
                  {libros.map((libro) => (
                    <tr key={libro.isbn}>
                      <td>{libro.isbn}</td>
                      <td>{libro.titulo}</td>
                      <td>{libro.autor}</td>
                      <td>{libro.precio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
           
            <TablaLibros />

          </div>
        );

        
        case 'Clientes':
          return (
            <div className="management-section">
              <h2>Gestión de Clientes</h2>
              <div className="search-section">
                <button className="new-book-button" onClick={() => setShowClientModal(true)}>
                  Nuevo Cliente
                </button>
              </div>
              <div className="table-container">
              </div>
              
              <TablaClientes />
            </div>
          );

      case 'Sucursales':
        return (
          <div className="management-section">
            <h2>Gestión de Sucursales</h2>
            <div className="table-container">
            </div>
            <TablaSucursales />
          </div>
        );

        case 'Empleado':
          return (
            <div className="management-section">
              <h2>Gestión de Empleados</h2>
                <button className="new-book-button" onClick={() => setShowEmployeeModal(true)}>
                  Nuevo Empleado
                </button>
              <div className="table-container">
              </div>
              
              <TablaEmpleados />
            </div>
          );

      case 'Venta':
        return (
          <div className="management-section">
            <h2>Gestión de Ventas</h2>
            <button className="new-sale-button" onClick={() => setShowSaleModal(true)}>
            Nueva Venta
            </button>

            <div className="table-container">
            </div>
            <TablaVentas />
          </div>
        );

      case 'Stock':
        return (
          <div className="management-section">
            <h2>Gestión de Stock</h2>
            <div className="table-container">
            </div>
            <TablaStock />
          </div>
        );
      case 'Suministro':
        return (
          <div className="management-section">
            <h2>Gestión de Suministros</h2>
            <div className="table-container">
            </div>
            <TablaSuministro />
          </div>
        );
        case 'Proveedor':
          return (
            <div className="management-section">
              <h2>Gestión de Proveedores</h2>
              <div className="search-section">
                <button className="new-provider-button" onClick={() => setShowProviderModal(true)}>
                  Nuevo Proveedor
                </button>
              </div>
              <div className="table-container">
    
              </div>
              
              <TablaProveedor />
            </div>
          );
        
      default:
        return <p>Sección no encontrada.</p>;
    }
  };

  return (
    <div className="library-container">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo"></div>
            <h1>LIBRERIA BIBLIOCÓSMICA</h1>
            {successMessage && <div className="success-message">{successMessage}</div>}

          </div>
          
        </div>
        
      </div>
      

      {/* Navigation */}
      <div className="navigation">
        <nav className="nav-content">
          <button className="nav-button" onClick={() => setActiveSection('Libros')}>📚 Libros</button>
          <button className="nav-button" onClick={() => setActiveSection('Clientes')}>👥 Clientes</button>
          <button className="nav-button" onClick={() => setActiveSection('Sucursales')}>🏠 Sucursales</button>
          <button className="nav-button" onClick={() => setActiveSection('Empleado')}>👨‍💼 Empleados</button>
          <button className="nav-button" onClick={() => setActiveSection('Venta')}>💵 Ventas</button>
          <button className="nav-button" onClick={() => setActiveSection('Stock')}>📦 Stock</button>
          <button className="nav-button" onClick={() => setActiveSection('Suministro')}>🚚 Suministros</button>
          <button className="nav-button" onClick={() => setActiveSection('Proveedor')}>🛒 Proveedores</button>
        </nav>
      </div>
      

      {/* Main Section */}
      {renderSection()}

      {/* Modales */}
      {showBookModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Nuevo Libro</h3>
            <input type="text" placeholder="ISBN" onChange={(e) => setNewBook({...newBook, isbn: e.target.value})} />
            <input type="text" placeholder="Título" onChange={(e) => setNewBook({...newBook, titulo: e.target.value})} />
            <input type="text" placeholder="Autor" onChange={(e) => setNewBook({...newBook, autor: e.target.value})} />
            <input type="text" placeholder="Precio" onChange={(e) => setNewBook({...newBook, precio: e.target.value})} />
            <button onClick={handleSubmitBook}>Agregar</button>
            <button onClick={() => setShowBookModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
      {showClientModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Nuevo Cliente</h3>
           
            <input type="text" placeholder="ID Sucursal" onChange={(e) => setNewClient({...newClient, id_sucursal: e.target.value})} />
            <input type="text" placeholder="Nombre" onChange={(e) => setNewClient({...newClient, nombre: e.target.value})} />
            <input type="text" placeholder="Teléfono" onChange={(e) => setNewClient({...newClient, telefono: e.target.value})} />
            <button onClick={handleSubmitClient}>Agregar</button>
            <button onClick={() => setShowClientModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
      {showEmployeeModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Nuevo Empleado</h3>
             <input type="text" placeholder="ID Sucursal" onChange={(e) => setNewEmployee({...newEmployee, idSucursal: e.target.value})} />
            <input type="text" placeholder="salario" onChange={(e) => setNewEmployee({...newEmployee, salario: e.target.value})} />
            <input type="text" placeholder="Nombre" onChange={(e) => setNewEmployee({...newEmployee, nombre: e.target.value})} />
            
            <button onClick={handleSubmitEmployee}>Agregar</button>
            <button onClick={() => setShowEmployeeModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
      {showProviderModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Nuevo Proveedor</h3>

            
            <input type="text" placeholder="Nombre" onChange={(e) => setNewProvider({...newProvider, nombre: e.target.value})} />
            <input type="text" placeholder="Contacto" onChange={(e) => setNewProvider({...newProvider, contacto: e.target.value})} />
            <button onClick={handleSubmitProvider}>Agregar</button>
            <button onClick={() => setShowProviderModal(false)}>Cancelar</button>
          </div>
        </div>
      )}
     {showSaleModal && (
  <div className="modal">
    <div className="modal-content">
      <h3>Nueva Venta</h3>
      
      <input 
        type="date" 
        onChange={(e) => setNewSale({ ...newSale, fechaVenta: e.target.value })} 
      />
      <input 
        type="text" 
        placeholder="ID Empleado" 
        onChange={(e) => setNewSale({ ...newSale, id_empleado: e.target.value })} // Cambié a id_empleado
      />
      <input 
        type="text" 
        placeholder="ID Cliente" 
        onChange={(e) => setNewSale({ ...newSale, id_cliente: e.target.value })} // Cambié a id_cliente
      />
      <input 
        type="text" 
        placeholder="ISBN Libro" 
        onChange={(e) => setNewSale({ ...newSale, isbn: e.target.value })} 
      />
      <input 
        type="number" 
        placeholder="Cantidad" 
        onChange={(e) => setNewSale({ ...newSale, cantidad: e.target.value })} 
      />
      <input 
        type="number" 
        placeholder="Precio Unitario" 
        onChange={(e) => setNewSale({ ...newSale, precioUnitario: e.target.value })} 
      />
      <input 
        type="number" 
        placeholder="Subtotal" 
        onChange={(e) => setNewSale({ ...newSale, subtotal: e.target.value })} 
      />
      <input 
        type="number" 
        placeholder="Total" 
        onChange={(e) => setNewSale({ ...newSale, total: e.target.value })} 
      />
      
      <button onClick={handleSubmitSale}>Agregar Venta</button>
      <button onClick={() => setShowSaleModal(false)}>Cancelar</button>
    </div>
  </div>
)}
    </div>
  );
};

export default Sistema;

