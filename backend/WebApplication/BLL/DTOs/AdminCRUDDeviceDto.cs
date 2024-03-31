using DAL.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.DTOs
{
    public class AdminCRUDDeviceDto
    {
        public required string adminEmail { get; set; }
        public required string Reference { get; set; } = string.Empty;
        public required string DeviceName { get; set; } = string.Empty;
        public string XCoordinate { get; set; } = string.Empty;
        public string YCoordinate { get; set; } = string.Empty;
    }
}
