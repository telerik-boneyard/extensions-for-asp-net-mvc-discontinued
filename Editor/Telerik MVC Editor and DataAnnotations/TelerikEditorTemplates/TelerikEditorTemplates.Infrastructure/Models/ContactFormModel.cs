using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using TelerikEditorTemplates.Core.Interfaces;

namespace TelerikEditorTemplates.Infrastructure.Models
{
    public class ContactFormModel : IContactModel
    {
        [Display(Name="Name")]
        [Required]
        public string Name { get; set; }
        [Display(Name = "Email address")]
        [Required]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }
        [Display(Name = "Subject of message")]
        public string Subject { get; set; }
        [Display(Name = "Enter your message below")]
        [Required(ErrorMessage="Make sure you have entered a message below.")]
        [DataType(DataType.Html)]
        [AllowHtml]
        public string Message { get; set; }
    }
}
