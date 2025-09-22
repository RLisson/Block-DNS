import "./SingleDomain.css"

function SingleDomain({domains, setDomains}: {domains: string[]; setDomains: React.Dispatch<React.SetStateAction<string[]>>}) {
    return (
        <div>
            <input 
            type="text" 
            placeholder="Enter domain"
            value={domains[0]}
            onChange={(e) => setDomains([e.target.value])} />
        </div>
    );
}

export default SingleDomain