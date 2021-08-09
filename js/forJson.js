window.addEventListener('load', function() {
    var jsonFromfile = {};
    var  dataForTable= {};
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            addFromUrl(this);
        }
     };
    var jsonRequestURL = "lpu.json";
    xmlhttp.open("GET", jsonRequestURL, true);
    xmlhttp.send();


    function addFromUrl(s, jsonFromfile){
        jsonFromfile = s.responseText;
        parse(s.responseText);
    }


    function saveFile() {

    }

    document.addEventListener('dragover', ev => ev.preventDefault())
    document.addEventListener('drop', ev => ev.preventDefault())
    var tabl = document.getElementById('dataTable');

    
    function IsJsonString(str) {
        try {
            console.log(str);
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function parse(str) {
        console.log(1);
        if(IsJsonString(str)){
            dataForTable = JSON.parse(str);
        }  else{
            console.log("Ошибка");
        }
        createTable();
    }

    

    document.getElementById('delRec').addEventListener('click', deleteFromTable);

    function deleteFromTable() {
        console.log(dataForTable);
        var result = [];
        for(j = 0; j < tabl.rows.length ; j++) {     
            for(k = 0; k < tabl.rows[j].cells.length ; k++) {   
                if(tabl.rows[j].cells[k].classList.contains('checkbox')) {
                    if(tabl.rows[j].cells[k].firstChild.checked) {
                        let key = tabl.rows[j].cells[k].firstChild.value;
                        delete dataForTable[key];
                        console.log(dataForTable);
                    }
                }
            }
        }
        createTable();

    }

    document.getElementById('addRec').addEventListener('click', addFromTable);

    function addFromTable () {
        var max = 0;
        for (var key in dataForTable) {
            let current = 1 * key;
            if(current>max){
                max = current;
            }
        }
        max++;
        var full_name = document.getElementById('full_name').value;
        var address = document.getElementById('address').value;
        var phone = document.getElementById('phone').value;
        dataForTable[max] = {"full_name":full_name, "address'":address, "phone":phone};
        console.log(dataForTable);
        createTable();
        var full_name = document.getElementById('full_name').value = "";
        var address = document.getElementById('address').value = "";
        var phone = document.getElementById('phone').value = "";
    }

    function saveFromTable(data) {
        data= {};
        for(j = 0; j < tabl.rows.length ; j++) {     
            for(k = 0; k < tabl.rows[j].cells.length ; k++) {   
                if(typeof data[j] == 'undefined') {
                    data[j] = {'full_name':'', 'address':'', 'phone':''};
                } 
                if(tabl.rows[j].cells[k].classList.contains('address')) {
                    data[j]['address'] = tabl.rows[j].cells[k].textContent;
                }
                if(tabl.rows[j].cells[k].classList.contains('full_name')) {
                    data[j]['full_name'] = tabl.rows[j].cells[k].textContent;
                }
                if(tabl.rows[j].cells[k].classList.contains('phone')) {
                    data[j]['phone'] = tabl.rows[j].cells[k].textContent;
                }
            }
        }
    }

    function createTable() {

        var str = document.getElementById('dataTable');
        while(str.rows.length) {
            str.deleteRow(0);
        }
        var i=0;
        for (var prop in dataForTable) {
            i++;
            let tr = document.createElement('tr'); 
            let td1 = document.createElement('td'); td1.innerHTML = i; 
            td1.setAttribute('contenteditable', false); 
            let td2 = document.createElement('td'); td2.setAttribute('class', 'full_name'); td2.innerHTML = dataForTable[prop]['full_name'];
            let td3 = document.createElement('td'); td3.setAttribute('class', 'address'); td3.innerHTML = dataForTable[prop]['address']; 
            let td4 = document.createElement('td'); td4.setAttribute('class', 'phone'); td4.innerHTML = dataForTable[prop]['phone']; 
            let chkbx=document.createElement('input');
            chkbx.setAttribute('type','checkbox');
            chkbx.setAttribute('value', prop);
            chkbx.setAttribute('id', 'ch' + prop);
            chkbx.setAttribute('class', 'checkbox');
            chkbx.setAttribute('title', 'Пометка для удаления');

            let td5 = document.createElement('td'); td5.appendChild(chkbx); 
            td5.setAttribute('class', 'checkbox');
            td5.setAttribute('contenteditable', false); 
            tr.appendChild(td1);
            tr.appendChild(td2); 
            tr.appendChild(td3); 
            tr.appendChild(td4);
            tr.appendChild(td5);
            str.appendChild(tr);
        }
        console.log(str.rows.length);
        if(str.rows.length == 0){
            let tr = document.createElement('tr'); 
            let td1 = document.createElement('td'); td1.innerHTML = "Ничего нет"; 
            tr.appendChild(td1);
            str.appendChild(tr);
        }
    }



     //возможно применю для валидации и  фильтрации введенных данных
    function setChangeListener (tb, listener) {

        tb.addEventListener("blur", listener);
        /*tb.addEventListener("keyup", listener);
        tb.addEventListener("paste", listener);
        tb.addEventListener("copy", listener);
        tb.addEventListener("cut", listener);
        tb.addEventListener("delete", listener);*/
        tb.addEventListener("mouseup", listener);

        tb.addEventListener("click", listener);
    
    }




    function download(content, fileName, contentType) {
        var a = document.createElement("a");
        var file = new Blob([JSON.stringify(content)], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
    }
    document.querySelector('.saveToFile').addEventListener('click', e => {
        download(dataForTable, 'result.json', 'text/plain');            
    });

    setChangeListener(tabl, function(event){

        console.log(event);
        if(event.type === 'mouseup' && event.target.type === 'checkbox') {
            var chbx = document.querySelectorAll('.checkbox');
            var resCh;
            if(event.target.checked){
                resCh = false;
            } else {
                resCh = true;
            }
            for(j = 0; j < chbx.length ; j++) {   
                if(chbx[j].checked && chbx[j].id != event.target.id) {
                    resCh = true;
                }
                //console.log(chbx[j].checked);
            }
            var delRec = document.getElementById('delRec');
            if(resCh){
                delRec.removeAttribute('disabled');
                console.log(2);
            } else {
                delRec.setAttribute('disabled', true);
            }

        }
        if(event.type === 'blur'){
            saveFromTable(dataForTable);
            console.log(10);
        }
    });

});