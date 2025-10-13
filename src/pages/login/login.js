import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import api from "../../constants/api.js";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { setUser } = useContext(AuthContext);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("ae")

    try {
      const response = await api.post("/usuarios/login", { email, senha });

      if (response.data) {
        // salva no contexto
       
        setUser(response.data);

        // salva no localStorage
        localStorage.setItem("usuario-blog", JSON.stringify(response.data));

        // seta token no axios para próximas requisições
        api.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;

        console.log("Login realizado!", response.data);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Erro no login, tente novamente");
    }
  }

  return (
    <div className="container-login">
      <div className="login">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;