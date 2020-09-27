import loadingMenu from './loadingmenu';
import loadingMap from './loadingmap';
import loadingComment from './loadingcomment';
import mapReducer from './map_r';
import accountData from './accountdata';
import profileImageData from './profileimage';
import broadImage from './broadcastimages';
import commentIdSaver from './comment';
import reviewIdSaver from './review';
import reviewIdSaverCloth from './reviewcloth';
import profileData from './profiledata';
import profileId from './profileid';
import profileIdNew from './profileidnew';
import picture from './picturedata';
import texpicture from './texpicturedata';
import clothpicture from './clothpicturedata';
import previousPage from './previouspage';
import previousPageNew from './previouspagenew';
import postId from './postid';
import postIdNew from './postidnew';
import styleId from './styleid';
import textileSold from './textilesolddata';
import ShareData from './sharedata';
import Gender from './gender';
import BroadcastHT from './broadcasthashtag';
import TextileHT from './textilehashtag';
import TailorHT from './tailorhashtag';
import BroadcastL from './broadcastlikes.js';
import TextileL from './textilelikes.js';
import TailorL from './tailorlikes.js';
import IHaveitSellers from './ihaveitsellers';
import BoughtIt from './boughtit';
import BuyCloth from './buycloth';
import SoldCloth from './soldcloth';
import TailorFinish from './tailorfinish';
import TailorFinish2 from './tailorfinish2';
import Follow from './follow';
import BroadcastSize from './broadcastsize';
import TextileSize from './textilesize';
import ClothSize from './clothsize';
import ChatVideo from './chatvideo';
import ChatAudio from './chataudio';
import ChatPicture from './chatpicture';
import ChatFile from './chatfile';
import ClothWallet from './clothwallet';
import GiveWallet from './givewallet';
import TextileWallet from './textilewallet';
import TextileBuyWallet from './textilebuywallet';
import BroadcastImage from './broadcastimage';
import TextileImage from './textileimage';
import ClothImage from './clothimage';
import MyLikesUsername from './mylikesusername';
import MapGetInsight from './mapgetinsight';
import BuyItTextile from './buyittextile';
import HaveItBroadcast from './haveitbroadcast';
import OrderItCloth from './orderitcloth';
import RegisterComplete from './registercomplete';
import SupplierChangi from './supplierchangi';
import CustomerChangi from './customerchangi';
import {combineReducers} from 'redux';

const mainReducer = combineReducers({
    loadmenu: loadingMenu, loadmap: loadingMap,
    lcomment: loadingComment, maproute: mapReducer,
    adata: accountData, pimage: profileImageData, 
    broadi: broadImage, commentid: commentIdSaver,
    pdata: profileData, piddata: profileId,
    pic: picture, ppage: previousPage,
    poi: postId, piddatanew: profileIdNew,
    ppagenew: previousPageNew, poinew: postIdNew,
    styleid: styleId, reviewid: reviewIdSaver,
    texpic: texpicture, texsold: textileSold,
    reviewidcloth: reviewIdSaverCloth, clothpic: clothpicture,
    gender: Gender, share: ShareData, bcastht: BroadcastHT,
    texht: TextileHT, tailht: TailorHT, broadcastl: BroadcastL,
    textilel: TextileL, tailorl: TailorL, ihaveit: IHaveitSellers,
    bit: BoughtIt, bcloth: BuyCloth, scloth: SoldCloth,
    tfinish: TailorFinish, tfinish2: TailorFinish2, follow: Follow,
    bsize: BroadcastSize, tsize: TextileSize, csize: ClothSize,
    cvideo: ChatVideo, caudio: ChatAudio, cpicture: ChatPicture,
    cfile: ChatFile, cwallet: ClothWallet, gwallet: GiveWallet,
    twallet: TextileWallet, tbwallet: TextileBuyWallet, bimage: BroadcastImage,
    timage: TextileImage, cimage: ClothImage, mlikesu: MyLikesUsername,
    tmap: MapGetInsight, buyt: BuyItTextile, havet: HaveItBroadcast,
    ordert: OrderItCloth, rcomplete: RegisterComplete, SupplierChangi: SupplierChangi,
    CustomerChangi: CustomerChangi
});

export default mainReducer;