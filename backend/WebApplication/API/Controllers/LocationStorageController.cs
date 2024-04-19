using API.JWTHelpers;
using BLL.DTOs;
using BLL.Interfaces;
using BLL.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationStorageController : ControllerBase
    {
        private readonly ILocationStorageService _locationStorageService;

        public LocationStorageController(ILocationStorageService locationStorageService)
        {
            _locationStorageService = locationStorageService;
        }

        [HttpPost("save-location")]
        public async Task<ActionResult> SaveLocation(LocationStorageDto locationStorageDto)
        {
            await _locationStorageService.SaveLocation(locationStorageDto);

            return Ok(new { Message = "Location saved" });
        }

        [HttpGet("get-device-locations/{deviceId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<LocationStorageDto>>> GetLocationsByDeviceId(int deviceId)
        {
            return Ok(await _locationStorageService.GetLocationsByDeviceId(deviceId));
        }

    }
}
