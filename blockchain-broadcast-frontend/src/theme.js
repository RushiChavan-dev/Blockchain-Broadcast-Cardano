import { createTheme } from '@material-ui/core/styles';

const globalTheme = createTheme({
    palette: {
        primary: {
            main: "#7A9EA7"
        }
    }
});

const theme = createTheme(
    {
        overrides: {
            MuiCircularProgress: {
                root: {
                    color: "#333e48",
                    "& .MuiCircularProgress-colorPrimary": {

                        color: "#333e48",
                        fontSize: "10rem"
                    },
                    "$colorPrimary": {
                        color: "#333e48",

                    },
                    "& .MuiCircularProgress-svg.MuiCircularProgress-circle": {
                        color: "#333e48",
                    },
                    "& .MuiCircularProgress-indeterminate": {
                        color: "#333e48",
                    },
                    "& .MuiCircularProgress-root": {
                        left: "43%",
                        position: "absolute",
                        top: "44vh",
                    },
                }
            },

            MuiSelect: {
                root: {
                    fontSize: "14px",
                },
                icon: {
                    color: "#333e48",
                },

            },
            MuiButton: {
                root: {
                    backgroundColor: globalTheme.palette.primary.main,
                    fontSize: "14px",
                },
                label: {
                    color: globalTheme.palette.primary.contrastText
                }
            },
            MuiInputBase: {
                root: {
                    fontSize: "12px",
                    color: "#333e48",
                },
            },
            MuiMenuItem: {
                root: {
                    fontSize: "14px",
                    color: "#333e48",
                },
            },
            MuiOutlinedInput: {
                root: {
                    borderRadius: "0px",
                    fontSize: "14px",
                    borderColor: globalTheme.palette.primary.main,
                    "&:hover $notchedOutline": {
                        borderColor: globalTheme.palette.primary.main,
                    },
                    "&$focused $notchedOutline": {
                        borderColor: globalTheme.palette.primary.main,
                    },
                    "& .MuiOutlinedInput-input": {
                        padding: "10.5px 10px",
                    },
                }
            }, MuiFormLabel: {
                root: {
                    color: "#333e48"
                }
            }, MuiInput: {
                underline: {
                    "&:before": {
                        borderBottom: "1px solid #333e48",
                    }
                }
            }
        }
    },
    globalTheme
);

export default theme;
