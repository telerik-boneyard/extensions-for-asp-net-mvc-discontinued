namespace DropDownInGrid.Models
{
    using System.ComponentModel.DataAnnotations;

    public class ProductViewModel
    {
        [Required]
        public int ProductID { get; set; }

        [Required]
        public string ProductName { get; set; }

        [Required]
        [ScaffoldColumn(false)]
        public int? CategoryID { get; set; }

        public string CategoryName { get; set; }
    }
}