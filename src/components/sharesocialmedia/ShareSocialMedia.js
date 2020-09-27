import React from 'react';
import Facebook from '@material-ui/icons/Facebook';
import Instagram from '@material-ui/icons/Instagram';
import Twitter from '@material-ui/icons/Twitter';
import WhatsApp from '@material-ui/icons/WhatsApp';
import Grid from '@material-ui/core/Grid';

const sizeoflogo = {
    color: "rgb(107, 43, 8)",
    width: "1.3em",
    height: "1.3em"
}

export function ShareSocialMedia(props){
    return (
        <span>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=https://textailng.com/${props.linkname}?s=${props.id}&quote=${props.text}`} target='__blank'>
                <Facebook style={sizeoflogo}/>
            </a>
            <a href={`https://www.twitter.com/intent/tweet?text=${props.text} - https://textailng.com/${props.linkname}?s=${props.id}`} target='__blank'>
                <Twitter style={sizeoflogo}/>
            </a>
            <a href={`whatsapp://send?text=${props.text} - https://textailng.com/${props.linkname}?s=${props.id}`} target='__blank'>
                <WhatsApp style={sizeoflogo}/>
            </a>
            <Instagram style={sizeoflogo}/>
        </span>
    );
}

export function ShareSocialMedia2(props){
    return (
        <div className="socialalign">
            <Grid container direction="row" spacing={2}>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=https://textailng.com/${props.linkname}?s=${props.id}&quote=${props.text}`} target='__blank'>
                    <Facebook style={sizeoflogo}/>
                </a>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                <a href={`https://www.twitter.com/intent/tweet?text=${props.text} - https://textailng.com/${props.linkname}?s=${props.id}`} target='__blank'>
                    <Twitter style={sizeoflogo}/>
                </a>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                <a href={`whatsapp://send?text=${props.text} - https://textailng.com/${props.linkname}?s=${props.id}`} target='__blank'>
                    <WhatsApp style={sizeoflogo}/>
                </a>
                </Grid>
            </Grid>
        </div>
    );
}

export function ShareSocialMedia3(props){
    return (
        <div className="socialalign">
            <Grid container direction="row" spacing={2}>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=https://textailng.com/${props.linkname}?affiliate=${props.id}&quote=${props.text}`} target='__blank'>
                    <Facebook style={sizeoflogo}/>
                </a>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                <a href={`https://www.twitter.com/intent/tweet?text=${props.text} - https://textailng.com/${props.linkname}?affiliate=${props.id}`} target='__blank'>
                    <Twitter style={sizeoflogo}/>
                </a>
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                <a href={`whatsapp://send?text=${props.text} - https://textailng.com/${props.linkname}?affiliate=${props.id}`} target='__blank'>
                    <WhatsApp style={sizeoflogo}/>
                </a>
                </Grid>
            </Grid>
        </div>
    );
}