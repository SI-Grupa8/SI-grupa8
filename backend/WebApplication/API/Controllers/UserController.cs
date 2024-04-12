using System;
using BLL.DTOs;
using BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.JWTHelpers;
using System.Security.Claims;
using BLL.Services;

namespace API.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class UserController : ControllerBase
	{
		private readonly IUserService _userService;

		public UserController(IUserService userService)
		{
			_userService = userService;
		}

		[HttpGet("get-current-user")]
		[Authorize]
		public async Task<ActionResult<UserDto>> GetLoggedUser()
		{
			string token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last()!;
			var id = JWTHelper.GetUserIDFromClaims(token);

			var user = await _userService.GetUser(id);

			return Ok(user);
		}

		[HttpDelete("remove-user/{userId}")]
		[Authorize(Roles = "Admin, SuperAdmin")]
		public async Task<ActionResult> RemoveUser(int userId)
		{
			await _userService.RemoveUser(userId);

            return Ok(new { message = "Device removed." });
        }

        [HttpPost("add-user")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<ActionResult<UserDto>> AddUser(UserRegisterDto request)
        {
            string token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last()!;
            var id = JWTHelper.GetUserIDFromClaims(token);

            var userDto = await _userService.AddUser(request, id);

			return Ok(userDto);
        }

        [HttpPut("update-user")]
        [Authorize(Roles = "Admin, SuperAdmin")]
        public async Task<ActionResult> UpdateUser(UserDto request)
		{
			return Ok(await _userService.UpdateUser(request));
		}

        [HttpGet("get-admins")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<List<UserDto>>> GetAllAdmins()
		{
			return Ok(await _userService.GetAllAdmins());
        }

		[HttpGet("get-admins-without-company")]
		[Authorize(Roles = "SuperAdmin")]
		public async Task<ActionResult<List<UserDto>>> GetAdminsWithoutCompany()
		{
			return Ok(await _userService.GetAdminsWihotuCompany());
		}
    }
}

