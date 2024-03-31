using BLL.DTOs;
using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Interfaces
{
    public interface IDeviceService
    {
        Task<DeviceDto> GetDeviceByID(int id);
        Task<List<DeviceDto>> GetAllByCompanyId(int companyID);
        Task<DeviceDto> AddDevice(DeviceDto deviceDto);
        void UpdateDevice(DeviceDto request);
        void RemoveDevice(DeviceDto request);
    }
}
