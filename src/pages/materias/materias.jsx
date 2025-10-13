import "./materias.css";
import { useState, useEffect } from "react";
import api from "../../constants/api.js";
import Modal from "../../components/modal/modal.jsx";
import BtnVoltar from "../../components/btn-voltar/btn-voltar.jsx";
import { useNavigate } from "react-router-dom";
import Postagem from "../../components/postagem/postagem.jsx";

function Materias(){

  const [materias, setMaterias] = useState([]);
  const [open, setOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [img, setImg] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMaterias() {
      try {
        const response = await api.get("/materias");
        if (response.data) {
          setMaterias(response.data);
        }
      } catch (error) {
        console.log(error.response?.data?.error || "Ocorreu um erro, tente novamente mais tarde");
      }
    }
    fetchMaterias();
  }, []);

  function abrirModal() {
    setTexto("");
    setImg("");
    setTitulo("");
    setEditandoId(null);
    setOpen(true);
  }

  function voltar(){
    navigate("/home");
  }

  function verMais() {
    setVisibleCount(prev => prev + 10);
  }

  return (
    <div className="container-materias">
      <div className="header-materias">
        <h2>Matérias</h2>
        <div className="containerBtn-materias">
          <button className="inserir" onClick={abrirModal}>Fazer Nova Publicação</button>
          <BtnVoltar voltar={voltar}/>
        </div>
      </div>

      <div className="materias">
        {materias.slice(0, visibleCount).map((materia) => (
          <Postagem
            key={materia.id_post}
            post={materia}
          />
        ))}

        <Modal
          isOpen={open}
          setOpen={setOpen}
          enviar={() => console.log("Implementar depois")}
          texto={texto}
          titulo={titulo}
          setTitulo={setTitulo}
          img={img}
          tipo="post"
          setImg={setImg}
          placeholderTexto={"Digite seu post aqui..."}
          placeholderTitulo={"Digite seu título aqui..."}
          setTexto={setTexto}
        />
      </div>

      {visibleCount < materias.length && (
        <div className="btn-vermais">
          <button onClick={verMais}>Ver mais</button>
        </div>
      )}
    </div>
  );
}

export default Materias;