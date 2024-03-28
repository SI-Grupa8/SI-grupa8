using System;
using DAL.Entities;

namespace DAL.Interfaces
{
	public interface IUserRepository : IRepository<User>
	{
        Task<User> FindByEmail(string email);
        Task<User> FindByPhoneNumber(string phoneNumber);
        Task<User> GetByToken(string token);

    }
}

