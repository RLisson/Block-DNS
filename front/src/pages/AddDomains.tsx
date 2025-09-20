import { useState } from "react";
import Header from "../components/Header";
import SingleDomain from "../components/SingleDomain";
import MultipleDomains from "../components/MultipleDomains";
import Button from "../components/Button";
import "./AddDomains.css";


function AddDomains() {
    const [multipleDomains, setMultipleDomains] = useState<boolean>(true);

    const handleClick = (prevValue: boolean) => {
        setMultipleDomains(!prevValue);
    };

    return (
        <div>
            <Header />
            <main>
            <h2>Add Domains</h2>
            <Button onClick={() => handleClick(multipleDomains)} label={multipleDomains ? "Single Domain" : "Multiple Domains"}/>
            {multipleDomains ? (
                <MultipleDomains />
            ) : (
                <SingleDomain />
            )}
            <Button onClick={() => {}} label="Submit" />
            </main>
        </div>
    );
}

export default AddDomains;