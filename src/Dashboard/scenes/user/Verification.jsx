import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { Box, Button, TextField } from "@mui/material";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import UserApi from "../../../Api/UserApi";
import { toast } from 'react-toastify';
import {  useTheme} from "@mui/material";

const initialValues = {
    verification_code: ""
};

const verificationRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
    verification_code: yup
        .string()
        .required("required"),
});

const Verification = () => {
    const theme = useTheme();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const navigate = useNavigate();
    const handleSubmit = async (values) => {
        const response = await UserApi.verifyUser(values);
        console.log(response);
        if (response.status) {
            toast.error(response.data.message, {
                theme: theme.palette.mode
            })
        } else {
            await toast.success("Xác thực thành công, tài khoản đã được khởi tạo.", {
                theme: theme.palette.mode
            })
            navigate('/admin/users');
        }
    }
    return (
        <Box m="20px">
            <Header title="Verification" subtitle="Verify account before signing up successfully" />
            <Formik
                onSubmit={handleSubmit}
                initialValues={initialValues}
                validationSchema={checkoutSchema}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                }) => (
                    <form 
                    onSubmit={handleSubmit}>
                        <Box
                            width="100%"
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": {
                                    gridColumn: isNonMobile
                                        ? undefined
                                        : "span 4",
                                },
                            }}
                        >
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                label="Verification Code"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.verification_code}
                                name="verification_code"
                                error={!!touched.verification_code && !!errors.verification_code}
                                helperText={touched.verification_code && errors.verification_code}
                                sx={{ gridColumn: "span 1" }}
                            />
                        </Box>
                        <Box display="flex" justifyContent="start" mt="40px">
                            <Button
                                type="submit"
                                color="secondary"
                                variant="contained"
                            >
                                Verify
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
        </Box>
    );
};

export default Verification;
