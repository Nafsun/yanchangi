export const loadingMenuChangeTrue = () => {
    return {
        type: 'CHANGETRUE'
    };
} 
export const loadingMenuChangeFalse = () => {
    return {
        type: 'CHANGEFALSE'
    };
}
export const loadingMapChangeTrue = () => {
    return {
        type: 'CHANGEMAPTRUE'
    };
} 
export const loadingMapChangeFalse = () => {
    return {
        type: 'CHANGEMAPFALSE'
    };
}
export const loadingCommentChangeTrue = () => {
    return {
        type: 'CHANGECOMMENTTRUE'
    };
} 
export const loadingCommentChangeFalse = () => {
    return {
        type: 'CHANGECOMMENTFALSE'
    };
} 
export const mapRouteDisplay = (mr) => {
    return {
        type: 'DIRECTION',
        payload: mr
    };
}
export const AccountInformation = (ai) => {
    return {
        type: 'ACCOUNTDATA',
        payload: ai
    };
}
export const profileImage = (pi) => {
    return {
        type: 'PROFILEIMAGE',
        payload: pi
    };
}
export const broadcastImages = (bi) => {
    return {
        type: 'BROADCASTIMAGES',
        payload: bi
    };
}
export const commentIdSaver = (cis) => {
    return {
        type: 'COMMENT',
        payload: cis
    };
}
export const reviewIdSaver = (ris) => {
    return {
        type: 'REVIEW',
        payload: ris
    };
}
export const reviewIdSaverCloth = (risc) => {
    return {
        type: 'REVIEWCLOTH',
        payload: risc
    };
}
export const ProfileInformation = (pi) => {
    return {
        type: 'PROFILEDATA',
        payload: pi
    };
}
export const ProfileIds = (pid) => {
    return {
        type: 'PROFILEID',
        payload: pid
    };
}
export const ProfileIdsNew = (pidnew) => {
    return {
        type: 'PROFILEIDNEW',
        payload: pidnew
    };
}
export const PreviousPages = (pp) => {
    return {
        type: 'PREVIOUSPAGE',
        payload: pp
    };
}
export const PreviousPagesNew = (ppn) => {
    return {
        type: 'PREVIOUSPAGENEW',
        payload: ppn
    };
}
export const Picture = (p) => {
    return {
        type: 'PICTURE',
        payload: p
    };
}
export const TexPicture = (t) => {
    return {
        type: 'TEXPICTURE',
        payload: t
    };
}
export const ClothPicture = (t) => {
    return {
        type: 'CLOTHPICTURE',
        payload: t
    };
}
export const PostId = (poi) => {
    return {
        type: 'POSTID',
        payload: poi
    };
}
export const PostIdNew = (poinew) => {
    return {
        type: 'POSTIDNEW',
        payload: poinew
    };
}
export const StyleIds = (sd) => {
    return {
        type: 'STYLEID',
        payload: sd
    };
}
export const TextileSolder = (ts) => {
    return {
        type: 'SOLDER',
        payload: ts
    };
}
export const Gender = (g) => {
    return {
        type: 'GENDER',
        payload: g
    };
}
export const ShareData = (sd) => {
    return {
        type: 'SHARE',
        payload: sd
    };
}
export const BroadcastHashtag = (ht) => {
    return {
        type: 'BROADCASTHASHTAG',
        payload: ht
    };
}
export const TextileHashtag = (ht) => {
    return {
        type: 'TEXTILEHASHTAG',
        payload: ht
    };
}
export const TailorHashtag = (ht) => {
    return {
        type: 'TAILORHASHTAG',
        payload: ht
    };
}
export const BroadcastLikers = (bl) => {
    return {
        type: 'BROADCASTLIKERS',
        payload: bl
    };
}
export const TextileLikers = (tl) => {
    return {
        type: 'TEXTILELIKERS',
        payload: tl
    };
}
export const TailorLikers = (tl) => {
    return {
        type: 'TAILORLIKERS',
        payload: tl
    };
}
export const IHaveItSellers = (is) => {
    return {
        type: 'IHAVEITSELLERS',
        payload: is
    };
}
export const BoughtIt = (bi) => {
    return {
        type: 'BOUGHTIT',
        payload: bi
    };
}
export const BuyCloth = (bc) => {
    return {
        type: 'BUYCLOTH',
        payload: bc
    };
}
export const SoldCloth = (sc) => {
    return {
        type: 'SOLDCLOTH',
        payload: sc
    };
}
export const TailorFinish = (tf) => {
    return {
        type: 'TAILORFINISH',
        payload: tf
    };
}
export const TailorFinish2 = (tf) => {
    return {
        type: 'TAILORFINISH2',
        payload: tf
    };
}
export const Follow = (f) => {
    return {
        type: 'FOLLOW',
        payload: f
    };
}
export const BroadcastSize = (s) => {
    return {
        type: 'BROADCASTSIZE',
        payload: s
    };
}
export const TextileSize = (s) => {
    return {
        type: 'TEXTILESIZE',
        payload: s
    };
}
export const ClothSize = (s) => {
    return {
        type: 'CLOTHSIZE',
        payload: s
    };
}
export const ChatVideo = (s) => {
    return {
        type: 'CHATVIDEO',
        payload: s
    };
}
export const ChatAudio = (s) => {
    return {
        type: 'CHATAUDIO',
        payload: s
    };
}
export const ChatPicture = (s) => {
    return {
        type: 'CHATPICTURE',
        payload: s
    };
}
export const ChatFile = (s) => {
    return {
        type: 'CHATFILE',
        payload: s
    };
}
//sewing textiles by tailors - start
export const ClothWallet = (s) => {
    return {
        type: 'CLOTHWALLET',
        payload: s
    };
}
export const GiveWallet = (s) => {
    return {
        type: 'GIVEWALLET',
        payload: s
    };
}
export const TextileWallet = (s) => {
    return {
        type: 'TEXTILEWALLET',
        payload: s
    };
}
//end

//buying textiles from textile seller - start
export const TextileBuyWallet = (s) => {
    return {
        type: 'TEXTILEBUYWALLET',
        payload: s
    };
}
//end

//picture poper
export const BroadcastImage = (s) => {
    return {
        type: 'BROADCASTIMAGE',
        payload: s
    };
}
export const TextileImage = (s) => {
    return {
        type: 'TEXTILEIMAGE',
        payload: s
    };
}
export const ClothImage = (s) => {
    return {
        type: 'CLOTHIMAGE',
        payload: s
    };
}
//end

export const MyLikesUsername = (s) => {
    return {
        type: 'MYLIKESUSERNAME',
        payload: s
    };
}

export const MapGetInsight = (s) => {
    return {
        type: 'MAPGETINSIGHT',
        payload: s
    };
}

export const BuyItTextile = (s) => {
    return {
        type: 'BUYITTEXTILE',
        payload: s
    };
}

export const HaveItBroadcast = (s) => {
    return {
        type: 'HAVEITBROADCAST',
        payload: s
    };
}

export const OrderItCloth = (s) => {
    return {
        type: 'ORDERITCLOTH',
        payload: s
    };
}

export const RegisterComplete = (s) => {
    return {
        type: 'REGISTERCOMPLETE',
        payload: s
    };
}

export const SupplierChangi = (s) => {
    return {
        type: 'SUPPLIERCHANGI',
        payload: s
    };
}

export const CustomerChangi = (s) => {
    return {
        type: 'CUSTOMERCHANGI',
        payload: s
    };
}