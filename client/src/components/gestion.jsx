import React, { useState } from "react";

export default function Gestion() {
  const [votos, setVotos] = useState([]);
  const [postulanteGanador, setPostulanteGanador] = useState("");
  const [detalleVoto, setDetalleVoto] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [register, setRegister] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    fetch("/votos")
      .then((response) => response.json())
      .then((data) => {
        const votosOrdenados = data.sort((a, b) => b.numVotos - a.numVotos);
        setVotos(votosOrdenados);
        if (data.length > 0) {
          setPostulanteGanador(data[0].NombreEntidad);
        }
      });

    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Inicio de sesión exitoso") {
          console.log("SCCES");
          setRegister(true);
        } else {
          console.log("Credenciales incorrectas");
        }
      })
      .catch((error) => {
        console.error("Error al verificar las credenciales:", error);
      });
  };
  const handleVerDetalle = (idEntidadPostulante) => {
    fetch(`/votos/${idEntidadPostulante}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Detalle del voto:", data);
        setDetalleVoto(data);
      })
      .catch((error) => {
        console.error("Error al obtener el detalle del voto:", error);
      });
  };
  return !register ? (
    <div>
      <div className="form">
        <form onSubmit={handleFormSubmit}>
          <label>
            Email:
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
            />
          </label>
          <label>
            Contraseña:
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </label>
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    </div>
  ) : (
    <div>
      <div>
        <h2>
          Postulante ganador:{" "}
          <span className="nombrePostulante">{postulanteGanador}</span>
        </h2>
      </div>
      <div>
        <h3>Listado de votos:</h3>
        <ul>
          {votos.map((voto) => (
            <li key={voto.idEntidadPostulante}>
              <strong>Postulante:</strong> {voto.NombreEntidad} |{" "}
              <strong>Número de votos:</strong>{" "}
              <span className="nVotos">{voto.numVotos}</span> |{" "}
              <strong>Fecha:</strong> {voto.fecha}
              <button
                onClick={() => handleVerDetalle(voto.idEntidadPostulante)}
              >
                Ver detalle
              </button>
            </li>
          ))}
        </ul>
      </div>
      {detalleVoto &&
        detalleVoto.map((v,key) => (
          <div key={key}>
            <h3>Detalle del voto:</h3>
            <p>
              <strong>Postulante:</strong> {v.NombrePostulante}
            </p>
            <p>
              <strong>Votante:</strong> {v.Nombre}
            </p>
            <p>
              <strong>Dob:</strong> {v.Dob}
            </p>
            <p>
              <strong>Teléfono:</strong> {v.Teléfono}
            </p>
            <p>
              <strong>Dirección:</strong> {v.Dirección}
            </p>
          </div>
        ))}
    </div>
  );
}
