using System.ComponentModel.DataAnnotations;

namespace UploadGridIntegration_MVC2.Models
{
    public class Employee
    {
        public string ID { get; set; }

        public string Name { get; set; }

        [UIHint("Attachment")]
        public string Picture { get; set; }
    }
}