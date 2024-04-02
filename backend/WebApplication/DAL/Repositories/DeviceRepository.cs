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
    public class DeviceRepository : Repository<Device>, IDeviceRepository
    {
        private readonly AppDbContext _context;

        public DeviceRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Device>> GetAllByCompanyUsersIds(List<int> usersIds)
        {
            return await _context.Devices
                .Where(d => usersIds.Contains(d.UserID))
                .Include(d => d.User)
                .ToListAsync();
        }

    }
}
