using FastFoodProject.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IUserRepository
{
    Task<User> GetUserByIdAsync(int userId);
    Task<IEnumerable<User>> GetAllUsersAsync();
    Task<IEnumerable<User>> GetUsersByRoleIdAsync(int roleId);
    Task AddUserAsync(User user);
    Task UpdateUserAsync(User user);
    Task DeleteUserAsync(int userId);
    Task DisableUserAsync(int userId);
    Task<bool> HasMultipleActiveAdminsAsync();
}


