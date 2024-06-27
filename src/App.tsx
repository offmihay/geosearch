import { BrowserRouter } from "react-router-dom";
import MainpageLayout from "./layouts/MainpageLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <MainpageLayout />
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
