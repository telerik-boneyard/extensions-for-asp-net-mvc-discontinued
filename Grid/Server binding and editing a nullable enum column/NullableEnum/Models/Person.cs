using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.ComponentModel.DataAnnotations;

namespace NullableEnum.Models
{
    public class Person
    {
        [HiddenInput(DisplayValue = false)]
        public int PersonID { get; set; }
        public string Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        [UIHint("Role")]
        public Role? UserRole { get; set; }
    }

    public enum Role
    {
        Admin,
        User,
        Guest
    }
}