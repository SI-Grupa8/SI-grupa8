using BLL.DTOs;

namespace BLL.Interfaces
{
	public interface IDeviceLocationService
	{
		string CreateDeviceToken(string macAddressName);
		Task SaveCurrentLocation(string lat, string lgi, string macAddress);
		List<LocationStorageDto> GetDeviceLocationsFilter(List<int> deviceIds, DateTime startTime, DateTime endTime);

    }
}

