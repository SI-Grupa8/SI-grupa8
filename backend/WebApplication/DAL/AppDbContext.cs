using System;
using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL
{
	public class AppDbContext : DbContext
	{
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
    }
}

