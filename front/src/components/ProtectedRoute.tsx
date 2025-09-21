import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { authenticated, loading } = useAuth();
    
    if (loading) {
        return <div>Carregando...</div>; // Ou algum componente de loading
    }

    return authenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default ProtectedRoute