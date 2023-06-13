
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
                selectedFieldName : '',
                templateSummObj : {}            
                       
        }
    },

    //------- Code to run when the Page loads
    mounted() {
        setInterval(() => {
            this.activeMsg = new Date().toLocaleString('en-GB', { timeZone: 'UTC' });
            
        }, 1000)
    },

    // Methods of this App
    methods: {
        doShowCreateNewTemplate() { // set up the multipurpose dialog box for the Create Template process
            console.log('doShowCreateNewTemplate button clicked');
            
            this.modalDiagOKclickAction = "theapp.handleCreateTemplateOKBtn(event);"  // assign the function that will be called by the Modal Dialog Ok button
            this.mDialogHeader = "Create New Template";
            this.mDialogBody = " ";           
            this.OkBtnMsg = ' Create Template ';
            this.modaldialogheadercolor= 'modal-header-success';

            this.mDialogBodyHtml = `<div class="mb-3"><label for="templatecntrl" class="form-label">Template Name </label><input type="text" class="form-control" id="templatecntrl"   placeholder="Enter Template Name" required autofocus></div>
                      <div class="mb-3">
                      <label for="exampleFormControlTextarea1" class="form-label">Template Description</label>
                     <textarea class="form-control" id="templatedesc" rows="3" placeholder="Enter some description about the use of this template...."></textarea>
                     </div>`

            //document.getElementById("templatecntrl").focus();        
        }, // end function doShowCreateNewTemplate()

        handleCreateTemplateOKBtn(event)
        {
                
                console.log(' In handleCreateTemplateOKBtn()');
                console.log(event.target.tagName);
                let tmpName = document.getElementById("templatecntrl").value;
                document.getElementById("templatecntrl").value ='';
                //console.log(tmpName);
                
                if(tmpName !== undefined && tmpName.length > 0 )
                {
                    tmpName = tmpName.toLocaleUpperCase().trim();
                    if (this.templateLists.findIndex(e=> (e.name === tmpName)) == -1)
                    {                   
                        const desc = document.getElementById("templatedesc").value; 
                        document.getElementById("templatedesc").value = "";
						// here create the Template Object 
                        const tmpObj = this.prvCreateTemplateObject(tmpName,desc);
						// add to the Array of Templates
                        this.templateLists.push(tmpObj); 
						//close dialog	
                        this.$refs.dialogClose.click();
                    }
                    else
                    {
                        alert(tmpName + ' already exist on the list');
                        
                    }
                }
                else
                alert('Invalid Template Name');
        },     // end handleCreateTemplateOKBtn()    


            
      

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
                    this.templateSummObj = this.prvGenerateSummaryObj(this.templateLists[index]);
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


        doCreateNewField() { // set up the multipurpose dialog box for the Create Template process
            console.log('...In doCreateNewField()');
            
            
            this.modalDiagOKclickAction = "theapp.handleCreateFieldOKBtn(event);"  // assign the function that will be called by the Modal Dialog Ok button
            this.mDialogHeader = "Create New Field for " + this.selectedTemplateName;
            this.mDialogBody = " ";     
            this.OkBtnMsg = "Create Field";      
            this.modaldialogheadercolor= 'modal-secondary';

            this.mDialogBodyHtml = `<div class="mb-3">
            <label for="fieldName" class="form-label fw-bold mb-0 fs-6">Field Name</label>                
            <input type="text" class="form-control form-control-sm" id="fieldName" placeholder="Field Name">               
        </div>

        <div class="mb-3">
            <label for="fieldDesc" class="form-label fw-bold mb-0 fs-6">Field Description</label>                
            <input type="text" class="form-control form-control-sm" id="fieldDesc" placeholder="Field Description">               
        </div>            

        <div class="mb-3">
            <label for="fieldType" class="form-label fw-bolder mb-0 fs-6">Field Type</label>               
            <select class="form-select form-select-sm" id="fieldType"  >
                <option selected value="">Click to select option</option>
                <option value="TEXT">TEXT</option>
                <option value="NUMBER">NUMBER</option>
                <option value="DATE">DATE</option>
            </select>  
        </div>   

        <div class="mb-3">
            <label for="fieldImportance" class="form-label fw-bold fs-6 mb-0">Field Importance</label>               
            <select class="form-select form-select-sm" id="fieldImportance"  >
                <option selected>Click this select option</option>
                <option value="Optional">Optional</option>
                <option value="Required">Required</option>                   
            </select>  
        </div>              `

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

				//creat the field object
                const aFieldObj = this.prvCreateFieldObject(this.selectedTemplateName,fieldname,fielddesc,fieldtype,fieldimpt);

                //Now get the Template Object that this field belongs to 

                //Find the Object in the Array List 
                const index = this.templateLists.findIndex(e => (e.name === this.selectedTemplateName ));

                if (index > -1)
                {
                    
					//get the array that holds the field object for the selected template
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



        doDeleteFieldDialogRender()
        {
            console.log('Inside doDeleteFieldDialogRender()');
            console.log(this.selectedFieldName);
            
            const OkClickFunc = "theapp.handleDeleteFieldYESBtn(event);"            
            this.prvRenderDeleteModalDiaLog(OkClickFunc, "Delete Field", this.selectedFieldName );
    
        }, // end doDeleteFieldDialogRender()


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
                getRowID: function(){return name}               
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
              'No. of Databases' : theTemplateObj.childDBnames.length
              
          }
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



