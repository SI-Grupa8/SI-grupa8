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
    public class LocationStorageRepository: Repository<LocationStorage>, ILocationStorageRepository
    {
        private readonly AppDbContext _context;

        public LocationStorageRepository(AppDbContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<LocationStorage>> getLocationsByDeviceId(int deviceId)
        {
            return await _context.LocationStorages
                                   .Where(location => location.DeviceID == deviceId)
                                   .OrderBy(location => location.Timestamp)
                                   .ToListAsync();
        }
    }
}
