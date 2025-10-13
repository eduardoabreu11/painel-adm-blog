import "./videos.css";
import { useEffect, useState } from "react";
import api from "../../constants/api.js";
import Modal from "../../components/modal/modal.jsx";
import { useNavigate } from "react-router-dom";
import BtnVoltar from "../../components/btn-voltar/btn-voltar.jsx";

function Videos() {
  const [video, setVideo] = useState({});
  const [open, setOpen] = useState(false);
  const [novoVideo, setNovoVideo] = useState(null);

    const navigate = useNavigate();

  // Carrega o vídeo único
  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await api.get("/videos/1");
        if (response.data) {
          setVideo(response.data);
          console.log("Vídeo carregado:", response.data);
        }
      } catch (error) {
        console.log(error.response?.data?.error || "Erro ao buscar vídeo");
      }
    }
    fetchVideo();
  }, []);

  // Abre modal para edição
  function editarVideo() {
    setNovoVideo(null); // limpa qualquer arquivo selecionado
    setOpen(true);
  }

  // Envia a edição para o backend
  async function enviarEdit() {
    try {
      const formData = new FormData();
      if (novoVideo) {
        formData.append("video_url", novoVideo); // backend espera "video_url"
      }

      const response = await api.put("/videos/1", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Atualiza o estado com o vídeo atualizado
      setVideo(prev => ({
        ...prev,
        ...response.data,
      }));

      setOpen(false);
    } catch (error) {
      console.log(error.response?.data?.error || "Erro ao editar vídeo");
    }
  }


   function voltar(){
    navigate("/home")
  }

  return (
    <div className="container-midia">
        <div className="container-btnMidia">

            <BtnVoltar
                    voltar={voltar}
                
                />
        </div>
        
      <div className="midia">
        {video.video_url && (
          <div className="video">
            <video
              src={video.video_url}
              controls
              width="600"
              height="700"
            >
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </div>
        )}

        <div className="botoes-midia">
          <button onClick={editarVideo}>Editar</button>
        </div>
      </div>

      <Modal
        isOpen={open}
        setOpen={setOpen}
        enviar={enviarEdit} // função passada corretamente
        tipo="video"
        img={novoVideo} // o Modal usa "img" para receber o arquivo
        setImg={setNovoVideo} // controla o upload do novo vídeo
      />
    </div>
  );
}

export default Videos;