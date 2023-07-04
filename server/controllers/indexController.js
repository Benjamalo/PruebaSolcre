const mysql = require("mysql");
const controller = {};
const fecha = new Date();
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "benjamin2422002",
  database: "dbsolcre",
});
  const datosPrecargadosUsuario = [
    [1,5159780-2,'benjamin','benjamalo02@gmail.com',2],
  ]
  const datosPrecargadosPerfil = [
    [1,'benjamin','Malo','Ejido y canelones', 91602768,'2002/2/24','m' ],
    [2,'Alfonso','Trezza','Canelones', 91602666,'2008/2/29','m' ],
    [3,'Brunella','Chevalier','Mercedes', 91607833,'1998/4/13','f' ],
    [4,'Eloisa','Teixeira','Ejido y canelones', 99122657,'1982/2/19','f' ],
    [5,'Guillermo','Belando','24 de febrero', 97856274,'2002/2/27','m' ],
    [6,'Isabel','Halty','Julio Herrara', 98742442,'2003/5/15','f' ],
    [7,'Carlos','Malo','Soriano', 92847244,'2000/1/1','m' ],
    [8,'Ricardo','Bueno','Caracas', 98998372,'1978/6/12','m' ],
    [9,'Juan','Castro','18 de julio', 95537535,'2000/8/6','m' ],
    [10,'Daisy','Dolores','Calle 18', 97442523,'1969/3/4','f' ],
  ]
  const datosPrecargadosEntidad = [
    [1,'5159780-2',1,1],
    [2,'3172739-8',0,2],
    [3,'5891460-7',0,3],
    [4,'6970216-2',0,4],
    [5,'9496221-0',0,5],
    [6,'4241814-8',0,6],
    [7,'1751550-3',0,7],
    [8,'4983214-5',0,8],
    [9,'7508633-8',0,9],
    [10,'4965361-8',1,10],

  ]
  const insertQueryPerfil = 'INSERT INTO perfil (idPerfil,Nombre, Apellido,Dirección,Teléfono, Dob,Sexo) VALUES ?';
  const insertQueryEntidad = 'INSERT INTO entidad (idEntidad,Documento, es_postulante,idPerfil) VALUES ?';
  const insertQueryUser = 'INSERT INTO usuario (idUsuario,Documento, Clave,Email,idPerfil) VALUES ?';

  function insertarDatos() {
    const insertPerfil = new Promise((resolve, reject) => {
      connection.query(insertQueryPerfil, [datosPrecargadosPerfil], (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
    const insertEntidad = insertPerfil.then(() => {
      return new Promise((resolve, reject) => {
        connection.query(insertQueryEntidad, [datosPrecargadosEntidad], (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    });
  
    const insertUsuario = insertEntidad.then(() => {
      return new Promise((resolve, reject) => {
        connection.query(insertQueryUser, [datosPrecargadosUsuario], (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    });
    insertUsuario
      .then(() => {
        console.log("Datos insertados correctamente.");
      })
      .catch((error) => {
        console.error("Error al insertar los datos:", error);
      });
  }
  insertarDatos();
  
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
  SELECT v.idEntidadPostulante, COUNT(*) AS numVotos, p.Nombre AS NombreEntidad, v.fecha
  FROM voto v
  INNER JOIN entidad e ON v.idEntidadPostulante = e.idEntidad
  INNER JOIN perfil p ON e.idPerfil = p.idPerfil
  GROUP BY v.idEntidadPostulante, p.Nombre, v.fecha
`;
  connection.query(obtenerVotosQuery, (error, results) => {
    if (error) {
      console.error("Error al obtener el número de votos:", error);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.status(200).json(results);
  });
};

controller.obtenerDetalleVoto = (req, res) => {
  const idEntidadPostulante = req.params.idEntidadPostulante;
  const obtenerDetalleVotoQuery = `
    SELECT v.*, ev.Nombre, ev.Apellido, ev.Dirección, ev.Teléfono, ev.Dob, p.Nombre AS NombrePostulante
    FROM voto v
    INNER JOIN entidad e ON v.idEntidadVotante = e.idEntidad
    INNER JOIN perfil ev ON e.idPerfil = ev.idPerfil
    INNER JOIN perfil p ON v.idEntidadPostulante = p.idPerfil
    WHERE v.idEntidadPostulante = ?
  `;
  connection.query(obtenerDetalleVotoQuery, [idEntidadPostulante], (error, results) => {
    if (error) {
      console.error("Error al obtener el detalle del voto:", error);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.status(200).json(results);
  });
};




module.exports = controller;
