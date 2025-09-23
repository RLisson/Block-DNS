import type { Domain } from "../types/domain";
import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Redirecionar para login ou disparar evento
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };

export default class domainService {
  static async deleteDomain(id: number): Promise<boolean> 
  {
    const response = await api.delete(`/domains/${id}`);
    return response.data.success;
  }

  static async updateDomain(id: number, url: string): Promise<Domain> 
  {
    const response = await api.put(`/domains/${id}`, { url });
    return response.data.success;
  }
  
  static async createDomain(urls: string[]): Promise<{ added: Domain[]; failed: string[] }> {
    const added: Domain[] = [];
    const failed: string[] = [];
    
    for (const url of urls) {
      try {
        if (!url.trim()) {
          continue; // Pular URLs vazias
        }
        const response = await api.post(`/domains`, { url });

        // Verificar se a resposta foi bem-sucedida
        if (response.status === 201) {
          added.push(response.data.data);
        } else {          
          failed.push(url);
        }
      } catch (error) {
        let errorMessage = 'Erro desconhecido';
        
        // Tratar erros específicos do Axios
        if (axios.isAxiosError(error)) {
          if (error.response?.data?.error) {
            errorMessage = error.response.data.error;
          } else if (error.response?.status === 400) {
            errorMessage = 'Dados inválidos';
          } else if (error.response?.status === 409) {
            errorMessage = 'Domínio já existe';
          } else if (error.response?.status && error.response.status >= 500) {
            errorMessage = 'Erro interno do servidor';
          } else {
            errorMessage = `Erro HTTP ${error.response?.status || 'desconhecido'}`;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        console.log(`Failed to add domain "${url}": ${errorMessage}`);
        failed.push(url);
      }
    }
    return { added, failed };
  }

  static async search(term: string): Promise<Domain[]> {
    const response = await api.get(`/domains/search`, {
      params: { q: term }
    });
    return response.data.data;
  }

  static async saveRpz(): Promise<boolean> {
    try {
      const response = await api.get(`/domains/rpz`);
      return response.data.success;
    } catch (error) {
      console.error('Erro ao gerar arquivo RPZ:', error);
      return false;
    }
  }
}