using BLL.DTOs;
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
    }
}
