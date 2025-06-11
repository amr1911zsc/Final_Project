using System.ComponentModel.DataAnnotations.Schema;

namespace Smart_Flower_Shop.Models
{
    public class Cart
    {

        public int Id { get; set; }  // Primary Key

        [ForeignKey("User")]
        public string UserId { get; set; }  // Foreign Key لربط الكارت بالمستخدم

        // Navigation Properties
        public ApplicationUser User { get; set; }
        public ICollection<CartItem> CartItems { get; set; }
    }
}
