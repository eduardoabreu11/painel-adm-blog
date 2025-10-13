import { useContext } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "../contexts/auth";
import RoutesOpen from "./RoutesOpen.js";
import RoutesPrivate from "./Routes.private.js";

export default function Routes() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      {user?.id_usuario ? <RoutesPrivate /> : <RoutesOpen />}
    </Router>
  );
}