import mysql from "mysql2/promise"; // importa mysql2 en su version con promesas para usar async/await

// crea un pool de conexiones en lugar de una conexion unica
// el pool maneja multiples conexiones automaticamente segun la demanda
const pool = mysql.createPool({
  host: "127.0.0.1",       // direccion del servidor mysql, localhost
  port: 3306,              // puerto por defecto de mysql
  user: "app_user",        // usuario restringido que creamos en workbench
  password: "TORRES_2007", // contrasena del usuario app_user
  database: "inventario_apropiacion", // base de datos a la que se conecta
  waitForConnections: true, // si no hay conexiones disponibles, espera en lugar de dar error
  connectionLimit: 10,      // maximo de conexiones simultaneas permitidas en el pool
  queueLimit: 0,            // 0 significa sin limite de peticiones en espera
});

export default pool; // exporta el pool para usarlo en los modelos