using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class Device
    {
        public int DeviceId { get; set; }
        public required string Reference { get; set; }
        public required string DeviceName { get; set; }
        public int CompanyID { get; set; }
        public Company? Company { get; set; }
        public string XCoordinate { get; set; } = string.Empty;
        public string YCoordinate { get; set; } = string.Empty;
    }
}
