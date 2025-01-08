using FastFoodProject.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FastFoodProject.Repositories
{
    public interface IOrderRepository
    {
        Task AddOrderAsync(Order order);
        Task<IEnumerable<Order>> GetAllOrdersAsync();
        Task<PaginatedOrdersDto> GetUserOrdersAsync(int userId, int pageNumber, int pageSize);
    }

}
