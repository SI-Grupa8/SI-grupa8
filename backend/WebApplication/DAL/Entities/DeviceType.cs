using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class DeviceType
    {
        public int DeviceTypeID { get; set; }
        public required string DeviceTypeName { get; set; }
    }
}
