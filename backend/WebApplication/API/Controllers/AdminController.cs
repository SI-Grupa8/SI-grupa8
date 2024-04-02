using BLL.DTOs;
using BLL.Interfaces;
using BLL.Services;
using DAL.Entities;
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

        [HttpGet("get-company-users/{adminId}")]
        public async Task<ActionResult<List<UserDto>>> GetAllUsers(int adminId)
        {
            var admin = await _userService.GetUserById(adminId);
            
            if (admin == null || admin.Role?.RoleName != "Admin")
            {
                return BadRequest("Admin not found or not authorized");
            }

            var company = _companyService.GetCompanyByID((int)admin.CompanyID).Result;
            if (company == null)
            {
                return BadRequest("Company not found");
            }

            var users = await _userService.GetAllByCompanyId(company.CompanyID);
            return Ok(users);
        }


        [HttpDelete("remove-user/{userId}")]
        public async Task<ActionResult> RemoveUser(int adminId, int userId)
        {
            var admin = await _userService.GetUserById(adminId);
            if (admin == null || admin.Role?.RoleName != "Admin")
            {
                return BadRequest("Admin not found or not authorized");
            }

            var company = _companyService.GetCompanyByID((int)admin.CompanyID).Result;
            if (company == null)
            {
                return BadRequest("Company not found");
            }

            var user = await _userService.GetUserById(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (user.CompanyID != admin.CompanyID)
            {
                return BadRequest("User does not belong to the same company as the admin.");
            }

            _userService.RemoveUser(user);
            return Ok("User successfully removed.");
        }



        [HttpPost("add-user")]
        public async Task<ActionResult<UserDto>> AddUser(AdminCRUDUserDto request)
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

            if (request.Email.IsNullOrEmpty() && request.PhoneNumber.IsNullOrEmpty())
            {
                return BadRequest("Cannot add a user without an email or a phone number!");
            }

            var user = new UserRegisterDto
            {
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Name = request.Name,
                Surname = request.Surname,
                Password = request.Password,
                RoleID = request.RoleId, 
                CompanyID = company.CompanyID
            };

            var userDto = await _userService.AddUser(user);
            return Ok(userDto);
        }


        [HttpPut("update-user/{userId}")]
        public async Task<ActionResult> UpdateUser(int userId, AdminCRUDUserDto request)
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

            var user = await _userService.GetUserById(userId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Ensure the user belongs to the same company as the admin
            if (user.CompanyID != admin.CompanyID)
            {
                return BadRequest("User does not belong to the same company as the admin.");
            }

            if (request.Name != null) user.Name = request.Name;
            if (request.Surname != null) user.Surname = request.Surname;
            if (request.Email != null) user.Email = request.Email;
            if (request.PhoneNumber != null) user.PhoneNumber = request.PhoneNumber;
            if (request.Password != null)
            {
                user.PasswordHash = Encoding.UTF8.GetBytes(BCrypt.Net.BCrypt.HashPassword(request.Password));
                user.PasswordSalt = []; 
            }
            if(request.RoleId != null) user.RoleID = request.RoleId;

            await _userService.UpdateUser(user);
            return Ok("User successfully updated.");
        }



        [HttpGet("get-company-devices/{adminId}")]
        public async Task<ActionResult<List<DeviceDto>>> GetAllDevices(int adminId)
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
        public async Task<ActionResult> UpdateDevice(int deviceId, AdminCRUDDeviceDto request)
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
        }



        [HttpGet("get-all-companies/{superAdminId}")]
        public async Task<ActionResult<List<DeviceDto>>> GetAllCompanies(int superAdminId)
        {
            if (superAdminId <= 0)
            {
                return BadRequest("Invalid super admin ID.");
            }

            var superAdmin = await _userService.GetUserById(superAdminId);
            if (superAdmin == null || superAdmin.Role?.RoleName != "Super Admin")
            {
                return BadRequest("Only super admin allowed.");
            }

            var companies = await _companyService.GetAll();
            return Ok(companies);
        }

        [HttpDelete("remove-company/{companyId}")]
        public async Task<ActionResult> RemoveCompany(int adminId, int companyId)
        {
            var superAdmin = await _userService.GetUserById(adminId);
            if (superAdmin == null || superAdmin.Role?.RoleName != "Super Admin")
            {
                return BadRequest("Only super admin allowed.");
            }

            var company = await _companyService.GetCompanyByID(companyId);
            if (company == null)
            {
                return BadRequest("Company not found");
            }

            await _companyService.RemoveCompany(company);
            return Ok("Company successfully removed.");
        }


        [HttpPost("add-company")]
        public async Task<ActionResult<CompanyDto>> AddCompany(SuperAdminDto request)
        {
            var superAdmin = await _userService.GetUserById(request.SuperAdminId);
            if (superAdmin == null || superAdmin.Role?.RoleName != "Super Admin")
            {
                return BadRequest("Only super admin allowed.");
            }

            var adminUser = await _userService.GetUserById(request.AdminId);
            if (adminUser == null || adminUser.Role?.RoleName != "Admin")
            {
                return BadRequest("The specified admin user is not valid or does not have the role of Admin.");
            }

            var companyDto = new CompanyDto { CompanyName = request.CompanyName, AdminID = request.AdminId };
            var company = await _companyService.AddCompany(companyDto);

            return Ok(company);
        }


        [HttpPut("update-company/{companyId}")]
        public async Task<ActionResult> UpdateCompany(int companyId, SuperAdminDto request)
        {
            var admin = await _userService.GetUserById(request.SuperAdminId);
            if (admin == null || admin.Role?.RoleName != "Super Admin")
            {
                return BadRequest("Only super admin allowed.");
            }

            var company = await _companyService.GetCompanyByID(companyId);
            if (company == null)
            {
                return NotFound("Company not found.");
            }

            if (!string.IsNullOrEmpty(request.CompanyName))
            {
                company.CompanyName = request.CompanyName;
            }

            if (request.AdminId != null)
            {
                company.AdminID = (int)request.AdminId;
            }

            await _companyService.UpdateCompany(company);
            return Ok("Company updated");
        }


        [HttpGet("get-admins/{superAdminId}")]
        public async Task<ActionResult<List<UserDto>>> GetAllAdmins(int superAdminId)
        {
            var admin = await _userService.GetUserById(superAdminId);
            if (admin == null || admin.Role?.RoleName != "Super Admin")
            {
                return BadRequest("Super admin not found or not authorized");
            }

            var admins = await _userService.GetAllByRole("Admin");
            return Ok(admins);
        }
    }
}
