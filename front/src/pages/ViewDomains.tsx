import { useState } from "react";
import { usePagination } from "../hooks/usePagination";
import type { Domain } from "../types/domain";
import Header from "../components/Header";
import ListItem from "../components/ListItem";
import PaginationControls from "../components/PaginationControls";
import domainService from "../services/domainService";
import "./ViewDomains.css";

function ViewDomains() {
    const {
        data: domains,
        loading,
        error,
        pagination,
        goToPage,
        nextPage,
        prevPage,
        changeLimit,
        refresh
    } = usePagination<Domain>('/domains', {
        page: 1,
        limit: 10,
        sortBy: 'id',
        sortOrder: 'ASC'
    });

    const [searchTerm, setSearchTerm] = useState<string>('');

    const handleDelete = async (id: number) => {
        try {
            const response = await domainService.deleteDomain(id);
            if (response) {
                refresh(); // Refresh the current page after deletion
            } else {
                alert('Erro ao deletar domínio');
            }
        } catch (error) {
            alert(`Erro ao deletar domínio: ${error}`);
        }
    };

    const handleUpdate = async (id: number, newUrl: string) => {
        try {
            const response = await domainService.updateDomain(id, newUrl);
            if (response) {
                await domainService.saveRpz(); // Save RPZ after updating a domain
                refresh(); // Refresh the current page after update
            } else {
                alert('Erro ao atualizar domínio');
            }
        } catch {
            alert(`Erro ao atualizar domínio`);
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <main>
                    <h2>View Domains</h2>
                    <div className="loading">Carregando domínios...</div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Header />
                <main>
                    <h2>View Domains</h2>
                    <div className="error">
                        Erro ao carregar domínios: {error}
                        <button onClick={refresh} className="retry-btn">
                            Tentar novamente
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div>
            <Header />
            <main>
                <h2>View Domains</h2>

                <input type="text" placeholder="Buscar domínio..." className="search-input" onChange={(e) => setSearchTerm(e.target.value)}/>
                
                {domains.length === 0 ? (
                    <div className="no-domains">
                        <p>Nenhum domínio encontrado.</p>
                    </div>
                ) : (
                    <>
                        <ul className="domains-list">
                            {domains.filter(domain => 
                                domain.url.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((domain: Domain, index: number) => (
                                <div 
                                    key={domain.id}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <ListItem 
                                        id={domain.id}
                                        domain={domain.url} 
                                        deleteFunction={handleDelete} 
                                        editFunction={handleUpdate}
                                    />
                                </div>
                            ))}
                        </ul>

                        {pagination && (
                            <PaginationControls
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                hasNext={pagination.hasNext}
                                hasPrev={pagination.hasPrev}
                                onPageChange={goToPage}
                                onNext={nextPage}
                                onPrev={prevPage}
                                onLimitChange={changeLimit}
                                currentLimit={pagination.limit}
                                total={pagination.total}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default ViewDomains;