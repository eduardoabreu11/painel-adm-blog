import "./banner.css";
import { useState, useEffect } from "react";
import api from "../../constants/api.js";
import Modal from "../../components/modal/modal.jsx";
import BtnVoltar from "../../components/btn-voltar/btn-voltar.jsx";
import { useNavigate } from "react-router-dom";

function Banner() {
  const [banners, setBanners] = useState([]);
  const [img, setImg] = useState("");
  const [texto, setTexto] = useState("");
  const [open, setOpen] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

   const navigate = useNavigate();

  useEffect(() => {
    async function fetchBanners() {
      try {
        const response = await api.get("/banners");
        if (response.data) {
          setBanners(response.data);
        }
      } catch (error) {
        console.log(error.response?.data?.error || "Ocorreu um erro, tente novamente mais tarde");
      }
    }

    fetchBanners();
  }, []);



    function editarBanner(banner) {
    
     
    setImg(banner.foto)       // coloca o texto atual no modal
    setEditandoId(banner.id_banner); // guarda qual post tá editando
    setOpen(true);               // abre modal
  }

  function voltar(){
    navigate("/home")
  }

 async function enviarEdit(){
    console.log("boi sad")
    console.log(JSON.parse(localStorage.getItem("usuario-blog")));
        try {
      const formData = new FormData();
      

      // só adiciona a imagem se o usuário trocou
      if (img && typeof img !== "string") {
        formData.append("foto", img);
      }

      const response = await api.put(`/banners/${editandoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        setBanners(prev =>
          prev.map(p =>
            p.id_banner === editandoId
              ? { ...p,  banner: response.data.banner || p.banner }
              : p
          )
        );
        
        setImg("");
        setEditandoId(null);
        setOpen(false);
      }
    } catch (error) {
      console.log(error.response?.data?.error || "Erro ao atualizar post");
    }
  }

  return (
    <div className="container-banners">

      <div className="header-banners">
        <h1>Editar Banners</h1>
        <BtnVoltar
                    voltar={voltar}
                
                />
      </div>

        
      <div className="banners">
        
        {banners.map((banner) => (
          <div className="banner" key={banner.id_banner}>
            <img src={banner.banner} alt="Banner" />
            <div className="buttons-banners">
                      
                      <button onClick={() => editarBanner(banner)}>Editar</button>
                      
                    </div>
          </div>
        ))}

        <Modal isOpen={open}
                          setOpen={setOpen}
                          enviar={enviarEdit}
                          texto={texto}
                          setTexto={setTexto}
                          img={img}
                          setImg={setImg}
                           />
      </div>
    </div>
  );
}

export default Banner;