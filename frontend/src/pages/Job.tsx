import { useState } from "react"
import { Table, TableCaption, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"

interface JobModel{
    id: string,
    jobname: string,
    user: string,
    time: string,
    status: string
}

const generateJobData = (rows: number): JobModel[] => {
    return Array.from({ length: rows }, (_, index) => ({
        id: String(index + 1),
        jobname: "test",
        user: "u1",
        time: "12000",
        status: "running"
    }))
}

export function Job(){

    const data: JobModel[] = generateJobData(33)

    const [currentPage, setCurrentPage] = useState(1);
    const LIMIT_ROW = 10;
    const MAX_PAGE = Math.ceil(data.length / LIMIT_ROW);

    const incress = ()=>{
        setCurrentPage(prevCurrentPage => Math.min(prevCurrentPage + 1, MAX_PAGE))
    }

    const decress = ()=>{
        setCurrentPage(prevCurrentPage => Math.max(prevCurrentPage - 1, 1))
    }

        const displayedData: JobModel[] = data.slice(
            (currentPage - 1) * LIMIT_ROW,
            Math.min((currentPage - 1) * LIMIT_ROW + LIMIT_ROW, data.length)
        );

        return (
            <div className="flex flex-col min-h-screen bg-slate-50">
                <div className="flex items-center justify-between bg-white sticky top-0 z-10 p-4 shadow-md border-b">
                    <h1 className="text-2xl font-bold text-indigo-700 tracking-tight">Job Table</h1>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input
                            className="w-64 px-4 py-2 rounded-lg border border-indigo-300 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all placeholder-gray-500 text-gray-700 bg-white hover:shadow-md"
                            type="text"
                            placeholder="Search job name..."
                            //value={searchQuery}
                            //onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>
                <main className="flex-1 p-4">
                    <div className="overflow-x-auto rounded-lg shadow">
                        <Table className="min-w-full text-sm">
                            <TableCaption className="text-left text-gray-500 mb-2">Showing jobs {((currentPage - 1) * LIMIT_ROW) + 1} - {Math.min(currentPage * LIMIT_ROW, data.length)} of {data.length}</TableCaption>
                            <TableHeader>
                                <TableRow className="bg-indigo-100 text-indigo-700 sticky top-0">
                                    <TableHead className="py-2 px-4">ID</TableHead>
                                    <TableHead className="py-2 px-4">Job Name</TableHead>
                                    <TableHead className="py-2 px-4">User</TableHead>
                                    <TableHead className="py-2 px-4">Time</TableHead>
                                    <TableHead className="py-2 px-4">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {displayedData.map((item, idx) => (
                                    <TableRow key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-100"}>
                                        <TableCell className="py-2 px-4 font-medium">{item.id}</TableCell>
                                        <TableCell className="py-2 px-4">{item.jobname}</TableCell>
                                        <TableCell className="py-2 px-4">{item.user}</TableCell>
                                        <TableCell className="py-2 px-4">{item.time}</TableCell>
                                        <TableCell className="py-2 px-4">
                                            <span className={
                                                item.status === "running"
                                                    ? "bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold"
                                                    : item.status === "failed"
                                                    ? "bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold"
                                                    : "bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold"
                                            }>
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex flex-row justify-between items-center mt-4">
                        <span className="text-gray-600 text-sm">Page {currentPage} of {MAX_PAGE}</span>
                        <div className="flex gap-2">
                            <button
                                className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md font-bold text-white transition-colors disabled:bg-indigo-300"
                                onClick={decress}
                                disabled={currentPage === 1}
                            >
                                Prev
                            </button>
                            <button
                                className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md font-bold text-white transition-colors disabled:bg-indigo-300"
                                onClick={incress}
                                disabled={currentPage === MAX_PAGE}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        );
}