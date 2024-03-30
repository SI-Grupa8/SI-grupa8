using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class Company
    {
        public int CompanyID { get; set; }
        public required string CompanyName { get; set; } 
        public required int AdminID { get; set; } 
    }
}
