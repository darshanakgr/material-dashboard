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

db.ref().child('rank').on('value', function (snapshot) {
    var table = document.getElementById('result-table');
    while (table.rows.length > 1) {
        table.deleteRow(-1);
    }
    var arr = snapshot.val();
    for (var key in arr) {
        var rowdata = table.insertRow(-1);
        rowdata.insertCell(0).innerHTML = key;
        rowdata.insertCell(1).innerHTML = arr[key].gpa;
        rowdata.insertCell(2).innerHTML = arr[key].rank;
    }
});

var ar = {};
var count = 0;

function rankStudent() {
    eachStudent();
}

function eachStudent() {
    return db.ref('student/').once('value').then(function (students) {
        for (var index in students.val()) {
            ar[index] = {name:students.val()[index].name,gpa: 0, credits: 0};
            getModules(index);
        }
    });
}

function getModules(index) {
    return db.ref('module/').once('value').then(function (snapshot) {
        var arr = snapshot.val();
        for (var moduleCode in arr) {
            secondary(arr, moduleCode, index);
        }
    });
}

function secondary(arr, moduleCode, index) {
    return db.ref('result/' + moduleCode + "/" + index).once('value').then(function (data) {
        if (data.val()) {
            lookupRecord(index, parseFloat(data.val().grade), parseFloat(arr[moduleCode].credit));
        }
    });
}

function lookupRecord(index, grade, credit) {
    ar[index].gpa = ((ar[index].gpa * ar[index].credits) + (grade * credit)) / (ar[index].credits + credit);
    ar[index].credits += credit;
    save(index, 0);
}

function save(index, rank) {
    return db.ref('rank/' + index).set({
        name:ar[index].name,
        gpa: ar[index].gpa,
        credits: ar[index].credits,
        rank: rank
    });
}

function setRank() {
    var rank = 1;
    var rankCount = 0;
    var lastMax = 4.2;
    while (Object.keys(ar).length) {
        var max = 0.0;
        var index = undefined;
        for (var key in ar) {
            console.log("L :" + key);
            if (ar[key].gpa > max) {
                max = ar[key].gpa;
                index = key;
                console.log("C :" + key);
            }
        }
        if (lastMax == max) {
            save(index, rank);
            rankCount++;
        } else {
            rank = rank + rankCount;
            save(index, rank);
            rankCount = 1;
        }
        lastMax = max;
        delete ar[index];
    }
}

function setChart() {
    db.ref().child('module').once('value').then(function (modules) {
        var arr = modules.val();
        for (var module in arr) {
            var resultQty = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            goThroughresults(module,resultQty);
            saveChart(module,resultQty);
        }
    });
}

function goThroughresults(moduleCode,resultQty) {
    return db.ref().child('result').child(moduleCode).once('value').then(function (data) {
        var arr = data.val();
        for(var index in arr){
            switch (arr[index].grade) {
                case "4.2":
                    resultQty[0]++;
                    break;
                case "4.0":
                    resultQty[1]++;
                    break;
                case "3.7":
                    resultQty[2]++;
                    break;
                case "3.3":
                    resultQty[3]++;
                    break;
                case "3.0":
                    resultQty[4]++;
                    break;
                case "2.7":
                    resultQty[5]++;
                    break;
                case "2.3":
                    resultQty[6]++;
                    break;
                case "2.0":
                    resultQty[7]++;
                    break;
                case "1.5":
                    resultQty[8]++;
                    break;
                case "1.0":
                    resultQty[9]++;
                    break;
                default:
                    resultQty[10]++;
                    break;
            }
        }
    });
}

function saveChart(module,arr) {
    return db.ref().child('chart').child(module).set({data:arr});
}
