import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import ReportApi from "../../Api/ReportApi";
import ChannelApi from "../../Api/ChannelApi";
import UserApi from "../../Api/UserApi";
const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [getDataSuccess, setGetDataSuccess] = useState(false);
    const [recentActivities, setRecentActivities] = useState([
        {
            id: "channels",
            color: tokens("dark").greenAccent[500],
            data: [],
            key: 1,
        },
        {
            id: "reports",
            color: tokens("dark").blueAccent[300],
            data: [],
            key: 2,
        },
        {
            id: "users",
            color: tokens("dark").redAccent[500],
            data: [],
            key: 3,
        }
    ]);

    const createEmptyData = async () => {
        const dateNow = new Date(Date.now());

        const obj = {};
        for (let i = 0; i < 7; i++) {
            const formattedDate = dateNow.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
            obj[formattedDate] = 0;
            dateNow.setTime(dateNow.getTime() - 24 * 60 * 60 * 1000);
        }
        return obj;
    };
    const handleGetData = async () => {
        const copyRecentActivities = recentActivities;
        const recentUserListResponse = await UserApi.getRecentUserList();
        const recentChannelListResponse = await ChannelApi.getRecentChannelList();
        const recentReportListResponse = await ReportApi.getRecentAllReports();
        const users = await createEmptyData();
        let reports = await createEmptyData();
        let channels = await createEmptyData();
        for(let i = 0; i < recentUserListResponse.data.data.length; i++) {
            const obj = recentUserListResponse.data.data[i];
            const date = new Date(Date.parse(obj.date_joined));
            const day = date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
            users[day] = (users[day] || 0) + 1;
        }
        for(let i = 0; i < recentChannelListResponse.data.data.length; i++) {
            const obj = recentChannelListResponse.data.data[i];
            const date = new Date(Date.parse(obj.create_at));
            const day = date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
            channels[day] = (channels[day] || 0) + 1;
        }
        for(let i = 0; i < recentReportListResponse.data.data.length; i++) {
            const obj = recentReportListResponse.data.data[i];
            const date = new Date(Date.parse(obj.create_at));
            const day = date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
            reports[day] = (reports[day] || 0) + 1;
        }
        copyRecentActivities[0]["data"] = [];
        copyRecentActivities[1]["data"] = [];
        copyRecentActivities[2]["data"] = [];
        for (const key of Object.keys(channels)) {
            copyRecentActivities[0]["data"].unshift({
                x: key,
                y: channels[key],
            });
        }
        for (const key of Object.keys(reports)) {
            copyRecentActivities[1]["data"].unshift({
                x: key,
                y: reports[key],
            });
        }
        for (const key of Object.keys(users)) {
            copyRecentActivities[2]["data"].push({
                x: key,
                y: users[key]
            })
        }
        setRecentActivities(copyRecentActivities);
        setGetDataSuccess(true);
    };

    useEffect(() => {
        handleGetData();
    }, []);

    return (
        <ResponsiveLine
            data={getDataSuccess ? recentActivities : []}
            key={recentActivities.map((item) => item.key).join("-")}
            theme={{
                axis: {
                    domain: {
                        line: {
                            stroke: colors.grey[100],
                        },
                    },
                    legend: {
                        text: {
                            fill: colors.grey[100],
                        },
                    },
                    ticks: {
                        line: {
                            stroke: colors.grey[100],
                            strokeWidth: 1,
                        },
                        text: {
                            fill: colors.grey[100],
                        },
                    },
                },
                legends: {
                    text: {
                        fill: colors.grey[100],
                    },
                },
                tooltip: {
                    container: {
                        color: colors.primary[500],
                    },
                },
            }}
            colors={isDashboard ? { datum: "color" } : { scheme: "nivo" }} // added
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
                type: "linear",
                min: "auto",
                max: "auto",
                stacked: true,
                reverse: false,
            }}
            yFormat=" >-.2f"
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: "bottom",
                tickSize: 0,
                tickPadding: 5,
                tickRotation: 0,
                legend: isDashboard ? undefined : "date", // added
                legendOffset: 36,
                legendPosition: "middle",
            }}
            axisLeft={{
                orient: "left",
                tickValues: 5, // added
                tickSize: 3,
                tickPadding: 5,
                tickRotation: 0,
                legend: isDashboard ? undefined : "count", // added
                legendOffset: -40,
                legendPosition: "middle",
            }}
            enableGridX={false}
            enableGridY={false}
            pointSize={8}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
                {
                    anchor: "bottom-right",
                    direction: "column",
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: "left-to-right",
                    itemWidth: 80,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: "circle",
                    symbolBorderColor: "rgba(0, 0, 0, .5)",
                    effects: [
                        {
                            on: "hover",
                            style: {
                                itemBackground: "rgba(0, 0, 0, .03)",
                                itemOpacity: 1,
                            },
                        },
                    ],
                },
            ]}
        />
    );
};

export default LineChart;
