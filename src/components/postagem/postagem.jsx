import "./postagem.css";

function Postagem({ post, abrirPost, editarPost, excluirPost }) {
  const id = post.id_post || post.id_materia; // ✅ pega o ID correto dependendo do tipo

  return (
    <div className="post">
      <div className="container-conteudo">
        {post.imagem_url && <img src={post.imagem_url} alt="Imagem do post" />}

        <h1>{post.titulo}</h1>
        <p>
          {post.texto.length > 100
            ? post.texto.slice(0, 600) + "..."
            : post.texto}
        </p>
      </div>

      <div className="container-buttons">
        <button onClick={() => abrirPost(id)}>Abrir</button>
        {editarPost && <button onClick={() => editarPost(post)}>Editar</button>}
        {excluirPost && <button onClick={() => excluirPost(id)}>Excluir</button>}
      </div>
    </div>
  );
}

export default Postagem;