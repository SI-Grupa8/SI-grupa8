using BLL.Interfaces;
using BLL.Mapper;
using BLL.Services;
using DAL;
using DAL.Interfaces;
using DAL.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Net.Http.Headers;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

var builder = WebApplication.CreateBuilder(args);



// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();


//Services
builder.Services.AddScoped(typeof(IUserService), typeof(UserService));
builder.Services.AddScoped(typeof(IRoleService), typeof(RoleService));
builder.Services.AddScoped(typeof(ICompanyService), typeof(CompanyService));
builder.Services.AddScoped(typeof(IDeviceService), typeof(DeviceService));
builder.Services.AddScoped(typeof(IDeviceLocationService), typeof(DeviceLocationService));
builder.Services.AddScoped(typeof(IDeviceTypeService), typeof(DeviceTypeService));
builder.Services.AddScoped(typeof(ILocationStorageService), typeof(LocationStorageService));
builder.Services.AddSingleton<IHostedService, LocationCleanupService>();

//Repositories
builder.Services.AddScoped(typeof(IUserRepository), typeof(UserRepository));
builder.Services.AddScoped(typeof(IRoleRepository), typeof(RoleRepository));
builder.Services.AddScoped(typeof(ICompanyRepository), typeof(CompanyRepository));
builder.Services.AddScoped(typeof(IDeviceRepository), typeof(DeviceRepository));
builder.Services.AddScoped(typeof(IDeviceLocationService), typeof(DeviceLocationService));
builder.Services.AddScoped(typeof(IDeviceTypeRepository), typeof(DeviceTypeRepository));
builder.Services.AddScoped(typeof(ILocationStorageRepository), typeof(LocationStorageRepository));


//Db context
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("ConnectionDatabase"));
});
builder.Services.AddAutoMapper(typeof(MapperProfile));


builder.Services.AddSwaggerGen(options=>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    options.OperationFilter<SecurityRequirementsOperationFilter>();
});



builder.Services.AddAuthentication(options =>
    {
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.IncludeErrorDetails = true;
        var token = builder.Configuration.GetSection("AppSettings:Token").Value!;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            ValidateAudience = false,
            ValidateIssuer = false,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                builder.Configuration.GetSection("AppSettings:Token").Value!))

        };
    })
    .AddJwtBearer("DeviceJwtScheme", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("AppSettings:DeviceToken").Value!))
        };
    })
    .AddPolicyScheme("MultiAuthSchemes", JwtBearerDefaults.AuthenticationScheme, options =>
    {
        options.ForwardDefaultSelector = context =>
        {
            string authorization = context.Request.Headers[HeaderNames.Authorization]!;
            var token = authorization.Substring("Bearer ".Length).Trim();
            var jwtHandler = new JwtSecurityTokenHandler();
            return (jwtHandler.CanReadToken(token))
                ? JwtBearerDefaults.AuthenticationScheme : "SecondJwtScheme";

        };
    });




var app = builder.Build();

app.UseCors(options =>
{
    options.AllowAnyOrigin();
    options.AllowAnyHeader();
    options.AllowAnyMethod();
});

// Configure the HTTP request pipeline.

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();

