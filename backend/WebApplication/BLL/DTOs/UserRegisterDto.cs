using System;
namespace BLL.DTOs
{
	public class UserRegisterDto
	{
		public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;
		public required string Password { get; set; }
		public string PhoneNumber { get; set; } = string.Empty;

    }
}

