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

        [HttpGet("get-company-users")]
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


        [HttpDelete("remove-user")]
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



        [HttpPost("get-company-devices")]
        public async Task<ActionResult<List<DeviceDto>>> GetAllDevices(AdminCRUDDeviceDto request)
        {
            var admin = new User();
            if (!request.adminEmail.IsNullOrEmpty())
            {
                admin = await _userService.GetUserByEmail(request.adminEmail);
                if (admin == null || admin.Role.RoleName != "Admin") { return BadRequest("Admin not found"); }
            }

            var company = _companyService.GetCompanyByID(admin.UserID).Result;
            if (company == null) { return BadRequest("Company not found"); }
            var devices = await _deviceService.GetAllByCompanyId(company.CompanyID);
            return devices;
        }

        [HttpPost("remove-device")]
        public async Task<ActionResult> RemoveDevice(AdminCRUDDeviceDto request)
        {

            var admin = new User();
            if (!request.adminEmail.IsNullOrEmpty())
            {
                admin = await _userService.GetUserByEmail(request.adminEmail);
                if (admin == null || admin.Role.RoleName != "Admin") { return BadRequest("Admin not found"); }
            }
            var company = _companyService.GetCompanyByID(admin.UserID).Result;
            if (company == null) { return BadRequest("Company not found"); }
            var devices = await _deviceService.GetAllByCompanyId(company.CompanyID);
            var deviceDto = devices.FirstOrDefault(u => u.Reference==request.Reference);
            _deviceService.RemoveDevice(deviceDto);
            return Ok("Device successfully removed.");
        }

        [HttpPost("add-device")]
        public async Task<ActionResult<DeviceDto>> AddDevice(AdminCRUDDeviceDto request)
        {

            var admin = new User();
            if (!request.adminEmail.IsNullOrEmpty())
            {
                admin = await _userService.GetUserByEmail(request.adminEmail);
                if (admin == null || admin.Role.RoleName != "Admin") { return BadRequest("Admin not found"); }
            }
            var company = _companyService.GetCompanyByID(admin.UserID).Result;
            if (company == null) { return BadRequest("Company not found"); }
            var devices = await _deviceService.GetAllByCompanyId(company.CompanyID);
            var deviceDto = devices.FirstOrDefault(u => u.Reference == request.Reference);
            var device = _deviceService.AddDevice(deviceDto);
            return Ok(device);
        }

        [HttpPost("update-device")]
        public async Task<ActionResult> UpdateDevice(AdminCRUDDeviceDto request)
        {

            var admin = new User();
            if (!request.adminEmail.IsNullOrEmpty())
            {
                admin = await _userService.GetUserByEmail(request.adminEmail);
                if (admin == null || admin.Role.RoleName != "Admin") { return BadRequest("Admin not found"); }
            }
            var company = _companyService.GetCompanyByID(admin.UserID).Result;
            if (company == null) { return BadRequest("Company not found"); }
            var devices = await _deviceService.GetAllByCompanyId(company.CompanyID);
            var deviceDto = devices.FirstOrDefault(u => u.Reference == request.Reference);
            if (request.DeviceName != null) deviceDto.DeviceName = request.DeviceName;
            if (request.Reference != null) deviceDto.Reference = request.Reference;
            _deviceService.UpdateDevice(deviceDto);
            return Ok("Device successfully updated.");
        }

        [HttpPost("get-all-companies")]
        public async Task<ActionResult<List<DeviceDto>>> GetAllCompanies(SuperAdminDto request)
        {
            var admin = new User();
            if (!request.superAdminEmail.IsNullOrEmpty())
            {
                admin = await _userService.GetUserByEmail(request.superAdminEmail);
                if (admin == null || admin.Role.RoleName != "Super Admin") { return BadRequest("Only super admin allowed."); }
            }
            var companies = _companyService.GetAll().Result;
            return Ok(companies);
        }

        [HttpPost("remove-company")]
        public async Task<ActionResult> RemoveCompany(SuperAdminDto request)
        {

            var admin = new User();
            if (!request.superAdminEmail.IsNullOrEmpty())
            {
                admin = await _userService.GetUserByEmail(request.superAdminEmail);
                if (admin == null || admin.Role.RoleName != "Super Admin") { return BadRequest("Only super admin allowed."); }
            }
            var company = _companyService.GetCompanyByName(request.CompanyName).Result;
            if (company == null) { return BadRequest("Company not found"); }
            _companyService.RemoveCompany(company);
            return Ok("Company successfully removed.");
        }

        [HttpPost("add-company")]
        public async Task<ActionResult<CompanyDto>> AddCompany(SuperAdminDto request)
        {

            var admin = new User();
            if (!request.superAdminEmail.IsNullOrEmpty())
            {
                admin = await _userService.GetUserByEmail(request.superAdminEmail);
                if (admin == null || admin.Role.RoleName != "Super Admin") { return BadRequest("Only super admin allowed."); }
            }
            var companyDto=new CompanyDto{ CompanyName= request.CompanyName };
            var company = _companyService.AddCompany(companyDto).Result;
            return Ok(company);
        }

        [HttpPost("update-company")]
        public async Task<ActionResult> UpdateCompany(SuperAdminDto request)
        {
            var admin = new User();
            if (!request.superAdminEmail.IsNullOrEmpty())
            {
                admin = await _userService.GetUserByEmail(request.superAdminEmail);
                if (admin == null || admin.Role.RoleName != "Super Admin") { return BadRequest("Only super admin allowed."); }
            }
            var company = _companyService.GetCompanyByName(request.CompanyName).Result;
            if (company!= null) { 
                company.CompanyName = request.CompanyName;
                company = _companyService.GetCompanyByName(request.CompanyName).Result;
                _companyService.UpdateCompany(company);
            }
            return Ok("Company updated");
        }

        [HttpPost("get-admins")]
        public async Task<ActionResult<List<UserDto>>> GetAllAdmins(UserPhoneOrMail request)
        {
            var admin = new User();
            if (!request.Email.IsNullOrEmpty())
            {
                admin = await _userService.GetUserByEmail(request.Email);
                if (admin == null || admin.Role.RoleName != "Super Admin") { return BadRequest("Super admin not found"); }
            }
            var admins = _userService.GetAllByRole("Admin");
            return Ok(admins);
        }
    }
}
