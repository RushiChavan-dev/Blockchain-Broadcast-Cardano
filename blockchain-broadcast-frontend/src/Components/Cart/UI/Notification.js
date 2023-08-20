import React from 'react';
import { Snackbar, makeStyles } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
    root: {
        top: theme.spacing(9),
        color: 'secondary',
    }
}));


export default function Notification(props) {

    const classes = useStyles();
    const { notify, setNotify } = props;

    const handleClose = (event, reason) => {
        setNotify({
            ...notify,
            isOpen: false
        });
    };
    return (
        <Snackbar
            className={classes.root}
            open={notify.isOpen}
            autoHideDuration={3000}
            anchorOrigin={notify.typeStyle === 'specific' ? { horizontal: 'right', vertical: 'top' } : { horizontal: 'center', vertical: 'top' }}
            onClose={handleClose}
        >
            <Alert
                severity={notify.type}
                onClose={handleClose}
            >
                {notify.message}
            </Alert>

        </Snackbar>
    );
}
