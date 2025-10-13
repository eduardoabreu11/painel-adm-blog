import "./colunistas.css";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import Modal from "../../components/modal/modal.jsx";
import { useNavigate } from "react-router-dom";
import BtnVoltar from "../../components/btn-voltar/btn-voltar.jsx";

function Colunistas() {
  const [colunistas, setColunistas] = useState([]);
const [open, setOpen] = useState(false);
const [editandoId, setEditandoId] = useState(null);
const [titulo, setTitulo] = useState("");
const [texto, setTexto] = useState(""); 
const [img, setImg] = useState(null); 


const navigate = useNavigate();

  useEffect(() => {
    async function fetchColunistas() {
      try {
        const response = await api.get("/colunistas");
        if (response.data) {
          setColunistas(response.data);
          
        }
      } catch (error) {
        console.log(error.response?.data?.error || "Ocorreu um erro, tente novamente mais tarde");
      }
    }

    fetchColunistas();
  }, []);



  

  function abrirPostColunista(id_colunista){
      
    navigate(`/admin/colunistas/${id_colunista}/posts`);
  

  };

  function voltar(){
    navigate("/home")
  }

  
  function editarColunista(colunista){
    
    setTitulo(colunista.nome); 
    setImg(colunista.foto)       // coloca o texto atual no modal
    setEditandoId(colunista.id_colunista); // guarda qual post tá editando
    setOpen(true);  
  };

   async function enviarPost() {
  if (!texto.trim() && !img) return; 



  try {
    const formData = new FormData();
    formData.append("nome", titulo);
    


      if (img) {
      formData.append("foto", img);
    }
     const response = await api.post("/colunistas", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data) {
      const novoPost = {
        id_post: response.data.id_colunista, // veio do backend
        nome: titulo,
        
        foto: response.data.foto || null, // pega do state (pra não ficar vazio)
        id_usuario: response.data.id_colunista || null // se vier do backend, usa, senão deixa null
      };

      setColunistas(prev => [novoPost, ...prev]); // adiciona na lista
      setTitulo(""); 
      setImg("")
      setOpen(false);
    }
  } catch (error) {
    console.log(error.response?.data?.error || "Erro ao enviar post");
  }
}


  

 async function enviarEdit(){

  
         try {
    const formData = new FormData();
    formData.append("nome", titulo);

    if(img && typeof img !== "string") {
      formData.append("foto", img);
    }

    const response = await api.put(`/colunistas/${editandoId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if(response.data){
      setColunistas(prev =>
            prev.map(c =>
              c.id_colunista === editandoId
                ? { ...c, nome: response.data.nome, foto: response.data.foto }
                : c
            )
          );
      setTitulo(response.data.nome);
      setImg(response.data.foto);
      setOpen(false);
      
    }
  } catch (error) {
    console.log(error.response?.data?.error || "Erro ao atualizar post");
  }
  };


  function abrirModal() {
  setTitulo("");  
  setImg(null);   
  setEditandoId(null); 
  setOpen(true);
}

    

 async function excluirColunista(id_colunista){
     try {
    console.log(id_colunista)
    await api.delete(`/colunistas/${id_colunista}`);
    
    // atualiza a lista local removendo o post deletado
    setColunistas(prev => prev.filter(colunista => colunista.id_colunista !== id_colunista));
    
    console.log("Post deletado com sucesso!");
  } catch (error) {
    console.log(error.response?.data?.error || "Erro ao deletar post");
  }
  };




  return (
    <div className="container-colunistas">
       <div className="header-colunistas">
            <h2>Colunistas</h2>
            
            <div className="containerBtn-colunistas">
              <button className="inserir" onClick={abrirModal}>Inserir Colunista</button>
              <BtnVoltar
                voltar={voltar}
              
              />
              
            </div>
            
            
          </div>
      <div className="lista-colunistas">
        
        {colunistas.map((colunista) => (
          <div className="colunista" key={colunista.id_colunista}>
            <img src={colunista.foto} alt={colunista.nome} />
            <p>{colunista.nome}</p>
            <div className="btn-colunista">
                 <button onClick={() => abrirPostColunista(colunista.id_colunista)}>Abrir Posts</button>
                 <button onClick={() => editarColunista(colunista)}>Editar</button>
                 <button onClick={() => excluirColunista(colunista.id_colunista)}>Excluir</button>
            </div>
          </div>
          
        ))}

          <Modal isOpen={open}
                          setOpen={setOpen}
                          enviar={editandoId ? () => enviarEdit(texto) : enviarPost}
                          texto={texto}
                          img={img}
                          titulo={titulo}
                          setTitulo={setTitulo}
                          tipo="colunista"
                          setImg={setImg}
                          placeholderTitulo={"Digite o nome do colunista"}
                          setTexto={setTexto} />
      </div>
    </div>
  );
}

export default Colunistas;