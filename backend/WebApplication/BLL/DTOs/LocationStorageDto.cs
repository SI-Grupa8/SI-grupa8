using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.DTOs
{
    public class LocationStorageDto
    {
        public int LocationStorageID { get; set; }

        public int DeviceID { get; set; }

        //public DeviceDto? Device { get; set; }

        public string XCoordinate { get; set; } = string.Empty;

        public string YCoordinate { get; set; } = string.Empty;

        public DateTime Timestamp { get; set; }
    }
}
