using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Interfaces
{
    public interface IDeviceRepository : IRepository<Device>
    {
        Task<List<Device>> GetAllByCompanyUsersIds(List<int> usersIds);
        Task<Device> GetWithUser(int deviceId);
        Task<Device> GetByMacAddress(string macAddress);
        Task<List<Device>> GetFilteredDevicesByUserIds(List<int> userIds, List<int>? deviceTypeIDs = null);
    }
}
