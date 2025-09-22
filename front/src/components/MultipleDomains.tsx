import "./MultipleDomains.css"

function MultipleDomains({ domains, setDomains }: { domains: string[]; setDomains: React.Dispatch<React.SetStateAction<string[]>> }) {
    return (
        <div>
            <textarea
                placeholder="Enter domains, one per line"
                value={domains.join("\n")}
                onChange={(e) => setDomains(e.target.value.split("\n"))}
            ></textarea>
        </div>
    );
}

export default MultipleDomains