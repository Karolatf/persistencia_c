import mysql from "mysql2/promise"; // importa mysql2 en su version con promesas para usar async/await
// Cargamos las variables de entorno
import "dotenv/config";

// crea un pool de conexiones en lugar de una conexion unica
// el pool maneja multiples conexiones automaticamente segun la demanda
// Es mucho más eficiente que abrir y cerrar una conexión por cada consulta.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10, // Máximo de conexiones simultáneas
  queueLimit: 0,
});

// Prueba de conexión automática al arrancar
pool
  .getConnection()
  .then((connection) => {
    console.log("Conexión a la base de datos MySQL establecida con éxito");
    // Liberamos la conexión de vuelta al pool
    connection.release();
  })
  .catch((error) => {
    console.error("Error al conectar con la base de datos:", error.message);
  });

export default pool; // exporta el pool para usarlo en los modelos