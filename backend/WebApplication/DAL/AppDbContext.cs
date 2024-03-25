using System;
using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL
{
	public class AppDbContext : DbContext
	{
		/*public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
		{
		}*/

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("host=localhost;database=Vehicletrackingsystem;username=postgres;password=volimbaze");
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
    }
}

