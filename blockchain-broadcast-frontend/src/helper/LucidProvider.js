import React, { useState, useEffect } from "react";
import { Lucid, Blockfrost } from "lucid-cardano";
import { LucidContext } from './LucidContext';

export const LucidProvider = ({ children }) => {
    const [lucid, setLucid] = useState(null);
    const [isLoading, setIsLoading] = useState(true);  // <-- Add loading state

    useEffect(() => {
        const instantiateLucid = async () => {
            const lucidInstance = await Lucid.new(
                new Blockfrost("https://cardano-preprod.blockfrost.io/api/v0", "preprod0nmqzrUnd4dQFb4U371gLO6iGYkxWaXK"),
                "Preprod",
            );
            setLucid(lucidInstance);
            setIsLoading(false);  // <-- Update loading state once instantiation is done
        }

        instantiateLucid();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;  // <-- Render a loading indication or a spinner
    }

    return (
        <LucidContext.Provider value={lucid}>
            {children}
        </LucidContext.Provider>
    );
}
