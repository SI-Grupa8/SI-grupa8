using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.JWTHelpers
{
	public static class JWTHelper
	{
		public static List<Claim> GetClaimsFromToken(string token)
		{
            var handler = new JwtSecurityTokenHandler();
            var jsonToken = handler.ReadToken(token) as JwtSecurityToken;

            return jsonToken!.Claims.ToList();
        }
	}
}

