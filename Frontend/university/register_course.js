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
            html: "You are not connected to the Ropsten network.<br />Change metamask network and login again.<br /><br /><a href='https://yush.dev' target='_blank'>How to do that?</a>",
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

    let university_name = "Welcome University";
    if(university_data?.name != "") {
        let university_name = university_data.name;
    }
    document.getElementById('university_name').innerText = university_data.name;
    document.getElementById('established_at').innerText = new Date(university_data.establishedAt * 1000);
    document.getElementById('register_course').addEventListener('submit', register_course);
    let courseTemplates = await contract.methods.getValidCourseTemplates().call();
    courseTemplates.forEach((singleTemplate, idx) => {
        if(singleTemplate.duration <= 0) {
            return;
        }
        let option = document.createElement('option');
        option.value = idx;
        option.innerText = singleTemplate.name;
        option.dataset.courseId = idx;
        option.dataset.courseName = singleTemplate.name;
        option.dataset.courseDescription = singleTemplate.description;
        option.dataset.courseDuration = singleTemplate.duration;
        document.getElementById('equivalency').appendChild(option);
    });
    document.getElementById('equivalency').addEventListener('change', enable_disable_read_more);
    document.getElementById('course_template_modal').addEventListener('show.bs.modal', loadCourseModal);
    
})();

const loadCourseModal = async elem => {
    let course_data_elem = document.getElementById('equivalency').options[document.getElementById('equivalency').selectedIndex];
    let course_data = course_data_elem.dataset;
    document.getElementById('course_name').innerText = course_data.courseName;
    document.getElementById('course_description').innerText = course_data.courseDescription;
    document.getElementById('course_duration').innerText = course_data.courseDuration + ' months';
}

const enable_disable_read_more = _ => {
    let courseID = document.getElementById('equivalency').value;
    console.log(courseID);
    if(courseID >= 0) {
        document.getElementById('read_more_course_template').disabled = false;
    } else {
        document.getElementById('read_more_course_template').disabled = true;
    }
}

const register_course = async event => {
    event.preventDefault();

    let name = document.getElementById('name').value;
    let description = document.getElementById('description').value;
    let equivalency = parseInt(document.getElementById('equivalency').value);
    if(equivalency < 0) {
        Swal.fire('Invalid Course', 'Select Equivalent Course from the dropdown!', 'error');
        return;
    }
    
    let duration = parseInt(document.getElementById('duration').value);

    let executioner_addr = await getAccount();
    try {
        document.getElementById('course_loading_spinner').classList.remove('d-none');
        document.getElementById('register_course_btn').disabled = true;
        let response = await contract.methods.registerCourse(name, description, duration, equivalency).send({from: executioner_addr}); 
        let transaction_id = response.transactionHash;
        Swal.fire({
            title: 'Course Registered Successfully', 
            html: `Transaction ID: ${transaction_id} <br /> <a href="https://ropsten.etherscan.io/tx/${transaction_id}" target="_blank">View on Etherscan</a>`, 
            icon: 'success', 
            width: 900
        });
        document.getElementById('course_loading_spinner').classList.add('d-none');
        document.getElementById('register_course_btn').disabled = false;
    } catch(e) {
        console.log(e);
        document.getElementById('course_loading_spinner').classList.add('d-none');
        document.getElementById('register_course_btn').disabled = false;
    }
}

document.getElementById('logout').addEventListener('click', _ => {
    logOut();
    window.location.href = '../index.html';
});

document.getElementById('university_logo').addEventListener('click', _ => {
    window.location.href = 'index.html';
});