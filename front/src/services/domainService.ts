import type { Domain } from "../types/domain";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default class domainService {
  static async deleteDomain(id: number): Promise<boolean> 
  {
    const response = await axios.delete(`${BACKEND_URL}/domains/${id}`);
    return response.data.success;
  }

  static async updateDomain(id: number, url: string): Promise<Domain> 
  {
    const response = await axios.put(`${BACKEND_URL}/domains/${id}`, { url });
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
        const response = await axios.post(`${BACKEND_URL}/domains`, { url });

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

  static async saveRpz(): Promise<boolean> {
    try {
      const response = await axios.get(`${BACKEND_URL}/domains/rpz`);
      return response.data.success;
    } catch (error) {
      console.error('Erro ao gerar arquivo RPZ:', error);
      return false;
    }
  }
}