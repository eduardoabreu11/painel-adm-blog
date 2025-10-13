import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../constants/api.js";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import "./conta.css";


function Conta() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState(""); // mensagem de erro
  const [sucesso, setSucesso] = useState(""); // mensagem de sucesso
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault(); // impede recarregar a página
    setErro("");
    setSucesso("");

    try {
      const response = await api.post("/usuarios/registro", { nome, email, senha });

      if (response.data?.token) {
        localStorage.setItem("usuario-blog", JSON.stringify(response.data));
        api.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;

        setSucesso("Conta criada com sucesso!");
        setUser(response.data);
        
          navigate("/posts");
      } else {
        setErro("Conta criada, mas token não recebido.");
      }
    } catch (error) {
      setErro(error.response?.data?.error || "Ocorreu um erro ao criar a conta.");
    }
  }

  function irParaLogin() {
    navigate("/login");
  }

  return (
    <div className="container-conta">
      <div className="conta">
        <h2>Criar Conta</h2>

        {erro && <p style={{ color: "red" }}>{erro}</p>}
        {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit">Criar Conta</button>
        </form>

        <p
          onClick={irParaLogin}
          style={{ cursor: "pointer", textAlign: "center", marginTop: "15px", color: "#2b6dfd" }}
        >
          Fazer Login
        </p>
      </div>
    </div>
  );
}

export default Conta;