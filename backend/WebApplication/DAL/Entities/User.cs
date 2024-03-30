using System;
using System.ComponentModel.DataAnnotations;
namespace DAL.Entities
{
	public class User
	{
		public int UserID { get; set; }
		public string Email { get; set; } = string.Empty;
		public string PhoneNumber { get; set; } = string.Empty;
		public string Name { get; set; } = string.Empty;
		public string Surname { get; set; } = string.Empty;
		public byte[] PasswordHash { get; set; }
		public byte[] PasswordSalt { get; set; }
		public int RoleID { get; set; }
        [StringLength(30)] public string TwoFactorKey { get; set; } = string.Empty;
        public bool TwoFactorEnabled { get; set; } = false;
        public string RefreshToken { get; set; } = string.Empty;
        public DateTime TokenCreated { get; set; }
        public DateTime TokenExpires { get; set; }
        public Role Role { get; set; }
		public int CompanyID { get; set; }
		public Company Company { get; set; }

    }
}

