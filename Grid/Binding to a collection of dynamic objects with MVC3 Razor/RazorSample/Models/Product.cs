namespace RazorSample.Models
{
    using System.ComponentModel.DataAnnotations;

    [MetadataType(typeof(ProductMetadata))]
    public partial class Product
    {
    }

    class ProductMetadata
    {
        [Required]
        public int ProductID { get; set; }

        [Required]
        public string ProductName { get; set; }
    }
}