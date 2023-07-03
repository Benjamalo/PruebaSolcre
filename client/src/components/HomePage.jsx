import { Link  } from "react-router-dom";

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
  const [backData, setBackData] = useState([{}]);
  useEffect(() => {
    fetch("/api")
      .then((response) => response.json())
      .then((data) => {
        setBackData(data);
      });
  }, []);
  return (
    <div>
      <div className="form">
        <form>
          <label>
            Cédula: <input type="text" />
          </label>
          <Dropdown
            isOpen={dropDown}
            toggle={abrirCerrarDropDown}
            direction="right"
          >
            <DropdownToggle>Participantes</DropdownToggle>
            <DropdownMenu>
              {backData.map((item, index) => (
                <DropdownItem key={index}>{item.Nombre}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <button>Enviar voto</button>
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
