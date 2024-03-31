using System;
using BLL.DTOs;
using BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using API.JWTHelpers;
using System.Security.Claims;

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

		[HttpGet]
		[Authorize(Roles = "User")]
		public async Task<ActionResult<UserDto>> GetLoggedUser()
		{
            string token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last()!;
			var claims = JWTHelper.GetClaimsFromToken(token);

			var id = int.Parse(claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)!.Value);
            var user = await _userService.GetUser(id);

			return Ok(user);
		}
        
    }
}

