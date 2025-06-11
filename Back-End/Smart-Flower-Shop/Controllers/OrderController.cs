using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Flower_Shop.DTO;
using Smart_Flower_Shop.Models;
using System.Security.Claims;

namespace Smart_Flower_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly ApplicationDbcontext _context;


        public OrderController(ApplicationDbcontext context)
        {
            _context = context;
        }

        [HttpPost("AddOrder")]
        public async Task<IActionResult> Checkout([FromBody] OrderDto orderDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            try
            {
                
                var cart = await _context.Cart
                    .Include(c => c.CartItems)
                    .ThenInclude(ci => ci.Product)
                    .FirstOrDefaultAsync(c => c.UserId == userId);

                if (cart == null || !cart.CartItems.Any())
                {
                    return BadRequest("Cart is empty");
                }

            

                var order = new Orders
                {
                    DateOfOrder = DateTime.UtcNow,
                    UserId = userId,
                    OrderStatus = "Pending",
                    DeliveryAddress = orderDto.DeliveryLocation,
                    DeliveryDate = null,
                    TotalPrice = cart.CartItems.Sum(i => i.Quantity * i.Product.Price),
                };

                using (var transaction = await _context.Database.BeginTransactionAsync())
                {
                    try
                    {
                     
                        _context.Orders.Add(order);
                        await _context.SaveChangesAsync(); 

                       
                        var orderItems = cart.CartItems.Select(ci => new OrderItem
                        {
                            OrderId = order.OrdersId,  
                            ProductId = ci.ProductId,
                            Quantity = ci.Quantity,
                            UnitPrice = ci.Product.Price
                        }).ToList();

                     
                        _context.OrderItems.AddRange(orderItems);

                       
                        foreach (var item in cart.CartItems)
                        {
                            var product = await _context.Products.FindAsync(item.ProductId);
                            if (product == null)
                            {
                                return NotFound($"Product with ID {item.ProductId} not found");
                            }

                            
                            if (product.Quantity < item.Quantity)
                            {
                                return BadRequest($"Not enough stock for product {product.Name}");
                            }

                           
                            product.Quantity -= item.Quantity;
                        }

                        
                        var user = await _context.Users.FindAsync(userId);
                        if (user != null)
                        {
                            user.NumberOfOrders += 1;
                            _context.Users.Update(user);
                        }

                       
                        _context.CartItems.RemoveRange(cart.CartItems);
                        _context.Cart.Remove(cart);

                        await _context.SaveChangesAsync();
                        await transaction.CommitAsync();

                        return Ok(new { Message = "Order placed successfully", OrderId = order.OrdersId });
                    }
                    catch (Exception ex)
                    {
                        await transaction.RollbackAsync();
                        return StatusCode(500, $"Error while saving: {ex.InnerException?.Message ?? ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }


        [HttpGet("GetAllOrders")]
        public async Task<IActionResult> GetOrders()
        {
            var result = await _context.Orders
                .Select(o => new
                {
                    o.OrdersId,
                    o.DateOfOrder,
                    o.TotalPrice,
                    o.OrderStatus,
                    o.DeliveryAddress,
                    o.DeliveryDate,
                    o.UserId,
                })
                .ToListAsync();

            return Ok(result);
        }



        [HttpGet("GetOrdersCount")]
        public async Task<IActionResult> GetOrdersCount()
        {
            var count = await _context.Orders.CountAsync();
            return Ok(new { OrdersCount = count });

        }

        [HttpGet("GetPendingOrdersCount")]
        public async Task<IActionResult> GetPendingOrdersCount()
        {
            var pendingCount = await _context.Orders.CountAsync(o => o.OrderStatus == "Pending");
            return Ok(new { PendingOrders = pendingCount });
        }

        [HttpGet("GetDeliveredOrdersCount")]
        public async Task<IActionResult> GetDeliveredOrdersCount()
        {
            var deliveredCount = await _context.Orders.CountAsync(o => o.OrderStatus == "Delivered");
            return Ok(new { DeliveredOrders = deliveredCount });
        }


        [HttpGet("GetOrderById/{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            var dto = new OrderDetailsDTO
            {
                OrdersId = order.OrdersId,
                TotalPrice = order.TotalPrice,
                DeliveryAddress = order.DeliveryAddress,
                DateOfOrder = order.DateOfOrder,
                OrderStatus = order.OrderStatus,
                DeliveryDate = order.DeliveryDate,
                UserId = order.UserId
            };

            return Ok(dto);
        }




       [HttpPut("CancelOrder/{id}")]
        public async Task<IActionResult> CancelOrder(int id, [FromBody] CancelOrderDto cancelOrderDto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null) return NotFound();

            order.OrderStatus = cancelOrderDto.OrderStatus;
            await _context.SaveChangesAsync();
            return Ok(new { message = "Order canceled successfully." });
        }






        [HttpPut("UpdateOrderStatus/{OrderId}")]
        public async Task<IActionResult> UpdateOrderStatus(int OrderId, [FromBody] UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(OrderId);
            if (order == null)
            {
                return NotFound();  // الطلب مش موجود
            }

            if (string.IsNullOrEmpty(dto.OrderStatus))
            {
                return BadRequest("Order status is required.");
            }

            order.OrderStatus = dto.OrderStatus;
            order.DeliveryDate = dto.DeliveryDate;

            try
            {
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Order updated successfully",
                   
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error updating order: {ex.Message}");
            }
        }
      


    }
}


       
 