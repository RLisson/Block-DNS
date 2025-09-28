import { useState, useEffect, useCallback } from "react";
import { usePagination } from "../hooks/usePagination";
import type { Domain } from "../types/domain";
import Header from "../components/Header";
import ListItem from "../components/ListItem";
import PaginationControls from "../components/PaginationControls";
import LoadingSpinner from "../components/LoadingSpinner";
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
        refresh,
        setSearchTerm
    } = usePagination<Domain>('/domains', {
        page: 1,
        limit: 10,
        sortBy: 'id',
        sortOrder: 'ASC'
    });

    const [searchInput, setSearchInput] = useState<string>('');
    const [operationLoading, setOperationLoading] = useState<{ [key: number]: 'deleting' | 'updating' | null }>({});

    // Debounce para a busca
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setSearchTerm(searchInput);
        }, 500); // 500ms de delay

        return () => clearTimeout(timeoutId);
    }, [searchInput, setSearchTerm]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    }, []);


    const handleDelete = async (id: number) => {
        try {
            setOperationLoading(prev => ({ ...prev, [id]: 'deleting' }));
            const response = await domainService.deleteDomain(id);
            if (response) {
                await domainService.saveRpz(); // Save RPZ after deleting a domain
                refresh(); // Refresh the current page after deletion
            } else {
                alert('Erro ao deletar domínio');
            }
        } catch (error) {
            alert(`Erro ao deletar domínio: ${error}`);
        } finally {
            setOperationLoading(prev => ({ ...prev, [id]: null }));
        }
    };

    const handleUpdate = async (id: number, newUrl: string) => {
        try {
            setOperationLoading(prev => ({ ...prev, [id]: 'updating' }));
            const response = await domainService.updateDomain(id, newUrl);
            if (response) {
                await domainService.saveRpz(); // Save RPZ after updating a domain
                refresh(); // Refresh the current page after update
            } else {
                alert('Erro ao atualizar domínio');
            }
        } catch {
            alert(`Erro ao atualizar domínio`);
        } finally {
            setOperationLoading(prev => ({ ...prev, [id]: null }));
        }
    };

    if (loading) {
        return (
            <div>
                <Header />
                <main>
                    <h2>View Domains</h2>
                    <LoadingSpinner message="Carregando domínios" size="medium" />
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

                <input 
                    type="text" 
                    placeholder="Buscar domínio..." 
                    className="search-input" 
                    value={searchInput}
                    onChange={handleSearchChange}
                />
                
                {domains.length === 0 ? (
                    <div className="no-domains">
                        <p>{searchInput ? 'Nenhum domínio encontrado para a busca.' : 'Nenhum domínio encontrado.'}</p>
                    </div>
                ) : (
                    <>
                        <ul className="domains-list">
                            {domains.map((domain: Domain, index: number) => (
                                <div 
                                    key={domain.id}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <ListItem 
                                        id={domain.id}
                                        domain={domain.url} 
                                        deleteFunction={handleDelete} 
                                        editFunction={handleUpdate}
                                        externalLoading={operationLoading[domain.id]}
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