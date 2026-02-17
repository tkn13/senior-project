import { useState, useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "./ui/chart";

interface NodeCardProp {
    cardTitle: string,
    cardDetail: string,
    cardState: "idle" | "busy" | "dead"
}

type TimeRange = "30m" | "1hr" | "6hr" | "12hr" | "1D";

const TIME_RANGES: TimeRange[] = ["30m", "1hr", "6hr", "12hr", "1D"];

const STATE_COLORS: Record<"idle" | "busy" | "dead", string> = {
    idle: "bg-green-500",
    busy: "bg-yellow-500",
    dead: "bg-red-500"
};

const CHART_CONFIG = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)"
    }
} satisfies ChartConfig;

const generateData = (startMin: number, endMin: number, baseValue: number) => {
    const result = [];
    for (let i = startMin; i <= endMin; i++) {
        const timestamp = `10:${i.toString().padStart(2, '0')}`;
        const value = baseValue + Math.floor(Math.random() * 11) - 5;
        result.push({ time: timestamp, cpu: value, ram: value + 10 });
    }
    return result;
};

const getButtonClassName = (isActive: boolean, isDisabled: boolean) =>
    `px-2 py-1 mb-1 rounded-sm font-sm transition-all ${
        isActive
            ? "bg-indigo-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`;




export function NodeCard(props: NodeCardProp) {
    const [selectedMetric, setSelectedMetric] = useState<"cpu" | "ram">("cpu");
    const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>("30m");
    const isDisabled = props.cardState === "dead";

    const simulatedData = useMemo(() => generateData(0, 30, 80), []);

    const timeRangeButtons = useMemo(() =>
        TIME_RANGES.map((item) => (
            <button
                key={item}
                onClick={() => setSelectedTimeRange(item)}
                disabled={isDisabled}
                className={`px-2 py-1 m-1 rounded-sm font-sm transition-all ${
                    selectedTimeRange === item
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
                {item}
            </button>
        )),
        [selectedTimeRange, isDisabled]
    );

    return (
        <Card className={`m-4 relative transition-transform ${!isDisabled ? "hover:scale-105 cursor-pointer" : ""}`}>
            <CardHeader>
                <CardTitle className="text-xl">{props.cardTitle}</CardTitle>
                <CardDescription>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${STATE_COLORS[props.cardState]}`} />
                        <p className="text-lg">{props.cardState}</p>
                    </div>
                </CardDescription>
                <CardAction>
                    <div className="flex items-center gap-2">
                        <img src="/cpu.png" alt="CPU" className="w-6 h-6" />
                        <p className="font-bold text-gray-800">85%</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <img src="/memory.png" alt="RAM" className="w-6 h-6" />
                        <p className="font-bold text-gray-800">4.6/8 GB</p>
                    </div>
                </CardAction>
            </CardHeader>
            <CardContent>
                <div className={`flex flex-col justify-center items-end-safe mb-4 ${isDisabled ? "pointer-events-none opacity-50" : ""}`}>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSelectedMetric("cpu")}
                            disabled={isDisabled}
                            className={getButtonClassName(selectedMetric === "cpu", isDisabled)}
                        >
                            CPU
                        </button>
                        <button
                            onClick={() => setSelectedMetric("ram")}
                            disabled={isDisabled}
                            className={getButtonClassName(selectedMetric === "ram", isDisabled)}
                        >
                            RAM
                        </button>
                    </div>
                    <div>
                        {timeRangeButtons}
                    </div>
                </div>

                <ChartContainer config={CHART_CONFIG}>
                    <LineChart
                        accessibilityLayer
                        data={simulatedData}
                        margin={{
                            left: 12,
                            right: 12
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="time"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey={selectedMetric}
                            type="natural"
                            stroke="var(--color-desktop)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            {isDisabled && (
                <div className="absolute inset-0 bg-red-300/25 rounded-lg" />
            )}
        </Card>
    );
}