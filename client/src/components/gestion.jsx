import React, {useState } from "react";

export default function Gestion(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [register, setRegister] = useState(false)
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
      };
    
      const handlePasswordChange = (event) => {
        setPassword(event.target.value);
      };
      const handleFormSubmit = (event) => {
        event.preventDefault();
    
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
              setRegister(true)
            } else {
              console.log("Credenciales incorrectas");
            }
          })
          .catch((error) => {
            console.error("Error al verificar las credenciales:", error);
          });
      };
return (
    !register?(

        <div>
        <div className="form">
            <form onSubmit={handleFormSubmit}>
              <label>
                Nombre de usuario:
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
):(
    'GestionSinregistrar'
)
)

}