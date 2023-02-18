public with sharing class stockReceiving {

@AuraEnabled
public static List<Contact> getcontactdetails(String accid){
    
List<Contact> cntactList=[Select id,Name from Contact where AccountId =:accid];
System.debug('cntactList>>'+cntactList);
 return cntactList;
}
 
@AuraEnabled
public static List<Purchase_Order_Product__c> getproductsdetails(String pursOrd){
    
List<Purchase_Order_Product__c> prodList=[Select Product__r.Name,Quantity__c,Remaining_Qty__c,	Net_Amount__c,	Tax_Amount__c,Total_Amount__c,Unit_Price__c from Purchase_Order_Product__c where Purchase_Order__c =:pursOrd];
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
    List<Bin_Location__c> binList = [Select id,Name from Bin_Location__c where Location__c =:loc];
    return binList;
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
    public static void createsol(String jsonOfListOfSol) {
        List<Stock_Receiving_Product__c> orderLines = (List<Stock_Receiving_Product__c>) JSON.deserialize(jsonOfListOfSol, List<Stock_Receiving_Product__c>.class);
        for(Stock_Receiving_Product__c SRP : orderLines)
        {
            SRP.Purchase_Order_Product__c = SRP.Id;
            SRP.Id = null;
        }
        
        
        
        insert orderLines;
    }
    
}
