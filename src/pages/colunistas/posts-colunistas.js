import "./postsColunistas.css";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import Modal from "../../components/modal/modal.jsx";
import { useNavigate, useParams } from "react-router-dom";
import BtnVoltar from "../../components/btn-voltar/btn-voltar.jsx";

function PostsColunistas() {
  const [postsColunistas, setPostsColunistas] = useState([]);
  const [open, setOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [img, setImg] = useState(null);

  const { id_colunista } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPostsColunistas() {
      try {
        const response = await api.get(`/admin/colunistas/${id_colunista}/posts`);
        if (response.data) {
          setPostsColunistas(response.data);
        }
      } catch (error) {
        console.log(error.response?.data?.error || "Erro ao buscar posts do colunista");
      }
    }
    fetchPostsColunistas();
  }, [id_colunista]);

  function abrirModal() {
    setTitulo("");
    setTexto("");
    setImg(null);
    setEditandoId(null);
    setOpen(true);
  }

  function editarPost(post) {
    setEditandoId(post.id_post_colunista); // ✅ Agora pega o ID certo
    setTitulo(post.titulo);
    setTexto(post.texto);
    setImg(post.foto); // ✅ No seu backend a propriedade correta é 'foto'
    setOpen(true);
  }

  async function enviarPost() {
    try {
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("texto", texto);
      formData.append("id_colunista", id_colunista);
      if (img) {
        formData.append("foto", img);
      }

      const response = await api.post(`/colunistas/${id_colunista}/posts`, formData);
      setPostsColunistas(prev => [response.data, ...prev]);
      setOpen(false);
    } catch (error) {
      console.log(error.response?.data?.error || "Erro ao enviar post");
    }
  }

  function voltar(){
    navigate(`/colunistas`)
  }

  

  async function enviarEdit(id_post_colunista) {
  try {
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("texto", texto);

    // Se tiver imagem nova, envia para atualizar
    if (img && typeof img !== "string") {
      formData.append("foto", img); // backend espera "foto", não "imagem"
    }

    const response = await api.put(
      `/colunistas/${id_colunista}/posts/${id_post_colunista}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" }
      }
    );

        setPostsColunistas(prev =>
        prev.map(post =>
          post.id_post_colunista === id_post_colunista
            ? { ...post, ...response.data } // Atualiza só aquele post
            : post
        )
      );

    setOpen(false);
  } catch (error) {
    console.log(error.response?.data?.error || "Erro ao editar post");
  }
}

  async function excluirPost(id_post_colunista) {
    try {
      await api.delete(`/colunistas/${id_colunista}/posts/${id_post_colunista}`);
      setPostsColunistas(prev => prev.filter(post => post.id_post_colunista !== id_post_colunista));
    } catch (error) {
      console.log(error.response?.data?.error || "Erro ao excluir post");
    }
  }

  return (
    <div className="container-posts-colunistas">
      <div className="header-posts-colunistas">
        <h2>Posts do Colunista</h2>
         <div className="containerBtn-postsColunistas">
              <button className="inserir" onClick={abrirModal}>Inserir Post</button>
              <BtnVoltar
                    voltar={voltar}
                
                />
            </div>
      </div>

      <div className="lista-posts-colunistas">
        {postsColunistas.map(post => (
          <div key={post.id_post_colunista} className="post-colunista">
            <img src={post.foto} alt={post.titulo} />
            <h3>{post.titulo}</h3>
            <p>{post.texto}</p>
            <div className="botoes-posts-colunista">
              
              <button onClick={() => editarPost(post)}>Editar</button>
              <button onClick={() => excluirPost(post.id_post_colunista)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={open}
        setOpen={setOpen}
        enviar={editandoId ? () => enviarEdit(editandoId) : enviarPost}
        titulo={titulo}
        setTitulo={setTitulo}
        texto={texto}
        setTexto={setTexto}
        img={img}
        setImg={setImg}
        tipo="post"
      />
    </div>
  );
}

export default PostsColunistas;