using System;
using DAL.Entities;
using DAL.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories
{
	public class UserRepository : Repository<User>,  IUserRepository
	{
		private readonly AppDbContext _context;

		public UserRepository(AppDbContext context) : base(context)
		{
			_context = context;
		}

        public void Add(User user)
        {
            _context.Users.Add(user);
            
        }

        public async Task<List<User>> GetAll()
        {
            return await _context.Users.ToListAsync();
        }

    }
}

