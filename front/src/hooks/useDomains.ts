import type { Domain } from "../types/domain";
import { useState } from "react";

export const useDomains = () => {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteDomain = async (id: number) => {
        try {
            setLoading(true);
            // TODO: Implementar chamada para API
            setDomains(prev => prev.filter(domain => domain.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao deletar domínio');
        } finally {
            setLoading(false);
        }
    }

    const updateDomain = async (id: number, newUrl: string) => {
        try {
            setLoading(true);
            // TODO: Implementar chamada para API
            setDomains(prev => prev.map(domain => 
                domain.id === id ? { ...domain, url: newUrl } : domain
            ));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao atualizar domínio');
        } finally {
            setLoading(false);
        }
    }

    return {
        domains,
        setDomains,
        loading,
        error,
        deleteDomain,
        updateDomain
    };
}