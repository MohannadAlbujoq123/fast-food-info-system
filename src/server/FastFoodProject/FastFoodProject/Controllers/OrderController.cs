using FastFoodProject.Models;
using FastFoodProject.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FastFoodProject.Controllers
{
    [Route("api/orders")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly IUserRepository _userRepository;

        public OrderController(IOrderRepository orderRepository, IProductRepository productRepository, IUserRepository userRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _userRepository = userRepository;
        }

        [HttpPost("buy")]
        [Authorize(Policy = "NotDisabled")]
        [Authorize(Roles = "Buyer")]
        public async Task<IActionResult> Buy([FromBody] List<CartItem> cartItems)
        {
            try
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
                if (userIdClaim == null)
                {
                    return Unauthorized("UserId claim not found.");
                }

                var userId = int.Parse(userIdClaim.Value);
                var user = await _userRepository.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return Unauthorized("User not found.");
                }

                if (cartItems == null || !cartItems.Any())
                {
                    return BadRequest("Cart is empty.");
                }

                var order = new Order
                {
                    UserId = userId,
                    OrderProducts = new List<OrderProduct>()
                };

                foreach (var item in cartItems.Where(i => i.Quantity > 0))
                {
                    var product = await _productRepository.GetProductByIdAsync(item.ProductId);
                    if (product == null)
                    {
                        continue;
                    }

                    // Increment the Purchased property
                    product.Purchased += item.Quantity;

                    order.OrderProducts.Add(new OrderProduct
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity
                    });

                    // Update the product in the repository
                    await _productRepository.UpdateProductAsync(product);
                }

                if (!order.OrderProducts.Any())
                {
                    return BadRequest("No valid products in cart.");
                }

                await _orderRepository.AddOrderAsync(order);

                // Clear the cart cookie
                Response.Cookies.Append("cart", "", new CookieOptions
                {
                    Expires = DateTimeOffset.UtcNow.AddDays(-1),
                    Path = "/"
                });

                return Ok(new { message = "Order placed successfully." });
            }
            catch (Exception ex)
            {
                // Log the exception (you can use a logging framework here)
                Console.WriteLine(ex);
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }

        [HttpGet]
        [Authorize(Policy = "NotDisabled")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
        {
            var orders = await _orderRepository.GetAllOrdersAsync();
            return Ok(orders);
        }

        [HttpGet("user/{userId}")]
        [Authorize(Policy = "NotDisabled")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PaginatedOrdersDto>> GetUserOrders(int userId, int pageNumber = 1)
        {
            if (pageNumber < 1)
            {
                pageNumber = 1;
            }

            var paginatedOrders = await _orderRepository.GetUserOrdersAsync(userId, pageNumber, 2);
            return Ok(paginatedOrders);
        }
    }

    public class CartItem
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}