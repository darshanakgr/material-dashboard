/**
 * Created by drox2014 on 6/13/2017.
 */

var config = {
    apiKey: "AIzaSyC_MAA3q1F2RRvh_AJD6Rz7ucT5Th-lgXk",
    authDomain: "result-portal-8f513.firebaseapp.com",
    databaseURL: "https://result-portal-8f513.firebaseio.com",
    projectId: "result-portal-8f513",
    storageBucket: "result-portal-8f513.appspot.com",
    messagingSenderId: "873859476364"
};

firebase.initializeApp(config);

const db = firebase.database()

db.ref('/student/').on('value', function (snapshot) {
    var table = document.getElementById('student-table');
    while (table.rows.length > 1) {
        table.deleteRow(-1);
    }
    var arr = snapshot.val();
    for (var key in arr) {
        var rowdata = table.insertRow(-1);
        rowdata.insertCell(0).innerHTML = key;
        rowdata.insertCell(1).innerHTML = arr[key].name;
    }
});

function addStudent() {
    const indexNumber = document.getElementById('indexNumber');
    const studentName = document.getElementById('name');
    if (indexNumber.value) {
        if (studentName.value) {
            db.ref('student/' + indexNumber.value).set({name: studentName.value});
            indexNumber.value = '';
            studentName.value = '';
            indexNumber.focus();
            alert('Student registation success!');
        } else {
            alert('Please enter name before register...');
        }
    } else {
        alert('Please enter index number before register...');
    }
}

var form = document.getElementById("student");

function handleForm(event) {
    event.preventDefault();
}

form.addEventListener('submit', handleForm);