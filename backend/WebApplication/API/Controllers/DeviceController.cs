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

        [HttpGet("get-company-devices/{companyId}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<List<DeviceDto>>> GetAllForCompany(int companyId)
        {
            return Ok(await _deviceService.GetAllForCompany(companyId));
        }

        [HttpDelete("remove-device/{deviceId}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult> RemoveDevice(int deviceId, int companyId)
        {
            await _deviceService.RemoveDevice(deviceId, companyId);

            return Ok(new { message = "Device removed." });
        }

        [HttpPost("add-device")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<object>> AddDevice(DeviceDto request)
        {
            var data = await _deviceService.AddDevice(request);

            return Ok(data);
        }

        [HttpPut("update-device")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<DeviceDto>> UpdateDevice(DeviceDto request)
        {
            await _deviceService.UpdateDevice(request);

            return request;
        }

        [HttpGet("get-company-devices-v1")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<DeviceDto>>> FilterDevices([FromQuery] List<int>? deviceTypeIDs=null)
        {
            var token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last()!;
            var adminId = JWTHelper.GetUserIDFromClaims(token);
            return await _deviceService.GetDevicesByType(adminId, deviceTypeIDs);
        }
    }
}

