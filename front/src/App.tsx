import { BrowserRouter, Routes, Route, Navigate } from "react-router"
import AddDomains from "./pages/AddDomains"
import ViewDomains from "./pages/ViewDomains"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import { AuthProvider } from "./components/AuthProvider"
import Config from "./pages/Config"
import CreateUser from "./pages/CreateUser"
import ManageUsers from "./pages/ManageUsers"

const ProtectedRoutes = [
  {
    path: "/add-domains",
    element: <AddDomains />
  },
  {
    path: "/view-domains",
    element: <ViewDomains />
  },
  {
    path: "/config",
    element: <Config />
  },
  {
    path: "/create-user",
    element: <CreateUser />
  },
  {
    path: "/gerenciar-usuarios",
    element: <ManageUsers />
  }
]

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          {ProtectedRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute>
                  {element}
                </ProtectedRoute>
              }
            />
          ))}
          <Route path="/" element={<Navigate to="/view-domains" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
