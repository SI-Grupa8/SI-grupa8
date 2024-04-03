using BLL.DTOs;
using BLL.Interfaces;
using BLL.Services;
using DAL.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ICompanyService _companyService;
        private readonly IDeviceService _deviceService;

        public AdminController(IConfiguration config, IUserService userService, ICompanyService companyService, IDeviceService deviceService)
        {
            _userService = userService;
            _deviceService = deviceService;
            _companyService = companyService;
        }
       
        /*
        [HttpGet("get-company-devices/{adminId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<DeviceDto>>> GetAllDevices(int adminId)
        {
            var admin = await _userService.GetUserById(adminId);
            if (admin == null)
            {
                return BadRequest("Admin not found or not authorized");
            }

            var company = await _companyService.GetCompanyByID((int)admin.CompanyID!);
            if (company == null)
            {
                return BadRequest("Company not found");
            }

            var users = await _userService.GetAllByCompanyId(company.CompanyID);
            var userIds = await _userService.ExtractUserIDs(users);

            var devices = await _deviceService.GetAllByCompanyUsersIds(userIds);
            return devices;
        }

        [HttpDelete("remove-device/{deviceId}")]
        public async Task<ActionResult> RemoveDevice(int adminId, int deviceId)
        {

            var admin = await _userService.GetUserById(adminId);
            if (admin == null || admin.Role?.RoleName != "Admin")
            {
                return BadRequest("Admin not found or not authorized");
            }

            var company = await _companyService.GetCompanyByID((int)admin.CompanyID);
            if (company == null)
            {
                return BadRequest("Company not found");
            }

            var device = await _deviceService.GetDeviceByID(deviceId);
            if (device == null)
            {
                return NotFound("Device not found");
            }

            var userOwner = await _userService.GetUserById(device.UserID);
            if (userOwner == null || userOwner.CompanyID != admin.CompanyID)
            {
                return NotFound("Device doesn't belong to this company");
            }

            await _deviceService.RemoveDevice(device);
            return Ok("Device successfully removed.");
        }


        [HttpPost("add-device")]
        public async Task<ActionResult<DeviceDto>> AddDevice(AdminCRUDDeviceDto request)
        {

            var admin = await _userService.GetUserById(request.AdminId);
            if (admin == null || admin.Role?.RoleName != "Admin")
            {
                return BadRequest("Admin not found or not authorized");
            }

            var company = await _companyService.GetCompanyByID((int)admin.CompanyID);
            if (company == null)
            {
                return BadRequest("Company not found");
            }

            var deviceDto = new DeviceDto
            {
                Reference = request.Reference,
                DeviceName = request.DeviceName,
                UserID = request.UserId,
                XCoordinate = request.XCoordinate,
                YCoordinate = request.YCoordinate
            };

            var device = await _deviceService.AddDevice(deviceDto);
            return Ok(device);
        }

        [HttpPut("update-device/{deviceId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateDevice(int deviceId, AdminCRUDDeviceDto request)
        {
            var admin = await _userService.GetUserById(request.AdminId);
            if (admin == null)
            {
                return BadRequest("Admin not found or not authorized");
            }

            var company = await _companyService.GetCompanyByID((int)admin.CompanyID!);
            if (company == null)
            {
                return BadRequest("Company not found");
            }

            var device = await _deviceService.GetDeviceByID(deviceId);
            if (device == null)
            {
                return NotFound("Device not found");
            }

            var userOwner = await _userService.GetUserById(device.UserID);
            if(userOwner == null || userOwner.CompanyID != admin.CompanyID) 
            {
                return NotFound("Device doesn't belong to this company");
            }

            if (request.DeviceName != null)
            {
                device.DeviceName = request.DeviceName;
            }
            if (request.Reference != null)
            {
                device.Reference = request.Reference;
            }
            if(request.UserId != null)
            {
                device.UserID = request.UserId;
            }

            await _deviceService.UpdateDevice(device);
            return Ok("Device successfully updated.");
        }*/
    }
}
