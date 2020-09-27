import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import {Transition} from './panel';

function DialogImager({PopBoxImageGet, PopBoxClosed2}) {
    return (
        <Dialog
            open={true}
            TransitionComponent={Transition}
            onBackdropClick={() => PopBoxClosed2()}
        >
            <img className="styleexpander" src={PopBoxImageGet} alt={"style"} />
        </Dialog>
    );
}

export default DialogImager;