import { useEffect, useCallback, useState, useRef } from "react";

interface RFIDConfig {
    length?: number;
    timeout?: number;
}

interface UseRFIDScanner {
    code: string;
    isReading: boolean;
    reset: () => void;
}

export const useRFIDScanner = (
    onScan: (code: string) => void,
    config: RFIDConfig = {},
): UseRFIDScanner => {
    const { length = 10, timeout = 200 } = config;

    const [code, setCode] = useState<string>("");
    const [isReading, setIsReading] = useState<boolean>(false);
    const codeRef = useRef<string>("");
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    const reset = useCallback(() => {
        setCode("");
        codeRef.current = "";
        setIsReading(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = undefined;
        }
    }, []);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            // If we're in the timeout period after a successful scan, reset first
            if (isReading) {
                reset();
            }

            if (e.key === "Enter") {
                if (codeRef.current.length >= 1) { // Changed allow any length if Enter is pressed, user said "length" config but usually scanners send Enter at end
                    // Actually provided code says: if (codeRef.current.length === length) {
                    // But real scanners might differ. User provided logic:
                    /*
                     if (e.key === "Enter") {
                         if (codeRef.current.length === length) {
                         onScan(codeRef.current);
                         ...
                         } else {
                         reset();
                         }
                     }
                    */
                    // I should stick to user's provided code but maybe relax length check if feasible?
                    // No, user explicitly asked to "duplicate how it works". I will copy EXACTLY.
                    // Exception: The user's code only works if length is EXACTLY matched.
                    // Wait, usually scanners are configured to length.
                    // Let's copy it exactly first.
                    if (codeRef.current.length === length) {
                        onScan(codeRef.current);
                        setIsReading(true);

                        timeoutRef.current = setTimeout(() => {
                            reset();
                        }, timeout);
                    } else {
                        // If length doesn't match, maybe it's strict. 
                        // But what if the card is shorter? 
                        // I'll stick to the user's provided implementation.
                        reset();
                    }
                } else {
                    reset();
                }
            } else if (/^\d$/.test(e.key)) {
                // Only accept numbers as per user snippet
                const newCode = codeRef.current + e.key;

                // Only update if we haven't reached the maximum length
                if (newCode.length <= length) {
                    codeRef.current = newCode;
                    setCode(newCode);
                }
            } else {
                // Ignore other keys? User code says:
                /*
                } else {
                    reset();
                }
                */
                // So any non-digit non-enter key resets it? That might be aggressive if user types elsewhere.
                // But for a public scanner page, it's fine.
                reset();
            }
        };

        document.addEventListener("keypress", handleKeyPress);

        return () => {
            document.removeEventListener("keypress", handleKeyPress);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [length, timeout, onScan, reset, isReading]);

    return { code, isReading, reset };
};
