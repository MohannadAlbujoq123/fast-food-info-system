using FastFoodProject.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IPermissionRepository
{
    Task AddPermissionAsync(Permission permission);
    Task<Permission> GetPermissionByIdAsync(int id);
    Task DeletePermissionAsync(int id);
    Task UpdatePermissionAsync(Permission permission);
    Task<IEnumerable<Permission>> GetAllPermissionsAsync();
}
