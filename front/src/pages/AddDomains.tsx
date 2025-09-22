import { useState } from "react";
import Header from "../components/Header";
import SingleDomain from "../components/SingleDomain";
import MultipleDomains from "../components/MultipleDomains";
import Button from "../components/Button";
import domainService from "../services/domainService";
import "./AddDomains.css";


function AddDomains() {
    const [multipleDomains, setMultipleDomains] = useState<boolean>(true);
    const [domains, setDomains] = useState<string[]>([]);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (domains.length === 0) {
            alert("Please add at least one domain.");
            return;
        }
        const { failed } = await domainService.createDomain(domains);
        if (failed.length > 0) {
            alert("Some domains failed to submit");
            console.log("Failed domains:", failed);
            setDomains(failed);
            await domainService.saveRpz(); // Save RPZ even if some domains failed
            return;
        }
        setDomains([]);
        await domainService.saveRpz(); // Save RPZ after successful submission
        alert("Domains submitted successfully!");
    };

    const handleClick = (prevValue: boolean) => {
        setMultipleDomains(!prevValue);
    };

    return (
        <div>
            <Header />
            <main>
            <h2>Add Domains</h2>
            <Button onClick={() => handleClick(multipleDomains)} label={multipleDomains ? "Multiple Domains" : "Single Domain"}/>
            {multipleDomains ? (
                <MultipleDomains domains={domains} setDomains={setDomains} />
            ) : (
                <SingleDomain domains={domains} setDomains={setDomains} />
            )}
            <button className="custom-button" onClick={handleSubmit}>Submit</button>
            </main>
        </div>
    );
}

export default AddDomains;