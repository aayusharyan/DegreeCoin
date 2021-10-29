(async _ => {
    if(!await isWeb3()) {
        await Swal.fire({
            title: "Could not connect to Ethereum Network", 
            icon: "error",
            allowOutsideClick: false
        });
        window.location.href = '../index.html';
    }
    if(!await isNetworkRopsten()) {
        await Swal.fire({
            title: "Network Error!", 
            html: "You are not connected to the Ropsten network.<br />Change metamask network and login again.<br /><br /><a href='#' onClick='requestCorrectNetwork(event);'>Change Network</a>",
            icon: "error",
            allowOutsideClick: false
        });
        logOut();
        window.location.href = '../index.html';
    }

    await initialize();
    if(!await isAuthorizedUniversity()) {
        window.location.href = '../index.html';
    }
    const university_data = await contract.methods.getDetailsUniversity().call();
    const owner = await contract.methods.owner().call();
    if(owner != await getAccount()) {
        window.location.href = '../index.html';
    }

    let university_name = "Welcome University";
    if(university_data?.name != "") {
        let university_name = university_data.name;
    }
    document.getElementById('university_name').innerText = university_data.name;
    document.getElementById('established_at').innerText = new Date(university_data.establishedAt * 1000);
    document.getElementById('register_standard').addEventListener('submit', register_standard);
})();

const register_standard = async event => {
    event.preventDefault();

    let name = document.getElementById('name').value;
    let description = document.getElementById('description').value;               
    let duration = parseInt(document.getElementById('duration').value);

    let executioner_addr = await getAccount();
    try {
        document.getElementById('register_standard_spinner').classList.remove('d-none');
        document.getElementById('register_standard_btn').disabled = true;
        let response = await contract.methods.createCourseTemplate(name, description, duration).send({from: executioner_addr}); 
        let transaction_id = response.transactionHash;
        Swal.fire({
            title: 'Course Registered Successfully', 
            html: `Transaction ID: ${transaction_id} <br /> <a href="https://ropsten.etherscan.io/tx/${transaction_id}" target="_blank">View on Etherscan</a>`, 
            icon: 'success', 
            width: 900
        });
        document.getElementById('register_standard_spinner').classList.add('d-none');
        document.getElementById('register_standard_btn').disabled = false;
    } catch(e) {
        console.log(e);
        document.getElementById('register_standard_spinner').classList.add('d-none');
        document.getElementById('register_standard_btn').disabled = false;
    }
}

document.getElementById('logout').addEventListener('click', _ => {
    logOut();
    window.location.href = '../index.html';
});

document.getElementById('university_logo').addEventListener('click', _ => {
    window.location.href = 'index.html';
});