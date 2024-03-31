using BLL.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface ICompanyService
    {
        Task<CompanyDto> GetCompanyByID(int id);
        Task<List<CompanyDto>> GetAll();
        Task<CompanyDto> GetCompanyByName(string name);
        void RemoveCompany(CompanyDto request);
        Task<CompanyDto> AddCompany(CompanyDto request);
        void UpdateCompany(CompanyDto request);
    }
}
