import { LightningElement ,api,wire,track} from 'lwc';
import getcontactdetails from'@salesforce/apex/stockReceiving.getcontactdetails';
import getproductsdetails from '@salesforce/apex/stockReceiving.getproductsdetails';
import gettransactiondetails from '@salesforce/apex/stockReceiving.gettransactiondetails';
import getbinlocation from '@salesforce/apex/stockReceiving.getbinlocation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';//to show the error message
import createsol from '@salesforce/apex/stockReceiving.createsol';
import { NavigationMixin } from 'lightning/navigation';//we used for navigating to the record page after cliclking the save button 
import { createRecord } from 'lightning/uiRecordApi';
import StockReceivingObject from '@salesforce/schema/Stock_Recieving__c';
import Vendor_Field from '@salesforce/schema/Stock_Recieving__c.Vendor__c';
import Contact_Field from '@salesforce/schema/Stock_Recieving__c.Contact__c';
import Company_Field from '@salesforce/schema/Stock_Recieving__c.Company__c';
import Warehouse_Location_Field from '@salesforce/schema/Stock_Recieving__c.Location__c';
import Received_Date_Time_Field from '@salesforce/schema/Stock_Recieving__c.Received_Date_Time__c';
import Delivery_Note_Number_Field from '@salesforce/schema/Stock_Recieving__c.Delivery_Note_Number__c';
import Notes_Field from '@salesforce/schema/Stock_Recieving__c.Notes__c';
import Purchase_Order_Field from '@salesforce/schema/Stock_Recieving__c.Purchase_Order__c';







export default class SR_UI extends NavigationMixin(LightningElement) {
    selectedAccount;
    selectedContact;
    isClicked = false;
    @api recordId;
    @api objectApiName;
    myValue;
    filter;
    poplist;
    accountId;
    cnctname;
    cnctId;
    showcon=false;
    showproduct=false;
    transname;
    pursname;
    binname;
    showbin=false;
    showtrans=false;
    showpurs=false;
    translist = [];
    purchaseOrd;
    pursquan;
    ReceivedDateTime = '';
    DeliveryNoteNumber = '';
    Notes = '';
    company;
    location;
    @ track orderLines=[] ;

    handleChangeReceivedDateTime(event){
      this.ReceivedDateTime = event.detail.value;
  }

  handleChangeDeliveryNoteNumber(event){
    this.DeliveryNoteNumber = event.target.value;
}

handleChangeNotes(event){
  this.Notes = event.target.value;
}

handleChange(event) {
    this.value = event.detail.value;
    this.companyy = event.detail.value;
}
handleContact(event){
  this.cnctId = event.detail;
 console.log('cn>>'+this.cnctId);
}

handleCompany(event){   //event.detail.value is used for the lookup fields
  this.company = event.detail;             //event.target.value for input fields 
  }
  handleLocation(event){
    this.location =event.detail;
  }

  //  handlePOSelection(event){
  //   this.purchaseOrd = event.detail;
  //   getproductsdetails({pursOrd: this.purchaseOrd})
  //   .then(result => {
  
  //   this.poplist=result;
  //   })
  //   .catch(error => {
  //     console.log('error>>'+error);
  //   });

  //  }

  handlePOSelection(event){
    this.purchaseOrd = event.detail;
    getproductsdetails({pursOrd: this.purchaseOrd})
    .then(result => {
    
    let resultArray=result;
    this.poplist = resultArray.map((record, index) => {
      return {...record,index: index+1};
     
    });
    console.log('pop'+JSON.stringify(this.poplist)); 
})
.catch(error => {
  console.log('error>>'+error);
});
  }
  
   handleAccountSelection(event){
    console.log("the selected record id is11111"+event.detail);
    this.accountId = event.detail;
    console.log(this.accountId);
    getcontactdetails({ accid: this.accountId })
                .then(result => {
                    if(result.length == 1){
                     this.cnctname=result[0].Name;
                     this.cnctId=result[0].Id;
                     this.showcon=true;
                     console.log('cn>>'+this.cnctname);
                     console.log('cn>>'+this.cnctId);
                    }
                    else{
                     this.showcon= false;
                    }
                })
                .catch(error => {
                  console.log('error>>'+error);
                });
    gettransactiondetails({accid: this.accountId })
                .then(result => {
                  if(result.length == 1){
                     this.transname = result[0].Name;
                     this.showtrans = true;
                     console.log('tran>>'+this.transname);
                  }
                  else{
                     this.showtrans=false;
                  }
                })
                .catch(error =>{
                  console.log('error>>'+error);
                });
      getbinlocation({loc: this.location })
                .then(result => {
                  if(result.length == 1){
                     this.binname = result[0].Name;
                     this.showbin = true;
                     console.log('tran>>'+this.binname);
                  }
                  else{
                     this.showbin=false;
                  }
                })
                .catch(error =>{
                  console.log('error>>'+error);
                });
  

}
 
   setContact(event){
    this.template.querySelector('[def-con]').value = '0035g00000meHgiAAE';
   }

   closeQuickAction(event){
    var url = window.location.href;
    var value = url.substring(0,url.lastIndexOf('/')+1);
    window.history.back();
    return false;
   }

 handleClick(){
      if(this.accountId==undefined || this.accountId==null || this.accountId==''){

  const evt = new ShowToastEvent({
      title: 'Error',
      message: 'Select the Vendor before adding transactions.',
      variant: this.variant,
      
  });
  
  this.dispatchEvent(evt);
}
else {
  //let orderLines = [];
  this.createRow(this.orderLines);
 
}
}

createRow(orderLines){
   console.log('239'+orderLines);
   let solObject ={};
   if(orderLines.length > 0) {
       solObject.index = orderLines[orderLines.length - 1].index + 1;
   } else {
       solObject.index = 1;
   }
   // we need to add the fields which are need to be added in the sol line items 
   // and dont forget to add in the html part `binding the API name to the input or custom input(maybe ) so that the values get stored accurately
   solObject.Product__c = '';
   solObject.Ordered_Qty__c = 0;
   solObject.Remaining_Quantity__c = 0;
   solObject.Status__c='';
   solObject.Received_Quantity__c = 0;
   solObject.Bin_Location__c= '';
   solObject.Batch_No__c = 0;
   solObject.Expiry_Date__c='';
   
   orderLines.push(solObject);
   console.log('sfs'+JSON.stringify(orderLines));

}



handleInputChange(event) {
  let index = event.target.dataset.id;
  let fieldName = event.target.name;
  console.log('Field Name '+fieldName);
  let value = event.target.value;
  // console.log('index>>'+ index + 'fieldName>>' +fieldName + 'value>'+value);
  // console.log('len>>>>'+this.orderLines.length);
  for(let i = 0; i < this.poplist.length; i++) {
      // console.log('378>>>>'+this.orderLines[i].index);
      // console.log('379>>>>'+parseInt(index));
      if(this.poplist[i].index === parseInt(index)) {
          this.poplist[i][fieldName] = value;
          console.log('this.orderLines[i].fieldName>>>>'+ this.poplist[i][fieldName]);
      }
  }
  console.log('hhhhhhhhhhhhhhhhhhh'+ JSON.stringify(this.poplist));

}
handleBinSelection(event){
  console.log("the selected record id is11111"+event.detail);
  console.log("mmmmmmmmm"+event.target.dataset.id)
  this.bin = event.detail;
  console.log(this.bin);
  
  let index = event.target.dataset.id;
      let fieldName = event.target.name;
      for(let i = 0; i < this.poplist.length; i++) {
          if(this.poplist[i].index === parseInt(index)) {
              this.poplist[i][fieldName] = this.bin;
          }
      }
  
  console.log("318"+JSON.stringify(this.poplist));
    }
get statusoptions(){
  return [
      {
          label: 'Open' , value: 'Open'
      },
      {
          label: 'Verified' , value : 'Verified'
      }
  ];
}

removeindexrow(event){
  let toBeDeletedRowIndex = event.target.name;
    
            let orderLines = [];
            for(let i = 0; i < this.orderLines.length; i++) {
                let tempRecord = Object.assign({}, this.orderLines[i]); //cloning object
                if(tempRecord.index !== toBeDeletedRowIndex) {
                    orderLines.push(tempRecord);
                }
                }
                for(let i = 0; i < orderLines.length; i++) {
                    orderLines[i].index = i + 1;
                }
        
                this.orderLines = orderLines; 
      }
      /*
      handleInputChange(event) {
        let index = event.target.dataset.id;
        let fieldName = event.target.name;
        let value = event.target.value;
        // console.log('index>>'+ index + 'fieldName>>' +fieldName + 'value>'+value);
        // console.log('len>>>>'+this.orderLines.length);
        for(let i = 0; i < this.orderLines.length; i++) {
            // console.log('378>>>>'+this.orderLines[i].index);
            // console.log('379>>>>'+parseInt(index));
            if(this.orderLines[i].index === parseInt(index)) {
                this.orderLines[i][fieldName] = value;
                console.log('this.orderLines[i].fieldName>>>>'+ this.orderLines[i][fieldName]);
            }
        }
        console.log('hhhhhhhhhhhhhhhhhhh'+ JSON.stringify(this.orderLines));
    
    }*/

      saveB() {
       /* console.log('test@@');
        console.log('test@@'+this.poplist.length);
        if(this.poplist.length == 0 ){

          const evt = new ShowToastEvent({
              title: 'Error',
              message: 'Select the PO.',
              variant: this.variant,
              
          });
          
          this.dispatchEvent(evt);
          return;
        }*/
    
        const fields = {};
            
    
    
        fields[Vendor_Field.fieldApiName] = this.accountId;
        fields[Contact_Field.fieldApiName] = this.cnctId;
        fields[Company_Field.fieldApiName] = this.company;
        fields[Warehouse_Location_Field.fieldApiName] = this.location;
        fields[Received_Date_Time_Field.fieldApiName] = this.ReceivedDateTime;
        fields[Delivery_Note_Number_Field.fieldApiName]= this.DeliveryNoteNumber;
        fields[Notes_Field.fieldApiName]=this.Notes;
        fields[Purchase_Order_Field.fieldApiName]=this.purchaseOrd;
          
    
        console.log('fields?'+JSON.stringify(fields));
    
    
    
        const recordInput = { apiName: StockReceivingObject.objectApiName, fields };
        createRecord(recordInput)
            .then(account => {
                this.accountId = account.id;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Stock Receiving Created',
                        variant: 'success',
                    }),
                );
    
                
                this.createAccounts();//we are calling here bcoz on click of the save button even the sol line item must be saved along with the header acc
                
                
    
                // to navigate to the record page which was created newly 
                this[NavigationMixin.GenerateUrl]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: this.accountId,
                        actionName: 'view',
                    },
                }).then((url) => {
                    this.recordPageUrl = url;
                    window.location.assign(url);
    
                });
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
            });
            
        }
    
        createAccounts()
        {
            for(let i = 0; i < this.poplist.length; i++) {
                
                    this.poplist[i].Stock_Receiving__c = this.accountId;
                    this.poplist[i].Ordered_Qty__c = this.poplist[i].Quantity__c;
                    this.poplist[i].Remaining_Quantity__c = this.poplist[i].Remaining_Qty__c;
                    this.poplist[i].Net_Amount__c= this.poplist[i].Net_Amount__c;
                    this.poplist[i].Total_Amount__c = this.poplist[i].Total_Amount__c;
                    this.poplist[i].Unit_Price__c = this.poplist[i].Unit_Price__c;
            
                
    
            }
            console.log('order@@'+JSON.stringify(this.poplist));
                    createsol({ jsonOfListOfSol:JSON.stringify(this.poplist)})
                    .then(result => {
                        console.log('@@inserted'+result);
                    })
                    .catch(error => {
                        console.log('error>>'+error);
                    });


                    if(this.poplist==undefined || this.poplist==null || this.poplist==''){

                      const evt = new ShowToastEvent({
                          title: 'Error',
                          message: 'Add atleast one line item.',
                          variant: this.variant,
                          
                      });
                      
                      this.dispatchEvent(evt);
                    }
            
        } 
        
       
    
}
