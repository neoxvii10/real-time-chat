import "./Dashboard.css";
import Header from "../../components/Header";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ReportIcon from '@mui/icons-material/Report';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import { useState, useEffect } from "react";
import UserApi from "../../../Api/UserApi";
import ReportApi from "../../../Api/ReportApi";
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import ChannelApi from "../../../Api/ChannelApi";

interface ReportType {
    id: BigInteger;
    report_type: string;
    create_at: string;
    reason: string;
}

const Dashboard = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [userReports, setUserReports] = useState([]);
    const [channelReports, setChannelReports] = useState([]);
    const [userList, setUserList] = useState([]);
    const [channelList, setChannelList] = useState([]);
    const [totalReports, setTotalReports] = useState<ReportType[]>([]);

    const handleReport = async () => {
        const userReportResponse = await ReportApi.getUserReports();
        const channelReportResponse = await ReportApi.getChannelReports();
        setUserReports(userReportResponse.data);
        setChannelReports(channelReportResponse.data);
        const reports = [...userList, ...channelList];
        setTotalReports(reports);
    }

    const handleUserList = async () => {
        const userListResponse = await UserApi.getUserList();
        setUserList(userListResponse.data);
    }

    const handleChannelList = async () => {
        const channelListResponse = await ChannelApi.getChannelList();
        console.log(channelListResponse.data);
        setChannelList(channelListResponse.data);
    }

    useEffect(() => {
        handleReport();
        handleUserList();
        handleChannelList();
    }, [])

    return (
        <Box m="20px">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Header
                    title="DASHBOARD"
                    subtitle="Welcome to admin dashboard"
                />
                <Box>
                    <Button
                        sx={{
                            backgroundColor: colors.blueAccent[700],
                            color: colors.grey[100],
                            fontSize: "14px",
                            fontWeight: "bold",
                            padding: "10px 20px",
                        }}
                    >
                        <DownloadOutlinedIcon sx={{ mr: "10px" }} />
                        Download Reports
                    </Button>
                </Box>
            </Box>

            {/* GRID & CHART */}
            <Box
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="140px"
                gap="20px"
            >
                <Box
                    gridColumn="span 3"
                    sx={{
                        backgroundColor: colors.primary[400],
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={userReports.length}
                        subtitle="User Reports"
                        progress="0.75"
                        increase="+14%"
                        icon={
                            <NoAccountsIcon
                                sx={{
                                    color: colors.greenAccent[600],
                                    fontSize: "26px",
                                }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    sx={{
                        backgroundColor: colors.primary[400],
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={channelReports.length}
                        subtitle="Channel Reports"
                        progress="0.5"
                        increase="+21%"
                        icon={
                            <ReportIcon
                                sx={{
                                    color: colors.greenAccent[600],
                                    fontSize: "26px",
                                }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    sx={{
                        backgroundColor: colors.primary[400],
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={userList.length}
                        subtitle="New Clients"
                        progress="0.75"
                        increase="+14%"
                        icon={
                            <PersonAddIcon
                                sx={{
                                    color: colors.greenAccent[600],
                                    fontSize: "26px",
                                }}
                            />
                        }
                    />
                </Box>
                <Box
                    gridColumn="span 3"
                    sx={{
                        backgroundColor: colors.primary[400],
                    }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    <StatBox
                        title={channelList.length}
                        subtitle="New Channels"
                        progress="0.80"
                        increase="+43%"
                        icon={
                            <GroupAddIcon
                                sx={{
                                    color: colors.greenAccent[600],
                                    fontSize: "26px",
                                }}
                            />
                        }
                    />
                </Box>

                {/* ROW 2 */}
                <Box
                    gridColumn="span 8"
                    gridRow="span 2"
                    sx={{
                        backgroundColor: colors.primary[400],
                    }}
                >
                    <Box
                        mt="25px"
                        p="0 30px"
                        display="flex "
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Box>
                            <Typography
                                variant="h5"
                                fontWeight="600"
                                color={colors.grey[100]}
                            >
                                Recent Activities
                            </Typography>
                            <Typography
                                variant="h3"
                                fontWeight="bold"
                                color={colors.greenAccent[500]}
                            >
                                $59,342.32
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton>
                                <DownloadOutlinedIcon
                                    sx={{
                                        fontSize: "26px",
                                        color: colors.greenAccent[500],
                                    }}
                                />
                            </IconButton>
                        </Box>
                    </Box>
                    <Box height="250px" m="-20px 0 0 0">
                        <LineChart isDashboard={true} />
                    </Box>
                </Box>
                <Box
                    gridColumn="span 4"
                    gridRow="span 2"
                    sx={{ backgroundColor: colors.primary[400] }}
                    overflow="auto"
                >
                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        borderBottom={`4px solid ${colors.primary[500]}`}
                        sx={{ colors: colors.grey[100] }}
                        p="15px"
                    >
                        <Typography
                            color={colors.grey[100]}
                            variant="h5"
                            fontWeight="600"
                        >
                            Recent Reports
                        </Typography>
                    </Box>
                    {totalReports.map((report, i) => (
                            <Box
                            key={`${report.id}`}
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            borderBottom={`4px solid ${colors.primary[500]}`}
                            p="15px"
                        >
                            <Box>
                                <Typography
                                    color={colors.greenAccent[500]}
                                    variant="h5"
                                    fontWeight="600"
                                >
                                    {report.id}
                                </Typography>
                                <Typography color={colors.grey[100]}>
                                    {report.reason}
                                </Typography>
                            </Box>
                            <Box color={colors.grey[100]}>
                                {report.create_at}
                            </Box>
                            <Box
                                sx={{
                                    backgroundColor: colors.greenAccent[500],
                                }}
                                p="5px 10px"
                                borderRadius="4px"
                            >
                                ${report.report_type}
                            </Box>
                        </Box>
                    ))}

                </Box>
                {/* ROW 3 */}
                <Box
                    gridColumn="span 4"
                    gridRow="span 2"
                    sx={{
                        backgroundColor: colors.primary[400],
                    }}
                    p="30px"
                >
                    <Typography variant="h5" fontWeight="600">
                        Campaign
                    </Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mt="25px"
                    >
                        <ProgressCircle size="125" />
                        <Typography
                            variant="h5"
                            color={colors.greenAccent[500]}
                            sx={{ mt: "15px" }}
                        >
                            $48,352 revenue generated
                        </Typography>
                        <Typography>
                            Includes extra misc expenditures and costs
                        </Typography>
                    </Box>
                </Box>
                <Box
                    gridColumn="span 4"
                    gridRow="span 2"
                    sx={{
                        backgroundColor: colors.primary[400],
                    }}
                >
                    <Typography
                        variant="h5"
                        fontWeight="600"
                        sx={{ padding: "30px 30px 0 30px" }}
                    >
                        Sales Quantity
                    </Typography>
                    <Box height="250px" mt="-20px">
                        <BarChart isDashboard={true} />
                    </Box>
                </Box>
                <Box
                    gridColumn="span 4"
                    gridRow="span 2"
                    sx={{
                        backgroundColor: colors.primary[400],
                    }}
                    padding="30px"
                >
                    <Typography
                        variant="h5"
                        fontWeight="600"
                        sx={{ marginBottom: "15px" }}
                    >
                        User Geography Chart
                    </Typography>
                    <Box height="200px">
                        <GeographyChart isDashboard={true} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Dashboard;
