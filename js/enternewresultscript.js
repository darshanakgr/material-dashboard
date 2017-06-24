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

function setModule() {
    const moduleCode = document.getElementById('moduleCode');
    if (moduleCode.options) {
        const moduleName = document.getElementById('moduleName');
        const credit = document.getElementById('credit');
        db.ref('/module/' + moduleCode.value + "/").once('value').then(function (snapshot) {
            var module = snapshot.val();
            moduleName.value = module.name;
            credit.value = module.credit;
        });
    }
    fillTable();
}

function fillTable() {
    const moduleCode = document.getElementById('moduleCode');
    if (moduleCode.options) {
        var table = document.getElementById('result-table');
        while (table.rows.length > 1) {
            table.deleteRow(-1);
        }
        db.ref('/result/' + moduleCode.value + "/").once('value').then(function (snapshot) {
            var res = snapshot.val();
            for (var key in res) {
                var rowData = table.insertRow(-1);
                rowData.insertCell(0).innerHTML = key;
                rowData.insertCell(1).innerHTML = findGrade(res[key].grade);
            }
        });
    }
}

db.ref('module/').once('value').then(function (snapshot) {
    var select = document.getElementById('moduleCode');
    var arr = snapshot.val();
    for (var key in arr) {
        var opt = document.createElement("option");
        opt.value = key;
        opt.innerHTML = key;
        select.appendChild(opt);
    }
    setModule();
});

function enterResult() {
    const indexNumber = document.getElementById('indexNumber');
    const moduleCode = document.getElementById('moduleCode');
    const grade = document.getElementById('grade');
    if (indexNumber.value) {
        if (moduleCode.value) {
            if (grade.selectedIndex > -1) {
                db.ref('result/' + moduleCode.value + '/' + indexNumber.value).set({grade: grade.options[grade.selectedIndex].value});
                indexNumber.value = "";
                grade.selectedIndex = 0;
                //alert('Result submitted successfully !');
                fillTable();
                indexNumber.focus();
            } else {
                alert('Please select a grade before submitting...');
            }
        } else {
            alert('Please enter module code before submitting...');
        }
    } else {
        alert('Please enter index number before submitting...');
    }
}
