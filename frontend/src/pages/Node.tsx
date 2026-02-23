import { useState, useMemo } from "react"

import { NodeCard } from "../components/NodeCard"

const DATA: Array<{ id: string; title: string; detail: string; state: "idle" | "busy" | "dead" }> = [
    { id: "n1", title: "blade-n1", detail: "blade-n1 detail", state: "idle" },
    { id: "n2", title: "blade-n2", detail: "blade-n2 detail", state: "idle" },
    { id: "n3", title: "blade-n3", detail: "blade-n3 detail", state: "busy" },
    { id: "n4", title: "blade-n4", detail: "blade-n4 detail", state: "idle" },
    { id: "n5", title: "blade-n5", detail: "blade-n5 detail", state: "dead" },
    { id: "n6", title: "blade-n6", detail: "blade-n6 detail", state: "idle" },
    { id: "n7", title: "blade-n7", detail: "blade-n7 detail", state: "dead" },
    { id: "n8", title: "blade-n8", detail: "blade-n8 detail", state: "idle" },
]

export function Node() {

    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = useMemo(() => {
        return DATA.filter((item) => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);
    
    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between bg-background  sticky top-0 z-10 p-4 shadow-sm">

                <div>
                    <h1 className="text-2xl font-bold text-indigo-600">Compute Node</h1>
                </div>

                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        className="w-full px-4 py-2 rounded-lg border border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all placeholder-gray-500 text-gray-700 bg-white hover:shadow-md"
                        type="text"
                        placeholder="Search node name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
            </div>
            <main className="grid grid-cols-3">
                {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                        <NodeCard
                            key={item.id}
                            cardTitle={item.title}
                            cardDetail={item.detail}
                            cardState={item.state}
                        />
                    ))
                ) : (
                    <p className="p-4 col-span-2 text-gray-500">No nodes found.</p>
                )}
            </main>
        </div>
    )
}