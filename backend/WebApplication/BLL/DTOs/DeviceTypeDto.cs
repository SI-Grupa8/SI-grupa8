using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.DTOs
{
    public class DeviceTypeDto
    {
        public int DeviceTypeID { get; set; }
        public required string DeviceTypeName { get; set; }
    }
}
