import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Fab from '@material-ui/core/Fab';
import {Transition} from '../functions/panel';

export function Loading(){
    return (
        <Dialog
            TransitionComponent={Transition}
            fullWidth={true} //transitionDuration={{ enter: 1000, exit: 2000 }}
            open={true}
        >
            <DialogTitle>Please Wait</DialogTitle>
            <DialogContent>
                <CircularProgress size={28} style={{color: "rgb(107, 43, 8)"}} thickness={5}/>
            </DialogContent>
        </Dialog>
    );
}

export function JustLoading(){
    return (
        <div className="loading3"><Fab size="small"><CircularProgress size={25} style={{color: "rgb(107, 43, 8)"}} thickness={5}/></Fab></div>
    );
}

export function TopLoading(){
    return (
        <div className="loading3"><Fab size="small"><CircularProgress size={25} style={{color: "rgb(107, 43, 8)"}} thickness={5}/></Fab></div>
    );
}

export function ChangeLoading(){
    return (
        <div className="loading3"><Fab size="small"><CircularProgress size={25} style={{color: "rgb(107, 43, 8)"}} thickness={5}/></Fab></div>
    );
}

export function UploadLoading(){
    return (
        <div className="loading3"><Fab size="small"><CircularProgress size={25} style={{color: "rgb(107, 43, 8)"}} thickness={5}/></Fab></div>
    );
}

export function InnerLoading(){
    return (
        <div className="loading3"><Fab size="small"><CircularProgress size={25} style={{color: "rgb(107, 43, 8)"}} thickness={5}/></Fab></div>
    );
}

export function CurrentLoading(){
    return (
        <div align="center" className="loading4"><Fab size="small"><CircularProgress size={25} style={{color: "rgb(107, 43, 8)"}} thickness={5}/></Fab><br/><br/><br/></div>
    );
}

export function InsideLoading(){
    return (
        <CircularProgress size={28} style={{color: "rgb(107, 43, 8)"}} thickness={5}/>
    );
}

export function DialogLoader(props){
    return (
        <Dialog
            fullWidth={true} transitionDuration={{ enter: 1000, exit: 2000 }}
            open={true}
        >
            <DialogTitle>{props.PopBoxTitleGet ? props.PopBoxTitleGet : "Please Wait"}</DialogTitle>
            <DialogContent>
                <CircularProgress size={28} style={{color: "rgb(107, 43, 8)"}} thickness={5}/>
            </DialogContent>
        </Dialog>
    );
}