
//Create the Vue Optional Object parameter 
const vueOptObject = {
    //-----------------the data object-------------------
    data() {
        return {
                activeMsg : 'Vue is active',
                mDialogHeader: '',
                mDialogBody: '',
                mDialogBodyHtml: '',
                modaldialogsettings: '',
                mTemplate: '',
                CloseBtnMsg: 'Cancel',
                OkBtnMsg: 'Ok',
                templateLists:[],
                selectedTemplate: null,
                bDisableDelBtn: true,
                bDisableEditBtn: true,
                bDisableUploadRecBtn : true,
                selectedTemplateName : '',
                dynTest: 'theapp.Test3()',
                modaldialogheadercolor : '',
                currentFieldRowSelected : null,
                modalDiagOKclickAction: "alert('Click Action NOT DEFINED')",
                fields: [],
                records: [],
				modifiedRecords:[],
                selectedFieldName : '',
                templateSummObj : {},
                dataInputHTMLColumns : '',
                mtfooterHtml: '',
				currRecPos: -9999,
                showInputrow: false,
                tmpImportedRec : [],
                tmpImportErrorLogs:[],
                currentMappColSelected :null           
                       
        }
    },

    //------- Code to run when the Page loads
    mounted() {

        this.templateLists = JSON.parse('[{"name":"BELFAST","description":"The Belfast ","owner":"Dr. Sanmi Olade","fields":[{"fieldname":"mid","fielddesc":"The mID Description","fieldtype":"NUMBER","fieldimpt":"Required"},{"fieldname":"firstname","fielddesc":"the user first name","fieldtype":"TEXT","fieldimpt":"Required"},{"fieldname":"phone","fielddesc":"User Phone number","fieldtype":"TEXT","fieldimpt":"Required"},{"fieldname":"dob","fielddesc":"date of Birth ","fieldtype":"DATE","fieldimpt":"Optional"}],"datecreated":"20/10/2021, 16:50:29","RecordCount":"346","records":[{"recUniqueID": 1,"CRUD_ACTION":"DB_REC","mid":"1072","firstname":"Sanmi","phone":"08033280147","dob":"12/01/1975"}]}]');
        
        setInterval(() => {
            this.activeMsg = new Date().toLocaleString('en-GB', { timeZone: 'UTC' });
            
        }, 1000)
    },

    // Methods of this App
    methods: {

        checkkey(thekey)
        {
            //console.log(thekey);
            if(thekey == 'Enter') this.insertRecord(0); // insert new record
        },

        insertRecord(recIndex){

            let newRecordObj  = {recUniqueID: 0,CRUD_ACTION: "CREATE"};

            console.log('----------- In insert Record() ------------------');
                for (eachField of this.fields)
                {
                    //console.log(eachField.fieldname);
                    let elementid = "new_input_" + eachField.fieldname;
                    const inpObj = document.getElementById(elementid );
                    if (!inpObj.reportValidity()) {
                        console.log('[Field : ' + eachField.fieldname + ']' + inpObj.validationMessage); 
                        return false;
                    }

                        //  inpObj.setCustomValidity("Invalid date format...");
                    let theValue = inpObj.value;
                   
                    if(eachField.fieldtype.toLowerCase() === 'date' && theValue.length > 0)  // if it is a Date convert to dd/mm/yyyy
                    {
                        let tmpDate = new Date(theValue);
                        theValue =   new Intl.DateTimeFormat('en-GB').format(tmpDate ); // tmpDate.getDay() + '/' + tmpDate.getMonth()  + '/' + tmpDate.getFullYear();                        
                    }

                    //Add the field into the Record Obj
                    newRecordObj[eachField.fieldname] = theValue ;        
                    
                } // end for loop
				
			
                
            if (recIndex < 1)  // if it is a New Record
            { 
                    this.currRecPos = this.currRecPos + 1;  // pls note currRecPos is init to -9999
                    newRecordObj.recUniqueID = this.currRecPos;

                    this.records.push(newRecordObj); //add to records             
                    this.templateSummObj.No_of_Records = this.records.length; // update Summary window
                    
                    //now create the record that will be sent to database for storage
                    this.modifiedRecords.push(newRecordObj); //add to records going to the DB
                    for (eachField of this.fields) //clear the input
                    {
                        document.getElementById("new_input_" + eachField.fieldname).value='';
                    }

                    // here put focus back to leftmost input
                    let elemid = "new_input_" + this.fields[0].fieldname;
                    document.getElementById(elemid).focus();
            }
            else // if it is an edit 
            {
     
                    newRecordObj.recUniqueID  = this.records[recIndex-1].recUniqueID;
                    newRecordObj.CRUD_ACTION = newRecordObj.recUniqueID > 0 ? "UPDATE" : "CREATE"; 
                    this.records[recIndex-1] = newRecordObj;
                
            }
            return true;

        }, //End InsertRecord



        doShowCreateNewTemplate() { // set up the multipurpose dialog box for the Create Template process
            console.log('doShowCreateNewTemplate button clicked');
            
            this.modalDiagOKclickAction = "theapp.handleCreateTemplateOKBtn(event);"  // assign the function that will be called by the Modal Dialog Ok button
            this.mDialogHeader = "Select Template for Database";
            this.mDialogBody = " ";           
            this.OkBtnMsg = ' Create Database ';
            this.modaldialogheadercolor= 'modal-header-warning';

 

         
        }, // end function doShowCreateNewTemplate()


        doUploadRecordInit(){
            document.getElementById('mapptablecontent').style.display = 'none'; 
            document.getElementById('importedDatatablediv').style.display = 'none';
            this.tmpImportedRec = [];
            this.tmpImportErrorLogs = [];
            document.getElementById('xlf').value ="";
            document.getElementById('btnReadXLSfile').disabled = true;
            document.getElementById("wkslist").disabled = true;
            
            

        },

        
        AddXLSDataImporttoDBList(btn)
        {
           // alert('Are you sure ?');
            let r = window.confirm("Are you sure You wish to Add these " + this.tmpImportedRec.length + " Records to your Database ??");
           if (r == true) {
            //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push#merging_two_arrays
            //merge the imported record into the main records
             this.records.push(...this.tmpImportedRec); //add to records 
                        
             this.templateSummObj.No_of_Records = this.records.length; // update Summary window
             
             //now create the record that will be sent to database for storage
             this.modifiedRecords.push(...this.tmpImportedRec); //add to records going to the DB

             this.$refs.ImportFileDialog.click(); // close dialog
           } 
        },
            
      

        doDBNameClick(e){
            console.log('Inside doDBNameClick');
            console.log(e.target.tagName);
            //if a tenplate has already been selected remove the focus border
            if (this.selectedTemplate !== null && this.selectedTemplate.tagName ==="BUTTON") {
                 this.selectedTemplate.classList.remove("templatelistfocus");   // remove the clicked border indication             
            }
           
            
            this.selectedTemplate = e.target;
            e.target.classList.add("templatelistfocus");  // indicate that it has been clicked with a Border
            //console.log(e.target.classList);
           
        
            console.log(this.selectedTemplate.getAttribute('data-id'));
            if (this.selectedTemplate.getAttribute('tempName').length > 0)
            {
                this.bDisableEditBtn = false;
                this.bDisableUploadRecBtn = false;
                this.selectedTemplateName = this.selectedTemplate.getAttribute('tempName')

                //Find the Object in the Array List 
                const index = this.templateLists.findIndex(e => (e.name === this.selectedTemplateName ));

                if (index > -1)
                {
                    // the load the field variable that is used to render the rows 
                    this.fields = this.templateLists[index].fields;
                    this.records = this.templateLists[index].records;
                    this.templateSummObj = this.prvGenerateSummaryObj(this.templateLists[index]);
                    this.mtfooterHtml = this.prvGenerateDataInputColumns2(this.fields,0);
                    //this.showInputrow = this.mtfooterHtml.length > 0;
                }                
            }
            else
            {
                this.bDisableDelBtn = true;
                this.selectedTemplateName = '';
                this.bDisableUploadRecBtn = true;
            }
            this.bDisableDelBtn = this.selectedTemplate.getAttribute('tempName').length > 0 ? false : true;
           
            //then enable the buttons
        }, // end dodbNameClick()

        prvRenderDeleteModalDiaLog(OkClickFunc,DelLabel,itemname)
        {
            this.modalDiagOKclickAction = OkClickFunc;  // assign the function that will be called by the Modal Dialog Ok button
            this.bDisableDelBtn = true; 
            this.mDialogHeader = DelLabel;
            this.mDialogBody = " ";
            this.mDialogBodyHtml ='<div class="mb-3"><p class="fs-4">' + DelLabel + ' <span class="fw-bolder" > ' +  itemname + ' </span> ?</p></div>';  
            this.CloseBtnMsg =' NO ';
            this.modaldialogsettings ='';
            this.OkBtnMsg = ' YES '; 
            this.modaldialogheadercolor= 'modal-header-danger'; 

        },

        doDeleteTemplate()
        {
            console.log('Inside doDeleteTemplate()');

            const tmpname = this.selectedTemplate.getAttribute('tempName');
            const OkClickFunc = "theapp.handleDeleteTemplateYESBtn(event);"
            
            this. prvRenderDeleteModalDiaLog(OkClickFunc, "Delete Template", tmpname );
    
        }, // end doDeleteTemplate()

 

        handleDeleteTemplateYESBtn(event)
        {
           // console.log(event.target.tagName);
            const templatename = this.selectedTemplate.getAttribute('tempName');
            console.log(templatename );
            //const index = this.templateLists.indexOf(templatename);
            const index = this.templateLists.findIndex(e => (e.name === templatename )) 
            if (index > -1)
            {
               
                if (this.selectedTemplate !== null && this.selectedTemplate.tagName ==="BUTTON") {
                    this.selectedTemplate.classList.remove("templatelistfocus");   // remove the clicked border indication             
                  }
                              
                this.templateLists.splice(index,1);
                this.fields = [];
                this.selectedTemplateName = "";
                this.selectedTemplate = null;
                this.templateSummObj = {};
                this.$refs.dialogClose.click();
            }



        }, //handleDeleteTemplateYESBtn()
       


        handleDeleteRecordYESBtn(event)
        {
            
           // console.log(event.target.tagName);
            const theRowID = parseInt(this.currentFieldRowSelected.getAttribute("id")); 
            console.log(this.selectedRecRowSerialNum );
           
            const index = this.records.findIndex(e => (e.recUniqueID === theRowID )) 
            if (index > -1)
            {
                this.records.splice(index,1);
                this.templateSummObj.No_of_Records = this.records.length; // update Summary window

                //Now we need to perform a delete process for the modified records array. We have 2 types of Records
                // Records from the Database whose recUniqueID > 0 and records just added whose recUniqueID < 0
                const modRecindex = this.modifiedRecords.findIndex(e => (e.recUniqueID === theRowID )) 
                if (modRecindex > -1)
                {
                    if (theRowID < 0) // a record added in this unsaved session
                        this.modifiedRecords.splice(modRecindex,1); // just remove it from the array

                }
                else if (theRowID > 0)
                { // since You are trying to delete a Record stored in the DB, Send a Dummy Rec with a CRUD_ACTION Message. Server will delete for us
                    const DBrecObj = {"recUniqueID" : theRowID , "CRUD_ACTION" : "DELETE"}; //create a dummy Record 
                    this.modifiedRecords.push(DBrecObj);
                }

                this.$refs.dialogClose.click();
            }

        }, //handleDeleteFieldYESBtnn()


        doShowInputRow() { // 
            console.log('...doShowInputRow()');
            
            this.showInputrow = this.mtfooterHtml.length > 0;

           
           // document.getElementById(elemid).focus();

            setTimeout(() => {
                let elemid = "new_input_" + this.fields[0].fieldname;
                document.getElementById(elemid).focus();
               }, 200);
           
            
        }, // end function doCreateNewField()        

        handleCreateFieldOKBtn(event)
        {
            console.log('...In handleCreateFieldOKBtn()');    
           
            let fieldname = document.getElementById("fieldName").value;          
            const fielddesc = document.getElementById("fieldDesc").value;
            const fieldtype = document.getElementById("fieldType").value;
            const fieldimpt = document.getElementById("fieldImportance").value;

            if(fieldname === undefined || fieldname.length <= 0 )
                {
                    alert("Please enter the field name..");
                    document.getElementById("fieldName").focus();
                    return;
                }

                if(fieldtype === undefined || fieldtype.length <= 0 )
                {
                    alert("Please select the field type..");
                    document.getElementById("fieldType").focus();
                    return;
                }    
                
                if(fieldimpt === undefined || fieldimpt.length <= 0 )
                {
                    alert("Please select the field importance..");
                    document.getElementById("fieldImportance").focus();
                    return;
                }                 


                document.getElementById("fieldName").value ="";          
                document.getElementById("fieldDesc").value ="";
                document.getElementById("fieldType").value ="";
                document.getElementById("fieldImportance").value ="";                


                fieldname = fieldname.toLocaleLowerCase().trim();

                const aFieldObj = this.prvCreateFieldObject(this.selectedTemplateName,fieldname,fielddesc,fieldtype,fieldimpt);

                //Now get the Template Object that this field belongs to 

                //Find the Object in the Array List 
                const index = this.templateLists.findIndex(e => (e.name === this.selectedTemplateName ));

                if (index > -1)
                {
                    
                    let theFields = this.templateLists[index].fields;
                    //check if this newField exist in this list
                    if (theFields.findIndex (e => (e.fieldname === fieldname )) == -1) // not exist
                    {
                        theFields.push(aFieldObj);
                        this.templateSummObj.No_of_Fields = theFields.length; // update Summary window
                        this.$refs.dialogClose.click();
                    }
                    else
                    {
                        alert("The Field  already exist in this template");
                        return;
                    }
                }                

        }, // end handleCreateFieldOKBtn


        handleTRclick(e)
        {
            //handles the visual borders seen on a clicked row. 
            console.log('In Test 3  ' + e.currentTarget.getAttribute("id") );
            const theCSSclass = 'dofocusvisible';
            //if the same row previously seledcted.... then remove the border indicator
           if (this.currentFieldRowSelected !== null && this.currentFieldRowSelected !== e.currentTarget )
           {
             this.currentFieldRowSelected.classList.remove( 'dofocusvisible');
           }
           
           e.currentTarget.classList.toggle('dofocusvisible');
           this.currentFieldRowSelected = e.currentTarget.classList.contains( 'dofocusvisible') ? e.currentTarget : null;
           //handle button state
           document.getElementById("btnDelField").disabled = (this.currentFieldRowSelected === null);
           document.getElementById("btnEditField").disabled = (this.currentFieldRowSelected === null);
           //get name of the selected field
           this.selectedRecRowSerialNum = (this.currentFieldRowSelected !== null) ? e.currentTarget.getAttribute("sn") : '';

          
        }, // end handleTRclick

        handleMappedFieldclick(e)
        {
            //handles the visual borders seen on a clicked row. 
            console.log('handleMappedFieldclick  ' + e.currentTarget.getAttribute("id") );
            
            //if the same row previously seledcted.... then remove the border indicator
           if (this.currentMappColSelected !== null && this.currentMappColSelected !== e.currentTarget )
           {
             this.currentMappColSelected.classList.remove( 'domappedcolunmfocus');
           }
           
           e.currentTarget.classList.toggle('domappedcolunmfocus');
           this.currentMappColSelected = e.currentTarget.classList.contains( 'domappedcolunmfocus') ? e.currentTarget : null;
           //handle button state
           
           document.getElementById("btnMapRemove").disabled = (this.currentMappColSelected === null || this.currentMappColSelected.innerText === "");
           document.getElementById("btnMapAdd").disabled = true;
           
          
        }, // end handleTRclick

        doimportedRecordRowDelete(indx)
        {
            
            this.tmpImportedRec.splice(indx,1);
        },

        handleMappDblClick(event){
            //this basically clicks and adds the field for u 
            this.handleOncchange(event);
            let Addbtn = document.getElementById("btnMapAdd");
            if (!Addbtn.disabled){
                this.doAddMap(Addbtn);
            }
        },

        handleOncchange(event){
            console.log(event.target.value);
            console.log(event.target.selectedIndex) ;
           
            if (this.currentMappColSelected === null){
                document.getElementById("btnMapAdd").disabled = true;
                document.getElementById("btnMapRemove").disabled = true;
            }
            else
            {
                document.getElementById("btnMapRemove").disabled = (this.currentMappColSelected.innerText === "");
                document.getElementById("btnMapAdd").disabled = (this.currentMappColSelected.innerText !== "");
            }
        },

        doAddMap(btn)
        {
            let selectElem = document.getElementById('selXLSHdrFields'); 
            if(selectElem !== null)
            {
                
                let optelemId = "opt_" + selectElem.selectedIndex;
                let optElem = document.getElementById(optelemId); 
                if (optElem !== null)
                {
                    optElem.style.visibility = "hidden";
                    if (this.currentMappColSelected !== null) this.currentMappColSelected.innerText = selectElem.value;
                    this.currentMappColSelected.setAttribute("optionId", optelemId );
                    this.currentMappColSelected.setAttribute("arrelempos", selectElem.selectedIndex );
                    btn.disabled = true;
                    document.getElementById("btnMapRemove").disabled = false;
                }
            }
        },

        doRemoveMap(btn)
        {
            if (this.currentMappColSelected !== null && this.currentMappColSelected.innerText !== null && this.currentMappColSelected.optionId !== null) 
            {
                let optElem = document.getElementById(this.currentMappColSelected.getAttribute("optionid")); 
                optElem.style.visibility = "visible";
                this.currentMappColSelected.innerText ="";
                btn.disabled = true;
            }
        },

        doDeleteRecordDialogRender()
        {
            console.log('Inside doDeleteRecordDialogRender()');
            console.log(this.selectedRecRowSerialNum);
            
            const OkClickFunc = "theapp.handleDeleteRecordYESBtn(event);"            
            this.prvRenderDeleteModalDiaLog(OkClickFunc, "Delete Record", this.selectedRecRowSerialNum );
    
        }, // end doDeleteRecordDialogRender()


        doEditRecordDialogRender()
        {
            console.log('Inside doDeleteRecordDialogRender()');
            console.log(this.selectedRecRowSerialNum);
            this.showInputrow= false; // hide the table footer based Record row input
            let Label = "Edit Record #" + this.selectedRecRowSerialNum + " ?";
            let datainputrow = this.prvGenerateDataInputColumns2(this.fields,this.selectedRecRowSerialNum) ;
       
            let rowCol ="";
            for (eachField of this.fields)  rowCol += '<th class="text-center" scope="col" >' + eachField.fieldname + '</th>' ;

            let dyntable = `<div class="table-responsive"><table class="table  table-striped  table-sm  table-bordered">
                <thead class="thead-dark bg-dark text-white"><tr><th scope="col">#</th>` + rowCol + `</tr></thead><tbody><tr>`+datainputrow +`</tr></tbody></table></div>`;                       
    

            this.modalDiagOKclickAction = "theapp.handleEditFieldYESBtn(" + this.selectedRecRowSerialNum + ");"  ;  // assign the function that will be called by the Modal Dialog Ok button
            this.bDisableDelBtn = true; 
            this.mDialogHeader = Label;
            this.mDialogBody = " ";
            this.modaldialogsettings ='modal-xl';
            this.mDialogBodyHtml =dyntable;//'<div class="mb-3"><p class="fs-4">' + Label + ' <span class="fw-bolder" > ' +  this.selectedFieldName + ' </span> ?</p></div>';  
            this.CloseBtnMsg =' Cancel ';
            this.OkBtnMsg = ' Save Changes '; 
            this.modaldialogheadercolor= 'modal-header-primary'; 
    
        }, // end doDeleteRecordDialogRender()



        prvCreateTemplateObject(templateName,desc)
        {
            return {
                name : templateName,
                description: desc,
                owner: '_TO_BE_UPDATED_',
                fields:[],
                childDBnames: [],
                datecreated: new Date().toLocaleString('en-GB', { timeZone: 'UTC' })
            }
        }, //end prvCreateTemplateObject

        prvCreateFieldObject(templatename,name,desc,type,impt)
        {
            return {
                fieldname: name, 
                fielddesc:desc,
                fieldtype:type,
                fieldimpt:impt,
                templatename: templatename,
                      
            }
        },

        prvGenerateSummaryObj(theTemplateObj)
        {
          //creat the Object used in displaying teh Summary section
          console.log(" In prvGenerateSummaryObj()");
          return {
              Description: theTemplateObj.description,
              Dated_Created : theTemplateObj.datecreated,
              Owner : theTemplateObj.owner,
              No_of_Fields: theTemplateObj.fields.length,
              No_of_Records: theTemplateObj.records.length,            
              
          }
        }, // END  prvGenerateSummaryObj ,




        prvGenerateDataInputColumns2(theFieldObjectArray,RecordObjIndex)
        {
            //generated the inputs html 
            // See (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number#using_number_inputs)

            // the column that contains the # Serial number is shown as >>
           
            let RecObj = RecordObjIndex > 0 ? this.records[RecordObjIndex-1] : null; //get the record to use to populate
            let outputHTML=' <th scope="row" style="text-align: right;" class="bg-warning"><span class="fs-5 bg-warning"> >> </span></th>';
            if (RecordObjIndex > 0)
            {
                let serialnum = RecordObjIndex
                outputHTML =' <th scope="row" style="text-align: right;" ><span > ' + serialnum + '  </span></th>';
            }


            
           

            let fieldLeft = theFieldObjectArray.length -1;
            let fieldcnt = 1;
            for (fieldobj of theFieldObjectArray)
            { //for each field 
                
                let fieldvalue = RecObj !== null ? RecObj[fieldobj.fieldname] : null; //get the value
                let inputtype = 'text';
                let elementid = "new_input_" + fieldobj.fieldname;
                let otherattributes ='id="' + elementid  + '"';
                if (fieldcnt == 1)  otherattributes  = otherattributes + '  ref ="leftmostinput"';  // delete later
                if (fieldobj.fieldtype.toLowerCase() === 'number') inputtype = 'number';
                if (fieldobj.fieldtype.toLowerCase() === 'date'){
                    otherattributes  = otherattributes + '  placeholder ="dd/mm/yyyy" ';
                    let d = new Date();
                    maxdate = d.getFullYear() +'-'+ d.getMonth()+ "-" + (d.getDay() + 1);   //d.toISOString().split('T')[0];  // in format yyyy-mm-dd
                    mindate = (d.getFullYear() -100) +'-'+ d.getMonth()+ "-" + d.getDay();                    
                    otherattributes  = otherattributes + '  min ="'+ mindate + '"  max="' + maxdate + '"';             
                    inputtype = 'date';

                    if (fieldvalue  !== null && fieldvalue.includes("/")) // if there is a initial value
                    {                    

                        var dateParts = fieldvalue.split("/");                        
                        // month is 0-based, that's why we need dataParts[1] - 1
                        let dx  = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);                                               
                       
                        fieldvalue = dx.toISOString().split('T')[0];  // in format yyyy-mm-dd
                    }
                }
                 
                if (fieldobj.fieldimpt.toLowerCase() === 'required') otherattributes  = otherattributes + 'required';
                if(fieldobj.fielddesc !== null && fieldobj.fielddesc.length > 0) otherattributes += '  title="'+ fieldobj.fielddesc +'"';
                if(fieldLeft == 0 && RecordObjIndex < 1) otherattributes += '   onkeyup="theapp.checkkey(event.key)"';  //the last input box has a enterkey up event

                if (fieldvalue  !== null) otherattributes += '   value="' + fieldvalue + '" '; 

                 outputHTML += '<td ><input style="min-width: 110px !important;" type="'+ inputtype+ '" class="form-control form-control-sm" '+ otherattributes + '></td>' + "\n";
                 fieldLeft--;
                 fieldcnt++;
            }
             return outputHTML;
        }, //prvGenerateDataInputColumns

        


        handleEditFieldYESBtn(recIndex){
           if  (this.insertRecord(recIndex) )// Insert the updated record into the old row it was 
           { this.$refs.dialogClose.click();} 
        }

    } // ####################### End Methods #######################


}

const theapp = Vue.createApp(vueOptObject).mount('#maindiv');

//------------------------------------------- Now for Vanilla Javascript --------------------------------------------------

function Test1()
{
    console.log('In Test 1');
}

function Test2()
{
    console.log('In Test 2');
}

function SetFocusToElement(id)
{
    $(id).focus();
}



