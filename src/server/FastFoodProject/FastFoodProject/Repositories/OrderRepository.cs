using FastFoodProject.Data;
using FastFoodProject.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FastFoodProject.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _context;

        public OrderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddOrderAsync(Order order)
        {
            order.OrderDate = DateTime.UtcNow;
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await _context.Orders
                .Include(o => o.OrderProducts)
                .ThenInclude(op => op.Product)
                .OrderBy(o => o.OrderDate)
                .ThenBy(o => o.Id)
                .ToListAsync();
        }

        public async Task<PaginatedOrdersDto> GetUserOrdersAsync(int userId, int pageNumber, int pageSize)
        {
            var totalOrders = await _context.Orders.CountAsync(o => o.UserId == userId);
            var totalPages = (int)Math.Ceiling(totalOrders / (double)pageSize);

            var orders = await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.OrderProducts)
                .ThenInclude(op => op.Product)
                .OrderBy(o => o.OrderDate)
                .ThenBy(o => o.Id)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(o => new OrderDto
                {
                    OrderId = o.Id,
                    OrderDate = o.OrderDate,
                    TotalPrice = o.OrderProducts.Sum(op => op.Product != null ? op.Product.Price * op.Quantity : 0),
                    OrderProducts = o.OrderProducts.Select(op => new OrderProductDto
                    {
                        ProductName = op.Product != null ? op.Product.ProductName : "Product was deleted",
                        Price = op.Product != null ? op.Product.Price : 0,
                        Quantity = op.Quantity
                    }).ToList()
                })
                .ToListAsync();

            return new PaginatedOrdersDto
            {
                TotalPages = totalPages,
                Orders = orders
            };
        }
    }
}

