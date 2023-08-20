import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, makeStyles, IconButton } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

const useStyles = makeStyles(theme => ({
    dialog: {
        padding: theme.spacing(2),
        position: 'absolute',
        top: theme.spacing(25)
    },
    dialogTitle: {
        textAlign: 'center'
    },
    dialogContent: {
        textAlign: 'center'
    },
    dialogAction: {
        justifyContent: 'center'
    },
    titleIcon: {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.error.light,
        '&:hover': {
            cursor: 'default'
        },
        '& .MuiSvgIcon-root': {
            fontSize: '4rem',
        }
    }
}));

export default function SignInFirstDialog(props) {

    const { signInFirstDialog, setSignInFirstDialog } = props;
    const classes = useStyles();

    return (

        <Dialog open={signInFirstDialog.isOpen} classes={{ paper: classes.dialog }}>
            <DialogTitle className={classes.dialogTitle}>
                <IconButton disableRipple className={classes.titleIcon}>
                    <ErrorOutlineIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <Typography variant="h6">
                    {signInFirstDialog.title}
                </Typography>
                <Typography variant="subtitle2">
                    {signInFirstDialog.subTitle}
                </Typography>
            </DialogContent>
            <DialogActions className={classes.dialogAction}>

                <div>
                    <button
                        className="btn btn-light"
                        onClick={() => setSignInFirstDialog({ ...signInFirstDialog, isOpen: false })}>
                        Cancel
                    </button>
                </div>
                <div >
                    <button
                        className="btn btn-primary"
                        onClick={function redirect() {
                            setSignInFirstDialog({ ...signInFirstDialog, isOpen: false });
                            window.location.href = "/auth";
                        }}>
                        Sign In
                    </button>
                </div>
            </DialogActions>
        </Dialog>
    );
}
