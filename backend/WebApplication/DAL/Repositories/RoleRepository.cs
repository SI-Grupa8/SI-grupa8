using System;
using DAL.Entities;
using DAL.Interfaces;

namespace DAL.Repositories
{
	public class RoleRepository : Repository<Role>, IRoleRepository
	{
		private readonly AppDbContext _context;

		public RoleRepository(AppDbContext context) : base(context)
		{
			_context = context;
		}
	}
}

