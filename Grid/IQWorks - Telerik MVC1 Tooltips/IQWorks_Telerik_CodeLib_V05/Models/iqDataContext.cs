/// <pgmdescription>
/// 
/// <pgmname>
/// iqDataContext.cs
/// </pgmname>
/// 
/// <datecreated>
/// 03/17/2010
/// </datecreated>
/// 
/// <summary>
/// Data context for EF data.
/// </summary>
/// 
/// <mods>
/// </mods>
/// 
/// </pgmdescription>
 
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IQWorksTelerikCodeLib.Models 
{

    public class iqDataContext
    {
        /// <summary>
        /// Get iqData entity
        /// </summary>
        /// <returns></returns>
      public static IEnumerable<iqCompany> GetiqCompanies()
        {
        iqDataEntities entities = new iqDataEntities();
        return entities.iqCompany;

        } 


    }
}
