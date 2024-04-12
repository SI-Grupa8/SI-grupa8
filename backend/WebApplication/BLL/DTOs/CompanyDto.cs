using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.DTOs
{
    public class CompanyDto
    {
        public int CompanyID { get; set; }
        public string CompanyName { get; set; } = string.Empty;

        public List<UserDto>? Users { get; set; } = null;
    }
}
