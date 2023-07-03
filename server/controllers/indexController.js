const mysql = require("mysql");
const controller = {};
const fecha = new Date();
let idVoto = 0;
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
      "SELECT perfil.idPerfil, perfil.Nombre, perfil.Apellido, perfil.Dirección, perfil.Teléfono, perfil.Dob, perfil.Sexo, usuario.idUsuario, usuario.Documento, usuario.Clave, usuario.Email " +
        "FROM perfil " +
        "LEFT JOIN usuario ON perfil.idPerfil = usuario.idPerfil " +
        "INNER JOIN entidad ON perfil.idPerfil = entidad.idPerfil " +
        "WHERE entidad.es_postulante = 1",
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
  WHERE usuario.Email = ? AND usuario.Clave = ?`;
  connection.query(query, [username, password], (error, results) => {
    if (error) {
      console.error("Error al ejecutar la consulta:", error);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    console.log(query);
    if (results.length > 0) {
      const usuario = results;
      const { idUsuario, Documento, Clave, Email, Nombre } = usuario;
      res.status(200).json({
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

controller.verificarVoto = (req, res) => {
  const { documento, participante } = req.body;
  const verificarEntidadQuery =
    "SELECT idPerfil FROM entidad WHERE documento = ?";
  connection.query(verificarEntidadQuery, [documento], (error, results) => {
    if (error) {
      console.error("Error al ejecutar la consulta:", error);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    if (results.length === 0) {
      return res.status(404).json({
        error:
          "El participante no está registrado o el documento es incorrecto",
      });
    }
    const verificarVotoQuery = `
  SELECT v.idEntidadVotante
  FROM voto v
  INNER JOIN entidad e ON v.idEntidadVotante = e.idEntidad
  WHERE e.documento = ?
`;
    connection.query(verificarVotoQuery, [documento], (error, results) => {
      if (error) {
        console.error("Error al ejecutar la consulta:", error);
        return res.status(500).json({ error: "Error en el servidor" });
      }
      if (results.length > 0) {
        return res.status(403).json({ error: "El participante ya ha votado" });
      }
      const obtenerIdEntidadQuery =
        "SELECT idEntidad FROM entidad WHERE idPerfil = (SELECT idPerfil FROM perfil WHERE Nombre = ?)";
      connection.query(
        obtenerIdEntidadQuery,
        [participante],
        (error, results) => {
          if (error) {
            console.error("Error al obtener el id de la entidad:", error);
            return res.status(500).json({ error: "Error en el servidor" });
          }

          if (results.length === 0) {
            return res.status(404).json({
              error: "No se encontró el id de la entidad del participante",
            });
          }
          const idEntidadParticipante = results[0].idEntidad;
          const obtenerIdEntidadDocumentoQuery =
            "SELECT idEntidad FROM entidad WHERE documento = ?";
          connection.query(
            obtenerIdEntidadDocumentoQuery,
            [documento],
            (error, results) => {
              if (error) {
                console.error(
                  "Error al obtener el id de la entidad del documento:",
                  error
                );
                return res.status(500).json({ error: "Error en el servidor" });
              }
              if (results.length === 0) {
                return res.status(404).json({
                  error: "No se encontró el id de la entidad del documento",
                });
              }
              const idEntidadDocumento = results[0].idEntidad;
              const insertarVotoQuery =
                "INSERT INTO voto (idEntidadPostulante, idEntidadVotante, Fecha) VALUES (?, ?,?)";
              connection.query(
                insertarVotoQuery,
                [idEntidadParticipante, idEntidadDocumento, fecha],
                (error, results) => {
                  if (error) {
                    console.error("Error al insertar el voto:", error);
                    return res
                      .status(500)
                      .json({ error: "Error en el servidor" });
                  }
                  res
                    .status(200)
                    .json({ message: "El voto se ha procesado correctamente" });
                }
              );
            }
          );
        }
      );
    });
  });
};
controller.obtenerNumeroVotos = (req, res) => {
  const obtenerVotosQuery = `
    SELECT v.idEntidadPostulante, COUNT(*) AS numVotos, p.Nombre AS NombreEntidad
    FROM voto v
    INNER JOIN entidad e ON v.idEntidadPostulante = e.idEntidad
    INNER JOIN perfil p ON e.idPerfil = p.idPerfil
    GROUP BY v.idEntidadPostulante, p.Nombre
  `;

  connection.query(obtenerVotosQuery, (error, results) => {
    if (error) {
      console.error("Error al obtener el número de votos:", error);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.status(200).json(results);
  });
};

module.exports = controller;
