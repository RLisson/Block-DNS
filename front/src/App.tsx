import { BrowserRouter, Routes, Route } from "react-router"
import AddDomains from "./pages/AddDomains"
import ViewDomains from "./pages/ViewDomains"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AddDomains />} />
        <Route path="/add-domains" element={<AddDomains />} />
        <Route path="/view-domains" element={<ViewDomains />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
