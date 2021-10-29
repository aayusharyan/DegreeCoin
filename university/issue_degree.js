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
    const params = new URLSearchParams(window.location.search);
    search_address = params.get('address');
    if(search_address != null && search_address != "") {
        document.getElementById('student_address').value = search_address;
    }
    
    const university_data = await contract.methods.getDetailsUniversity().call();

    let university_name = "Welcome University";
    if(university_data?.name != "") {
        let university_name = university_data.name;
    }
    document.getElementById('university_name').innerText = university_data.name;
    document.getElementById('established_at').innerText = new Date(university_data.establishedAt * 1000);
    document.getElementById('issue_degree').addEventListener('submit', issue_degree);
    university_data.courses.forEach((single_course, idx) => {
        let option = document.createElement('option');
        option.value = idx;
        option.innerText = single_course.name;
        document.getElementById('course').appendChild(option);
    });
})();

const issue_degree = async event => {
    event.preventDefault();

    let student_address = document.getElementById('student_address').value;
    let courseID = parseInt(document.getElementById('course').value);
    if(courseID == -1) {
        Swal.fire('Invalid Course', 'Select Course from the dropdown!', 'error');
        return;
    }
    let cgpa = parseInt(document.getElementById('cgpa').value) * 100;
    let grade = document.getElementById('grade').value;
    let comments = document.getElementById('comments').value;
    
    let executioner_addr = await getAccount();
    try {
        document.getElementById('degree_loading_spinner').classList.remove('d-none');
        document.getElementById('issue_degree_btn').disabled = true;
        let response = await contract.methods.issueDegree(student_address, courseID, cgpa, grade, comments).send({from: executioner_addr}); 
        let transaction_id = response.transactionHash;
        Swal.fire({
            title: 'Degree Issued Successfully', 
            html: `Transaction ID: ${transaction_id} <br /> <a href="https://ropsten.etherscan.io/tx/${transaction_id}" target="_blank">View on Etherscan</a>`, 
            icon: 'success', 
            width: 900
        });
        document.getElementById('degree_loading_spinner').classList.add('d-none');
        document.getElementById('issue_degree_btn').disabled = false;
    } catch(e) {
        document.getElementById('degree_loading_spinner').classList.add('d-none');
        document.getElementById('issue_degree_btn').disabled = false;
    }
    
}

document.getElementById('logout').addEventListener('click', _ => {
    logOut();
    window.location.href = '../index.html';
});

document.getElementById('university_logo').addEventListener('click', _ => {
    window.location.href = 'index.html';
});