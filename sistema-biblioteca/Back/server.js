require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Configuración actualizada para SQL Server
const dbConfig = {
    user: process.env.DB_USER,           // Usuario
    password: process.env.DB_PASSWORD,   // Contraseña
    server: process.env.DB_SERVER.split("\\")[0],  // Nombre del servidor (sin instancia)
    database: process.env.DB_NAME,       // Base de datos
    options: {
        encrypt: false,                // Desactiva el cifrado (puedes ponerlo a true si lo necesitas)
        trustServerCertificate: true,  // Evitar problemas con certificados en desarrollo
        enableArithAbort: true,        // Habilitar abortos aritméticos en caso de errores
    }
};
// Mejorar el manejo de la conexión
const connectDB = async () => {
    try {
      await sql.connect(dbConfig);
      console.log('✅ Conectado exitosamente a SQL Server');
      console.log(`Servidor: ${process.env.DB_SERVER}`);
      console.log(`Base de datos: ${process.env.DB_NAME}`);
    } catch (err) {
      console.log('❌ Error de conexión:');
      console.log('Detalles de configuración:');
      console.log('Servidor:', process.env.DB_SERVER);
      console.log('Base de datos:', process.env.DB_NAME);
      console.log('Error completo:', err);
      process.exit(1); // Detener la aplicación si no puede conectarse
    }
  };

  // Conectar a la base de datos
connectDB();


//LIBRO-----------------------------------------------------
// Ruta para obtener todos los libros desde la base de datos
app.get('/api/libros', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Libro`;  // Asegúrate de que la tabla se llama "Libro" en la base de datos
    res.json(result.recordset);  // Devuelve los libros como respuesta
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los libros", details: err.message });  // Mejor manejo de errores
  }
});

  
app.post('/api/libros', async (req, res) => {
  const { isbn, titulo, autor, precio } = req.body;

  // Validación de los datos
  if (!isbn || !titulo || !autor || !precio) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  // Asegúrate de que el ISBN tenga el formato correcto
  const isbnPattern = /^[0-9]{13}$/;  // ISBN de 13 dígitos numéricos
  if (!isbnPattern.test(isbn)) {
    return res.status(400).json({ error: 'El ISBN debe ser de 13 dígitos numéricos' });
  }

  try {
    const pool = await sql.connect(dbConfig);

    // Insertar libro en la base de datos
    await pool.request()
      .input('isbn', sql.NVarChar, isbn)
      .input('titulo', sql.NVarChar, titulo)
      .input('autor', sql.NVarChar, autor)
      .input('precio', sql.Decimal(10, 2), precio)  // Usar Decimal para coincidir con el tipo de la base de datos
      .query('INSERT INTO Libro (isbn, titulo, autor, precio) VALUES (@isbn, @titulo, @autor, @precio)');
    
    res.status(201).json({ message: 'Libro agregado correctamente' });
  } catch (error) {
    console.error('Error al agregar libro:', error);
    res.status(500).json({ error: 'Error al agregar libro' });
  }
});



  // Ruta para eliminar un libro
  app.delete('/api/libros/:isbn', async (req, res) => {
    const { isbn } = req.params;
  
    try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
        .input('isbn', sql.NVarChar, isbn)
        .query('DELETE FROM Libro WHERE isbn = @isbn');
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ error: 'Libro no encontrado' });
      }
  
      res.status(200).json({ message: 'Libro eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar libro:', error);
      res.status(500).json({ error: 'Error al eliminar el libro', details: error.message });
    }
  });
  


  
  

// RUTAS PARA CLIENTES-----------------------------------------

app.get('/api/clientes', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Cliente`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});



app.post('/clientes', (req, res) => {
  const { id_sucursal, nombre, telefono } = req.body;
  
  if (!id_sucursal || !nombre || !telefono) {
    return res.status(400).json({ message: 'Faltan datos requeridos' });
  }

  const query = 'INSERT INTO cliente (id_sucursal, nombre, telefono) VALUES (?, ?, ?)';
  db.query(query, [id_sucursal, nombre, telefono], (err, result) => {
    if (err) {
      console.log("Error al insertar el cliente:", err);
      return res.status(500).json({ message: 'Error al agregar el cliente' });
    }
    
    console.log("Cliente agregado con éxito:", result);
    return res.status(201).json({ message: 'Cliente agregado con éxito', cliente: { id_sucursal, nombre, telefono } });
  });
});


app.delete('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;

  // Validar que el ID sea una cadena de 4 caracteres
  if (!id || id.length !== 4) {
    return res.status(400).json({ error: 'ID de cliente inválido. Debe ser una cadena de 4 caracteres.' });
  }

  try {
    const pool = await sql.connect(dbConfig);
    // Determina la tabla donde eliminar según el ID de la sucursal
    const tablaDestino = id.startsWith("Q") ? "Cliente_Quito" : "Cliente_Cuenca"; // Usa "Q" para Quito y "C" para Cuenca

    const result = await pool.request()
      .input('id_cliente', sql.Char(4), id) // Asegúrate de usar Char(4) para el id_cliente
      .query(`DELETE FROM ${tablaDestino} WHERE id_cliente = @id_cliente`);

    if (result.rowsAffected[0] > 0) {
      res.json({ message: 'Cliente eliminado correctamente' });
    } else {
      res.status(404).json({ error: 'Cliente no encontrado' });
    }
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar cliente', details: error.message });
  }
});




// RUTAS PARA SUCURSALES--------------------------------------------------------------------
app.get('/api/sucursales', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Sucursal`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});



//EMPLEADOS-----------------------------------------------------------------------------
// Ruta para obtener los empleados con salario
app.get('/api/empleados', async (req, res) => {
  try {
    // Consulta combinada entre las tablas 'Empleado' y 'NominaEmpleado'
    const result = await sql.query(`
      SELECT 
        e.id_empleado, 
        e.nombre, 
        e.id_sucursal, 
        n.salario
      FROM Empleado e
      JOIN NominaEmpleado n 
        ON e.id_empleado = n.id_empleado
    `);

    // Imprime los resultados para asegurarse de que el servidor está recibiendo los datos correctamente
    console.log(result.recordset); // Imprimir datos de la consulta

    res.json(result.recordset); // Enviar la respuesta JSON con los datos combinados
  } catch (err) {
    console.error("Error en la consulta:", err.message); // Imprimir el error si ocurre
    res.status(500).send(err.message); // Devolver el error al cliente
  }
});

//ruta para agregar en el modal 
app.post('/api/empleados', async (req, res) => {
  console.log("Datos recibidos:", req.body);
  const { nombre, idSucursal, salario } = req.body;
  const id_sucursal = idSucursal; // Ajustamos el nombre

  if (!nombre || !id_sucursal || !salario) {
    return res.status(400).send("Faltan valores para insertar.");
  }

  try {
    // Crear una nueva solicitud SQL
    let pool = await sql.connect(); // Conectar con la base de datos

    // Insertar en Empleado_Quito y obtener el ID generado
    let result = await pool.request()
      .input("nombre", sql.VarChar, nombre)
      .input("id_sucursal", sql.Int, id_sucursal)
      .query(`
        INSERT INTO Empleado (nombre, id_sucursal)
        OUTPUT INSERTED.id_empleado
        VALUES (@nombre, @id_sucursal);
      `);

    const id_empleado = result.recordset[0].id_empleado; // Extraer ID generado

    // Insertar en Nomina_empleado_Quito usando el ID generado
    await pool.request()
      .input("id_empleado", sql.Int, id_empleado)
      .input("salario", sql.Decimal, salario)
      .query(`
        INSERT INTO NominaEmpleado (id_empleado, salario)
        VALUES (@id_empleado, @salario);
      `);

    res.status(200).send("Empleado insertado correctamente.");
  } catch (err) {
    console.error("Error en la inserción:", err);
    res.status(500).send("Error al insertar empleado.");
  }
});


// Ruta para eliminar un empleado
app.delete('/api/empleados/:id', async (req, res) => {
  const { id } = req.params; // Obtiene el ID del empleado a eliminar

  try {
    const pool = await sql.connect(dbConfig);

    // Eliminar el salario del empleado en la tabla 'Nomina_empleado_Quito'
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM NominaEmpleado WHERE id_empleado = @id');

    // Eliminar el empleado de la tabla 'Empleado_Quito'
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Empleado WHERE id_empleado = @id');

    // Si no se afectó ninguna fila, es porque no se encontró el empleado
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.status(200).json({ message: 'Empleado eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar empleado:', error);
    res.status(500).json({ error: 'Error al eliminar el empleado', details: error.message });
  }
});




// RUTAS PARA VENTAS--------------------------------------------------------------------------

// Ruta para obtener las ventas con los detalles de los libros vendidos
app.get('/api/ventas', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query(`
      SELECT 
        v.id_venta,
        v.fechaVenta,
        v.total,
        v.id_cliente,
        v.id_empleado,
        vl.isbn,
        vl.cantidad,
        vl.precioUnitario,
        vl.subtotal
      FROM Venta v
      JOIN DetalleVenta vl ON v.id_venta = vl.id_venta
    `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});




app.post('/api/ventas', async (req, res) => {
  console.log("Datos recibidos en /api/ventas:", req.body);

  const { 
    fechaVenta, 
    id_empleado, 
    id_cliente, 
    isbn, 
    cantidad, 
    precioUnitario, 
    total, 
    subtotal 
  } = req.body;

  // Verify required fields
  if (!fechaVenta || !id_empleado || !id_cliente || !isbn || !cantidad || !precioUnitario || !total || !subtotal) {
    console.log("❌ Error: Datos faltantes o mal formateados", req.body);
    return res.status(400).json({ error: 'Datos faltantes o mal formateados' });
  }

  try {
    const pool = await sql.connect(dbConfig);
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Convert string values to appropriate types
      const ventaResult = await transaction.request()
        .input('fechaVenta', sql.DateTime, fechaVenta)
        .input('id_empleado', sql.Int, parseInt(id_empleado))
        .input('id_cliente', sql.Int, parseInt(id_cliente))
        .input('total', sql.Float, parseFloat(total))
        .query(`
          INSERT INTO Venta (fechaVenta, id_empleado, id_cliente, total)
          OUTPUT INSERTED.id_venta
          VALUES (@fechaVenta, @id_empleado, @id_cliente, @total);
        `);

      const id_venta = ventaResult.recordset[0].id_venta;

      await transaction.request()
        .input('idVenta', sql.Int, id_venta)
        .input('isbn', sql.NVarChar, isbn)
        .input('cantidad', sql.Int, parseInt(cantidad))
        .input('precioUnitario', sql.Float, parseFloat(precioUnitario))
        .input('subtotal', sql.Float, parseFloat(subtotal))
        .query(`
          INSERT INTO Venta (id_venta, isbn, cantidad, precioUnitario, subtotal)
          VALUES (@idVenta, @isbn, @cantidad, @precioUnitario, @subtotal);
        `);

      await transaction.commit();
      res.status(201).json({ message: 'Venta y libro agregados correctamente', id_venta });
    } catch (error) {
      await transaction.rollback();
      console.error('Error en transacción de venta:', error);
      res.status(500).json({ error: 'Error en la transacción de venta', details: error.message });
    }
  } catch (error) {
    console.error('Error al agregar venta:', error);
    res.status(500).json({ error: 'Error al agregar venta', details: error.message });
  }
});


// RUTA PARA ELIMINAR UNA VENTA
app.delete('/api/ventas/:id', async (req, res) => {
  const { id } = req.params; // Obtenemos el ID de la venta desde los parámetros de la URL

  try {
    const pool = await sql.connect(dbConfig);
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Eliminar los registros relacionados en VentaLibro
      await transaction.request()
        .input('idVenta', sql.Int, parseInt(id))
        .query(`
          DELETE FROM Venta WHERE id_venta = @idVenta;
        `);

      // Eliminar la venta en la tabla Venta
      await transaction.request()
        .input('idVenta', sql.Int, parseInt(id))
        .query(`
          DELETE FROM Venta WHERE id_venta = @idVenta;
        `);

      await transaction.commit();
      res.status(200).json({ message: 'Venta eliminada correctamente' });
    } catch (error) {
      await transaction.rollback();
      console.error('Error en transacción de eliminación:', error);
      res.status(500).json({ error: 'Error en la transacción de eliminación', details: error.message });
    }
  } catch (error) {
    console.error('Error al eliminar venta:', error);
    res.status(500).json({ error: 'Error al eliminar venta', details: error.message });
  }
});



// RUTAS PARA STOCK-------------------------------------------------------------------------
// Ruta para obtener el stock
app.get('/api/stock', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM StockSucursal`;// Asegúrate de que la tabla se llame correctamente
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// Ruta para eliminar un registro de stock
app.delete('/api/stock/:id_sucursal/:isbn', async (req, res) => {
  const { id_sucursal, isbn } = req.params;

  try {
    // Validación: Verificar si el stock existe
    const checkStock = await sql.query`
      SELECT * FROM StockSucursal
      WHERE id_sucursal = ${id_sucursal} AND isbn = ${isbn}`;
    
    if (checkStock.recordset.length === 0) {
      return res.status(404).json({ message: 'El stock no existe para la sucursal y ISBN proporcionados' });
    }

    // Eliminar el stock si existe
    await sql.query`
      DELETE FROM StockSucursal
      WHERE id_sucursal = ${id_sucursal} AND isbn = ${isbn}`;
    res.json({ message: 'Registro de stock eliminado exitosamente' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});



// RUTAS PARA SUMINISTROS-------------------------------------------------------------------

// Ruta para obtener todos los registros de suministro
app.get('/api/suministros', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM SLP`; // Asegúrate de que la tabla se llame correctamente
    res.json(result.recordset);  // Envío de la respuesta como JSON
  } catch (err) {
    res.status(500).send(err.message); // Manejo de errores en caso de fallo
  }
});

// Ruta para agregar un nuevo registro de suministro
app.post('/api/suministros', async (req, res) => {
  try {
    const { id_proveedor, id_sucursal, isbn, cantidad, fechasuministro } = req.body;
    await sql.query`
      INSERT INTO SLP (id_proveedor, id_sucursal, isbn, cantidad, fechasuministro)
      VALUES (${id_proveedor}, ${id_sucursal}, ${isbn}, ${cantidad}, ${fechasuministro})`;
    res.json({ message: 'Suministro agregado exitosamente' });
  } catch (err) {
    res.status(500).send(err.message); // Manejo de errores en caso de fallo
  }
});


// RUTAS PARA PROVEEDORES-------------------------------------------------------------------
// Ruta para obtener todos los proveedores
app.get('/api/proveedores', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Proveedor`; // Realiza una consulta para obtener todos los proveedores
    res.json(result.recordset); // Devuelve los proveedores en formato JSON
  } catch (err) {
    res.status(500).json({ error: "Error al obtener los proveedores", details: err.message }); // Manejo de errores
  }
});

// Ruta para agregar un nuevo proveedor
app.post('/api/proveedores', async (req, res) => {
  const { nombre, contacto } = req.body;

  // Validación de los datos
  if (!nombre || !contacto) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const pool = await sql.connect(dbConfig);

    // Insertar proveedor en la base de datos
    await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('contacto', sql.NVarChar, contacto)
      .query('INSERT INTO Proveedor (Nombre, Contacto) VALUES (@nombre, @contacto)');
    
    res.status(201).json({ message: 'Proveedor agregado correctamente' });
  } catch (error) {
    console.error('Error al agregar proveedor:', error);
    res.status(500).json({ error: 'Error al agregar proveedor', details: error.message });
  }
});

// Ruta para eliminar un proveedor
app.delete('/api/proveedores/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await sql.connect(dbConfig);

    // Eliminar proveedor de la base de datos
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM Proveedor WHERE id_proveedor = @id');

    // Verificar si se eliminó el proveedor
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.status(200).json({ message: 'Proveedor eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    res.status(500).json({ error: 'Error al eliminar proveedor', details: error.message });
  }
});








const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});