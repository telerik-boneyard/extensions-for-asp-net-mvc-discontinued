using System;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace CustomJsonSerializer.Common
{
    public class CustomJsonResult : ActionResult
    {
        const string JsonRequest_GetNotAllowed = "This request has been blocked because sensitive information could be disclosed to third party web sites when this is used in a GET request. To allow GET requests, set JsonRequestBehavior to AllowGet.";

        public string ContentType { get; set; }

        public System.Text.Encoding ContentEncoding { get; set; }

        public object Data { get; set; }

        public JsonRequestBehavior JsonRequestBehavior { get; set; }

        public int MaxJsonLength { get; set; }

        public CustomJsonResult()
        {
            JsonRequestBehavior = JsonRequestBehavior.DenyGet;
            MaxJsonLength = int.MaxValue; // by default limit is set to int.maxValue
        }
        
        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException("context");
            }

            if ((JsonRequestBehavior == JsonRequestBehavior.DenyGet) && string.Equals(context.HttpContext.Request.HttpMethod, "GET", StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(JsonRequest_GetNotAllowed);
            }

            var response = context.HttpContext.Response;
            if (!string.IsNullOrEmpty(ContentType))
            {
                response.ContentType = ContentType;
            }
            else
            {
                response.ContentType = "application/json";
            }
            if (ContentEncoding != null)
            {
                response.ContentEncoding = ContentEncoding;
            }
            if (Data != null)
            {
                //set the serializer limit
                var serializer = new JavaScriptSerializer { MaxJsonLength = MaxJsonLength };
                response.Write(serializer.Serialize(Data));
            }
        }
        
    }
}