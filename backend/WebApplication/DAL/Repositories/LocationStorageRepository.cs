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

        public List<LocationStorage> GetFilteredLocation(List<int> deviceIds, DateTime startDate, DateTime endDate)
        {
            List<LocationStorage> locationStorages = new List<LocationStorage>();
            var connectionString = _configuration.GetConnectionString("ConnectionDatabase");

            using (var conn = new NpgsqlConnection(connectionString))
            {
                conn.Open();


                using (var cmd = new NpgsqlCommand("SELECT * FROM DeviceLocation_Filter(@DeviceIds, @StartDate, @EndDate)", conn))
                {

                    cmd.Parameters.AddWithValue("@DeviceIds", deviceIds);
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

        public async Task<object> GetLocationStatisticsLast24HoursGrouped(int companyId)
        {
            var now = DateTime.UtcNow;
            var last24Hours = now.AddHours(-24);

            var recentLocations = await _context.LocationStorages
                .Join(_context.Devices,
                    loc => loc.DeviceID,
                    dev => dev.DeviceID,
                    (loc, dev) => new { Location = loc, Device = dev })
                .Join(_context.Users,
                    ld => ld.Device.UserID,
                    user => user.UserID,
                    (ld, user) => new { ld.Location, ld.Device, User = user })
                .Where(ldu => ldu.User.CompanyID == companyId &&
                               ldu.Location.Timestamp >= last24Hours &&
                               ldu.Location.Timestamp <= now)
                .Select(ldu => new
                {
                    Location = ldu.Location,
                    AdjustedTimestamp = ldu.Location.Timestamp.AddHours(4) // dodaje 4 sata zbog vremenske zone
                })
                .ToListAsync();

            if (!recentLocations.Any())
            {
                Console.WriteLine("No records found within the last 24 hours.");
                return GenerateEmptyStatistics();
            }
            foreach( var location in recentLocations )
            {
                Console.WriteLine(location.AdjustedTimestamp.ToString() );
            }

            var locationData = recentLocations
                .GroupBy(loc => ((loc.AdjustedTimestamp.Hour / 3) * 3) % 24)
                .Select(g => new
                {
                    TimeInterval = $"{g.Key:00}:00 - {(g.Key + 3) % 24:00}:00",
                    Count = g.Count()
                })
                .OrderBy(g => g.TimeInterval)
                .ToList();

            var totalCount = locationData.Sum(ld => ld.Count);

            var allIntervals = Enumerable.Range(0, 24 / 3)
                .Select(i => $"{i * 3:00}:00 - {(i * 3 + 3) % 24:00}:00")
                .ToList();

            var statistics = allIntervals
            .GroupJoin(locationData,
                interval => interval,
                data => data.TimeInterval,
                (interval, data) => new
                {
                    TimeInterval = interval,
                    Percentage = data.Select(d => d.Count == 0 ? 0 : (double)d.Count / totalCount * 100).FirstOrDefault()
                })
            .Select(x => new { x.TimeInterval, Percentage = Math.Round(x.Percentage, 2) }) 
            .ToList();

            return statistics;
        }

        // Helper method to generate empty statistics
        private List<object> GenerateEmptyStatistics()
        {
            return Enumerable.Range(0, 24 / 3)
                .Select(i => new
                {
                    TimeInterval = $"{i * 3:00}:00 - {(i * 3 + 3) % 24:00}:00",
                    Percentage = 0.0 
                })
                .Cast<object>()
                .ToList();
        }










    }

}
