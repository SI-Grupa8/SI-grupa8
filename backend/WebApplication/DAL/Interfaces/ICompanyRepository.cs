using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface ICompanyRepository : IRepository<Company>
    {
        Task<Company> GetByName(string name);
        Task<List<Company>> GetAllWithAdmins();
        Task<Company> GetAllUsersForCompany(int companyId);
        Task UpdateWithAttachment(Company company);
    }
}
