using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Smart_Flower_Shop.Models
{
    public class ApplicationDbcontext : IdentityDbContext<ApplicationUser>
    {

          public ApplicationDbcontext(DbContextOptions<ApplicationDbcontext> options) : base(options)
            {

            }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Products> Products { get; set; }
        public DbSet<Orders> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }

        public DbSet<Cart> Cart { get; set; }
        public DbSet<CartItem> CartItems { get; set; }

    }
    
}
