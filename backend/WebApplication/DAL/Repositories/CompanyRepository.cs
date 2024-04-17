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
                .ThenInclude(x => x!.Role)
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

        public async Task<object> GetUserStatistics(int companyId)
        {
            var company = await _context.Companies
               .Include(x => x.Users)
               .ThenInclude(x => x.Role)
               .FirstOrDefaultAsync(x => x.CompanyID == companyId);

            if (company == null)
            {
                return null;
            }

            var allCount = company.Users.Count;
            var userCount = company.Users.Count(u => u.Role.RoleName == "User");
            var adminCount = company.Users.Count(u => u.Role.RoleName == "Admin");
            var fleetManagerCount = company.Users.Count(u => u.Role.RoleName == "FleetManager");
            var dispatcherCount = company.Users.Count(u => u.Role.RoleName == "Dispatcher");
            var userPercent = (double)userCount / allCount * 100;
            var adminPercent = (double)adminCount / allCount * 100;
            var fleetManagerPercent = (double)fleetManagerCount / allCount * 100;
            var dispatcherPercent = (double)dispatcherCount / allCount * 100;

            var statistics = new
            {
                Admins = adminPercent,
                Dispatcher = dispatcherPercent,
                FleetManagers = fleetManagerPercent,
                Users = userPercent
            };

            return statistics;
        }
    }
}
