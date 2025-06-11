using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Flower_Shop.Models;
using System.Security.Claims;

namespace Smart_Flower_Shop.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/cart")]
    public class CartController : ControllerBase
    {
        private readonly ApplicationDbcontext _db;

        public CartController(ApplicationDbcontext db)
        {
            _db = db;
        }

        [HttpPost("AddProduct/{id}")]
        public IActionResult AddProductToCart(int id)
        {
            var product = _db.Products.Find(id);
            if (product == null)
                return NotFound(new { message = "Product not found" });

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized(new { message = "User Not Authorized" });

            // التحقق مما إذا كان للمستخدم سلة
            var cart = _db.Cart
                .Include(c => c.CartItems)
                .FirstOrDefault(c => c.UserId == userId);

            if (cart == null)
            {
                cart = new Cart
                {
                    UserId = userId,
                    CartItems = new List<CartItem>()
                };
                _db.Cart.Add(cart);
            }

            // التحقق مما إذا كان المنتج موجودًا بالفعل في السلة
            var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == id);

            if (cartItem != null)
            {
                cartItem.Quantity += 1;
                cartItem.Price = cartItem.Quantity * product.Price;
            }
            else
            {
                cart.CartItems.Add(new CartItem
                {
                    ProductId = id,
                    CartId = cart.Id,
                    Quantity = 1,
                    Price = product.Price
                });
            }

            _db.SaveChanges();
            return Ok(new
            {
                message = "Product added to cart",
                cartItems = cart.CartItems.Select(ci => new
                {
                    ci.ProductId,
                    ci.Quantity,
                    ci.Price
                }),
                totalPrice = cart.CartItems.Sum(ci => ci.Price)
            });
        }


        [HttpGet("GetCart")]
        public IActionResult GetCart()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized(new { message = "User Not Authorized" });

            var cart = _db.Cart
                .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                .FirstOrDefault(c => c.UserId == userId);

            if (cart == null || cart.CartItems == null || !cart.CartItems.Any())
                return NotFound(new { message = "Cart is empty" });

            var cartItems = cart.CartItems.Select(ci => new
            {
                ProductId = ci.ProductId,
                ProductName = ci.Product.Name,
                Quantity = ci.Quantity,
                Price = ci.Price
            }).ToList();

            return Ok(new
            {
                message = "Cart retrieved successfully",
                cartItems,
                totalPrice = cart.CartItems.Sum(ci => ci.Price)
            });
        }


        [HttpDelete("RemoveProduct/{id}")]
        public IActionResult RemoveProductFromCart(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return Unauthorized(new { message = "User Not Authorized" });

            var cart = _db.Cart
                .Include(c => c.CartItems)
                .FirstOrDefault(c => c.UserId == userId);

            if (cart == null || cart.CartItems.Count == 0)
                return NotFound(new { message = "Cart is empty" });

            var cartItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == id);
            if (cartItem == null)
                return NotFound(new { message = "Product not found in cart" });

            // تقليل الكمية بمقدار 1
            cartItem.Quantity -= 1;

            if (cartItem.Quantity <= 0)
            {
                // لو الكمية وصلت 0 → نحذف المنتج بالكامل
                cart.CartItems.Remove(cartItem);
            }
            else
            {
                // تحديث السعر بناءً على الكمية الجديدة
                var product = _db.Products.Find(id);
                cartItem.Price = cartItem.Quantity * product.Price;
            }

            _db.SaveChanges();
            return Ok(new
            {
                message = "Product removed from cart",
                cartItems = cart.CartItems.Select(ci => new
                {
                    ci.ProductId,
                    ci.Quantity,
                    ci.Price
                }),
                totalPrice = cart.CartItems.Sum(ci => ci.Price)
            });
        }








    }
}

