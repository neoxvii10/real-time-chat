import {Box, useTheme} from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";
import { useState, useEffect } from "react";
import ReportApi from "../../../Api/ReportApi";
const Report = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [totalReports, setTotalReports] = useState([]);

    const handleReport = async () => {
        const userReportResponse = await ReportApi.getUserReports();
        const channelReportResponse = await ReportApi.getChannelReports();
        const reports = [...userReportResponse.data, ...channelReportResponse.data];
        setTotalReports(reports);
    };

    useEffect(() => {
        handleReport();
    }, []);

    return (    <Box m="20px">
    <Header title="REPORTS" subtitle="Manage the Reports" />
    {
        totalReports.map((report, i) => (
            <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography color={colors.greenAccent[500]} variant="h5">
                An Important Question
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                malesuada lacus ex, sit amet blandit leo lobortis eget.
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
    }
  </Box>)

}

export default Report;