using System;
using System.Threading;
using System.Threading.Tasks;
using BLL.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace BLL.Services
{
    public class LocationCleanupService : Microsoft.Extensions.Hosting.IHostedService, IDisposable
    {
        private readonly ILogger<LocationCleanupService> _logger;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private Timer _timer;

        public LocationCleanupService(ILogger<LocationCleanupService> logger, IServiceScopeFactory serviceScopeFactory)
        {
            _logger = logger;
            _serviceScopeFactory = serviceScopeFactory;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Location cleanup service started.");

            ScheduleCleanup();

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("Location cleanup service stopped.");

            _timer?.Change(Timeout.Infinite, 0);

            return Task.CompletedTask;
        }

        private void ScheduleCleanup()
        {
            var now = DateTime.Now;
            var nextRunTime = new DateTime(now.Year, now.Month, now.Day, 9, 0, 0);
            if (now > nextRunTime)
            {
                nextRunTime = nextRunTime.AddDays(1);
            }

            var dueTime = nextRunTime - now;

            _timer = new Timer(async (_) =>
            {
                try
                {
                    await CleanupOldLocations();
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "An error occurred while cleaning up old locations.");
                }
            }, null, dueTime, TimeSpan.FromHours(24));
        }

        private async Task CleanupOldLocations()
        {
            using (var scope = _serviceScopeFactory.CreateScope())
            {
                var locationStorageService = scope.ServiceProvider.GetRequiredService<ILocationStorageService>();
                var twentyFourHoursAgo = DateTime.UtcNow.AddHours(-24);
                await locationStorageService.DeleteOldRecords(twentyFourHoursAgo);
            }
        }
        public void Dispose()
        {
            _timer?.Dispose();
        }
    }
}
