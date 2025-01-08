using FastFoodProject.Data;
using FastFoodProject.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class PermissionRepository : IPermissionRepository
{
    private readonly ApplicationDbContext _context;

    public PermissionRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task AddPermissionAsync(Permission permission)
    {
        _context.Permissions.Add(permission);
        await _context.SaveChangesAsync();
    }

    public async Task<Permission> GetPermissionByIdAsync(int id)
    {
        return await _context.Permissions.FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task DeletePermissionAsync(int id)
    {
        var permission = await _context.Permissions.FirstOrDefaultAsync(p => p.Id == id);
        if (permission != null)
        {
            var isAssignedToRole = await _context.RolePermissions.AnyAsync(rp => rp.PermissionId == id);
            if (isAssignedToRole)
            {
                throw new InvalidOperationException("Permission cannot be deleted because it is assigned to a role.");
            }

            _context.Permissions.Remove(permission);
            await _context.SaveChangesAsync();
        }
    }

    public async Task UpdatePermissionAsync(Permission permission)
    {
        _context.Permissions.Update(permission);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<Permission>> GetAllPermissionsAsync()
    {
        return await _context.Permissions.ToListAsync();
    }
}

