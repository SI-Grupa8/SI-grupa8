using System;
namespace BLL.DTOs
{
	public class RefreshTokenDto
	{
        public string Token { get; set; }
        public DateTime Created { get; set; }
        public DateTime Expires { get; set; }
    }
}

