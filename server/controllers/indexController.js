// const mysql = require("mysql");
const controller = {};

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "benjamin2422002",
  database: "dbsolcre",
});
//   const datosPrecargados = [
//     [2,5159780-5,'benjamin','benjamalo02@gmail.com',2]
//   ]
//   const insertQuery = 'INSERT INTO usuario (idUsuario, Documento, Clave,Email,idPerfil) VALUES ?';
//   connection.query(insertQuery, [datosPrecargados], (error, results) => {
//     if (error) {
//       console.error('Error al insertar los datos:', error);

//       return;
//     }

//     console.log('Datos precargados insertados correctamente');
//     console.log('Número de filas insertadas:', results.affectedRows);

// });
controller.listPerfil = (req, res) => {
  req.getConnection((err, conn) => {
    conn.query(
      "SELECT perfil.idPerfil, perfil.Nombre, perfil.Apellido, perfil.Dirección, perfil.Teléfono, perfil.Dob, perfil.Sexo, usuario.idUsuario, usuario.Documento, usuario.Clave, usuario.Email FROM perfil LEFT JOIN usuario ON perfil.idPerfil = usuario.idPerfil",
      (err, result) => {
        if (err) {
          res.json(err);
        } else {
          res.send(result);
          console.log("Conexión exitosa - Perfil y Usuario unidos");
        }
      }
    );
  });
};

controller.login = (req, res) => {
  const { username, password } = req.body;

  const query = `
  SELECT usuario.*, perfil.Nombre
  FROM usuario
  INNER JOIN perfil ON usuario.idPerfil = perfil.idPerfil
  WHERE perfil.Nombre = ? AND usuario.Clave = ?`;
  connection.query(query, [username, password], (error, results) => {
    if (error) {
      console.error("Error al ejecutar la consulta:", error);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    console.log(query);
    if (results.length > 0) {
      const usuario = results; 
      const { idUsuario, Documento, Clave, Email, Nombre } = usuario;
      res
        .status(200)
        .json({
          idUsuario,
          Documento,
          Clave,
          Email,
          Nombre,
          message: "Inicio de sesión exitoso",
        });
    } else {
      res.status(401).json({ error: "Credenciales incorrectas" });
    }
  });
};

module.exports = controller;

