using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.DTOs
{
    public class CompanyDto
    {
        public required string CompanyName { get; set; }
        public required int AdminID { get; set; }
    }
}
