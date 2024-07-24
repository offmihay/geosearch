import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routing from "./routes/app.route";
import AuthContextProvider from "./contexts/AuthContext/AuthContextProvider";
import ModalContextProvider from "./contexts/ModalContext/ModalContextProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <ModalContextProvider>
            <Routing />
          </ModalContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
