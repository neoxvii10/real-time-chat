import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useState, useEffect } from "react";
import ReportApi from "../../Api/ReportApi";
import ChannelApi from "../../Api/ChannelApi";

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [recentActivities, setRecentActivities] = useState([
        {
            id: "channels",
            color: tokens("dark").greenAccent[500],
            data: [
              {
                  "x": "18/12/2023",
                  "y": 0
              },
              {
                  "x": "19/12/2023",
                  "y": 0
              },
              {
                  "x": "20/12/2023",
                  "y": 0
              },
              {
                  "x": "21/12/2023",
                  "y": 0
              },
              {
                  "x": "22/12/2023",
                  "y": 0
              },
              {
                  "x": "23/12/2023",
                  "y": 0
              },
              {
                  "x": "24/12/2023",
                  "y": 0
              }
          ],
            key: 1,
        },
        {
            id: "reports",
            color: tokens("dark").blueAccent[300],
            data: [
              {
                  "x": "18/12/2023",
                  "y": 0
              },
              {
                  "x": "19/12/2023",
                  "y": 0
              },
              {
                  "x": "20/12/2023",
                  "y": 0
              },
              {
                  "x": "21/12/2023",
                  "y": 0
              },
              {
                  "x": "22/12/2023",
                  "y": 1
              },
              {
                  "x": "23/12/2023",
                  "y": 0
              },
              {
                  "x": "24/12/2023",
                  "y": 0
              }
          ],
            key: 2,
        },
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
        const userReportResponse = await ReportApi.getUserReports();
        const channelReportResponse = await ReportApi.getChannelReports();
        const channelListResponse = await ChannelApi.getChannelList();
        const reportData = [
            ...userReportResponse.data,
            ...channelReportResponse.data,
        ];
        const dateNow = new Date(Date.now());
        dateNow.setTime(dateNow.getTime() - 7 * 24 * 60 * 60 * 1000);
        let reports = await createEmptyData();
        let channels = await createEmptyData();
        reports = await reportData.reduce((acc, obj) => {
            const date = new Date(Date.parse(obj.create_at));
            if (date.getTime() >= dateNow.getTime()) {
                const day = date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
                acc[day] = (acc[day] || 0) + 1;
            }
            return acc;
        }, reports);

        channels = await channelListResponse.data.reduce((acc, obj) => {
            const date = new Date(Date.parse(obj.create_at));
            if (date.getTime() >= dateNow.getTime()) {
                const day = date.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                });
                acc[day] = (acc[day] || 0) + 1;
            }
            return acc;
        }, channels);
        const copyRecentActivities = recentActivities;
        copyRecentActivities[0]["data"] = [];
        copyRecentActivities[1]["data"] = [];
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
        setRecentActivities(copyRecentActivities);
        console.log(recentActivities);
    };


    useEffect(() => {

    handleGetData();

    }, [recentActivities]);

    return (
        <ResponsiveLine
            data={recentActivities}
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
                legend: isDashboard ? undefined : "transportation", // added
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
