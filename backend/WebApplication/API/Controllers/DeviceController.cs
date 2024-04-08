using System;
using System.Collections;
using API.JWTHelpers;
using BLL.DTOs;
using BLL.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeviceController : ControllerBase
	{
        private readonly IDeviceService _deviceService;

		public DeviceController(IDeviceService deviceService)
		{
            _deviceService = deviceService;
		}

        [HttpGet("get-company-devices")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<DeviceDto>>> GetAllForCompany()
        {
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last()!;
            var adminId = JWTHelper.GetUserIDFromClaims(token);

            return Ok(await _deviceService.GetAllForCompany(adminId));
        }

        [HttpDelete("remove-device/{deviceId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> RemoveDevice(int deviceId)
        {
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last()!;
            var adminId = JWTHelper.GetUserIDFromClaims(token);

            await _deviceService.RemoveDevice(deviceId, adminId);

            return Ok(new { message = "Device removed." });
        }

        [HttpPost("add-device")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<object>> AddDevice(DeviceDto request)
        {
            var data = await _deviceService.AddDevice(request);

            return Ok(data);
        }

        [HttpPut("update-device/{deviceId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<DeviceDto>> UpdateDevice(DeviceDto request)
        {
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last()!;
            var adminId = JWTHelper.GetUserIDFromClaims(token);

            await _deviceService.UpdateDevice(request, adminId);

            return request;
        }

        [HttpGet("get-company-devices-v1")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IList<DeviceDto>>> FilterDevices([FromQuery] string type)
        {
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last()!;
            var adminId = JWTHelper.GetUserIDFromClaims(token);
            var devicesFromCompany = await _deviceService.GetAllForCompany(adminId);
            return _deviceService.GetDevicesByType(devicesFromCompany, type);
        }
    }
}

