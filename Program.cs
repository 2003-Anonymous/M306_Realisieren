using System.Security.Authentication;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

var mongoConfig = builder.Configuration.GetSection("MongoDbSettings");

var mongoSettings = MongoClientSettings.FromConnectionString(mongoConfig["ConnectionString"]!);
mongoSettings.SslSettings = new SslSettings { EnabledSslProtocols = SslProtocols.Tls12, CheckCertificateRevocation = false };
var mongoClient = new MongoClient(mongoSettings);

builder.Services.AddDbContext<VehicleContext>(options =>
    options.UseMongoDB(mongoClient, mongoConfig["DatabaseName"]!));

builder.Services.AddControllers()
    .AddJsonOptions(o => o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));

var app = builder.Build();

// Seed initial data if collection is empty
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<VehicleContext>();
    if (!context.Vehicles.Any())
    {
        context.Vehicles.AddRange(
            new Vehicle { Name = "BMW M4", Category = "Auto", MaxSpeed = 250, Length = 4.79, LastService = new DateTime(2026, 2, 10), NextService = new DateTime(2026, 8, 10), Image = "" },
            new Vehicle { Name = "Audi RS6", Category = "Auto", MaxSpeed = 305, Length = 5.00, LastService = new DateTime(2025, 11, 20), NextService = new DateTime(2026, 5, 20), Image = "" },
            new Vehicle { Name = "Yamaha R1", Category = "Motorrad", MaxSpeed = 299, Length = 2.05, LastService = new DateTime(2026, 1, 15), NextService = new DateTime(2026, 7, 15), Image = "" },
            new Vehicle { Name = "Ducati Panigale V4", Category = "Motorrad", MaxSpeed = 300, Length = 2.08, LastService = new DateTime(2025, 12, 5), NextService = new DateTime(2026, 6, 5), Image = "" },
            new Vehicle { Name = "Boeing 747", Category = "Flugzeug", MaxSpeed = 988, Length = 70.66, LastService = new DateTime(2026, 3, 1), NextService = new DateTime(2026, 9, 1), Image = "" },
            new Vehicle { Name = "Airbus A320", Category = "Flugzeug", MaxSpeed = 871, Length = 37.57, LastService = new DateTime(2026, 2, 18), NextService = new DateTime(2026, 8, 18), Image = "" },
            new Vehicle { Name = "Titanic II", Category = "Schiff", MaxSpeed = 43, Length = 269.00, LastService = new DateTime(2026, 1, 10), NextService = new DateTime(2026, 7, 10), Image = "" },
            new Vehicle { Name = "Queen Mary 2", Category = "Schiff", MaxSpeed = 56, Length = 345.03, LastService = new DateTime(2025, 10, 22), NextService = new DateTime(2026, 4, 22), Image = "" }
        );
        context.SaveChanges();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
