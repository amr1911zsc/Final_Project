
using Microsoft.AspNetCore.Identity;


namespace Smart_Flower_Shop.Models
{
    public class ApplicationUser : IdentityUser
    {

        public string Address { get; set; }
        public int NumberOfOrders { get; set; }



        public ICollection<Orders> orders { get; set; }
    }
}
