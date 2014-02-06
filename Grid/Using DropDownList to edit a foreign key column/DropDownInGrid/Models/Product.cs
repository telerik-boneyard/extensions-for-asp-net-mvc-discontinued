using System.ComponentModel.DataAnnotations;

namespace DropDownInGrid.Models
{
    // Specify metadata type in order to apply the various metadata attributes - UIHint, Required
    [MetadataType(typeof(ProductMetadata))]
    public partial class Product
    {
    }

    public class ProductMetadata
    {
        // Specify the editor template for the Category property - it is in ~/Views/Home/EditorTemplates/Category.ascx
        [UIHint("Category")]
        public Category Category
        {
            get;
            set;
        }

        // The ProductName is required property
        [Required]
        public string ProductName
        {
            get;
            set;
        }
    }
}