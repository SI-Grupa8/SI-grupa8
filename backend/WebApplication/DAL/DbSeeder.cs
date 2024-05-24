using System;
using DAL.Entities;
using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace DAL
{
	public class DbSeeder
	{
        private readonly ModelBuilder _modelBuilder;



        public DbSeeder(ModelBuilder modelBuilder)
        {
            _modelBuilder = modelBuilder;
        }

        public void Seed()
        {
            AddRoles(_modelBuilder);
            AddDeviceType(_modelBuilder);
            AddSuperAdmin(_modelBuilder);
        }


        private static void AddRoles(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Role>().HasData(new Role
            {
                RoleID = 1,
                RoleName = "Admin"
            });

            modelBuilder.Entity<Role>().HasData(new Role
            {
                RoleID = 2,
                RoleName = "SuperAdmin"
            });

            modelBuilder.Entity<Role>().HasData(new Role
            {
                RoleID = 3,
                RoleName = "Dispatcher"
            });

            modelBuilder.Entity<Role>().HasData(new Role
            {
                RoleID = 4,
                RoleName = "FleetManager"
            });

            modelBuilder.Entity<Role>().HasData(new Role
            {
                RoleID = 5,
                RoleName = "User"
            });

        }

        private static void AddDeviceType(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DeviceType>().HasData(new DeviceType
            {
                DeviceTypeID = 1,
                DeviceTypeName = "Mobile"
            });

            modelBuilder.Entity<DeviceType>().HasData(new DeviceType
            {
                DeviceTypeID = 2,
                DeviceTypeName = "GPS"
            });

            modelBuilder.Entity<DeviceType>().HasData(new DeviceType
            {
                DeviceTypeID = 3,
                DeviceTypeName = "Car"
            });
        }

        private static void AddSuperAdmin(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(new User
            {
                UserID = 1,
                Email = "superAdmin@gmail.com",
                PhoneNumber = "061123456",
                Name = "Vin",
                Surname = "Diesel",
                PasswordHash = Encoding.UTF8.GetBytes(BCrypt.Net.BCrypt.HashPassword("12345678")),
                PasswordSalt = [],
                RoleID = 2
            });
        }
	}
}

