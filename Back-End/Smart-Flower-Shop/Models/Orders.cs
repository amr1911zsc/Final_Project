using Smart_Flower_Shop.DTO;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smart_Flower_Shop.Models
{
    public class Orders
    {
        public int OrdersId { get; set; }
        public decimal TotalPrice { get; set; }
        public string DeliveryAddress { get; set; }
        public DateTime DateOfOrder { get; set; } = DateTime.Now;
        public string OrderStatus { get; set; }
     
        public DateTime ? DeliveryDate { get; set; } = DateTime.Today;

        [ForeignKey("User")]
        public string UserId { get; set; }

        // خاصية الـ Navigation Property للـ User
        public ApplicationUser User { get; set; }

        public List<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    }
}
