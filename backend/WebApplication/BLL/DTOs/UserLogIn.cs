using System;
namespace BLL.DTOs
{
	public class UserLogIn
	{

		public string Email { get; set; } = string.Empty;
		public required string Password { get; set; } = string.Empty;
		public string PhoneNumber { get; set; } = string.Empty;

    }
}

