import { useState } from "react";
import SingleDomain from "../components/SingleDomain";
import MultipleDomains from "../components/MultipleDomains";

function AddDomains() {
    const [multipleDomains, setMultipleDomains] = useState<boolean>(true);

    const handleClick = (prevValue: boolean) => {
        setMultipleDomains(!prevValue);
    };

    return (
        <div>
            <h1>Add Domains Page</h1>
            <button onClick={() => handleClick(multipleDomains)}>
                {multipleDomains ? 
                "Single Domain" : 
                "Multiple Domains"}
            </button>
            {multipleDomains ? (
                <MultipleDomains />
            ) : (
                <SingleDomain />
            )}
        </div>
    );
}

export default AddDomains;