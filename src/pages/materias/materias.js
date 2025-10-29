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

   function editarPostModal(post) {
    setTitulo(post.titulo)
    setTexto(post.texto); 
    setImg(post.imagem_url)       
    setEditandoId(post.id_materia); 
    setOpen(true);               
  }

  function voltar(){
    navigate("/home");
  }

  function verMais() {
    setVisibleCount(prev => prev + 10);
  }


  

  async function excluirPost(id) {
  try {
    await api.delete(`/materias/${id}`);

    
    setMaterias(prev => prev.filter(materia => materia.id_materia !== id));

    console.log("Matéria deletada com sucesso!");
  } catch (error) {
    console.log(error.response?.data?.error || "Erro ao deletar matéria");
  }
}

 


  async function enviarEdit() {
    try {
      const formData = new FormData();
      formData.append("texto", texto);
      formData.append("titulo", titulo);

      // só adiciona a imagem se o usuário trocou
      if (img && typeof img !== "string") {
        formData.append("imagem_url", img);
      }

      const response = await api.put(`/materias/${editandoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        setMaterias(prev =>
          prev.map(p =>
            p.id_materia === editandoId
              ? { ...p, texto,titulo, imagem_url: response.data.imagem_url || p.imagem_url }
              : p
          )
        );

        
        setTexto("");
        setImg("");
        setEditandoId(null);
        setOpen(false);
      }
    } catch (error) {
      console.log(error.response?.data?.error || "Erro ao atualizar post");
    }
}


  async function enviarPost() {
      if (!texto.trim() && !img) return; 



      try {
        const formData = new FormData();
        formData.append("texto", texto);
        formData.append("titulo", titulo);


          if (img) {
          formData.append("imagem_url", img);
        }
        const response = await api.post("/materias", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data) {
          const novoPost = {
            id_materia: response.data.id_materia, // veio do backend
            texto: texto,
            titulo:titulo,
            imagem_url: response.data.imagem_url || null, // pega do state (pra não ficar vazio)
            id_usuario: response.data.id_usuario || null // se vier do backend, usa, senão deixa null
          };

          setMaterias(prev => [novoPost, ...prev]); // adiciona na lista
          setTexto(""); 
          setTitulo(""); 
          setImg("")
          setOpen(false);
        }
      } catch (error) {
        console.log(error.response?.data?.error || "Erro ao enviar post");
      }
}

  function abrirPost(id_materia) {
  navigate(`/materias/${id_materia}`);
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
              key={materia.id_materia}   // ✅ agora está certo
              post={materia}
              abrirPost={abrirPost}
              excluirPost={excluirPost}
              editarPost={editarPostModal}
            />
        ))}

        <Modal
          isOpen={open}
          setOpen={setOpen}
          enviar={editandoId ? enviarEdit : enviarPost}
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