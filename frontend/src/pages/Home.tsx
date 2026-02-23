import { useAuth } from "../hook/useAuth";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip as ReTooltip,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

export function Home() {
    const { user } = useAuth();

    // Mocked cluster details and metrics — replace with real API data as needed
    const cluster = {
        name: "Demo Cluster",
        nodes: 12,
        running: 9,
        pending: 2,
        failed: 1,
        kubernetesVersion: "v1.28.0",
        uptime: "14 days 3h",
    };

    const pieData = [
        { name: "Running", value: cluster.running },
        { name: "Pending", value: cluster.pending },
        { name: "Failed", value: cluster.failed },
    ];

    const COLORS = ["#10B981", "#F59E0B", "#EF4444"];

    // Time-series data for CPU and RAM percentages (sample)
    const timeseries = [
        { time: "10:00", cpu: 35, ram: 62 },
        { time: "10:05", cpu: 42, ram: 58 },
        { time: "10:10", cpu: 50, ram: 64 },
        { time: "10:15", cpu: 48, ram: 66 },
        { time: "10:20", cpu: 55, ram: 70 },
        { time: "10:25", cpu: 60, ram: 72 },
        { time: "10:30", cpu: 58, ram: 68 },
    ];

    return (
        <main className="flex flex-col h-full gap-4 p-4">
            <div className="flex flex-row gap-4">
                {/* First part: cluster details */}
                <div className="flex-1 bg-white/5 rounded-lg p-4 shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Cluster Details</h2>
                    {/* Cards row */}
                    <div className="flex flex-row gap-4 mb-4">
                        {/* Card: Current job in node */}
                        <div className="flex-1 bg-white/10 rounded-lg p-4 shadow border border-slate-200">
                            <div className="text-sm text-muted-foreground mb-1">Current Job in Node</div>
                            <div className="font-bold text-xl text-blue-700">Job #42: Data Processing</div>
                            <div className="text-xs text-gray-500 mt-1">Node: node-7 | Status: Running</div>
                        </div>
                        {/* Card: Utilization percent */}
                        <div className="flex-1 bg-white/10 rounded-lg p-4 shadow border border-slate-200">
                            <div className="text-sm text-muted-foreground mb-1">Utilization Percent</div>
                            <div className="flex flex-row items-center gap-4">
                                <div>
                                    <div className="font-bold text-lg text-blue-600">CPU</div>
                                    <div className="text-2xl font-bold">{timeseries[timeseries.length-1].cpu}%</div>
                                </div>
                                <div>
                                    <div className="font-bold text-lg text-orange-600">RAM</div>
                                    <div className="text-2xl font-bold">{timeseries[timeseries.length-1].ram}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <div className="text-sm text-muted-foreground">Name</div>
                            <div className="font-medium">{cluster.name}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Nodes</div>
                            <div className="font-medium">{cluster.nodes}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">K8s Version</div>
                            <div className="font-medium">{cluster.kubernetesVersion}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Uptime</div>
                            <div className="font-medium">{cluster.uptime}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Owner</div>
                            <div className="font-medium">{user ?? "—"}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">Health</div>
                            <div className="font-medium">{cluster.failed > 0 ? "Degraded" : "Healthy"}</div>
                        </div>
                    </div>
                </div>

                {/* Second part: pie chart of node state */}
                <div className="w-80 bg-white/5 rounded-lg p-4 shadow-sm">
                    <h2 className="text-lg font-semibold mb-3">Node State</h2>
                    <div style={{ width: "100%", height: 220 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={4}>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <ReTooltip formatter={(value: number) => `${value} nodes`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Third part: combined CPU and RAM line chart */}
            <div className="bg-white/5 rounded-lg p-4 shadow-sm flex-1">
                <h2 className="text-lg font-semibold mb-3">CPU & RAM Usage (percent)</h2>
                <div style={{ width: "100%", height: 320 }}>
                    <ResponsiveContainer>
                        <LineChart data={timeseries} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                            <ReTooltip formatter={(value: number) => `${value}%`} />
                            <Legend />
                            <Line type="monotone" dataKey="cpu" stroke="#3B82F6" strokeWidth={2} dot={{ r: 2 }} />
                            <Line type="monotone" dataKey="ram" stroke="#F97316" strokeWidth={2} dot={{ r: 2 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </main>
    );
}