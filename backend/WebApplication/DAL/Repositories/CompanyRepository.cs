using DAL.Entities;
using DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class CompanyRepository : Repository<Company>, ICompanyRepository
    {
        private readonly AppDbContext _context;

        public CompanyRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<Company> GetAllUsersForCompany(int companyId)
        {
            return await _context.Companies
                .Include(x => x.Users)
                .FirstAsync(x => x.CompanyID == companyId);
        }

        public async Task<List<Company>> GetAllWithAdmins()
        {
            return await _context.Companies.Include(x => x.Users).ToListAsync();
        }


        public async Task<Company> GetByName(string name)
        {
            return await _context.Companies.FirstAsync(x => x.CompanyName == name);
        }
    }
}
