using FastFoodProject.Models;
using FastFoodProject.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FastFoodProject.Controllers
{
    [Route("api/permissions")]
    [ApiController]
    [Authorize(Policy = "NotDisabled")]
    [Authorize(Roles = "Admin")]
    public class PermissionsController : ControllerBase
    {
        private readonly IPermissionRepository _permissionRepository;

        public PermissionsController(IPermissionRepository permissionRepository)
        {
            _permissionRepository = permissionRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreatePermission([FromBody] CreatePermissionRequest request)
        {
            if (string.IsNullOrEmpty(request.PermissionName))
            {
                return BadRequest("Permission name is required.");
            }

            var permission = new Permission
            {
                PermissionName = request.PermissionName
            };

            await _permissionRepository.AddPermissionAsync(permission);

            var permissionDto = new PermissionDto
            {
                Id = permission.Id,
                PermissionName = permission.PermissionName
            };

            return CreatedAtAction(nameof(GetPermissionById), new { id = permission.Id }, permissionDto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPermissionById(int id)
        {
            var permission = await _permissionRepository.GetPermissionByIdAsync(id);
            if (permission == null)
            {
                return NotFound();
            }

            var permissionDto = new PermissionDto
            {
                Id = permission.Id,
                PermissionName = permission.PermissionName
            };

            return Ok(permissionDto);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PermissionDto>>> GetAllPermissions()
        {
            var permissions = await _permissionRepository.GetAllPermissionsAsync();
            var permissionDtos = permissions.Select(p => new PermissionDto
            {
                Id = p.Id,
                PermissionName = p.PermissionName
            }).ToList();

            return Ok(permissionDtos);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePermission(int id)
        {
            var permission = await _permissionRepository.GetPermissionByIdAsync(id);
            if (permission == null)
            {
                return NotFound();
            }

            try
            {
                await _permissionRepository.DeletePermissionAsync(id);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePermission(int id, [FromBody] UpdatePermissionRequest request)
        {
            if (string.IsNullOrEmpty(request.PermissionName))
            {
                return BadRequest("Permission name is required.");
            }

            var permission = await _permissionRepository.GetPermissionByIdAsync(id);
            if (permission == null)
            {
                return NotFound();
            }

            permission.PermissionName = request.PermissionName;
            await _permissionRepository.UpdatePermissionAsync(permission);

            return NoContent();
        }
    }

    public class CreatePermissionRequest
    {
        public string PermissionName { get; set; }
    }

    public class UpdatePermissionRequest
    {
        public string PermissionName { get; set; }
    }
}

