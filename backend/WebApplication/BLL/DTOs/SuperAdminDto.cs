using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.DTOs
{
    public class SuperAdminDto
    {
        public required int SuperAdminId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public int AdminId { get; set;}
    }
}
