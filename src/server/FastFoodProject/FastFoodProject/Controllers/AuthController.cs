using FastFoodProject.Models;
using FastFoodProject.Repositories;
using FastFoodProject.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace FastFoodProject.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;

        public AuthController(UserService userService, IConfiguration configuration, IUserRepository userRepository, IRoleRepository roleRepository)
        {
            _userService = userService;
            _configuration = configuration;
            _userRepository = userRepository;
            _roleRepository = roleRepository;
        }

        [HttpPost("register")]
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
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password, 11), // Ensure the same work factor
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

            return Ok(userDto);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDto userLoginDto)
        {
            var user = await _userService.AuthenticateUserAsync(userLoginDto.Email, userLoginDto.Password);
            if (user == null)
            {
                return Unauthorized("Invalid credentials.");
            }

            var token = GenerateJwtToken(user);
            return Ok(new { Token = token });
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
        new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(ClaimTypes.Role, user.UserRoles.FirstOrDefault()?.Role?.RoleName ?? "User"),
        new Claim("UserId", user.Id.ToString()), // Ensure UserId claim is numeric
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }


    }
}
