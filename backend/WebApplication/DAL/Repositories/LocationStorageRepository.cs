using DAL.Entities;
using DAL.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Npgsql;
using NpgsqlTypes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Repositories
{
    public class LocationStorageRepository : Repository<LocationStorage>, ILocationStorageRepository
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public LocationStorageRepository(AppDbContext context, IConfiguration configuration) : base(context)
        {
            _context = context;
            _configuration = configuration;

            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        }

        public async Task<List<LocationStorage>> getLocationsByDeviceId(int deviceId)
        {
            return await _context.LocationStorages
                                   .Where(location => location.DeviceID == deviceId)
                                   .OrderBy(location => location.Timestamp)
                                   .ToListAsync();
        }

        public async Task DeleteOldRecords(DateTime threshold)
        {
            var oldRecords = await _context.LocationStorages
                .Where(ls => ls.Timestamp < threshold)
                .ToListAsync();

            if (oldRecords.Count != 0)
            {
                _context.LocationStorages.RemoveRange(oldRecords);
                await _context.SaveChangesAsync();
            }
        }

        public List<LocationStorage> GetFilteredLocation(int adminId, DateTime startDate, DateTime endDate)
        {
            List<LocationStorage> locationStorages = new List<LocationStorage>();
            var connectionString = _configuration.GetConnectionString("ConnectionDatabase");

            using (var conn = new NpgsqlConnection(connectionString))
            {
                conn.Open();


                using (var cmd = new NpgsqlCommand("SELECT * FROM DeviceLocation_Filter(@AdminID, @StartDate, @EndDate)", conn))
                {

                    cmd.Parameters.AddWithValue("@AdminID", adminId);
                    cmd.Parameters.AddWithValue("@StartDate", NpgsqlDbType.Timestamp, startDate);
                    cmd.Parameters.AddWithValue("@EndDate", NpgsqlDbType.Timestamp, endDate);

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            LocationStorage locationStorage = new LocationStorage
                            {
                                LocationStorageID = reader.GetInt32(reader.GetOrdinal("LocationStorageID")),
                                DeviceID = reader.GetInt32(reader.GetOrdinal("DeviceID")),
                                Timestamp = reader.GetDateTime(reader.GetOrdinal("Timestamp")),
                                XCoordinate = reader.GetString(reader.GetOrdinal("XCoordinate")),
                                YCoordinate = reader.GetString(reader.GetOrdinal("YCoordinate"))
                            };
                            locationStorages.Add(locationStorage);
                        }

                    }
                }
            }

            return locationStorages;
        }
    }
    
}
