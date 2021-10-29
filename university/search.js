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
    university_data = await contract.methods.getDetailsUniversity().call();
    const params = new URLSearchParams(window.location.search);
    search_address = params.get('address');
    if(search_address == "" || search_address == null) {
        document.getElementById('search_address').innerText += 'Nothing? 🤔';
        return;
    }
    document.getElementById('search_address').innerText = search_address;
    document.getElementById('search_field').value = search_address;

    let university_name = "Welcome University";
    if(university_data?.name != "") {
        let university_name = university_data.name;
    }
    document.getElementById('university_name').innerText = university_data.name;
    document.getElementById('established_at').innerText = new Date(university_data.establishedAt * 1000);

    try {
        const account_type = await contract.methods.getAccountType().call({from: search_address});
        if(account_type == ACCOUNT_TYPE_UNIVERSITY) {
            await setupAccountTypeUniversity();
        } else {
            await setupAccountTypeStudent();
        }
    } catch (error) {
        console.error(error);
    }
    

    const contract_owner = await contract.methods.owner().call();
    if(contract_owner == search_address) {
        document.getElementById('owner_account').classList.remove('d-none');
        document.getElementById('invited_bt_text').classList.add('d-none');
    }

})();

document.getElementById('logout').addEventListener('click', _ => {
    logOut();
    window.location.href = '../index.html';
});

document.getElementById('university_logo').addEventListener('click', _ => {
    window.location.href = 'index.html';
});

const setupAccountTypeUniversity = async _ => {
    document.getElementById('account_type_badge').innerText = 'University';
    let blacklisted_status = await contract.methods.isBlacklistedUniversity(search_address).call();
    if(blacklisted_status) {
        document.getElementById('blacklisted_badge').classList.remove('d-none');
        document.getElementById('whitelist_university').classList.remove('d-none');
        document.getElementById('whitelist_university').addEventListener('click', whitelist_university);
    } else {
        document.getElementById('blacklist_university').classList.remove('d-none');
        document.getElementById('blacklist_university').addEventListener('click', blacklist_university);
    }

    search_university_data = await contract.methods.getDetailsUniversity(search_address).call();

    if(search_university_data.name != null && search_university_data.name != "") {
        document.getElementById('address_name').innerText = search_university_data.name;
    }

    document.getElementById('invited_by_address').innerText = search_university_data.invitedBy;
    document.getElementById('invited_bt_text').addEventListener('click', search_inviter);

    document.getElementById('search_universite_established_since').innerText = new Date(search_university_data.establishedAt * 1000);

    search_university_data.courses.forEach((single_course, idx) => {
        let tr = document.createElement('tr');
        let th = document.createElement('th');
        th.setAttribute('scope', 'row');
        th.innerText = idx;
        tr.appendChild(th);
        let td = document.createElement('td');
        td.innerHTML = single_course.name + "&emsp;";
        let button = document.createElement('button');
        button.classList.add('btn');
        button.classList.add('btn-outline-primary');
        button.classList.add('btn-sm');
        button.innerText = "Equivalent?";
        button.dataset.courseId = idx;
        button.dataset.bsToggle = "modal";
        button.dataset.bsTarget = "#equivalency_modal";
        td.appendChild(button);
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerText = single_course.duration + ' months';
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerText = single_course.description;
        tr.appendChild(td);
        document.getElementById('courses_offered').appendChild(tr);
    });
    if(search_university_data.courses.length > 0) {
        setupEquivalencyModal();
    }

    document.getElementById('data_university').classList.remove('d-none');
}
const setupAccountTypeStudent = async _ => {
    document.getElementById('account_type_badge').innerText = 'Student';
    document.getElementById('issue_degree').classList.remove('d-none');
    document.getElementById('issue_degree').addEventListener('click', issue_degree);
    document.getElementById('data_student').classList.remove('d-none');
    
    const student_data = await contract.methods.getDetailsStudent(search_address).call();
    
    document.getElementById('student_degree_count').innerText = student_data.degreeCount;
    student_data.degrees.forEach((single_degree, idx) => {
        let tr = document.createElement('tr');
        let th = document.createElement('th');
        th.setAttribute('scope', 'row');
        th.innerText = idx;
        tr.appendChild(th);
        let td = document.createElement('td');
        td.innerHTML = moment(single_degree.issuedAt * 1000).format('DD MMM, YYYY');
        tr.appendChild(td);
        td = document.createElement('td');
        let span = document.createElement('span');
        span.innerText = 'Loading...';
        span.dataset.courseNameIssuer = single_degree.issuer;
        span.dataset.courseId = single_degree.courseID;
        td.appendChild(span);
        let br = document.createElement('br');
        td.appendChild(br);
        let button = document.createElement('button');
        button.classList.add('btn');
        button.classList.add('btn-outline-primary');
        button.classList.add('btn-sm');
        button.innerText = "Equivalent?";
        button.dataset.courseId = single_degree.courseID;
        button.dataset.university = single_degree.issuer;
        button.dataset.bsToggle = "modal";
        button.dataset.bsTarget = "#equivalency_modal";
        td.appendChild(button);
        tr.appendChild(td);
        td = document.createElement('td');
        let a = document.createElement('a');
        a.href = `search.html?address=${single_degree.issuer}`;
        a.innerText = single_degree.issuer;
        span = document.createElement('span');
        span.dataset.universityNameIssuer = single_degree.issuer;
        a.appendChild(span);
        td.appendChild(a);
        span = document.createElement('span');
        span.classList = "badge bg-danger d-none ms-2";
        span.innerText = "Blacklisted"
        td.appendChild(span);
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerText = parseFloat(single_degree.cgpa) / 100;
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = single_degree.grade;
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerHTML = single_degree.comments;
        tr.appendChild(td);
        document.getElementById('student_degrees').appendChild(tr);
        loadUniversityData(single_degree.issuer);
    });
    if(student_data.degrees.length > 0) {
        setupEquivalencyModal();
    }
}

const loadUniversityData = async university => {
    const some_university_data = await contract.methods.getDetailsUniversity(university).call();
    let blacklisted_status = await contract.methods.isBlacklistedUniversity(university).call();

    let course_name_elems = document.querySelectorAll(`[data-course-name-issuer='${university}']`);
    let university_name_elems = document.querySelectorAll(`[data-university-name-issuer='${university}']`);

    course_name_elems.forEach(single_course_name_elem => {
        let courseID = single_course_name_elem.dataset.courseId;
        let course = some_university_data.courses[courseID];
        single_course_name_elem.innerText = course.name;
    });

    university_name_elems.forEach(single_university_name_elem => {
        if(some_university_data.name != null && some_university_data.name != "") {
            single_university_name_elem.innerHTML = `<br />(${some_university_data.name})`;
        }
        if(blacklisted_status) {
            single_university_name_elem.parentNode.nextSibling.classList.remove('d-none');
        }
    });
}

const issue_degree = _ => {
    window.location.href = `issue_degree.html?address=${search_address}`;
}

const blacklist_university = async _ => {
    const transaction = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to blacklist this university?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, blacklist',
        cancelButtonText: 'No, don\'t blacklist',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async _ => {
            try {
                let executioner_addr = await getAccount();
                const transaction = await contract.methods.addBlacklistedUniversity(search_address).send({from: executioner_addr});
                return transaction;
            } catch(e) {
                Swal.showValidationMessage('Blacklist Failed');
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    });
    let transaction_id = transaction.value?.transactionHash;
    if(transaction_id) {
        await Swal.fire({
            title: 'Blacklisted Successfully', 
            html: `Transaction ID: ${transaction_id} <br /> <a href="https://ropsten.etherscan.io/tx/${transaction_id}" target="_blank">View on Etherscan</a>`, 
            icon: 'success', 
            width: 900
        });
        window.location.reload();
    }
    window.location.reload();
}

const search_inviter = _ => {
    window.location.href = `search.html?address=${search_university_data.invitedBy}`;
}

const whitelist_university = _ => {
    (async _ => {
        try {
            document.getElementById('whitelisting_spinner').classList.remove('d-none');
            document.getElementById('whitelist_university').disabled = true;
            let executioner_addr = await getAccount();
            let res = await contract.methods.removeBlacklistedUniversity(search_address).send({from: executioner_addr});
            window.location.reload();
        } catch(e) {
            document.getElementById('whitelisting_spinner').classList.add('d-none');
            document.getElementById('whitelist_university').disabled = false;
        }
    })();
}

const blacklist_course = async _ => {
    const transaction = await Swal.fire({
        title: 'Are you sure?',
        text: "Do you want to blacklist this course standard?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, blacklist',
        cancelButtonText: 'No, don\'t blacklist',
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async _ => {
            try {
                let executioner_addr = await getAccount();
                let courseID = parseInt(document.getElementById('global_course').dataset.courseId);
                let transaction = await contract.methods.addBlacklistedCourseTemplate(courseID).send({from: executioner_addr});
                return transaction;
            } catch(e) {
                Swal.showValidationMessage('Blacklist Failed');
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    });
    let transaction_id = transaction.value?.transactionHash;
    if(transaction_id) {
        await Swal.fire({
            title: 'Blacklisted Successfully', 
            html: `Transaction ID: ${transaction_id} <br /> <a href="https://ropsten.etherscan.io/tx/${transaction_id}" target="_blank">View on Etherscan</a>`, 
            icon: 'success', 
            width: 900
        });
        window.location.reload();
    }
    window.location.reload();
}

const whitelist_course = _ => {
    (async _ => {
        try {
            document.getElementById('whitelist_course_spinner').classList.remove('d-none');
            document.getElementById('whitelist_course').disabled = true;
            let executioner_addr = await getAccount();
            let courseID = parseInt(document.getElementById('global_course').dataset.courseId);
            let res = await contract.methods.removeBlacklistedCourseTemplate(courseID).send({from: executioner_addr});
            window.location.reload();
        } catch(e) {
            document.getElementById('whitelist_course_spinner').classList.add('d-none');
            document.getElementById('whitelist_course').disabled = false;
        }
    })();
}

const setupEquivalencyModal = _ => {
    let modal_elem = document.querySelector('#equivalency_modal');
    modal_elem.addEventListener('show.bs.modal', event => {
        let caller = event.relatedTarget;
        (async (courseID, university) => {
            await loadCourseEquivalencyInModal(courseID, university);
        })(caller.dataset.courseId, caller.dataset.university);
    });
    document.getElementById('blacklist_course').addEventListener('click', blacklist_course);
    document.getElementById('whitelist_course').addEventListener('click', whitelist_course);
}

const loadCourseEquivalencyInModal = async (courseID, university) => {
    if(typeof university != "undefined") {
        search_university_data = await contract.methods.getDetailsUniversity(university).call();
    }
    const their_course = search_university_data.courses[courseID]; 
    let my_course = {};

    const their_equivalency = parseInt(their_course.equivalency);
    const equivalent_course = await contract.methods.getCourseTemplate(their_equivalency).call();

    const is_blacklisted = await contract.methods.isBlacklistedCourseTemplate(their_equivalency).call();
    if(is_blacklisted) {
        document.getElementById('whitelist_course').className = 'btn btn-outline-success';
        document.getElementById('blacklist_course').className = 'btn btn-outline-danger d-none';
        document.getElementById('blacklisted_course_badge').className = 'badge bg-danger';
    } else {
        document.getElementById('whitelist_course').className = 'btn btn-outline-success d-none';
        document.getElementById('blacklist_course').className = 'btn btn-outline-danger';
        document.getElementById('blacklisted_course_badge').className = 'badge bg-danger d-none';
    }

    university_data.courses.forEach(single_course => {
        if(single_course.equivalency == their_equivalency) {
            my_course = single_course;
        }
    });

    if(typeof my_course.duration != "undefined" && my_course.duration != 0) {
        document.getElementById('my_course_name').innerText = my_course.name;
        document.getElementById('my_course_description').innerText = my_course.description;
        document.getElementById('my_course_duration').innerText = my_course.duration + ' months';
    } else {
        document.getElementById('my_course_name').innerText = '-----';
        document.getElementById('my_course_description').innerText = '-----';
        document.getElementById('my_course_duration').innerText = '-----';
    }

    document.getElementById('global_course').dataset.courseId = their_equivalency;

    document.getElementById('their_course_name').innerText = their_course.name;
    document.getElementById('equivalent_course_name').innerText = equivalent_course.name;
    

    document.getElementById('their_course_description').innerText = their_course.description;
    document.getElementById('equivalent_course_description').innerText = equivalent_course.description;

    document.getElementById('their_course_duration').innerText = their_course.duration + ' months';
    document.getElementById('equivalent_course_duration').innerText = equivalent_course.duration + ' months';

}