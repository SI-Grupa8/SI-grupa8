using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Utilities
{
    public class DeviceFilter
    {
        public List<int>? DeviceTypeIds { get; set; }
        public List<int>? DeviceIds { get; set; }
    }
}
