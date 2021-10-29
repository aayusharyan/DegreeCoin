CONTRACT_ADDRESS = "0xF9cC69A9d9959D386322a1B1E3dD60c0A3765594";

//Check whether the required files are present.
if((typeof md5 == "undefined")
|| (typeof contract_data == "undefined")) {
        throw 'Required files are missing';
}


//Returns True if web3 is available
const isWeb3 = async _ => {
    return (typeof window.ethereum !== 'undefined');
}

const initialize = async _ => {
    web3 = new Web3(window.ethereum);
    if(await isLoggedIn()) {
        await initializeContract();
    }
}

const initializeContract = async _ => {
    contract = new web3.eth.Contract(contract_data.output.abi, CONTRACT_ADDRESS);
    ACCOUNT_TYPE_UNIVERSITY = await contract.methods.ACCOUNT_TYPE_UNIVERSITY().call();
    ACCOUNT_TYPE_STUDENT = await contract.methods.ACCOUNT_TYPE_STUDENT().call();
}

const getAccount = async _ => {
    const accounts = await web3.eth.getAccounts();
    if(accounts[0] == undefined || accounts[0] == "") {
        return false;
    }
    web3.eth.defaultAccount = accounts[0];
    return accounts[0];
}

//This checks cookie for whether user is logged in or not as well as accountDetails.
//Mainly because metamask does not provide logout functionality to the developer.
//Doing fake logout.
const isLoggedIn = async _ => {
    const account = await getAccount();
    if(account) {
        let cookie = getCookie('account');
        if(cookie == md5(account)) {
            return true;
        }
    }
    logOut();
    return false;
}

const isAuthorizedUniversity = async _ => {
    if(await isLoggedIn()) {
        const account_type = await contract.methods.getAccountType().call();
        if(account_type == ACCOUNT_TYPE_UNIVERSITY) {
            return true;
        }
    }
    return false;
}

const isAuthorizedStudent = async _ => {
    if(await isLoggedIn()) {
        const account_type = await contract.methods.getAccountType().call();
        if(account_type == ACCOUNT_TYPE_STUDENT) {
            return true;
        }
    }
    return false;
}

const logOut = _ => {
    setCookie('account', '', -1);
}

//Check if Chain ID is 3, for ropsten network.
const isNetworkRopsten = async _ => {
    let web3 = new Web3(window.ethereum);
    const chainID = await web3.eth.net.getId();
    return (chainID == 3);
}

//https://stackoverflow.com/a/14573665/6632251
const setCookie = (c_name, value, exdays=30) => {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value + "; Path=/;";
}

//https://stackoverflow.com/a/14573665/6632251
function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}


//Event Listener when user disconnects from wallet.
ethereum.on('accountsChanged', async accounts => {
    if(!await getAccount()) {
        logOut();
        window.location.href = 'index.html';
    }
});

//Event listener for change of chain.
ethereum.on('chainChanged', _ => {
    window.location.reload();
});