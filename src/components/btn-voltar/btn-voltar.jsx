import "./btn-voltar.css";

function BtnVoltar({voltar}){
    return  <div className="containerBtn-voltar">
              <button onClick={voltar}>voltar</button>
            </div>
}


export default BtnVoltar