using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL.Entities
{
    public class LocationStorage
    {
        [Key]
        public int LocationStorageID { get; set; }

        [Required]
        public int DeviceID { get; set; }

        [ForeignKey("DeviceID")]
        public Device Device { get; set; }
        public DateTime Timestamp { get; set; }
        public string XCoordinate { get; set; }
        public string YCoordinate { get; set; }
    }
}
