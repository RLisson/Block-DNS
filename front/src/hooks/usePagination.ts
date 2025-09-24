import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface UsePaginationResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  changeLimit: (limit: number) => void;
  refresh: () => void;
}

export const usePagination = <T>(
  endpoint: string,
  initialOptions: PaginationOptions = {}
): UsePaginationResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginatedResponse<T>['pagination'] | null>(null);
  const [options, setOptions] = useState<PaginationOptions>({
    page: 1,
    limit: 10,
    sortBy: 'id',
    sortOrder: 'ASC',
    ...initialOptions
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      if (options.page) queryParams.append('page', options.page.toString());
      if (options.limit) queryParams.append('limit', options.limit.toString());
      if (options.sortBy) queryParams.append('sortBy', options.sortBy);
      if (options.sortOrder) queryParams.append('sortOrder', options.sortOrder);

      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api/v1';
      const url = `${baseUrl}${endpoint}?${queryParams.toString()}`;

      const response = await api.get(url);
      
      if (response.data.success) {
        setData(response.data.data);
        setPagination(response.data.pagination);
      } else {
        throw new Error('Erro na resposta da API');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados';
      setError(errorMessage);
      console.error('Erro ao buscar dados paginados:', err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goToPage = useCallback((page: number) => {
    setOptions(prev => ({ ...prev, page }));
  }, []);

  const nextPage = useCallback(() => {
    if (pagination?.hasNext) {
      setOptions(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
    }
  }, [pagination?.hasNext]);

  const prevPage = useCallback(() => {
    if (pagination?.hasPrev) {
      setOptions(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }));
    }
  }, [pagination?.hasPrev]);

  const changeLimit = useCallback((limit: number) => {
    setOptions(prev => ({ ...prev, limit, page: 1 })); // Reset para página 1 ao mudar limite
  }, []);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    pagination,
    goToPage,
    nextPage,
    prevPage,
    changeLimit,
    refresh
  };
};