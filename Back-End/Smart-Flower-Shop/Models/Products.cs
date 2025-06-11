
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smart_Flower_Shop.Models
{
    public class Products

    {
        [Key]
        public int ProductId { get; set; }
        public string Name { get; set; } 

        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public string Type { get; set; }
        public string? ImagePath { get; set; }

        [Column(TypeName = "nvarchar(max)")]
        public string Description { get; set; }

        [ForeignKey("Category")]
        public int  CatgyId { get; set; }

        public Category Category { get; set; }

        public List<OrderItem> OrderProducts { get; set; } = new List<OrderItem>();

    }
}
