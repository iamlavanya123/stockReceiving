import { LightningElement ,api,wire,track} from 'lwc';
export default class SR_UI extends LightningElement {
    selectedAccount;
    selectedContact;
    isClicked = false;
    @api recordId;
    @api objectApiName;
    myValue;
    
 handleTransactions(event){
    this.isClicked = !this.isClicked;
   }
   handleAccountSelection(event){
    console.log("the selected record id is11111"+event.detail);
}
   
   setContact(event){
    this.template.querySelector('[def-con]').value = '0035g00000meHgiAAE';
   }
}