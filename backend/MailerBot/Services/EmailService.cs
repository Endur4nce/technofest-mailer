using System.Net;
using System.Net.Mail;

namespace MailerBot.Services
{
    public class EmailService
    {
        private readonly string _smtpServer;
        private readonly int _port;
        private readonly string _from;
        private readonly string _password;

        public EmailService(string smtpServer, int port, string from, string password)
        {
            _smtpServer = smtpServer;
            _port = port;
            _from = from;
            _password = password;
        }

        public async Task SendMailAsync(IEnumerable<string> recipients, string subject, string body)
        {
            using var client = new SmtpClient(_smtpServer, _port)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(_from, _password)
            };

            foreach (var to in recipients)
            {
                using var msg = new MailMessage(_from, to)
                {
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = false
                };

                await client.SendMailAsync(msg);
            }
        }
    }
}
