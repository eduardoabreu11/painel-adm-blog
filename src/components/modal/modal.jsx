import "./modal.css";

function Modal({
  isOpen,
  setOpen,
  enviar,
  setTexto,
  titulo,
  setTitulo,
  texto,
  img,
  setImg,
  placeholderTexto,
  placeholderTitulo,
  tipo
}) {
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) setImg(file);
  }

  if (!isOpen) return null;

  return (
    <div className="container-modal">
      <div className="modal">
        
        {/* Preview (imagem ou vídeo) */}
        {img && (
          tipo === "video" ? (
            <video
              width="250"
              controls
              src={typeof img === "string" ? img : URL.createObjectURL(img)}
            />
          ) : (
            <img
              src={typeof img === "string" ? img : URL.createObjectURL(img)}
              alt="Preview"
              style={{ width: "200px", height: "auto" }}
            />
          )
        )}

        {/* Upload file (imagem ou vídeo) */}
        <input
          type="file"
          accept={tipo === "video" ? "video/*" : "image/*"}
          onChange={handleFileChange}
        />

        {/* Campo de título - aparece para post e colunista */}
        {(tipo === "post" || tipo === "colunista") && (
          <input
            type="text"
            placeholder={placeholderTitulo || "Título"}
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        )}

        {/* Campo de texto - só para post */}
        {tipo === "post" && (
          <textarea
            placeholder={placeholderTexto || "Digite o texto"}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        )}

        <button onClick={() => setOpen(false)}>Fechar</button>
        <button onClick={enviar}>Enviar</button>
      </div>
    </div>
  );
}

export default Modal;