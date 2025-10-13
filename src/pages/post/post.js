import { useParams , useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../constants/api.js";
import Modal from "../../components/modal/modal.jsx";
import "./post.css"




function Post(){
     const [posts, setPosts] = useState([]);
    const [texto, setTexto] = useState("");
    const [titulo, setTitulo] = useState("");
    const [open, setOpen] = useState(false);
     const [img, setImg] = useState("");
    const { id_post } = useParams(); 
    const navigate = useNavigate();
      

      useEffect(() => {

    
    async function fetchPosts() {
       try{
               
            const response = await api.get(`/posts/admin/${id_post}`);
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
  }, []);

  function editar(){
    setOpen(true)
  }
  function voltar(){
    navigate("/posts");
  }

   async function excluir(id_post) {
  try {
    await api.delete(`/posts/${id_post}`);
    
    // atualiza a lista local removendo o post deletado
    setPosts(prev => prev.filter(post => post.id_post !== id_post));
    navigate("/posts");
    
    console.log("Post deletado com sucesso!");
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
      formData.append("imagem", img);
    }

    const response = await api.put(`/posts/${id_post}`, formData, {
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

          <button onClick={()=>editar(id_post)}>editar</button>
          <button onClick={()=>excluir(id_post)}>excluir</button>
          <button onClick={()=>voltar(id_post)}>voltar</button>
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


export default Post