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

db.ref('/module/').on('value', function (snapshot) {
    var table = document.getElementById('module-table');
    while (table.rows.length > 1) {
        table.deleteRow(-1);
    }
    var arr = snapshot.val();
    for (var key in arr) {
        var rowdata = table.insertRow(-1);
        rowdata.insertCell(0).innerHTML = key;
        rowdata.insertCell(1).innerHTML = arr[key].name;
        rowdata.insertCell(2).innerHTML = arr[key].credit;
    }
});

function newModule() {
    const moduleCode = document.getElementById('moduleCode');
    const moduleName = document.getElementById('moduleName');
    const credit = document.getElementById('credit');
    if (moduleCode.value) {
        if (moduleName.value) {
            if (credit.value) {
                db.ref('/module/' + moduleCode.value).set({
                    name: moduleName.value,
                    credit: credit.value
                });
                moduleCode.value = "";
                moduleName.value = "";
                credit.value = "";
                alert('Module registration success !');
            } else {
                alert('Please credit before submitting...');
            }
        } else {
            alert('Please enter module name before submitting...');
        }
    } else {
        alert('Please enter module code before submitting...');
    }
}
