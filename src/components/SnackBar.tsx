import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import React, { useState } from 'react';
import { SnackBarProps } from '../types';



function SnackBar(props: SnackBarProps) {
    const [open, setOpen] = React.useState(props.data.open);
    const [soverity, setSoverity] = useState(props.data.type)
    const handleClick = () => {
        setOpen(true);
    };
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    return (
        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Alert onClose={handleClose} severity={soverity} sx={{ width: '100%' }}>
                   {props.data.message}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default SnackBar