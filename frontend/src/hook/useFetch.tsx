import { useEffect, useState } from "react";

interface FetchState<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
}


//temp zone
const generateData = (startMin: number, endMin: number, baseValue: number)=> {
    const result = [];
    console.log("Gen data was called")
    for (let i = startMin; i <= endMin; i++) {
        const timestamp = `10:${i.toString().padStart(2, '0')}`;
        const value = baseValue + Math.floor(Math.random() * 11) - 5;
        result.push({ time: timestamp, cpu: value, ram: value + 10 });
    }
    return result;
};
// end temp zone

export function useFetch<T>(url: string): FetchState<T> {

    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect( () => {

        const abortController = new AbortController();

        const fetchData = async () => {
            setIsLoading(true);

            try {

                const response = generateData(0, 30, 80);

                setData(response as T);
                setError(null);

            } catch (err: any) {
                if (err.name !== 'AbortError'){
                    setError(err.message || "Something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData()

        return () => abortController.abort();
    }, [url]);

    return {data, isLoading, error};
}