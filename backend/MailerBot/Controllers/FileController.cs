using Microsoft.AspNetCore.Mvc;
using ClosedXML.Excel;
using MailerBot.Models;

namespace MailerBot.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileController : ControllerBase
    {
        [HttpGet("ping")]
        public IActionResult Ping() => Ok(new { message = "ok", time = DateTime.Now });

        [HttpPost("upload")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(10_000_000)]
        public async Task<IActionResult> UploadExcel([FromForm] UploadForm form)
        {
            if (form.file == null || form.file.Length == 0)
                return BadRequest("Файл не загружен");

            if (!Path.GetExtension(form.file.FileName).Equals(".xlsx", StringComparison.OrdinalIgnoreCase))
                return BadRequest("Поддерживаются только .xlsx");

            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            Directory.CreateDirectory(uploadsDir);

            var filePath = Path.Combine(uploadsDir, form.file.FileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
                await form.file.CopyToAsync(stream);

            var sheets = new List<string>();
            using (var wb = new XLWorkbook(filePath))
                foreach (var ws in wb.Worksheets) sheets.Add(ws.Name);

            return Ok(new { message = "Файл успешно загружен", file = form.file.FileName, sheets });
        }
    }
}
