using DAL.Entities;
using DAL.Interfaces;
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
    }
}
