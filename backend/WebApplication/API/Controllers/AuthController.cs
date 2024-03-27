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
using DAL;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Google.Authenticator;
using QRCoder;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public static User user = new User();
        private readonly AppDbContext _context;

        IUserService _userService;
        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(UserRegisterDto userRegisterDto)
        {
            // Check if input contains at least an email or a phone number
            if (string.IsNullOrEmpty(userRegisterDto.Email) && string.IsNullOrEmpty(userRegisterDto.PhoneNumber))
                return BadRequest("Cannot register without at least an email or a phone number!");

            var userDto = await _userService.AddUser(userRegisterDto);
            return Ok(userDto);
        }

        [HttpPost("login")]
        public async Task<ActionResult<string>> Login(UserRegisterDto request)
        {
            // Check if input contains at least an email or a phone number
            if (string.IsNullOrEmpty(request.Email) && string.IsNullOrEmpty(request.PhoneNumber))
                return BadRequest("Cannot login without at least an email or a phone number!");

            List<User> users = await _userService.GetAll();
            User user = new User();
            if (!request.Email.IsNullOrEmpty())
            {
                user = users.FirstOrDefault(u => u.Email == request.Email);
                if (user == null) { return BadRequest("User not found"); }
            }
            //Look for a user by phone number
            else if (!request.PhoneNumber.IsNullOrEmpty())
            {
                user = users.FirstOrDefault(u => u.PhoneNumber == request.PhoneNumber);
                if (user == null) { return BadRequest("User not found"); }
            }

            if (user == null) return BadRequest("User not found");

            if (!BCrypt.Net.BCrypt.Verify(request.Password, Encoding.UTF8.GetString(user.PasswordHash)))
                return BadRequest("Wrong password.");

            string token = CreateToken(user);
            return Ok(token);
        }

        [HttpPost("login/tfa")]
        public async Task<ActionResult<string>> LoginTfa(UserRegisterDto request)
        {
            List<User> users = await _userService.GetAll();
            User user = new User();
            if (!request.Email.IsNullOrEmpty())
            {
                user = users.FirstOrDefault(u => u.Email == request.Email);
                if (user == null) { return BadRequest("User not found"); }
            }
            //Look for a user by phone number
            else if (!request.PhoneNumber.IsNullOrEmpty())
            {
                user = users.FirstOrDefault(u => u.PhoneNumber == request.PhoneNumber);
                if (user == null) { return BadRequest("User not found"); }
            }

            if (user == null) return BadRequest("User not found");

            if (user.TwoFactorEnabled)
            {
                var twoFactorAuthenticator = new TwoFactorAuthenticator();
                bool isValid = twoFactorAuthenticator.ValidateTwoFactorPIN(user.TwoFactorKey, request.TwoFactorCode);
                if (!isValid)
                {
                    return BadRequest("Invalid 2FA code.");
                }
            }
            string token = CreateToken(user);
            return Ok(token);
        }

        [HttpPost("enable-tfa")]
        public async Task<ActionResult> EnableTwoFactorAuthentication(UserRegisterDto request)
        {
            List<User> users = await _userService.GetAll();
            User user = new User();
            if (!request.Email.IsNullOrEmpty())
            {
                user = users.FirstOrDefault(u => u.Email == request.Email);
                if (user == null) { return BadRequest("User not found"); }
            }
            //Look for a user by phone number
            else if (!request.PhoneNumber.IsNullOrEmpty())
            {
                user = users.FirstOrDefault(u => u.PhoneNumber == request.PhoneNumber);
                if (user == null) { return BadRequest("User not found"); }
            }

            if (user == null) return BadRequest("User not found");
            var setup = await _userService.SetupCode(user);
            return (ActionResult)Results.Ok(new
            {
                setup.ManualEntryKey,
                QRCodeImageUrl = await _userService.GenerateQRCodeImageUrl(user, setup)
        });
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Name)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("my top secret key is currently very long"));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

    }
}
