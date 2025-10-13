import { useState, useEffect } from "react";
import Modal from "../../components/modal/modal.jsx";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../constants/api.js";
import "./posts.css";
import BtnVoltar from "../../components/btn-voltar/btn-voltar.jsx";
import Postagem from "../../components/postagem/postagem.jsx";

function Posts() {

    const navigate = useNavigate();

     const { id_post } = useParams(); 
   
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null); // id do post sendo editado
  const [texto, setTexto] = useState(""); // texto do post no modal
  const [titulo, setTitulo] = useState("");
  const [loading, setLoading] = useState(true);
  const [img, setImg] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  
  useEffect(() => {

    
    async function fetchPosts() {
       try{
               
            const response = await api.get("/posts");
            
      
            
            if(response.data){
              
              setPosts(response.data);
               setLoading(false);
            
                
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

  function abrirPost(id_post) {
    navigate(`/posts/admin/${id_post}`);
  }



   function editarPost(post) {
    setTitulo(post.titulo)
    setTexto(post.texto); 
    setImg(post.imagem_url)       // coloca o texto atual no modal
    setEditandoId(post.id_post); // guarda qual post tá editando
    setOpen(true);               // abre modal
  }


  async function excluirPost(id_post) {
  try {
    await api.delete(`/posts/${id_post}`);
    
    // atualiza a lista local removendo o post deletado
    setPosts(prev => prev.filter(post => post.id_post !== id_post));
    
    console.log("Post deletado com sucesso!");
  } catch (error) {
    console.log(error.response?.data?.error || "Erro ao deletar post");
  }
}

function voltar(){
    navigate("/home")
  }

function verMais() {
  setVisibleCount(prev => prev + 10);
}


  function abrirModal() {
    setTexto("");     // limpa texto
    setImg("");     // limpa texto
    setEditandoId(null); // garante que é criação
    setOpen(true);
  }


   async function enviarPost() {
  if (!texto.trim() && !img) return; 



  try {
    const formData = new FormData();
    formData.append("texto", texto);
    formData.append("titulo", titulo);


      if (img) {
      formData.append("imagem", img);
    }
     const response = await api.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data) {
      const novoPost = {
        id_post: response.data.id_post, // veio do backend
        texto: texto,
        titulo:titulo,
        imagem_url: response.data.imagem_url || null, // pega do state (pra não ficar vazio)
        id_usuario: response.data.id_usuario || null // se vier do backend, usa, senão deixa null
      };

      setPosts(prev => [novoPost, ...prev]); // adiciona na lista
      setTexto(""); 
      setTitulo(""); 
      setImg("")
      setOpen(false);
    }
  } catch (error) {
    console.log(error.response?.data?.error || "Erro ao enviar post");
  }
}



async function enviarEdit() {
    try {
      const formData = new FormData();
      formData.append("texto", texto);
      formData.append("titulo", titulo);

      // só adiciona a imagem se o usuário trocou
      if (img && typeof img !== "string") {
        formData.append("imagem", img);
      }

      const response = await api.put(`/posts/${editandoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        setPosts(prev =>
          prev.map(p =>
            p.id_post === editandoId
              ? { ...p, texto,titulo, imagem_url: response.data.imagem_url || p.imagem_url }
              : p
          )
        );

        console.log([...formData] + "aqui ein");
        setTexto("");
        setImg("");
        setEditandoId(null);
        setOpen(false);
      }
    } catch (error) {
      console.log(error.response?.data?.error || "Erro ao atualizar post");
    }
}


  
  if (loading) return <p>Carregando posts...</p>;

  return (
  <div className="container-posts">
          <div className="header-posts">
            <h2>Publicações</h2>
            
            <div className="containerBtn-post">
              <button onClick={abrirModal}>Fazer Nova Publicação</button>
              <BtnVoltar
                    voltar={voltar}
                
                />
            </div>
          </div>

               
                      

          <div className="posts">

                 {posts.slice(0, visibleCount).map((post) => (
                        <Postagem
                          key={post.id_post}
                          post={post}
                          abrirPost={abrirPost}
                          editarPost={editarPost}
                          excluirPost={excluirPost}
                        />
                      ))}

          
                  <Modal isOpen={open}
                          setOpen={setOpen}
                          enviar={editandoId ? () => enviarEdit(texto) : enviarPost}
                          texto={texto}
                          titulo={titulo}
                          setTitulo={setTitulo}
                          img={img}
                          tipo="post"
                          setImg={setImg}
                          placeholderTexto={"Digite seu post aqui..."}
                          placeholderTitulo={"digite seu titulo aqui..."}
                          setTexto={setTexto} />

          </div>

                  {visibleCount < posts.length && (
              
              <div className="btn-vermais" ><button onClick={verMais} >Ver mais</button></div>
            )}
      
  </div>
  );
}

export default Posts;


