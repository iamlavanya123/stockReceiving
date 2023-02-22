public with sharing class stockReceiving {

@AuraEnabled
public static List<Contact> getcontactdetails(String accid){
    
List<Contact> cntactList=[Select id,Name from Contact where AccountId =:accid];
System.debug('cntactList>>'+cntactList);
 return cntactList;
}
 
@AuraEnabled
public static List<Purchase_Order_Product__c> getproductsdetails(String pursOrd){
    
List<Purchase_Order_Product__c> prodList=[Select id,Name, Purchase_Order__c, Product__r.Name,Quantity__c,Remaining_Qty__c,	Net_Amount__c,	Tax_Amount__c,Total_Amount__c,Unit_Price__c from Purchase_Order_Product__c where Purchase_Order__c =:pursOrd];
System.debug('cntactList>>'+prodList);
 return prodList;
}

@AuraEnabled
public static List<Contact> getPOdetails(String accid){
    
List<Contact> cntactList=[Select id,Name from Contact where AccountId =:accid];
System.debug('cntactList>>'+cntactList);
 return cntactList;
}
@AuraEnabled
public static List<Purchase_Order__c> gettransactiondetails(String accid){
List<Purchase_Order__c> transList = [Select id,Name from Purchase_Order__c where AccId__c =:accid];
System.debug('transList>>'+transList);
return transList;
    }

    @AuraEnabled
    public static List<Bin_Location__c> getbinlocation(String loc){
    List<Bin_Location__c> binList = [Select Id,Name,Location__c from Bin_Location__c where Location__c =:loc];
    system.debug('binlist'+binList);
    return binList;
        }

        @AuraEnabled
        public static List<Location__c> getlocation(String loca){
        List<Location__c> locList = [Select Id,Name from Location__c where Company__c =:loca];
        system.debug('loclist'+locList);
        return locList;
            }
    @AuraEnabled(cacheable=true)
    public static List<Purchase_Order__c> trans(String transid){
        List<Purchase_Order__c> listpro = [select Name from Purchase_Order__c where Account__c=:transid];
        System.debug('listpro&&&'+listpro);
        return listpro;
    }
    public static void updaterecorrd() {
        
      Account[] acc = [Select Id, Description from Account];
     		 for (Account acct : acc) {
          acct.Description = 'hii';
             }
      update acc;
    }
    @AuraEnabled
    public static void createsol(String jsonOfListOfSol, String SRPId, String binname,Integer recquan,String status,String batch,Date exdate) {
        system.debug('jsonOfListOfSol>>>>'+jsonOfListOfSol);
        List<Purchase_Order_Product__c> orderLines = (List<Purchase_Order_Product__c>) JSON.deserialize(jsonOfListOfSol, List<Purchase_Order_Product__c>.class);
        
        system.debug('orderLines>>>>'+orderLines);
        system.debug('SRPId>>>>'+SRPId);
        system.debug('SRPId>>>>'+binname);
        List<Stock_Receiving_Product__c> SRPList=new List<Stock_Receiving_Product__c>();
        if(!orderLines.isEmpty()){
            for(Purchase_Order_Product__c pop : orderLines)
        {
            Stock_Receiving_Product__c fef=new  Stock_Receiving_Product__c();
            // pop.Name = pop.Id;
            // pop.Id = null;
            
            fef.Product__c = pop.Product__c;
            fef.Net_Amount__c = pop.Net_Amount__c;
            fef.Purchase_Order__c = pop.Purchase_Order__c;
            fef.Purchase_Order_Product__c = pop.id;
            fef.Remaining_Quantity__c = pop.Remaining_Qty__c;
            fef.Ordered_Qty__c = pop.Quantity__c;
            fef.Received_Quantity__c = recquan;
            fef.Status__c = status;
            fef.Bin_Location__c = binname;
            fef.Unit_Price__c = pop.Unit_Price__c;
            fef.Stock_Receiving__c = SRPId;
            fef.Batch_No__c = batch;
            fef.Expiry_Date__c = exdate;
            
            SRPList.add(fef);
        }
        }
        
      if(!SRPList.isEmpty()){
        insert SRPList;
      }
        //insert orderLines;
        
    }
    
}
