using System;
using DAL.Entities;

namespace DAL.Interfaces
{
	public interface IUserRepository : IRepository<User>
	{
        Task<User> FindByEmail(string email);
        Task<User> FindByPhoneNumber(string phoneNumber);
        Task<User> GetByToken(string token);
        Task<List<User>> GetAllByCompanyId(int companyID);
        Task<List<User>> GetAllByRole(string role);
    }
}

