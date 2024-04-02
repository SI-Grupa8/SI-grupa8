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


		public static int GetUserIDFromClaims(string token)
		{
			var claims = GetClaimsFromToken(token);
			var id = int.Parse(claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)!.Value);

			return id;
		}
	}
}

