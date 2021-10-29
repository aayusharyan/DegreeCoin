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
    if(!await isAuthorizedStudent()) {
        window.location.href = '../index.html';
    }

    const student_data = await contract.methods.getDetailsStudent().call();
    
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
        td.innerText = 'Loading...';
        td.dataset.courseNameIssuer = single_degree.issuer;
        td.dataset.courseId = single_degree.courseID;
        tr.appendChild(td);
        td = document.createElement('td');
        let a = document.createElement('a');
        a.href = `search.html?address=${single_degree.issuer}`;
        a.innerText = single_degree.issuer;
        let span = document.createElement('span');
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
})();

const loadUniversityData = async university => {
    const some_university_data = await contract.methods.getDetailsUniversity(university).call();
    
    console.log(some_university_data);

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

document.getElementById('student_logo').addEventListener('click', _ => {
    window.location.href = 'index.html';
});

document.getElementById('logout').addEventListener('click', _ => {
    logOut();
    window.location.href = '../index.html';
});