import React from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useTheme, Box } from "@mui/material";
import { tokens } from "../theme";

export default function ConfirmDialog(props) {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { confirmDialog, handleCancel, handleOk } = props;
    return (
        <Dialog open={confirmDialog.isOpen} fontSize="20px">
            <DialogTitle>
                <Typography
                    variant="h4"
                    sx={{
                        borderBottom: "1px solid #cccc",
                        paddingBottom: "5px",
                    }}
                >
                    {confirmDialog.title}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography variant="p">{confirmDialog.content}</Typography>
            </DialogContent>
            <DialogActions>
                <Box
                    onClick={handleOk}
                    backgroundColor={colors.greenAccent[700]}
                    sx={{
                        p: 0.25,
                        "&:hover": {
                            backgroundColor: colors.greenAccent[500],
                            cursor: "pointer"
                        },
                    }}
                >
                    <Button>

                        Accept
                    
                    </Button>
                </Box>
                <Box
                    onClick={handleCancel}
                    backgroundColor={colors.redAccent[700]}
                    sx={{
                        p: 0.25,
                        "&:hover": {
                            backgroundColor: colors.redAccent[500],
                            cursor: "pointer",
                        },
                    }}
                >
                    <Button
                    >Cancel</Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
}
