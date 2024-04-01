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
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.AspNetCore.Authorization;
using API.JWTHelpers;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IConfiguration _configuration;

        public AuthController(IUserService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }


        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(UserRegisterDto userRegisterDto)

        {
            //Check if input contains at least an email or a phone number

            if (userRegisterDto.Email.IsNullOrEmpty() && userRegisterDto.PhoneNumber.IsNullOrEmpty())
                return BadRequest("Cannot register without at least an email or a phone number!");
            var userDto = await _userService.AddUser(userRegisterDto);
            return Ok(userDto);
        }

        [HttpPost("login")]
        public async Task<ActionResult<object>> Login(UserLogIn request)
        {
            //Check if input contains at least an email or a phone number
            if (request.Email.IsNullOrEmpty() && request.PhoneNumber.IsNullOrEmpty())
                return BadRequest("Cannot login without at least an email or a phone number!");

            var (cookieOptions, refresh, data) = await _userService.UserLogIn(request);
            Response.Cookies.Append("refreshToken", refresh, cookieOptions);

            return Ok(data) ;

        }

        /*
        [HttpPost("refresh-token")]
        public async Task<ActionResult<string>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            User user = await _userService.GetByToken(refreshToken);

            if (user == null)
            {
                return Unauthorized("Invalid Refresh Token.");
            }
            else if (user.TokenExpires < DateTime.Now.ToUniversalTime())
            {
                return Unauthorized("Token expired.");
            }

            string token = CreateToken(user);
            var newToken = GenerateRefreshToken();
            newToken.Token = refreshToken;
            SetRefreshToken(newToken,user);
            RefreshTokenDto refresh = new RefreshTokenDto()
            {
                Token = newToken.Token,
                Created = newToken.Created,
                Expires = newToken.Expires
            };
            await _userService.RefreshUserToken(user.UserID, refresh);

            
            return Ok(token);

        }
        */

        [HttpPost("login/tfa")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> LoginTfa(UserLoginTfa request)
        {
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last()!;
            var userId = JWTHelper.GetUserIDFromClaims(token);
            return Ok(await _userService.ConfirmTfa(request, userId));
        }

        [HttpPost("get-tfa")] // vraca tfa samo
        [Authorize(Roles="User")]
        public async Task<ActionResult<object>> EnableTwoFactorAuthentication()
        {
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last()!;
            var userId = JWTHelper.GetUserIDFromClaims(token);
            return Ok(await _userService.EnableTwoFactorAuthentication(userId));
        }

        [HttpPost("store-tfa")] // ako se poklope enabled u bazu
        [Authorize(Roles = "User")]
        public async Task<ActionResult<UserDto>> StoreTwoFactorAuthentication(UserLoginTfa request)
        {
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last()!;
            var userId = JWTHelper.GetUserIDFromClaims(token);
            return Ok(await _userService.ConfirmTfa(request, userId));
        }

        [HttpPost("disable-tfa")]
        [Authorize(Roles = "User")]
        public async Task<ActionResult> DisableTwoFactorAuthentication()
        {
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last()!;
            var userId = JWTHelper.GetUserIDFromClaims(token);
            return Ok(await _userService.DisableTfa(userId));
        }

        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email.ToString()),
                new Claim(ClaimTypes.Role, user.Role.RoleName.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString())
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("AppSettings:Token").Value!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                //expires: DateTime.Now.AddSeconds(10),
                signingCredentials: credentials
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
    }
}
