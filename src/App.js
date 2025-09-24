import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import background from "./imagens/imagemControleWeb.webp";
import PagesRoutes from "./components/PagesRoutes";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <div
      class="appContainer"
      style={{
        backgroundImage: `url(${background})`,
        // backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <PagesRoutes />
    </div>
  );
}
