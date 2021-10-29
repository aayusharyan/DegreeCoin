(async _ => {
    if(!await isWeb3()) {
        await Swal.fire({
            title: "Could not connect to Ethereum Network", 
            icon: "error",
            allowOutsideClick: false
        });
        window.location.href = './index.html';
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
    if(!await isAuthorizedStudent()) {
        window.location.href = '../index.html';
    }
    const params = new URLSearchParams(window.location.search);
    search_address = params.get('address');
    if(search_address == "" || search_address == null) {
        document.getElementById('search_address').innerText += 'Nothing? 🤔';
        return;
    }
    document.getElementById('search_address').innerText = search_address;
    document.getElementById('search_field').value = search_address;

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
        document.getElementById('invited_by_text').classList.add('d-none');
    }

})();

document.getElementById('logout').addEventListener('click', _ => {
    logOut();
    window.location.href = '../index.html';
});

document.getElementById('student_logo').addEventListener('click', _ => {
    window.location.href = 'index.html';
});

const setupAccountTypeUniversity = async _ => {
    document.getElementById('account_type_badge').innerText = 'University';
    search_university_data = await contract.methods.getDetailsUniversity(search_address).call();

    if(search_university_data.name != null && search_university_data.name != "") {
        document.getElementById('address_name').innerText = search_university_data.name;
    }

    document.getElementById('invited_by_address').innerText = search_university_data.invitedBy;
    document.getElementById('invited_by_text').addEventListener('click', search_inviter);

    document.getElementById('search_universite_established_since').innerText = new Date(search_university_data.establishedAt * 1000);

    search_university_data.courses.forEach((single_course, idx) => {
        let tr = document.createElement('tr');
        let th = document.createElement('th');
        th.setAttribute('scope', 'row');
        th.innerText = idx;
        tr.appendChild(th);
        let td = document.createElement('td');
        td.innerHTML = single_course.name + "&emsp;";
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerText = single_course.duration + ' months';
        tr.appendChild(td);
        td = document.createElement('td');
        td.innerText = single_course.description;
        tr.appendChild(td);
        document.getElementById('courses_offered').appendChild(tr);
    });

    document.getElementById('data_university').classList.remove('d-none');
}
const setupAccountTypeStudent = async _ => {
    document.getElementById('account_type_badge').innerText = 'Student';
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
        td.innerHTML += "&emsp;"
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

    let course_name_elems = document.querySelectorAll(`[data-course-name-issuer='${university}']`);
    let university_name_elems = document.querySelectorAll(`[data-university-name-issuer='${university}']`);

    course_name_elems.forEach(single_course_name_elem => {
        let courseID = single_course_name_elem.dataset.courseId;
        let course = some_university_data.courses[courseID];
        single_course_name_elem.innerText = course.name;
    });

    if(some_university_data.name != null && some_university_data.name != "") {
        university_name_elems.forEach(single_university_name_elem => {
            single_university_name_elem.innerHTML = `<br />(${some_university_data.name})`;
        });
    }
}

const setupEquivalencyModal = _ => {
    let modal_elem = document.querySelector('#equivalency_modal');
    modal_elem.addEventListener('show.bs.modal', event => {
        let caller = event.relatedTarget;
        (async (courseID, university) => {
            await loadCourseEquivalencyInModal(courseID, university);
        })(caller.dataset.courseId, caller.dataset.university);
    });
}

const loadCourseEquivalencyInModal = async (courseID, university) => {
    document.getElementById('global_course').dataset.courseId = "";

    document.getElementById('their_course_name').innerText = "-----";
    document.getElementById('equivalent_course_name').innerText = "-----";
    

    document.getElementById('their_course_description').innerText = "-----";
    document.getElementById('equivalent_course_description').innerText = "-----";

    document.getElementById('their_course_duration').innerText = "-----";
    document.getElementById('equivalent_course_duration').innerText = "-----";

    let university_data = await contract.methods.getDetailsUniversity(university).call();

    const course_data = university_data.courses[courseID]; 

    const equivalency = parseInt(course_data.equivalency);
    const equivalent_course = await contract.methods.getCourseTemplate(equivalency).call();

    document.getElementById('global_course').dataset.courseId = equivalency;

    document.getElementById('their_course_name').innerText = course_data.name;
    document.getElementById('equivalent_course_name').innerText = equivalent_course.name;
    

    document.getElementById('their_course_description').innerText = course_data.description;
    document.getElementById('equivalent_course_description').innerText = equivalent_course.description;

    document.getElementById('their_course_duration').innerText = course_data.duration + ' months';
    document.getElementById('equivalent_course_duration').innerText = equivalent_course.duration + ' months';
}

const search_inviter = _ => {
    window.location.href = `search.html?address=${search_university_data.invitedBy}`;
}