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
        public required int AdminId { get; set; }
        public string Reference { get; set; } = string.Empty;
        public string DeviceName { get; set; } = string.Empty;
        public int UserId {  get; set; } 
        public string XCoordinate { get; set; } = string.Empty;
        public string YCoordinate { get; set; } = string.Empty;
    }
}
