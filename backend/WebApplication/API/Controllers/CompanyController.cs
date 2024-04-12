using System;
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
    public class CompanyController : ControllerBase
    {
        private readonly ICompanyService _companyService;

        public CompanyController(ICompanyService companyService)
        {
            _companyService = companyService;
        }

        [HttpGet("get-all-companies")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<List<CompanyDto>>> GetAll()
        {
            return Ok(await _companyService.GetAll());
        }

        [HttpDelete("remove-company/{companyId}")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult> RemoveCompany(int companyId)
        {
            await _companyService.RemoveCompany(companyId);

            return Ok("Company removed");
        }

        [HttpPost("add-company")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<CompanyDto>> AddCompany(CompanyDto company, int? adminId = 0)
        {
            var result = await _companyService.AddCompany(company, adminId);

            return Ok(result);
        }

        [HttpPut("update-company")]
        [Authorize(Roles = "SuperAdmin")]
        public async Task<ActionResult<CompanyDto>> UpdateCompany(CompanyDto company)
        {
            var companyDto = await _companyService.UpdateCompany(company);

            return companyDto;
        }

        [HttpGet("get-company-users/{companyId}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<List<UserDto>>> GetAllUsers(int companyId)
        {
            return Ok(await _companyService.GetAllUsers(companyId));
        }

        [HttpGet("get-company-by-id/{companyId}")]
        [Authorize(Roles = "Admin,SuperAdmin")]
        public async Task<ActionResult<CompanyDto>> GetCompanyById(int companyId)
        {
            return Ok(await _companyService.GetCompanyByID(companyId));
        }

    }
}

