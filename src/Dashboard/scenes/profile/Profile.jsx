import { Box, Button, TextField, Typography, useTheme } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import { useState } from "react";
import "./Profile.css";
import { tokens } from "../../theme";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import UpdateIcon from "@mui/icons-material/Update";
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
function generate(element) {
    return [0, 1, 2].map((value) =>
        React.cloneElement(element, {
            key: value,
        })
    );
}

const initialValues = {
    first_name: "",
    last_name: "",
    email: "",
    contact: "",
    username: "",
    password: "",
    confirmPassword: "",
};

const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
    first_name: yup.string().required("required"),
    last_name: yup.string().required("required"),
    email: yup.string().email("invalid email").required("required"),
    contact: yup
        .string()
        .matches(phoneRegExp, "Phone number is not valid")
        .required("required"),
    username: yup.string().required("required"),
    password: yup.string().required("required"),
    confirmPassword: yup.string().required("required"),
});

const Profile = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [dense, setDense] = React.useState(false);
    const [secondary, setSecondary] = React.useState(false);

    const handleSubmit = () => {};

    return (
        <Box m="20px">
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Header title="PROFILE" subtitle="Welcome to admin profile" />
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
                        <UpdateIcon sx={{ mr: "10px" }} />
                        UPDATE
                    </Button>
                </Box>
            </Box>

            {/* <Box textAlign="center">
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                >
                    <Box
                        size={100}
                        color="white"
                        style={{
                            borderRadius: 50,
                            textAlign: "center",
                        }}
                        position="relative"
                        display="inline-block"
                        margin="auto"
                    >
                        <Box
                            component="img"
                            src="/assets/flower.jpg"
                            alt="Hình ảnh"
                            width={100}
                            height={100}
                            objectFit="cover"
                            borderRadius="999px"
                        ></Box>
                        <Box
                            position="absolute"
                            sx={{
                                right: 2,
                                bottom: 2,
                                "&:hover": {
                                    cursor: "pointer",
                                },
                            }}
                            backgroundColor="black"
                            padding="5px"
                            style={{
                                borderRadius: 50,
                            }}
                            display="flex"
                        >
                            <CameraAltIcon></CameraAltIcon>
                        </Box>
                    </Box>
                    <Typography
                        variant="h2"
                        color={colors.grey[100]}
                        fontWeight="bold"
                        sx={{ mb: "5px" }}
                    >
                        Admin
                    </Typography>
                    <Typography variant="h5" color={colors.greenAccent[400]}>
                        I am an admin
                    </Typography>
                </Box>
            </Box>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-around"
                mt="20px"
            >
                <Box>
                    <Typography variant="h4">Basic Information</Typography>
                    <Box
                        marginTop="10px"
                        display="flex"
                        flexDirection="column"
                        border="1px solid #ccc"
                        width="100%"
                    >
                        <Box display="flex" flexDirection="row"
                            justifyContent="space-between"
                            gap="100px"
                            padding="15px"
                            borderBottom="1px solid #ccc"
                        >
                            <Typography 
                                fontWeight="bold"
                                variant="h6"
                            >
                                Username
                            </Typography>
                            <Typography 
                            variant="p"
                            sx={{
                                textDecoration: "underline"
                            }}
                            display="inline"
                            >
                                Pham Tung Thuy
                            </Typography>
                        </Box>
                        <Box display="flex" flexDirection="row"
                            justifyContent="space-between"
                            gap="50px"
                            padding="15px"
                            borderBottom="1px solid #ccc"

                        >
                            <Typography 
                                fontWeight="bold"
                                variant="h6"
                            >
                                Username
                            </Typography>
                            <Typography 
                            variant="p"
                            sx={{
                                textDecoration: "underline"
                            }}
                            display="inline"
                            >
                                Pham Tung Thuy
                            </Typography>
                        </Box>
                        <Box display="flex" flexDirection="row"
                            justifyContent="space-between"
                            gap="50px"
                            padding="15px"
                            borderBottom="1px solid #ccc"

                        >
                            <Typography 
                                fontWeight="bold"
                                variant="h6"
                            >
                                Username
                            </Typography>
                            <Typography 
                            variant="p"
                            sx={{
                                textDecoration: "underline"
                            }}
                            display="inline"
                            >
                                Pham Tung Thuy
                            </Typography>
                        </Box>
                        <Box display="flex" flexDirection="row"
                            justifyContent="space-between"
                            gap="50px"
                            padding="15px"
                            borderBottom="1px solid #ccc"

                        >
                            <Typography 
                                fontWeight="bold"
                                variant="h6"
                            >
                                Username
                            </Typography>
                            <Typography 
                            variant="p"
                            sx={{
                                textDecoration: "underline"
                            }}
                            display="inline"
                            >
                                Pham Tung Thuy
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box height="50vh" width="1px" backgroundColor="white" />
                <Box>
                    <Typography variant="h4">Basic Information</Typography>
                </Box>
            </Box> */}
            <Box display="flex" justifyContent="space-between">
                <Box
                    border="1px solid #ccc"
                    borderRadius="5px"
                    display="flex"
                    flexDirection="column"
                    padding="20px"
                    width="60%"
                >
                    <Typography variant="h4">General Information</Typography>
                    <Box marginTop="20px" width="100%">
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
                                <Box
                                    component="form"
                                    width="100%"
                                    onSubmit={handleSubmit}
                                >
                                    <Box
                                        display="grid"
                                        gap="30px"
                                        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                                        sx={{
                                            "& > div": "span 4",
                                        }}
                                    >
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Username"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.username}
                                            name="username"
                                            error={
                                                !!touched.username &&
                                                !!errors.username
                                            }
                                            helperText={
                                                touched.username &&
                                                errors.username
                                            }
                                            sx={{ gridColumn: "span 4" }}
                                        />
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="First Name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.first_name}
                                            name="first_name"
                                            error={
                                                !!touched.first_name &&
                                                !!errors.first_name
                                            }
                                            helperText={
                                                touched.first_name &&
                                                errors.first_name
                                            }
                                            sx={{ gridColumn: "span 2" }}
                                        />
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Last Name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.last_name}
                                            name="last_name"
                                            error={
                                                !!touched.last_name &&
                                                !!errors.last_name
                                            }
                                            helperText={
                                                touched.last_name &&
                                                errors.last_name
                                            }
                                            sx={{ gridColumn: "span 2" }}
                                        />
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Email"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.email}
                                            name="email"
                                            error={
                                                !!touched.email &&
                                                !!errors.email
                                            }
                                            helperText={
                                                touched.email && errors.email
                                            }
                                            sx={{ gridColumn: "span 4" }}
                                        />
                                        <TextField
                                            fullWidth
                                            variant="filled"
                                            type="text"
                                            label="Contact Number"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            value={values.contact}
                                            name="contact"
                                            error={
                                                !!touched.contact &&
                                                !!errors.contact
                                            }
                                            helperText={
                                                touched.contact &&
                                                errors.contact
                                            }
                                            sx={{ gridColumn: "span 4" }}
                                        />
                                    </Box>
                                    <Box
                                        display="flex"
                                        justifyContent="start"
                                        mt="20px"
                                    >
                                        <Button
                                            type="submit"
                                            color="secondary"
                                            variant="contained"
                                        >
                                            Update
                                        </Button>
                                    </Box>
                                </Box>
                            )}
                        </Formik>
                    </Box>
                    <Box></Box>
                </Box>
                <Box
                    width="35%"
                    display="flex"
                    flexDirection="column"
                    height="50vh"
                    justifyContent="space-between"
                >
                    <Box height="55%">
                        <Box
                            sx={{
                                backgroundImage: `url('/assets/flower.jpg')`,
                                height: "80%",
                                objectFit: "cover",
                                position: "relative",
                            }}
                            borderRadius="10px"
                        >
                            <Box
                                position="absolute"
                                bottom="-75px"
                                sx={{
                                    right: 0,
                                    left: 0,
                                    textAlign: "center",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                            >
                                <Box
                                    size="150px"
                                    color="white"
                                    style={{
                                        borderRadius: 50,
                                        textAlign: "center",
                                    }}
                                    position="relative"
                                    display="inline-block"
                                    margin="auto"
                                >
                                    <Box
                                        component="img"
                                        src="/assets/flower.jpg"
                                        alt="Hình ảnh"
                                        width="150px"
                                        height="150px"
                                        objectFit="cover"
                                        borderRadius="999px"
                                    ></Box>
                                    <Box
                                        position="absolute"
                                        sx={{
                                            right: 5,
                                            bottom: 5,
                                            "&:hover": {
                                                cursor: "pointer",
                                            },
                                        }}
                                        backgroundColor="black"
                                        padding="5px"
                                        style={{
                                            borderRadius: 50,
                                        }}
                                        display="flex"
                                    >
                                        <CameraAltIcon></CameraAltIcon>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box height="40%" textAlign="center">
                        <Typography
                            variant="h2"
                            color={colors.grey[100]}
                            fontWeight="bold"
                            sx={{ m: "10px 0 0 0" }}
                        >
                            Admin
                        </Typography>
                        <Typography
                            variant="h5"
                            color={colors.greenAccent[500]}
                        >
                            I am admin
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Profile;
