import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function DialogInfo(props) {
    return (
        <Dialog
            fullWidth={true} transitionDuration={{ enter: 1000, exit: 2000 }}
            open={true} onBackdropClick={() => props.PopBoxClosed()}
        >
            <DialogTitle>{props.PopBoxTitleGet ? props.PopBoxTitleGet : "Message"}</DialogTitle>
            {props.PopBoxTitleGet === "Share" ?
                <DialogContent>{props.PopBoxTextGet}</DialogContent>
            :
                <DialogContent>
                    <DialogContentText>{props.PopBoxTextGet}</DialogContentText>
                </DialogContent>
            }
        </Dialog>
    );
}

export default DialogInfo;