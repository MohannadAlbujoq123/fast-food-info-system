using FastFoodProject.Models;
using FastFoodProject.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FastFoodProject.Controllers
{
    [Route("api/roles")]
    [ApiController]
    [Authorize(Policy = "NotDisabled")]
    [Authorize(Roles = "Admin")]
    public class RoleController : ControllerBase
    {
        private readonly IRoleRepository _roleRepository;
        private readonly IPermissionRepository _permissionRepository;
        private readonly IUserRepository _userRepository;

        public RoleController(IRoleRepository roleRepository, IPermissionRepository permissionRepository, IUserRepository userRepository)
        {
            _roleRepository = roleRepository;
            _permissionRepository = permissionRepository;
            _userRepository = userRepository;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<RoleDto>>> GetRoles()
        {
            var roles = await _roleRepository.GetRolesAsync();
            return Ok(roles);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<RoleDto>> GetRole(int id)
        {
            var role = await _roleRepository.GetRoleByIdAsync(id);
            if (role == null)
            {
                return NotFound();
            }
            return Ok(role);
        }

        [HttpPost]
        public async Task<ActionResult<RoleDto>> CreateRole(CreateRoleRequest request)
        {
            var role = new Role
            {
                RoleName = request.RoleName,
                RolePermissions = new List<RolePermission>()
            };

            foreach (var permissionId in request.RolePermissions)
            {
                var permission = await _permissionRepository.GetPermissionByIdAsync(permissionId);
                if (permission != null)
                {
                    role.RolePermissions.Add(new RolePermission { PermissionId = permissionId });
                }
            }

            await _roleRepository.AddRoleAsync(role);

            var roleDto = new RoleDto
            {
                Id = role.Id,
                RoleName = role.RoleName,
                RolePermissions = role.RolePermissions.Select(rp => new PermissionDto
                {
                    Id = rp.Permission.Id,
                    PermissionName = rp.Permission.PermissionName
                }).ToList()
            };

            return CreatedAtAction(nameof(GetRole), new { id = role.Id }, roleDto);
        }

        [HttpPut("{roleId}")]
        public async Task<IActionResult> UpdateRole(int roleId, UpdateRoleRequest request)
        {
            var role = await _roleRepository.GetRoleEntityByIdAsync(roleId);
            if (role == null)
            {
                return NotFound();
            }

            if (role.RoleName == "Admin" && request.RoleName != "Admin")
            {
                return BadRequest("Cannot change the name of the Admin role.");
            }

            role.RoleName = request.RoleName;
            role.RolePermissions.Clear();

            foreach (var permissionId in request.RolePermissions)
            {
                var permission = await _permissionRepository.GetPermissionByIdAsync(permissionId);
                if (permission != null)
                {
                    role.RolePermissions.Add(new RolePermission { PermissionId = permissionId });
                }
            }

            await _roleRepository.UpdateRoleAsync(role);
            return NoContent();
        }

        [HttpDelete("{roleId}")]
        public async Task<IActionResult> DeleteRole(int roleId)
        {
            var role = await _roleRepository.GetRoleEntityByIdAsync(roleId);
            if (role == null)
            {
                return NotFound();
            }

            if (role.RoleName == "Admin")
            {
                return BadRequest("Cannot delete the Admin role.");
            }

            var usersWithRole = await _userRepository.GetUsersByRoleIdAsync(roleId);
            if (usersWithRole.Any())
            {
                return BadRequest("Role cannot be deleted because it has associated users.");
            }

            await _roleRepository.DeleteRoleAsync(roleId);
            return NoContent();
        }

        [HttpPost("{roleId}/permissions/{permissionId}")]
        public async Task<IActionResult> AddPermissionToRole(int roleId, int permissionId)
        {
            var result = await _roleRepository.AddPermissionToRoleAsync(roleId, permissionId);
            if (!result)
            {
                return BadRequest("Failed to add permission to role.");
            }
            return NoContent();
        }

        [HttpDelete("{roleId}/permissions/{permissionId}")]
        public async Task<IActionResult> RemovePermissionFromRole(int roleId, int permissionId)
        {
            var result = await _roleRepository.RemovePermissionFromRoleAsync(roleId, permissionId);
            if (!result)
            {
                return BadRequest("Failed to remove permission from role.");
            }
            return NoContent();
        }
    }
}
