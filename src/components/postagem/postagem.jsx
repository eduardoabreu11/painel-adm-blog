import "./postagem.css";

function Postagem({ post, abrirPost, editarPost, excluirPost }) {
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
        <button onClick={() => abrirPost(post.id_post)}>Abrir</button>
        <button onClick={() => editarPost(post)}>Editar</button>
        <button onClick={() => excluirPost(post.id_post)}>Excluir</button>
      </div>
    </div>
  );
}

export default Postagem;