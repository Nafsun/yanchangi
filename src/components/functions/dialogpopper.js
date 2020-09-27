import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import {Transition} from './panel';

function DialogPopper({Title, Describtion, Yes, No}) {
    return (
        <Dialog
            open={true}
            TransitionComponent={Transition}
            keepMounted
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description"
        >
            <DialogTitle id="alert-dialog-slide-title">{Title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    {Describtion}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={Yes} style={{color: "rgb(107, 43, 8)"}}>Yes</Button>
                <Button onClick={No} style={{color: "rgb(107, 43, 8)"}}>No</Button>
            </DialogActions>
        </Dialog>
    );
}

export default DialogPopper;