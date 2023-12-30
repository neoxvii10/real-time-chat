import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import ReportApi from "../../../Api/ReportApi";
import { IconButton } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import Tooltip from "@mui/material/Tooltip";
import ConfirmDialog from "../../components/ConfirmDialog";
import { toast } from "react-toastify";

const Report = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [confirmDialog, setConfirmDialog] = useState({
        title: "",
        content: "",
        isOpen: false,
        report: {},
        isDelete: false,
    });
    const [totalReports, setTotalReports] = useState([]);

    const getReportData = async () => {
        const response = await ReportApi.getAllReports();
        setTotalReports(response.data.reverse());
    };

    const cancelDialog = () => {
        setConfirmDialog({
            isOpen: false,
        });
    };

    const acceptDialog = async () => {
        setConfirmDialog({
            isOpen: false,
        });
        if (confirmDialog.isDelete) {
            const response = await ReportApi.deleteReport(
                confirmDialog.report.id
            );
            if (response.status) {
                toast.error("Error while deleting report", {
                    theme: theme.palette.mode,
                });
            } else {
                toast.success("Successfully deleted report", {
                    theme: theme.palette.mode,
                });
                getReportData();
            }
        } else {
            const response = await ReportApi.processReport(
                confirmDialog.report.id
            );
            if (response.status) {
                toast.error("Error while processing report", {
                    theme: theme.palette.mode,
                });
            } else {
                toast.success("Successfully processed report", {
                    theme: theme.palette.mode,
                });
                getReportData();
            }
        }
    };

    const deleteReport = (report) => {
        console.log(report);
        setConfirmDialog({
            title: "Delete Report",
            content: "Are you sure you want to delete this report?",
            isOpen: true,
            report: report,
            isDelete: true,
        });
    };

    const markAsDoneReport = (report) => {
        if (!report.processed) {
            setConfirmDialog({
                title: "Process report",
                content: "Are you sure to process this report?",
                isOpen: true,
                report: report,
                isDelete: false,
            });
        } else {
            toast.info("This report has been processed", {
                theme: theme.palette.mode,
            });
        }
    };

    useEffect(() => {
        getReportData();
    }, []);

    return (
        <Box m="20px">
            <Header title="REPORTS" subtitle="Manage the Reports" />
            {totalReports.map((report, i) => (
                <Accordion defaultExpanded id={`report-${report.id}`}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box
                            display="flex"
                            sx={{
                                justifyContent: "space-between",
                                width: "100%",
                            }}
                        >
                            <Box
                                display="flex"
                                gap="10px"
                                alignContent="center"
                                marginLeft="10px"
                            >
                                <Typography
                                    color={colors.greenAccent[500]}
                                    variant="h5"
                                >
                                    {report.report_type}
                                </Typography>
                                <Typography
                                    padding="3px 6px 0"
                                    fontSize="10px"
                                    backgroundColor={
                                        report.processed
                                            ? colors.greenAccent[500]
                                            : colors.blueAccent[500]
                                    }
                                >
                                    {report.processed ? "Solved" : "Processing"}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography>{report.create_at}</Typography>
                            </Box>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails position="relative">
                        <Typography>Reporter: {report.reporter}</Typography>
                        <Typography>
                            {report.report_type === "REPORT_USER"
                                ? "Reported User:"
                                : "Reported Channel:"}{" "}
                            {report.report_type === "REPORT_USER"
                                ? report.reported_user
                                : report.reported_channel}
                        </Typography>
                        <Typography>Reason: {report.reason}</Typography>
                        <Box
                            display="flex"
                            marginTop="10px"
                            gap="10px"
                            alignItems="start"
                            alignContent="start"
                        >
                            <Box
                                borderRadius="999px"
                                backgroundColor={colors.blueAccent[500]}
                                onClick={() => markAsDoneReport(report)}
                            >
                                <Tooltip title="Mark as done">
                                    <IconButton>
                                        <DoneIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Box
                                borderRadius="999px"
                                backgroundColor={colors.redAccent[500]}
                                onClick={() => deleteReport(report)}
                            >
                                <Tooltip title="Delete">
                                    <IconButton>
                                        <ClearIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            ))}
            <ConfirmDialog
                confirmDialog={confirmDialog}
                handleCancel={cancelDialog}
                handleOk={acceptDialog}
            />
        </Box>
    );
};

export default Report;
