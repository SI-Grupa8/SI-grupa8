﻿using API.JWTHelpers;
using BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceLocationController : ControllerBase
    {
        private readonly IDeviceLocationService _deviceLocationService;

        public DeviceLocationController(IDeviceLocationService deviceLocationService)
        {
            _deviceLocationService = deviceLocationService;
        }

        [HttpGet]
        [Authorize(Roles = "User")]
        public ActionResult<string> SetDeviceToken(string macAddress)
        {
            return Ok(_deviceLocationService.CreateDeviceToken(macAddress));
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = "DeviceJwtScheme")]
        public async Task<ActionResult> SendCurrentLocation(string lat, string lg)
        {
            string token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last()!;
            var mac = JWTHelper.GetDeviceClaims(token);
            await _deviceLocationService.SaveCurrentLocation(lat, lg, mac);

            return Ok(new { Message = "Location saved" });
        }
    }
}

