//It contains only the properties relevant in this particular 
//grid configuration. By using it we will serialize only the important 
//data thus improving the total size of the Ajax request. Here is 
//the updated configuration:


using System;
namespace IQWorksTelerikCodeLib.Models
{
      
    public class iqCompanyVM
    {  
        
        public int cCompanyNo
        {
            get;
            set;
        }

        public string cCompanyName
        {
            get;
            set;
        }

        public string cAddress1
            {
            get;
            set;
            }

        public string cAddress2
            {
            get;
            set;
            }

        public string cCity
            {
            get;
            set;
            }

        public string cProvince
            {
            get;
            set;
            }

        public string cPostalCode
            {
            get;
            set;
            }

        public string cPhone
            {
            get;
            set;
            }

     
        public string cContact
        {
            get;
            set;
        }

        public string cEmail
        {
            get;
            set;
        }

        public string cGroupCode
            {
            get;
            set;
            }

        public int cCreatedBy
            {
            get;
            set;
            }

        public int cUpdatedBy
            {
            get;
            set;
            }


        public DateTime  cDateCreated
            {
            get;
            set;
            }

        public DateTime  cDateUpdated
            {
            get;
            set;
            }
     
        public DateTime cBLANK // Blank field
            {
            get;
            set;
            }
    }
}