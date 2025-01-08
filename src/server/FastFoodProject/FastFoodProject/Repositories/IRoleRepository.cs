using FastFoodProject.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FastFoodProject.Repositories
{
    public interface IRoleRepository
    {
        Task<IEnumerable<RoleDto>> GetRolesAsync();
        Task<RoleDto> GetRoleByIdAsync(int roleId);
        Task<Role> GetRoleEntityByIdAsync(int roleId);
        Task AddRoleAsync(Role role);
        Task UpdateRoleAsync(Role role);
        Task DeleteRoleAsync(int roleId);
        Task<bool> AddPermissionToRoleAsync(int roleId, int permissionId);
        Task<bool> RemovePermissionFromRoleAsync(int roleId, int permissionId);
    }
}
