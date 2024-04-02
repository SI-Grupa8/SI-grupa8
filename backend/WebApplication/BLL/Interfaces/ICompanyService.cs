using BLL.DTOs;
using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface ICompanyService
    {
        Task<Company> GetCompanyByID(int id);
        Task<List<CompanyDto>> GetAll();
        Task<CompanyDto> GetCompanyByName(string name);
        Task RemoveCompany(Company company);
        Task<CompanyDto> AddCompany(CompanyDto request);
        Task UpdateCompany(Company company);
    }
}
