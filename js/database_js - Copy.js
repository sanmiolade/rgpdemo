
//Create the Vue Optional Object parameter 
const vueOptObject = {
    //-----------------the data object-------------------
    data() {
        return {
                activeMsg : 'Vue is active',
                mDialogHeader: '',
                mDialogBody: '',
                mDialogBodyHtml: '',
                mTemplate: '',
                CloseBtnMsg: 'Cancel',
                OkBtnMsg: 'Ok',
                templateLists:[],
                selectedTemplate: null,
                bDisableDelBtn: true,
                selectedTemplateName : '',
                dynTest: 'theapp.Test3()',
                modaldialogheadercolor : '',
                currentFieldRowSelected : null,
                modalDiagOKclickAction: "alert('Click Action NOT DEFINED')",
                fields: [],
                records: [],
                selectedFieldName : '',
                templateSummObj : {},
                dataInputHTMLColumns : '',
                mtfooterHtml: '',
                showInputrow: false           
                       
        }
    },

    //------- Code to run when the Page loads
    mounted() {

        this.templateLists = JSON.parse('[{"name":"BELFAST","description":"The Belfast ","owner":"_TO_BE_UPDATED_","fields":[{"fieldname":"mid","fielddesc":"The mID Description","fieldtype":"NUMBER","fieldimpt":"Required"},{"fieldname":"firstname","fielddesc":"the user first name","fieldtype":"TEXT","fieldimpt":"Required"},{"fieldname":"dob","fielddesc":"date of Birth ","fieldtype":"DATE","fieldimpt":"Optional"}],"datecreated":"20/10/2021, 16:50:29","RecordCount":"346","records":[{"recUniqueID": "1","mid":"BT072","firstname":"Sanmi","dob":"12/01/1975"},{"recUniqueID": "2","mid":"BT073","firstname":"Yemisi","dob":"09/09/1981"}, {"recUniqueID": "3","mid":"BT074","firstname":"Sade","dob":"05/11/1992"}, {"recUniqueID": "4","mid":"BT075","firstname":"Tolulope","dob":"19/04/2011"}]}]');
        
        setInterval(() => {
            this.activeMsg = new Date().toLocaleString('en-GB', { timeZone: 'UTC' });
            
        }, 1000)
    },

    // Methods of this App
    methods: {

        checkkey(thekey)
        {
            console.log(thekey);
            if(thekey == 'Enter') this.insertRecord();
        },

        insertRecord(){

            let newRecordObj  = {recUniqueID: "0"};

            console.log('----------- In insert Record() ------------------');
                for (eachField of this.fields)
                {
                    console.log(eachField.fieldname);
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

          this.records.push(newRecordObj); //add to records 
          this.templateSummObj.No_of_Records = this.records.length; // update Summary window
          for (eachField of this.fields) //clear the input
          {
            document.getElementById("new_input_" + eachField.fieldname).value='';
          }

          // here put focus back to leftmost input
          let elemid = "new_input_" + this.fields[0].fieldname;
          document.getElementById(elemid).focus();

        }, //End InsertRecord



        doShowCreateNewTemplate() { // set up the multipurpose dialog box for the Create Template process
            console.log('doShowCreateNewTemplate button clicked');
            
            this.modalDiagOKclickAction = "theapp.handleCreateTemplateOKBtn(event);"  // assign the function that will be called by the Modal Dialog Ok button
            this.mDialogHeader = "Select Template for Database";
            this.mDialogBody = " ";           
            this.OkBtnMsg = ' Create Database ';
            this.modaldialogheadercolor= 'modal-header-warning';

 

         
        }, // end function doShowCreateNewTemplate()


            
      

        doTemplateNameClick(e){
            console.log('Inside doTemplateNameClick');
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
                this.bDisableDelBtn = false;
                this.selectedTemplateName = this.selectedTemplate.getAttribute('tempName')

                //Find the Object in the Array List 
                const index = this.templateLists.findIndex(e => (e.name === this.selectedTemplateName ));

                if (index > -1)
                {
                    // the load the field variable that is used to render the rows 
                    this.fields = this.templateLists[index].fields;
                    this.records = this.templateLists[index].records;
                    this.templateSummObj = this.prvGenerateSummaryObj(this.templateLists[index]);
                    this.mtfooterHtml = this.prvGenerateDataInputColumns(this.fields);
                    //this.showInputrow = this.mtfooterHtml.length > 0;
                }                
            }
            else
            {
                this.bDisableDelBtn = true;
                this.selectedTemplateName = '';
            }
            this.bDisableDelBtn = this.selectedTemplate.getAttribute('tempName').length > 0 ? false : true;
           
            //then enable the buttons
        }, // end doTemplateNameClick()

        prvRenderDeleteModalDiaLog(OkClickFunc,DelLabel,itemname)
        {
            this.modalDiagOKclickAction = OkClickFunc;  // assign the function that will be called by the Modal Dialog Ok button
            this.bDisableDelBtn = true; 
            this.mDialogHeader = DelLabel;
            this.mDialogBody = " ";
            this.mDialogBodyHtml ='<div class="mb-3"><p class="fs-4">' + DelLabel + ' <span class="fw-bolder" > ' +  itemname + ' </span> ?</p></div>';  
            this.CloseBtnMsg =' NO ';
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
       


        handleDeleteFieldYESBtn(event)
        {
           // console.log(event.target.tagName);
            const theFieldname = this.selectedFieldName;
            console.log(this.selectedFieldName );
            //const index = this.templateLists.indexOf(templatename);
            const index = this.fields.findIndex(e => (e.fieldname === theFieldname )) 
            if (index > -1)
            {
                this.fields.splice(index,1);
                this.templateSummObj.No_of_Fields = this.fields.length; // update Summary window
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
             this.currentFieldRowSelected.classList.remove(theCSSclass);
           }
           
           e.currentTarget.classList.toggle('dofocusvisible');
           this.currentFieldRowSelected = e.currentTarget.classList.contains(theCSSclass) ? e.currentTarget : null;
           //handle button state
           document.getElementById("btnDelField").disabled = (this.currentFieldRowSelected === null);
           document.getElementById("btnEditField").disabled = (this.currentFieldRowSelected === null);
           //get name of the selected field
           this.selectedFieldName = (this.currentFieldRowSelected !== null) ? e.currentTarget.getAttribute("id") : '';

          
        }, // end handleTRclick



        doDeleteRecordDialogRender()
        {
            console.log('Inside doDeleteRecordDialogRender()');
            console.log(this.selectedFieldName);
            
            const OkClickFunc = "theapp.handleDeleteFieldYESBtn(event);"            
            this.prvRenderDeleteModalDiaLog(OkClickFunc, "Delete Record", this.selectedFieldName );
    
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

        prvGenerateDataInputColumns(theFieldObjectArray)
        {
            //generated the inputs html 
            // See (https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number#using_number_inputs)

           // const datepattern="^(((0[1-9]|[12][0-9]|3[01])[- /.](0[13578]|1[02])|(0[1-9]|[12][0-9]|30)[- /.](0[469]|11)|(0[1-9]|1\d|2[0-8])[- /.]02)[- /.]\d{4}|29[- /.]02[- /.](\d{2}(0[48]|[2468][048]|[13579][26])|([02468][048]|[1359][26])00))$"; 
            let outputHTML =' <th scope="row" style="text-align: right;" class="bg-warning"><span class="fs-5 bg-warning"> >> </span></th>';

            let fieldLeft = theFieldObjectArray.length -1;
            let fieldcnt = 1;
            for (fieldobj of theFieldObjectArray)
            {
                
                let inputtype = 'text';
                let elementid = "new_input_" + fieldobj.fieldname;
                let otherattributes ='id="' + elementid  + '"';
                if (fieldcnt == 1)  otherattributes  = otherattributes + '  ref ="leftmostinput"';
                if (fieldobj.fieldtype.toLowerCase() === 'number') inputtype = 'number';
                if (fieldobj.fieldtype.toLowerCase() === 'date'){
                    otherattributes  = otherattributes + '  placeholder ="dd/mm/yyyy" ';
                    let d = new Date();
                    maxdate = d.toISOString().split('T')[0];
                    mindate = (d.getFullYear() -100) +'-'+ d.getMonth()+ "-" + d.getDay();                    
                    otherattributes  = otherattributes + '  min ="'+ mindate + '"  max="' + maxdate + '"';             
                    inputtype = 'date';
                }
                 
                if (fieldobj.fieldimpt.toLowerCase() === 'required') otherattributes  = otherattributes + 'required';
                if(fieldobj.fielddesc !== null && fieldobj.fielddesc.length > 0) otherattributes += '  title="'+ fieldobj.fielddesc +'"';
                if(fieldLeft == 0) otherattributes += '   onkeyup="theapp.checkkey(event.key)"';  //the last input box has a enterkey up event



                 outputHTML += '<td><input type="'+ inputtype+ '" class="form-control form-control-sm" '+ otherattributes + '></td>' + "\n";
                 fieldLeft--;
                 fieldcnt++;
            }
             return outputHTML;
        } //prvGenerateDataInputColumns


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



