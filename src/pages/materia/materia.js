import { useParams , useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../constants/api.js";
import Modal from "../../components/modal/modal.jsx";
import "./materia.css"




function Materia(){
     const [posts, setPosts] = useState([]);
    const [texto, setTexto] = useState("");
    const [titulo, setTitulo] = useState("");
    const [open, setOpen] = useState(false);
     const [img, setImg] = useState("");

    const { id_materia } = useParams(); 
    const navigate = useNavigate();
      

      useEffect(() => {

    
    async function fetchPosts() {
       try{
               
            const response = await api.get(`/materias/${id_materia}`);
                          console.log(response.data + "ae")

            
      
            
            if(response.data){
              
              setTitulo(response.data.titulo);
              setTexto(response.data.texto);
              setImg(response.data.imagem_url) 
               
            
                
            }
        }
        catch(error){
            
            if(error.response?.data.error)
                console.log(error.response?.data.error)
            else
                console.log("Ocorreu um erro, tente novamente mais tarde")
        }
      

      
    }

    fetchPosts();
  }, [id_materia]);

  function editar(){
    setOpen(true)
  }
  function voltar(){
    navigate("/materias");
  }

   async function excluir() {
  try {
    await api.delete(`/materias/${id_materia}`);
    
    // atualiza a lista local removendo o post deletado
    setPosts(prev => prev.filter(materia => materia.id_materia !== id_materia));
    navigate("/materias");
    
    console.log("materia deletada com sucesso!");
  } catch (error) {
    console.log(error.response?.data?.error || "Erro ao deletar post");
  }
}

async function enviarEdit() {
  try {
    const formData = new FormData();
    formData.append("texto", texto);
    formData.append("titulo", titulo); 

    if(img && typeof img !== "string") {
      formData.append("imagem_url", img);
    }

    const response = await api.put(`/materias/${id_materia}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if(response.data){
      setTexto(response.data.texto);
      setImg(response.data.imagem_url);
      setOpen(false);
    }
  } catch (error) {
    console.log(error.response?.data?.error || "Erro ao atualizar post");
  }
}

    return (
    
    <div className="container-post">

      <div className="post">


        <img src={img} />
        <h1>{titulo}</h1>
        <p>{texto}</p>

        <div className="botoes">

      <button onClick={editar}>editar</button>
      <button onClick={excluir}>excluir</button>
      <button onClick={voltar}>voltar</button>

        </div>
       
      </div>

       <Modal isOpen={open}
              setOpen={setOpen}
              enviar={enviarEdit}
              texto={texto}
              img={img}
              tipo="post"
              setImg={setImg}
              setTitulo={setTitulo}
              titulo={titulo}
              setTexto={setTexto}/>
    </div>)
}


export default Materia