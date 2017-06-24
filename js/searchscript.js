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

const db = firebase.database();


function findGrade(gradePoint) {
    switch (gradePoint) {
        case "4.2":
            return "A+";
        case "4.0":
            return "A";
        case "3.7":
            return "A-";
        case "3.3":
            return "B+";
        case "3.0":
            return "B";
        case "2.7":
            return "B-";
        case "2.3":
            return "C+";
        case "2.0":
            return "C";
        case "1.5":
            return "C-";
        case "1.0":
            return "D";
        default:
            return "I-we";
    }
}

function fillTable(indexNumber) {
    var table = document.getElementById('result-table');
    while (table.rows.length > 1) {
        table.deleteRow(-1);
    }
    primary(indexNumber, table);
    db.ref().child('rank').child(indexNumber).once('value').then(function (data) {
        if (data.val()) {
            document.getElementById('gpa').value = data.val().gpa;
            document.getElementById('rank').value = data.val().rank;
        }
    });
}

function primary(indexNumber, table) {
    return db.ref('module/').once('value').then(function (snapshot) {
        var arr = snapshot.val();
        for (var moduleCode in arr) {
            var rowData = table.insertRow(-1);
            rowData.insertCell(0).innerHTML = moduleCode;
            rowData.insertCell(1).innerHTML = arr[moduleCode].name;
            rowData.insertCell(2).innerHTML = arr[moduleCode].credit;
            secondary(arr, moduleCode, rowData, indexNumber);
        }
    });
}

function secondary(arr, moduleCode, rowData, indexNumber, sum) {
    return db.ref('result/' + moduleCode + "/" + indexNumber).once('value').then(function (data) {
        if (data.val()) {
            rowData.insertCell(3).innerHTML = findGrade(data.val().grade);
        }
    });
}

function searchStudent() {
    const indexNumber = document.getElementById('indexNumber');
    if (indexNumber.value) {
        db.ref('student/' + indexNumber.value).once('value').then(function (snapshot) {
            var student = snapshot.val();
            if (student) {
                const name = document.getElementById('name');
                name.value = student.name;
                fillTable(indexNumber.value);

            } else {
                alert('No student found...');
            }
        });
    } else {
        alert('Please enter index number before searching...');
    }
}
