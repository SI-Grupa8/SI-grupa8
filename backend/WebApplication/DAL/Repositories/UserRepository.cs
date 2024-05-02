using System;
using System.ComponentModel.Design;
using DAL.Entities;
using DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
using static QRCoder.PayloadGenerator;

namespace DAL.Repositories
{
    public class UserRepository : Repository<User>, IUserRepository
	{
		private readonly AppDbContext _context;

		public UserRepository(AppDbContext context) : base(context)
		{
			_context = context;
		}

		public async Task<User> FindByEmail(string email)
		{

			return await _context.Users.Include(u => u.Role).FirstAsync(x => x.Email == email);

		}

        public async Task<User> FindByPhoneNumber(string phoneNumber)
        {
			return await _context.Users.Include(u => u.Role).FirstAsync(x => x.PhoneNumber == phoneNumber);
        }

        public async Task<User> GetByToken(string token)
        {
            return await _context.Users.Include(x => x.Role).FirstAsync(x => x.RefreshToken == token);
        }

        public async Task<List<User>> GetAllByCompanyId(int companyID)
        {
            return await _context.Users.Include(x => x.Role).Include(x => x.Company).Where(x => x.CompanyID == companyID).ToListAsync();
        }

        public async Task<List<User>> GetAllByRole(string role)
        {
            return await _context.Users.Where(x => x.Role.RoleName == role).ToListAsync();
        }

        public async Task<User> GetUserById(int userID)
        {
            return await _context.Users.AsNoTracking().Include(u => u.Role).FirstAsync(x => x.UserID == userID);
        }

        public async Task<List<User>> GetAllAdminsWithoutCompany()
        {
            //ako vam treba da vraca i Usere obicne samo u Where (x.RoleID == 1 || x.RoleID == 0)
            return await _context.Users.Where(x => (x.RoleID == 1 && x.CompanyID == null) || (x.RoleID == 0)).ToListAsync();
        }

        public async Task<List<User>> GetDispatchersForNewDevice(int companyId)
        {
            var devices = await _context.Devices
                .Include(x => x!.User)
                .Where(x => x.User != null && x.User.CompanyID == companyId)
                .ToListAsync();

            var usersList = devices.Select(x => x.UserID).ToList();

            return await _context.Users.Where(x =>
                x.RoleID == 3 &&
                x.CompanyID == companyId &&
                !usersList.Contains(x.UserID))
                .ToListAsync();
        }
    }
}

