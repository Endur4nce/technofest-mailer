using MailerBot.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System.Net;
using System.Net.Mail;

var builder = WebApplication.CreateBuilder(args);

// Добавляем контроллеры (это нужно для FileController)
builder.Services.AddControllers();

// Swagger (удобная документация)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MailerBot API",
        Version = "v1"
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

// Сюда нужно вставить почту и app password от почты.
builder.Services.AddSingleton(new EmailService(
    smtpServer: "smtp.gmail.com",
    port: 587,
    from: "mail",
    password: "app pass"
));

var app = builder.Build();

app.UseCors("AllowAll");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthorization();

// Подключаем маршруты контроллеров
app.MapControllers();

app.Run();
