using FastFoodProject.Data;
using FastFoodProject.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FastFoodProject.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<RoleRepository> _logger;

        public RoleRepository(ApplicationDbContext context, ILogger<RoleRepository> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<RoleDto>> GetRolesAsync()
        {
            return await Task.Run(() =>
                _context.Roles
                    .Select(r => new RoleDto
                    {
                        Id = r.Id,
                        RoleName = r.RoleName,
                        RolePermissions = r.RolePermissions.Select(rp => new PermissionDto
                        {
                            Id = rp.Permission.Id,
                            PermissionName = rp.Permission.PermissionName
                        }).ToList()
                    }).AsEnumerable()
            );
        }

        public async Task<RoleDto> GetRoleByIdAsync(int roleId)
        {
            return await Task.Run(() =>
                _context.Roles
                    .Where(r => r.Id == roleId)
                    .Select(r => new RoleDto
                    {
                        Id = r.Id,
                        RoleName = r.RoleName,
                        RolePermissions = r.RolePermissions.Select(rp => new PermissionDto
                        {
                            Id = rp.Permission.Id,
                            PermissionName = rp.Permission.PermissionName
                        }).ToList()
                    }).FirstOrDefault()
            );
        }

        public async Task<Role> GetRoleEntityByIdAsync(int id)
        {
            return await _context.Roles
                .Include(r => r.RolePermissions)
                .ThenInclude(rp => rp.Permission)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task AddRoleAsync(Role role)
        {
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateRoleAsync(Role role)
        {
            _context.Roles.Update(role);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRoleAsync(int roleId)
        {
            var role = await Task.Run(() => _context.Roles.FirstOrDefault(r => r.Id == roleId));
            if (role != null)
            {
                _context.Roles.Remove(role);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> AddPermissionToRoleAsync(int roleId, int permissionId)
        {
            var role = await Task.Run(() => _context.Roles.Include(r => r.RolePermissions).FirstOrDefault(r => r.Id == roleId));
            var permission = await Task.Run(() => _context.Permissions.FirstOrDefault(p => p.Id == permissionId));

            if (role == null)
            {
                _logger.LogWarning($"Role with ID {roleId} not found.");
                return false;
            }

            if (permission == null)
            {
                _logger.LogWarning($"Permission with ID {permissionId} not found.");
                return false;
            }

            role.RolePermissions.Add(new RolePermission { RoleId = roleId, PermissionId = permissionId });
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RemovePermissionFromRoleAsync(int roleId, int permissionId)
        {
            var rolePermission = await Task.Run(() => _context.RolePermissions.FirstOrDefault(rp => rp.RoleId == roleId && rp.PermissionId == permissionId));

            if (rolePermission == null)
            {
                _logger.LogWarning($"RolePermission with RoleId {roleId} and PermissionId {permissionId} not found.");
                return false;
            }

            _context.RolePermissions.Remove(rolePermission);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
