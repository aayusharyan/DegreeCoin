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

    const is_invited = await contract.methods.isInvitedUniversity().call();

    try {
        university_data = await contract.methods.getDetailsUniversity().call();
    } catch(e) {
        if(is_invited) {
            university_data = {
                name: "",
                establishedAt: 0,
                courses: [],
            };
        }
        else throw Error(e);
    }

    if(university_data.establishedAt == 0) {
        document.getElementById('on_invited').classList.remove('d-none');
        document.getElementById('registered_university_content').classList.add('d-none');
        document.getElementById('register_university').addEventListener('click', register_university);
    }

    let university_name = "Welcome University";
    if(university_data?.name != "") {
        let university_name = university_data.name;
        document.getElementById('new_university_name').value = university_name;
    }
    document.getElementById('university_name').innerText = university_data.name;
    document.getElementById('established_at').innerText = new Date(university_data.establishedAt * 1000);

    university_data.courses.forEach((single_course, idx) => {
        let tr = document.createElement('tr');
        let th = document.createElement('th');
        th.setAttribute('scope', 'row');
        th.innerText = idx;
        tr.appendChild(th);
        let td = document.createElement('td');
        td.innerText = single_course.name;
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerText = single_course.duration + ' months';
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerText = single_course.description;
        tr.appendChild(td);
        document.getElementById('offering_courses').appendChild(tr);
    });

    const contract_owner = await contract.methods.owner().call();
    if(contract_owner == await getAccount()) {
        document.getElementById('only_owner').classList.remove('d-none');
        document.getElementById('only_owner').addEventListener('click', _ => {
            window.location.href = 'create_standard.html';
        })
    }

    await setup_blacklisted_universities();
    await setup_blacklisted_courses();
})();

const setup_blacklisted_universities = async _ => {
    university_data.blacklistedUniversities.forEach(single_blacklisted_university => {
        let div = document.createElement('div');
        div.classList.add('col-md-auto');
        let button = document.createElement('button');
        button.classList.add('btn');
        button.classList.add('btn-outline-dark');
        button.classList.add('addressSearchButton');
        button.innerText = single_blacklisted_university;
        button.dataset.blacklistedUniversityAddress = single_blacklisted_university;
        div.appendChild(button);
        document.getElementById('blacklisted_universities_container').appendChild(div);
        load_university_data(single_blacklisted_university);
    });
    document.querySelectorAll('.addressSearchButton').forEach(single_elem => {
        single_elem.addEventListener('click', search_address_btn);
    });
    if(university_data.blacklistedUniversities.length > 0) {
        document.getElementById('blacklisted_university_list').classList.remove('d-none');
    }
}
const search_address_btn = event => {
    let address = event.target.dataset.blacklistedUniversityAddress;
    window.location.href = `search.html?address=${address}`;
}

const load_university_data = async address => {
    const local_university_data = await contract.methods.getDetailsUniversity(address).call();
    document.querySelectorAll(`[data-blacklisted-university-address='${address}']`).forEach(single_elem => {
        if(local_university_data.name != "") {
            single_elem.innerText = local_university_data.name;
        }
    });
}

const setup_blacklisted_courses = async _ => {
    if(university_data.blacklistedCourseTemplates.length == 0) {
        return;
    }
    const course_list = await contract.methods.getCourseTemplates().call();
    
    university_data.blacklistedCourseTemplates.forEach(single_blacklisted_course_idx => {
        let div = document.createElement('div');
        div.classList.add('col-md-auto');
        let button = document.createElement('button');
        button.classList.add('btn');
        button.classList.add('btn-outline-dark');
        button.innerText = course_list[single_blacklisted_course_idx].name;
        button.dataset.courseId = single_blacklisted_course_idx;
        button.dataset.courseDescription = course_list[single_blacklisted_course_idx].description;
        button.dataset.courseDuration = course_list[single_blacklisted_course_idx].duration;
        button.dataset.courseName = course_list[single_blacklisted_course_idx].name;
        button.dataset.bsToggle = "modal";
        button.dataset.bsTarget = "#course_modal";
        div.appendChild(button);
        document.getElementById('blacklisted_courses_container').appendChild(div);
    });
    setupCourseModal();
    document.getElementById('blacklisted_course_list').classList.remove('d-none');
}

const setupCourseModal = _ => {
    let modal_elem = document.querySelector('#course_modal');
    modal_elem.addEventListener('show.bs.modal', event => {
        let caller = event.relatedTarget;
        (async (caller) => {
            await loadCourseModal(caller);
        })(caller);
    });
    document.getElementById('whitelist_course').addEventListener('click', whitelist_course);
}

const loadCourseModal = async elem => {
    let course_data = elem.dataset;
    document.getElementById('course_name').innerText = course_data.courseName;
    document.getElementById('course_description').innerText = course_data.courseDescription;
    document.getElementById('course_duration').innerText = course_data.courseDuration + ' months';
    document.getElementById('whitelist_course').dataset.courseId = course_data.courseId;
}

const whitelist_course = async event => {
    try {
        document.getElementById('whitelist_course_spinner').classList.remove('d-none');
        document.getElementById('whitelist_course').disabled = true;
        let executioner_addr = await getAccount();
        let courseID = parseInt(event.target.dataset.courseId);
        let res = await contract.methods.removeBlacklistedCourseTemplate(courseID).send({from: executioner_addr});
        window.location.reload();
    } catch(e) {
        document.getElementById('whitelist_course_spinner').classList.add('d-none');
        document.getElementById('whitelist_course').disabled = false;
    }
}

const update_university_name = async _ => {
    try {
        document.getElementById('edit_name_loading_spinner').classList.remove('d-none');
        document.getElementById('update_university_name').disabled = true;
        let new_university_name = document.getElementById('new_university_name').value;
        let executioner_addr = await getAccount();
        await contract.methods.updateUniversityName(new_university_name).send({from: executioner_addr});
        window.location.reload();
    } catch(e) {
        document.getElementById('update_university_name').disabled = false;
        document.getElementById('edit_name_loading_spinner').classList.add('d-none');
    }
}

document.getElementById('edit_university_name').addEventListener('click', _ => {
    document.getElementById('edit_university_name').classList.add('d-none');
    document.getElementById('edit_form').classList.remove('d-none');
    document.getElementById('new_university_name').focus();
});

const invite_university = async _ => {
    const transaction = await Swal.fire({
        title: 'Enter university address',
        input: 'text',
        input: 'text',
        inputLabel: 'Double check the address. Invite once sent cannot be revoked.',
        icon: 'question',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Invite',
        showLoaderOnConfirm: true,
        inputValidator: (value) => {
            if (!value) {
                return 'Address cannot be empty'
            }
        },
        preConfirm: async (address) => {
            try {
                let executioner_addr = await getAccount();
                const transaction = await contract.methods.inviteUniversity(address).send({from: executioner_addr});
                return transaction;
            } catch(e) {
                Swal.showValidationMessage('Invite Request Failed');
            }
            
        },
        allowOutsideClick: () => !Swal.isLoading()
    });
    let transaction_id = transaction.value?.transactionHash;
    if(transaction_id) {
        Swal.fire({
            title: 'Invite Sent Successfully', 
            html: `Transaction ID: ${transaction_id} <br /> <a href="https://ropsten.etherscan.io/tx/${transaction_id}" target="_blank">View on Etherscan</a>`, 
            icon: 'success', 
            width: 900
        });
    }
    
}

const register_university = async _ => {
    try {
        document.getElementById('register_university_spinner').classList.remove('d-none');
        document.getElementById('register_university').disabled = true;
        let executioner_addr = await getAccount();
        let response = await contract.methods.registerUniversity("").send({from: executioner_addr}); 
        let transaction_id = response.transactionHash;
        await Swal.fire({
            title: 'Registered Successfully', 
            html: `Transaction ID: ${transaction_id} <br /> <a href="https://ropsten.etherscan.io/tx/${transaction_id}" target="_blank">View on Etherscan</a>`, 
            icon: 'success', 
            width: 900
        });
        document.getElementById('register_university_spinner').classList.add('d-none');
        document.getElementById('register_university').disabled = false;
        window.location.reload();
    } catch(e) {
        console.log(e);
        document.getElementById('register_university_spinner').classList.add('d-none');
        document.getElementById('register_university').disabled = false;
    }
}

document.getElementById('update_university_name').addEventListener('click', update_university_name);

document.getElementById('logout').addEventListener('click', _ => {
    logOut();
    window.location.href = '../index.html';
});

document.getElementById('university_logo').addEventListener('click', _ => {
    window.location.href = 'index.html';
});

document.getElementById('register_course').addEventListener('click', _ => {
    window.location.href = 'register_course.html';
});

document.getElementById('issue_degree').addEventListener('click', _ => {
    window.location.href = 'issue_degree.html';
})

document.getElementById('invite_university').addEventListener('click', invite_university);