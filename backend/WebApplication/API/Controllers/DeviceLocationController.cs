using API.JWTHelpers;
using BLL.DTOs;
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
        [Authorize(Roles = "Admin,SuperAdmin")]
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
            try
            {
                await _deviceLocationService.SaveCurrentLocation(lat, lg, mac);

            }
            catch (UnauthorizedAccessException ex)
            {
                return BadRequest(ex.Message);
            }

            return Ok(new { Message = "Location saved" });
        }

        [HttpGet("locations-filter")]
        [Authorize(Roles ="Admin")]
        public ActionResult<List<LocationStorageDto>> GetDeviceRoutesFilter(DateTime startTime, DateTime endTime)
        {
            string token = HttpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last()!;
            var adminId = JWTHelper.GetUserIDFromClaims(token);

            return _deviceLocationService.GetDeviceLocationsFilter(adminId, startTime, endTime);

        }
    }
}

