using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.DTOs
{
    public class SuperAdminDto
    {
        public required string superAdminEmail { get; set; }
        public string CompanyName { get; set; } = string.Empty;
    }
}
