using Telerik.Web.Mvc.UI;

namespace CustomJsonSerializer.Common
{
    public class MyCustomGridActionResultFactory : IGridActionResultFactory
    {
        public System.Web.Mvc.ActionResult Create(object model)
        {
            //return a custom JSON result which have json serializer set to int.MaxValue
            return new CustomJsonResult
            {
                Data = model
            };
        }
        
    }
}