namespace BLL.Interfaces
{
	public interface IDeviceLocationService
	{
		string CreateDeviceToken(string macAddressName);
		Task SaveCurrentLocation(string lat, string lgi, string macAddress);  
	}
}

