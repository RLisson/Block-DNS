import type { Domain } from "../types/domain";

export const domainService = {
  async deleteDomain(id: number): Promise<void> { throw new Error("Not implemented"); },
  async updateDomain(id: number, url: string): Promise<Domain> { throw new Error("Not implemented"); },
  async getAllDomains(): Promise<Domain[]> { throw new Error("Not implemented"); }
};