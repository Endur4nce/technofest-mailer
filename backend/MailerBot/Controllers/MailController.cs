using MailerBot.Services;
using Microsoft.AspNetCore.Mvc;

namespace MailerBot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MailController : ControllerBase
    {
        [HttpPost("send")]
        public async Task<IActionResult> SendEmails(
            [FromServices] EmailService emailService,
            [FromBody] SendMailRequest request)
        {
            if (request.Recipients == null || request.Recipients.Count == 0)
                return BadRequest("Нет получателей.");
            if (string.IsNullOrWhiteSpace(request.Message))
                return BadRequest("Пустое сообщение.");

            await emailService.SendMailAsync(request.Recipients, "Сообщение от Технофеста", request.Message);

            return Ok(new { status = "OK", sent = request.Recipients.Count });
        }

        public class SendMailRequest
        {
            public List<string> Recipients { get; set; } = [];
            public string Message { get; set; } = string.Empty;
        }
    }
}