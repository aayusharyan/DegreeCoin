(async _ => {
    if(!await isWeb3()) {
        await Swal.fire({
            position: 'top-end',
            title: "Web3 Wallet not found", 
            icon: "warning",
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
        });
        return;
    }
    await initialize();

    if(!await isNetworkRopsten()) {
        await Swal.fire({
            title: "Network Error!", 
            html: "You are not connected to the Ropsten network.<br />Change metamask network and login again.<br /><br /><a href='#' onClick='requestCorrectNetwork(event);'>Change Network</a>",
            icon: "error",
            allowOutsideClick: false
        });
        logOut();
    }
    enableLoginButtons();

    (async _ => {
        let contract = new web3.eth.Contract(contract_data.output.abi, CONTRACT_ADDRESS);
        const student_count = await contract.methods.studentCount().call();
        const university_count = await contract.methods.universityCount().call();
        const issued_degree_count = await contract.methods.issuedDegreeCount().call();
        document.getElementById('student_count').innerText = student_count;
        document.getElementById('university_count').innerText = university_count;
        document.getElementById('issued_degree_count').innerText = issued_degree_count;
    })();

    document.getElementById('metamaskSignInButton').addEventListener('click', async _ => {
        const login_response = await attemptLogin();
        const account = await getAccount();
        setLogin(account);
        if(typeof contract == "undefined") {
            await initializeContract();
        }
        const account_type = await contract.methods.getAccountType().call();
        if(account_type == ACCOUNT_TYPE_UNIVERSITY) {
            window.location.href = 'university/index.html';
        } else {
            window.location.href = 'student/index.html';
        }
    });

})();         

const attemptLogin = async _ => {
    // await ethereum.enable();
    await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{
            eth_accounts: {}
        }],
    });
}

const enableLoginButtons = _ => {
    document.getElementById('metamaskSignInButton').removeAttribute('disabled');
}

const setLogin = account => {
    setCookie('account', md5(account), 30);
}

const view_contract = _ => {
    window.open(`https://ropsten.etherscan.io/address/${CONTRACT_ADDRESS}`, '_blank').focus();
}

document.getElementById('view_contract').addEventListener('click', view_contract);