﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class Device
    {
        public int DeviceID { get; set; }
        public required string Reference { get; set; }
        public required string DeviceName { get; set; }
        public int? UserID { get; set; }
        public User? User { get; set; }
        public string XCoordinate { get; set; } = string.Empty;
        public string YCoordinate { get; set; } = string.Empty;
        public string BrandName { get; set; } = string.Empty;
        public int? DeviceTypeID { get; set; }
        public DeviceType? DeviceType { get; set; }

    }
}
