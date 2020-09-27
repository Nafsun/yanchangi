import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import gql from 'graphql-tag';
import {useQuery, useMutation} from 'react-apollo';
import {profileImage} from '../../../actions';
import {mimeTypeChecker, fileSizeChecker} from '../fileuploadverify';
import MutationError from '../../functions/mutationerror';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import {ThemeProvider} from '@material-ui/core/styles';
import theme from '../../functions/theme';
import { DialogLoader, CurrentLoading } from '../../loading/Loading';
import DialogInfo from '../../functions/dialoginfo';
import ValidateEmail from '../../functions/validateemail';
import imageCompression from 'browser-image-compression';
import NoInternetConnection from '../../nointernetconnection/NoInternetConnection';

const EDITVERIFY = gql`
    mutation accountUpdate($username: String, $jwtauth: String, $fullname: String, $email: String, $phoneno: String, $country: String, $state: String, $localgovt: String, $gender: String, $businessname: String, $file: String){
        accountUpdate(username: $username, jwtauth: $jwtauth, fullname: $fullname, email: $email, phoneno: $phoneno, country: $country, state: $state, localgovt: $localgovt, gender: $gender, businessname: $businessname, file: $file){
            picture, error
        }
    }
`;

const ACCOUNTINFO = gql`
    query accountInfo($username: String, $jwtauth: String){
        accountInfo(username: $username, jwtauth: $jwtauth){
            fullname, email, phoneno, 
            country, state, localgovt,
            gender, username,
            businessname, picture, error
        }
    }
`;

function Edit(props){ 

    const [editmutation] = useMutation(EDITVERIFY);
    const [WaitWhileUpdating, WaitWhileUpdatingSet] = useState(false);
    const [PopBoxerStart, PopBoxerEnd] = useState(false);
    const [PopBoxTextGet, PopBoxTextSet] = useState(null);
    const [UploadedImageGet, UploadedImageSet] = useState(null);
    const [PicsUrlStart2, PicsUrlEnd2] = useState(null);
    const [waitloadGet, waitloadSet] = useState(false);
    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    const dispatch = useDispatch();
    const [getGender2, setGender2] = useState("");
    const [getCountry2, setCountry2] = useState("");

    const { error, data, refetch } = useQuery(ACCOUNTINFO,
        {
            variables: { username: userinfo === null ? "nothing" : userinfo.loginAccount.username,
                        jwtauth: userinfo === null ? "nothing" : userinfo.loginAccount.token },
            fetchPolicy: 'no-cache',
            onCompleted() {
                if(data !== undefined){
                    setGender2(data.accountInfo.gender === null ? "" : data.accountInfo.gender);
                    setCountry2(data.accountInfo.country === null ? "" : data.accountInfo.country);
                    waitloadSet(true);
                }
            }
        });

    if(error){
        return <NoInternetConnection error={error.toString()} />;
    }

    const EditFunc = () => {

        let full = document.getElementById("fullnameid").value.replace(/(<([^>]+)>)/ig,"");
        let email = document.getElementById("emailid").value;
        let phoneno = document.getElementById("phonenoid").value;
        let state = document.getElementById("stateid").value.replace(/(<([^>]+)>)/ig,"");
        let localgovt = document.getElementById("localgovtid").value.replace(/(<([^>]+)>)/ig,"");
        let businessname = document.getElementById("businessnameid").value.replace(/(<([^>]+)>)/ig,"");
     
        if(full === ""){ PopBoxerEnd(true); PopBox("fullname not set"); return false; }
        if(email === ""){ PopBoxerEnd(true); PopBox("email not set"); return false; }
        if(ValidateEmail(email) === false){ PopBoxerEnd(true); PopBox("invalid email"); return false; }
        if(phoneno === ""){ PopBoxerEnd(true); PopBox("phoneno not set"); return false; }
        if(getCountry2 === "" || getCountry2 === "no"){ PopBoxerEnd(true); PopBox("Country not set"); return false; }
        if(state === ""){ PopBoxerEnd(true); PopBox("state not set"); return false; }
        if(localgovt === ""){ PopBoxerEnd(true); PopBox("localgovt not set"); return false; }
        if(getGender2 === ""){ PopBoxerEnd(true); PopBox("gender not set"); return false; }
        if(businessname === ""){ PopBoxerEnd(true); PopBox("business name not set"); return false; }
        if (businessname.length > 100) { 
            PopBoxerEnd(true); 
            PopBox(`Business Name must be less than 100 characters - you tried to post ${businessname.length} characters`); 
            return false; 
        }

        let u = userinfo.loginAccount.username; // username getter
        let j = userinfo.loginAccount.token; // token getter

        WaitWhileUpdatingSet(true); //popup and starting loading on submit

        const ui =  UploadedImageGet !== null ? UploadedImageGet : data.accountInfo.picture; //checking to see if the user did not set the profile pic 

        editmutation({variables: {username: u, jwtauth: j, fullname: full, email: email, phoneno: phoneno, country: getCountry2, state: state, localgovt: localgovt, gender: getGender2, businessname: businessname, file: ui}}).then(({data}) => {
            WaitWhileUpdatingSet(false); // cancel popup on finsihed upload
            if(data.accountUpdate.error === "no"){
                refetch();
                dispatch(profileImage(data.accountUpdate.picture));
                PopBoxerEnd(true); PopBox("Account Updated"); // pop dialog box on finished upload
                props.refetch();
            }else if(data.accountUpdate.error === "emailverified"){
                PopBoxerEnd(true); PopBox("Your Email Address cannot be changed because it has already being verified");
            }else if(data.accountUpdate.error === "emailnotverified"){
                PopBoxerEnd(true); PopBox("Your Email Address have not being verified, you must verify it before updating your profile");
            }
        }).catch((e) => MutationError(e.toString()));
    }

    const menuCountry2 = (event) => {
        setCountry2(event.target.value);
    }

    const genderChanger2 = (event) => {
        setGender2(event.target.value);
    }

    const clickbrowsefile2 = () => {
        document.getElementById("fileupl2").click();
    }

    function onProgress (p) {
        document.getElementById("loading1").innerHTML = `Loading (${p}%) image`;
    }

    const uploadFunction2 = async(event) => {
        const options = {
            maxSizeMB: parseFloat(process.env.REACT_APP_MAXSIZEMBMINIMUM),
            maxWidthOrHeight: parseInt(process.env.REACT_APP_MAXWIDTHORHEIGHTMINIMUM),
            useWebWorker: true,
            onProgress: onProgress
        }

        const imageFile = await event.target.files[0];

        if(mimeTypeChecker(imageFile) && fileSizeChecker(imageFile)){ //checking the size and extention

            const compressedFile = await imageCompression(imageFile, options);

            const w = window.URL.createObjectURL(compressedFile); //creating a url for image
            PicsUrlEnd2(w);
            const reader = new FileReader(); //converting file to base 64
            reader.onloadend = function(){
                UploadedImageSet(reader.result);
            }
            reader.readAsDataURL(compressedFile);
        }
    }

    const PopBox = (val) => {
        PopBoxTextSet(val); //set the text for error display
    }

    const PopBoxClosed = () => {
        PopBoxerEnd(false);
    }

    return(
        <div>
        {waitloadGet === false ?
            <CurrentLoading />
            :
        <div id="scrolldown" className="scrollpost">
            <div>
                <div className="loginspace">
                    
                    <ThemeProvider theme={theme}>
                    <TextField 
                    id="fullnameid" label="Fullname" fullWidth={true}
                    margin="normal" variant="outlined" defaultValue={data.accountInfo.fullname} />
                    <TextField 
                    id="emailid" label="Email" fullWidth={true}
                    margin="normal" variant="outlined" defaultValue={data.accountInfo.email} />
                    <TextField 
                    id="phonenoid" label="PhoneNo" fullWidth={true} type="tel"
                    margin="normal" variant="outlined" defaultValue={data.accountInfo.phoneno} />
                    <TextField 
                    id="countryid" label="Country" fullWidth={true}
                    margin="normal" variant="outlined" onChange={(e) => menuCountry2(e)} value={getCountry2} select>
                        <MenuItem value="Nigeria">Nigeria</MenuItem>
                    </TextField>
                    <TextField 
                    id="stateid" label="State" fullWidth={true}
                    margin="normal" variant="outlined" defaultValue={data.accountInfo.state} />
                    <TextField 
                    id="localgovtid" label="Local Govt" fullWidth={true}
                    margin="normal" variant="outlined" defaultValue={data.accountInfo.localgovt} />
                    <TextField 
                    name="gender" label="Gender" fullWidth={true}
                    margin="normal" variant="outlined" onChange={(e) => genderChanger2(e)} value={getGender2} select>
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                    </TextField>
                    <TextField 
                    id="businessnameid" label="Business Name" fullWidth={true}
                    margin="normal" variant="outlined" defaultValue={data.accountInfo.businessname} />
                    <input id="fileupl2" type="file" name="file" accept="image/*" onChange={(e) => uploadFunction2(e)}/>
                    <br/>
                    <Button 
                        fullWidth={true}
                        onClick={() => clickbrowsefile2()}
                        style={{color: "white", backgroundColor: "rgb(107, 43, 8)"}}
                    >Upload Business Logo</Button>
                    <br/>
                    {UploadedImageGet !== null ? <div><br/><img className="imageoutputstyle2" src={PicsUrlStart2} alt={"upload pics"}/></div> : ""}
                    <br/>
                    <div id="loading1"></div>
                    <Button 
                        fullWidth={true}
                        onClick={() => EditFunc()}
                        style={{color: "white", backgroundColor: "rgb(107, 43, 8)"}}
                    >Update</Button>
                    </ThemeProvider>
                    {WaitWhileUpdating ?
                        <DialogLoader PopBoxTitleGet={"Wait while Updating"} />
                    : ""}
                    {PopBoxerStart ?
                        <DialogInfo PopBoxTitleGet={"Message"} PopBoxTextGet={PopBoxTextGet} PopBoxClosed={PopBoxClosed} />
                    : ""}
                </div>
            </div>
        </div>
        }
        </div>
    );
}

export default Edit;