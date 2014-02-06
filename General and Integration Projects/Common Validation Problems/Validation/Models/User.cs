using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
namespace Validation.Models
{
    public class User
    {
        [ScaffoldColumn(false)]
        public Guid UserID { get; set; }

        [Required]
        [StringLength(50)]
        public string UserName { get; set; }

        [Required]
        [RegularExpression(@"\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*",ErrorMessage="Invalid Email")]
        public string Email { get; set; }
    }
}