using System;
using BLL.DTOs;

namespace API.Helpers
{
	public class LocationFilterRequest
	{
		public required DateTimes deviceTimes { get; set; }
		public required List<int> deviceIds { get; set; }
	}
}

