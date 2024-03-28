using System;
namespace BLL.DTOs
{
	public class RefreshTokenDto
	{
        public string RefreshToken { get; set; }
        public DateTime TokenCreated { get; set; }
        public DateTime TokenExpires { get; set; }
    }
}

