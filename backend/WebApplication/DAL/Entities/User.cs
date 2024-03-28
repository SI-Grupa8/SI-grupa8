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

		public Role Role { get; set; }

        [StringLength(30)] public string TwoFactorKey { get; set; } = string.Empty;

        public bool TwoFactorEnabled { get; set; } = false;

    }
}

