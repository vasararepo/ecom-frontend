import { useRoutes } from "react-router-dom";
import { appRoutes } from "./routes/app-routes";

const App = () => {
  return useRoutes(appRoutes);
};

export default App;
