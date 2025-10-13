import "./home.css"
import { useNavigate } from "react-router-dom";


function Home(){
    const navigate = useNavigate();



    return<div className="container-home">
            <header>
                <p>ADMIN</p>
            </header>
        <div className="Home">
            <div className="acesso-rapido">
                <div className="container-opcao">
                    <h1>O que você quer fazer?</h1>

                    <div className="opcoes">
                        <div onClick={() => navigate("/banners")}  className="opcao">
                            <p>Editar Banner</p>
                        </div>
                    
                        <div onClick={() => navigate("/posts")} className="opcao">
                            <p>Editar Posts</p>
                        </div>
                    
                        <div onClick={() => navigate("/colunistas")} className="opcao">
                            <p>Editar Colunistas</p>
                        </div>
                    
                        <div onClick={() => navigate("/videos")} className="opcao">
                            <p>Editar vídeos</p>
                        </div>
                    
                        <div onClick={() => navigate("/materias")} className="opcao">
                            <p>Editar Matérias</p>
                        </div>
                    
                    </div>
                </div>
            </div>
        </div>
        
    </div>
}


export default Home