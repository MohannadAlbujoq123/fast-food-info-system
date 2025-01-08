using FastFoodProject.Models;
using FastFoodProject.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FastFoodProject.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize(Policy = "NotDisabled")]
    [Authorize(Roles = "Admin")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;

        public UserController(IUserRepository userRepository, IRoleRepository roleRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
        {
            var users = await _userRepository.GetAllUsersAsync();
            var userDtos = users.Select(u => new UserDto
            {
                Id = u.Id,
                UserName = u.UserName,
                Email = u.Email,
                IsDisabled = u.IsDisabled,
                UserRoles = u.UserRoles.Select(ur => new UserRoleDto
                {
                    RoleId = ur.Role.Id,
                    RoleName = ur.Role.RoleName
                }).ToList()
            }).ToList();

            return Ok(userDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUserById(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                IsDisabled = user.IsDisabled,
                UserRoles = user.UserRoles.Select(ur => new UserRoleDto
                {
                    RoleId = ur.Role.Id,
                    RoleName = ur.Role.RoleName
                }).ToList()
            };

            return Ok(userDto);
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> AddUser(CreateUserRequest request)
        {
            var role = await _roleRepository.GetRoleEntityByIdAsync(request.RoleId);
            if (role == null)
            {
                return BadRequest("Invalid role ID.");
            }

            var user = new User
            {
                UserName = request.UserName,
                Email = request.Email,
                Password = request.Password,
                UserRoles = new List<UserRole>
        {
            new UserRole { RoleId = request.RoleId }
        }
            };

            await _userRepository.AddUserAsync(user);

            var userDto = new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                IsDisabled = user.IsDisabled,
                UserRoles = user.UserRoles.Select(ur => new UserRoleDto
                {
                    RoleId = ur.Role.Id,
                    RoleName = ur.Role.RoleName
                }).ToList()
            };

            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, userDto);
        }


        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, UpdateUserRequest request)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            if (user.UserRoles.Any(ur => ur.Role.RoleName == "Admin") && !await _userRepository.HasMultipleActiveAdminsAsync())
            {
                return BadRequest("Cannot change the role of the last active admin.");
            }

            user.UserName = request.UserName;
            user.Email = request.Email;
            user.IsDisabled = request.IsDisabled;

            if (!string.IsNullOrEmpty(request.Password))
            {
                user.Password = request.Password;
            }

            if (request.RoleId.HasValue)
            {
                var role = await _roleRepository.GetRoleEntityByIdAsync(request.RoleId.Value);
                if (role == null)
                {
                    return BadRequest("Invalid role ID.");
                }

                user.UserRoles.Clear();
                user.UserRoles.Add(new UserRole { RoleId = request.RoleId.Value });
            }

            await _userRepository.UpdateUserAsync(user);
            return NoContent();
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            if (user.UserRoles.Any(ur => ur.Role.RoleName == "Admin") && !await _userRepository.HasMultipleActiveAdminsAsync())
            {
                return BadRequest("Cannot delete the last active admin.");
            }

            await _userRepository.DeleteUserAsync(userId);
            return NoContent();
        }

        [HttpPut("{userId}/disable")]
        public async Task<IActionResult> DisableUser(int userId)
        {
            var user = await _userRepository.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            if (user.UserRoles.Any(ur => ur.Role.RoleName == "Admin") && !await _userRepository.HasMultipleActiveAdminsAsync())
            {
                return BadRequest("Cannot disable the last active admin.");
            }

            await _userRepository.DisableUserAsync(userId);
            return NoContent();
        }
    }
}
