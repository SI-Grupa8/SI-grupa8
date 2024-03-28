using System;
namespace BLL.DTOs
{
	public class UserRegisterDto
	{
		public string Email { get; set; } = string.Empty;
		public required string Password { get; set; }
		public string PhoneNumber { get; set; } = string.Empty;

		public string TwoFactorCode { get; set; } = string.Empty;
    }
}

