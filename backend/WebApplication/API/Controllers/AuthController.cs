using BLL.DTOs;
using DAL.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static System.Net.Mime.MediaTypeNames;
using System.Text;
using DAL.Repositories;
using DAL.Interfaces;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public static User user =new User();
        private readonly IUserRepository _userRepository;


        [HttpPost("register")]
        public ActionResult<User> Register(UserRegisterDto request)
        {
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
 
            user.Email= request.Email;
            user.PasswordHash = Encoding.UTF8.GetBytes(passwordHash);

            return Ok(user);
        }
        [HttpPost("login")]
        public async ActionResult<User> Login(UserRegisterDto request)
        {
            List<User> users = await _userRepository.GetAll();
            User user = users.FirstOrDefault(u => u.Email == request.Email);
            if (user == null) { return BadRequest("User not found"); }

        }

    }
}
