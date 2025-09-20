export interface Domain {
    id: number;
    url: string;
}

export interface DomainOperation {
    addDomain: (domain: string) => Promise<void>;
    deleteDomain: (domain: string) => Promise<void>;
    updateDomain: (oldDomain: string, newDomain: string) => Promise<void>;
    getAllDomains: () => Promise<Domain[]>;
}