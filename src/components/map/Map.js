import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Cancel from '@material-ui/icons/Cancel';
import { GoogleMap, withScriptjs, withGoogleMap, Marker, InfoWindow, DirectionsRenderer } from 'react-google-maps';
import imageloading from "../images/loading.gif";
import { JustLoading } from '../loading/Loading';
import {Helmet} from "react-helmet";

function Map() {

    let userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const maploc = useSelector(m => m.maproute);
    const [directionGet, directionSet] = useState(null);
    const [InfoGet, InfoSet] = useState(false);
    const [NormalGet, NormalSet] = useState(true);

    const [MyRTLocationXGet, MyRTLocationXSet] = useState(maploc.length === 0 ? 9.077751 : parseFloat(maploc[1]));
    const [MyRTLocationYGet, MyRTLocationYSet] = useState(maploc.length === 0 ? 8.6774567 : parseFloat(maploc[2]));

    const [OtherRTLocationXGet, OtherRTLocationXSet] = useState(null);
    const [OtherRTLocationYGet, OtherRTLocationYSet] = useState(null);

    const [NetworkCheckGet, NetworkCheckSet] = useState(null);
    const [OfflineGet, OfflineSet] = useState(false);

    const sizeoflogomap = {
        color: "white",
        width: "1.2em",
        height: "1.2em",
        paddingTop: "8px"
    }

    const goback = () => {
        window.history.back();
    }

    const loc = window.location.search;
    let loc_new = loc.slice(3);

    useEffect(() => {
        fetch("/networkchecker").then((e) => {
            return e.json();
        }).then((e) => {
            if (e.message === "online") {
                if (navigator.onLine) {
                    if (loc_new !== "") {
                        let latitude = '';
                        let longitude = '';
                        let escape = false;
                        for (let i of loc_new) {
                            if (i !== ",") {
                                if (escape === false) {
                                    latitude += i;
                                } else {
                                    longitude += i;
                                }
                            } else {
                                escape = true;
                            }
                        }
                        OtherRTLocationXSet(latitude === '' ? 9.077751 : parseFloat(latitude)); //9.077751
                        OtherRTLocationYSet(longitude === '' ? 8.6774567 : parseFloat(longitude)); //8.6774567
                        NetworkCheckSet(true);
                    } else {
                        if (maploc.length !== 0) {
                            OtherRTLocationXSet(parseFloat(maploc[1]));
                            OtherRTLocationYSet(parseFloat(maploc[2]));
                            NetworkCheckSet(true);
                        } else {
                            goback();
                        }
                    }
                } else {
                    NetworkCheckSet(false);
                    OfflineSet(true);
                }
            }
        }).catch(() => {
            NetworkCheckSet(false);
            OfflineSet(true)
        });
    }, [loc_new, maploc, OtherRTLocationXSet, OtherRTLocationYSet]);

    useEffect(() => {
        if (userinfo === null) {
            document.getElementById("hidelogin").click();
        } else if (loc_new === "") {
            if (maploc.length === 0) {
                goback();
            }
        }
    }, [userinfo, maploc, loc_new]);

    if(NetworkCheckGet === null && OfflineGet === false){
        return <JustLoading/>;
    }

    const getRoute = () => {
        if ("undefined" !== typeof google) {
            const DirectionsService = new window.google.maps.DirectionsService();

            DirectionsService.route({
                origin: new window.google.maps.LatLng(MyRTLocationXGet, MyRTLocationYGet),
                destination: new window.google.maps.LatLng(OtherRTLocationXGet, OtherRTLocationYGet),
                travelMode: window.google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    directionSet(result);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            });
        }
    }

    const showPosition = (position) => { //set your location
        MyRTLocationXSet(position.coords.latitude);
        MyRTLocationYSet(position.coords.longitude);
        getRoute();
    }

    const geolocationError = (e) => {
        console.log(e.message);
    }

    const onToggleOpen = () => {
        InfoSet(!InfoGet);
    }

    if(directionGet === null && NormalGet === false){
        if (navigator.geolocation) {
            console.log("Getting Live Location");
            navigator.geolocation.getCurrentPosition(showPosition, geolocationError, {enableHighAccuracy:true, maximumAge: 0});
        } else {
            console.log("Geolocation is not supported by this browser");
            NormalSet(true);
        }
    }

    const LiveMap = withScriptjs(withGoogleMap(() =>
        <GoogleMap
            defaultZoom={16}
            defaultCenter={{ lat: MyRTLocationXGet, lng: MyRTLocationYGet }}
        >
            {directionGet && <DirectionsRenderer directions={directionGet} />}
        </GoogleMap>
    ));

    const NormalMap = withScriptjs(withGoogleMap(() =>
        <GoogleMap
            defaultZoom={16}
            defaultCenter={{ lat: OtherRTLocationXGet, lng: OtherRTLocationYGet }}
        >
            <Marker
                position={{ lat: OtherRTLocationXGet, lng: OtherRTLocationYGet }} //lat: 9.077751, lng: 8.6774567
                onClick={() => onToggleOpen()}
            >
                {InfoGet && <InfoWindow
                    onCloseClick={() => onToggleOpen()}
                >
                    <div>
                        {maploc.length !== 0 ? maploc[3] : "Map"}
                    </div>
                </InfoWindow>}
            </Marker>
        </GoogleMap>
    ));

    const NormalMapSet = () => {
        NormalSet(true);
    }

    const LiveMapSet = () => {
        NormalSet(false);
        directionSet(null);
    }

    return (
        <div className="downsmall3">
            <p
                className="abovelinkcomment2"><span id="commentnav" onClick={() => goback()}>
                    <Cancel style={sizeoflogomap}></Cancel></span>
            </p>
            <p className="loginjobs4">Map</p>
            <Helmet>
                <title>Map</title>
                <meta name="description" content="Navigate to textile sellers and tailors location for pickup and navigate to your customers location for delivery" />
            </Helmet>
            <div id="homeexpander2">
                <div className="menudesign6">
                    {NetworkCheckGet === false ?
                        (OfflineGet === false ?
                            <p align="center" className="nocf"><img className="imageloadingsize6" src={imageloading} alt="Loading.." /></p>
                            :
                            <p align="center" className="nocf">You're Offline, Map cannot be loaded</p>)
                    :
                        (NormalGet === true ?
                            <NormalMap
                                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}`}
                                loadingElement={<div style={{ height: `400px`, borderRadius: `2px` }} />}
                                containerElement={<div style={{ height: `400px` }} />}
                                mapElement={<div style={{ height: `100%`, borderRadius: `2px` }} />}
                            />
                        :
                            <LiveMap
                                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}`}
                                loadingElement={<div style={{ height: `400px`, borderRadius: `2px` }} />}
                                containerElement={<div style={{ height: `400px` }} />}
                                mapElement={<div style={{ height: `100%`, borderRadius: `2px` }} />}
                            />
                        )
                    }
                </div>
                {NetworkCheckGet === true ? // && loc_new === ""
                    <div className="mapdownsection">
                        <button style={NormalGet === false ? { color: "red" } : { color: "rgb(107, 43, 8)" }} onClick={() => LiveMapSet()} className="bottonmap">Route</button>
                        <button style={NormalGet === true ? { color: "red" } : { color: "rgb(107, 43, 8)" }} onClick={() => NormalMapSet()} className="bottonmap">Point</button>
                    </div>
                : ""}
            </div>
            <br/><br/><br/>
        </div>
    );
}

export default Map;