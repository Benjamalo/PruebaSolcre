import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";

export default function HomePage() {
    const [dropDown, setDropDown] = useState(false);
    const abrirCerrarDropDown = () => {
      setDropDown(!dropDown);
    };
  const [documento, setDocumento] = useState("");
  const [participante, setParticipante] = useState("");
  const [backData, setBackData] = useState([]);

  const handleDocumentoChange = (event) => {
      setDocumento(event.target.value);
    };
    useEffect(() => {
      fetch("/api")
        .then((response) => response.json())
        .then((data) => {
          setBackData(data);
        });
    }, []);

    const handleSubmitVoto = (event) => {
        event.preventDefault();
      
        // Realizar la solicitud POST al backend
        fetch("/registrarVoto", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documento, participante }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      };
      


  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(participante, documento);
  };

  return (
    <div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <label>
            Cédula:{" "}
            <input
              type="text"
              value={documento}
              onChange={handleDocumentoChange}
            />
          </label>
          <Dropdown isOpen={dropDown} toggle={abrirCerrarDropDown}>
            <DropdownToggle>Participantes</DropdownToggle>
            <DropdownMenu>
              {backData.map((item, index) => (
                <DropdownItem
                  key={index}
                  value={item.Nombre}
                  onClick={() => setParticipante(item.Nombre)}
                >
                  {item.Nombre}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <button onClick={handleSubmitVoto}>Enviar voto</button>
        </form>
        <div>
          <Link to="/gestion">
            <button>Gestion!</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
