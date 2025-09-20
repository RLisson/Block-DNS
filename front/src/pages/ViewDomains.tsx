import { useDomains } from "../hooks/useDomains";
import type { Domain } from "../types/domain";
import Header from "../components/Header";
import ListItem from "../components/ListItem";
import "./ViewDomains.css";

function ViewDomains() {
    const { domains, deleteDomain, updateDomain } = useDomains();

    return (
        <div>
            <Header />
            <main>
            <h2>View Domains</h2>
            <ul>
                {domains.map((domain: Domain) => (
                    <ListItem 
                        key={domain.id}
                        id={domain.id}
                        domain={domain.url} 
                        deleteFunction={deleteDomain} 
                        editFunction={updateDomain}
                    />
                ))}
            </ul>
            </main>
        </div>
    );
}

export default ViewDomains;