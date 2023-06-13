let gResultObj = {}; //empty array 
let gtheApp;
let gMaptablefieldArr = [];
let gDbFieldName2ImportArrayIndexObj = {};
//-------------------------------------------------------------


function doXLSDataImport(btn)
{
    btn.disabled = true;   

    if (mapDbFld2ArrIndx() == true)
     {
        document.getElementById('mapptablecontent').style.display = 'none';
        convertRecords();
     }
     else
        btn.disabled = false;   
    
}

function convertRecords()
{

    //Note : gResultObj[worksheetname][0] is the FieldName or Header ROW
    //get the selected work book 
    let worksheetname= document.getElementById('wkslist').value;

    let totalRecCnt = gResultObj[worksheetname].length-1;
    gtheApp.tmpImportErrorLogs = [];
    let currRecIdPos = -99999;  //this is set to ensure that you can upload 100k
    let newRecordObj = null;
    let workshtRecordRow = null;
    gtheApp.tmpImportedRec = []; //define a empty array to store the new records

        function createErrorObj(errName, errDesc) { 
            return {'ErrName': errName, 'ErrDesc' : errDesc};
        };

    for (rowPos = 1; rowPos<= totalRecCnt;rowPos++ ) 
        {
            newRecordObj  = {recUniqueID: 0,CRUD_ACTION: "CREATE"};
            workshtRecordRow = gResultObj[worksheetname][rowPos];  // get a record row

            // Now below go thru the DB field Columns and determine which WorkSheet Record Colum was assigned based on the gDbFieldName2ImportArrayIndexObj[]
            for (eachField of gtheApp.fields)
            {
                noFieldImportError = true;
                let wrkshtColPos = gDbFieldName2ImportArrayIndexObj[eachField.fieldname]; 
                let theValue = workshtRecordRow[wrkshtColPos]; 

                let typeofvalue = typeof(theValue);

                //----------- Exercise some Importation Rules ------------------------

                // RULE 1 : If the a Required Field is missing 
                   if(eachField.fieldimpt == 'Required')
                   {
                      if (typeofvalue =="undefined") {
                        let tmpObj = createErrorObj("Required Record #" + rowPos + " has a field UNDEFINED", eachField.fieldname + " of Type " + eachField.fieldtype + " is UNDEFINED");
                        gtheApp.tmpImportErrorLogs.push(tmpObj);
                        noFieldImportError = false;
                        break ;  //break out of this loop to external loop
                      }                      
                   }

                // RULE 2 : TYPE and possible type conversion

                if(eachField.fieldtype.toLowerCase() === 'number' && (typeofvalue !== "number" || typeofvalue !== "bigint")) {
                    if (typeofvalue == "string") {
                        //try converting into a number 
                        if (isNaN(Number(theValue))){
                            let tmpObj = createErrorObj("Required Record #" + rowPos + " has a field TYPE-MISMATCH", eachField.fieldname + " of Type " + eachField.fieldtype + " has received a " + typeofvalue + "of value : " + theValue + " that was UNCONVERTABLE" );
                            gtheApp.tmpImportErrorLogs.push(tmpObj);
                            noFieldImportError = false;
                            break ;  //break out of this loop to external loop                            
                        }                  
                    }
                    else
                    {
                        let tmpObj = createErrorObj("Required Record #" + rowPos + " has a field TYPE-MISMATCH", eachField.fieldname + " of Type " + eachField.fieldtype + " has received a " + typeofvalue + "of value : " + theValue + " that was UNDETERMINED" );
                        gtheApp.tmpImportErrorLogs.push(tmpObj);
                        noFieldImportError = false;
                        break ;  //break out of this loop to external loop                          
                    }

                }

 

              
                if(eachField.fieldtype.toLowerCase() === 'date' && typeofvalue == "string" && theValue.length > 0)  // if it is a Date convert to dd/mm/yyyy
                {
                    if (isNaN(Date.parse(theValue))){
                        let tmpObj = createErrorObj("Required Record #" + rowPos + " has a field TYPE-MISMATCH", eachField.fieldname + " of Type " + eachField.fieldtype + " has received a " + typeofvalue + "of value : " + theValue + " that was UNCONVERTABLE" );
                        gtheApp.tmpImportErrorLogs.push(tmpObj);
                        noFieldImportError = false;
                        break ;  //break out of this loop to external loop                            
                    } 
                }    
                

 

                //Add the field into the Record Obj
                newRecordObj[eachField.fieldname] = theValue ;              
            } // end for loop  
   
            if(noFieldImportError) {
                currRecIdPos = currRecIdPos + 1;  // pls note currRecPos is init to -99999
                newRecordObj.recUniqueID = currRecIdPos;        
                gtheApp.tmpImportedRec.push(newRecordObj); //add to records 
            }

            
           
            
        }// end for loop 
         
        //show these elements
        document.getElementById('importedDatatablediv').style.display = 'block';
        document.getElementById('importedtablefooterdiv').style.display = 'block';
        
} //End convertRecords



function mapDbFld2ArrIndx()
{

    for(fieldname of gMaptablefieldArr)
    {
        let mappedFldNameColumnId = "mappedField_" + fieldname; 
        let mapCol = document.getElementById(mappedFldNameColumnId);

        if(mapCol !== null && mapCol.innerText !== "")
        {
            let arrelempos = parseInt(mapCol.getAttribute("arrelempos"));
            if(!isNaN(arrelempos))
            {
                gDbFieldName2ImportArrayIndexObj[fieldname] =  arrelempos;
            }
        }
        else
        { // if there is a Empty column mark it RED and exit
            mapCol.classList.add("domappedcolunmfocus");
            return false;
        }
    }
    return true;
}

function ReadXLSfile(theapp)
{
    gtheApp = theapp;

    gMaptablefieldArr = [];
    for (field of theapp.fields ) 
    {
        gMaptablefieldArr.push(field.fieldname);
    };

    var xlf = document.getElementById('xlf');
    
    XLStoObjectArr(xlf.files[0],displayResult);        
   
};


function generateTableBody(worksheet)
{
    const fieldnames = gMaptablefieldArr;
    let output = "";
    let fldcnt = 1;
    
    //get the selected work book 
    let wksOptElemVal = worksheet;  //document.getElementById('wkslist').value;
    let selectoption = "";
    let optcnt = 0;
    let worksheetdataHeaderRow = gResultObj[wksOptElemVal][0];  //this is the Header Row 

    let optioncnt = 0;
     for (const headerCol of worksheetdataHeaderRow) { // loop thru and get each column header name
         
        selectoption += `<option id="opt_${optioncnt}" arrelempos="${optioncnt}" value="${headerCol}">${headerCol}</option>`;
        optioncnt++;   
    } 

    let rowcnt = fieldnames.length;


    for (const field of fieldnames)  // loop thru the field name from the database fields
    {
            let selectdatacolunm ="";
        if (fldcnt == 1){
            selectdatacolunm = `
                                    <td rowspan="${rowcnt}" id="tbselectholder" class"d-flex p-1" style="padding : 2px">
                                        <div cxlass="border border-danger border-2"> 
                                    <select id="selXLSHdrFields" size="${worksheetdataHeaderRow.length}" style="border-width: 0;width: 100%;" onchange="theapp.handleOncchange(event)" ondblclick="theapp.handleMappDblClick(event)">
                                        ${selectoption}
                                    </select>

                                    <button type="button" class="btn btn-success btn-sm float-start mt-2 ml-1" id="btnMapAdd" disabled onclick="theapp.doAddMap(this)">Add</button>
                                    <button type="button" class="btn btn-danger btn-sm float-end mr-1 mt-2"  id="btnMapRemove" disabled onclick="theapp.doRemoveMap(this)"   >Remove</button>

                                        
                                    </div>
                                    </td> `;
        }


      

            output += `<tr>   
                                        
                            <td id="dbField_${field}">${field}</td><td style="font-weight: 900;"><<</td><td  onclick="theapp.handleMappedFieldclick(event)"  id="mappedField_${field}"></td>
                            ${selectdatacolunm}
                       
                        </tr>`;

        fldcnt++;                
    }
    return output;
}
function displayResult(ResultObj)
{
    
    let wksOptElem =  document.getElementById('wkslist');
    wksOptElem.disabled = true;
    let propPos = 1;
    let optText ="";
    let selectedWksName ="";

    // get the list of the Worksheet names 
    for (const property in ResultObj) {
        let attr = "";
        let numOfRec = ResultObj[property].length-1; // number ofrecords are in this worksheet
        if (propPos == 1) {
            attr = "selected";
            selectedWksName = property;
        }
        optText += '<option value="' + property + '" ' + attr + ' >' + property + " ("+ numOfRec + ")" +"</option>";
        propPos++;
    }
    if(wksOptElem !== undefined && optText !== "") 
    { 
        wksOptElem.innerHTML = optText;
        wksOptElem.disabled = false;
    } 

    
    displaySheetData(selectedWksName) 
}

function displaySheetData(worksheetname) 
{
document.getElementById('importedDatatablediv').style.display = 'none';
document.getElementById('importedtablefooterdiv').style.display = 'none';

 // make the whole mapp table visible   
 let maptablediv = document.getElementById('mapptablecontent');
 maptablediv.style.display = 'block';

document.getElementById('mapptablecontent').innerHTML = generateTableShell();


var tbody = document.getElementById('tablebody');
tbody.innerHTML = generateTableBody(worksheetname);
//get teh number of records in the worksheet
document.getElementById('excelRecCnt').innerText = numOfRec = gResultObj[worksheetname].length-1;
setTimeout(() => {  document.getElementById("selXLSHdrFields").style.height = (document.getElementById('tbselectholder').clientHeight * 0.95) + "px"; }, 100);       
           
           
 // doAutoMapDBFieldsWithExcelFields(); // Try and mapp fields with same name 
 
 let worksheetdataFieldRow = gResultObj[worksheetname][0]; 
    for ( const fieldName of gMaptablefieldArr)
    {
        let mappColumnId = "mappedField_" + fieldName;
        // get the table column that used to mapp the fields
        let mappColumn = document.getElementById(mappColumnId); 

        if(mappColumn !== null) {
            // check if the DB field name and Excel field name match
            let mapIndex = worksheetdataFieldRow.indexOf(fieldName);
            if (mapIndex >= 0 ) 
            {
                let optelemId = "opt_" + mapIndex;
                //get the option element
                let optElem = document.getElementById(optelemId); 
                if (optElem !== null)
                {
                    optElem.style.visibility = "hidden";
                    if (mappColumn!== null) mappColumn.innerText = fieldName;
                    mappColumn.setAttribute("optionId", optelemId );
                    mappColumn.setAttribute("arrelempos", mapIndex );
                    document.getElementById("btnMapAdd").disabled  = true;
                    document.getElementById("btnMapRemove").disabled = false;
                }             
            }

        }


    }
}


function XLStoObjectArr(filename, callbackfunc) {
   // see (https://oss.sheetjs.com/sheetjs/) and (https://docs.sheetjs.com/#parsing-examples) and (https://docs.sheetjs.com/#json) 
   //create a FileReader object
    var reader = new FileReader();

    //set the event onLoad that is raised when data is done loading
    reader.onload = function(e) {			
        var data = e.target.result; //det data
        //us the SheetsJS package to read the data into a work book
        //https://lifesaver.codes/answer/format-date-question  and  https://stackoverflow.com/questions/53163552/format-date-with-sheetjs
        var workbook = XLSX.read(data, { type: 'binary', cellText:false,cellDates:true });

        gResultObj = {}; //empty object is created

        workbook.SheetNames.forEach(function(sheetName) {
            //https://docs.sheetjs.com/#utility-functions  and https://docs.sheetjs.com/#parsing-options and https://stackoverflow.com/questions/53163552/format-date-with-sheetjs
            var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1,  raw:false,blankrows:false,dateNF:'dd/mm/yyyy'});
            if(roa.length) gResultObj [sheetName] = roa;
        });

        if(callbackfunc !== undefined) callbackfunc(gResultObj);
        

    };

    reader.onerror = function(ex) {
        console.log(ex);
    };        

    reader.readAsArrayBuffer(filename);

}; 

function generateTableShell()
{
    const tableshellHTML = `<table class="table table-responsive table-striped  tabsle-sm  table-bordered w-auto mx-auto">
    <thead class="thead-dark bg-primary text-white">                             
        <tr>                               
            <th scope="col" >Database Field Names</th>
            <th scope="col" ></th>
            <th scope="col" >Mapped Field Names</th>    
            <th scope="col" classs="col-md-auto">All Excel Table Fields</th>
        </tr>
    </thead>
    <tbody id="tablebody">
    
    
    </tbody>
    </table>
    <hr>
    <div class="d-flex flex-row   justify-content-center">                         
    <div class="pt-1 pe-5"><span>Number of Records :</span> <span id="excelRecCnt" style="font-weight :700">0</span></div>
    <div class="p-0"><button type="button" class="btn btn-dark btn-sm" onclick="doXLSDataImport(this)" ><i class="fas fa-file-import"></i>&nbsp; Import EXCEL Data</button> </div>                      
                                
    </div>`;

    return tableshellHTML;
}

