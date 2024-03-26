using BLL.DTOs;
using DAL.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static System.Net.Mime.MediaTypeNames;
using System.Text;
using DAL.Repositories;
using DAL.Interfaces;
using BLL.Interfaces;
using BLL.Services;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata.Ecma335;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public static User user =new User();
        IUserService _userService;
        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(UserRegisterDto userRegisterDto)
        {

            UserDto registeredUser = await _userService.AddUser(userRegisterDto);

            return Ok(registeredUser);
        }
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(UserRegisterDto request)
        {
            List<User> users = await _userService.GetAll();
            User user = users.FirstOrDefault(u => u.Email == request.Email);
            if (user == null) { return BadRequest("User not found"); }
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash.ToString()))
            {
                return BadRequest("Wrong password.");
            }
            return Ok(user);

        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Name)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("top secret key"));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
            var token = new JwtSecurityToken(
                claims:claims,
                expires:DateTime.Now.AddDays(1),
                signingCredentials:credentials
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

    }
}
