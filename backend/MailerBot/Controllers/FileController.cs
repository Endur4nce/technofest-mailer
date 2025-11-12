using Microsoft.AspNetCore.Mvc;
using ClosedXML.Excel;
using MailerBot.Models;
using MailerBot.Services;

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

        [HttpPost("emails")]
        public IActionResult GetEmails([FromBody] SheetRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.FileName) || string.IsNullOrWhiteSpace(request.SheetName))
                return BadRequest("Не указаны имя файла или лист.");

            var uploadsDir = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            var filePath = Path.Combine(uploadsDir, request.FileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound("Файл не найден.");

            var emails = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            using (var workbook = new XLWorkbook(filePath))
            {
                var sheet = workbook.Worksheet(request.SheetName);
                if (sheet == null)
                    return NotFound("Указанный лист не найден.");

                // Попробуем найти колонку "Почта" в первой или второй строке
                int emailColumnIndex = -1;
                for (int headerRow = 1; headerRow <= 2; headerRow++)
                {
                    foreach (var cell in sheet.Row(headerRow).CellsUsed())
                    {
                        if (cell.GetString().Trim().Equals("Почта", StringComparison.OrdinalIgnoreCase))
                        {
                            emailColumnIndex = cell.Address.ColumnNumber;
                            break;
                        }
                    }
                    if (emailColumnIndex != -1) break;
                }

                if (emailColumnIndex == -1)
                    return NotFound("Колонка 'Почта' не найдена.");

                // Собираем все значения под заголовком
                var lastRow = sheet.LastRowUsed().RowNumber();
                for (int row = 3; row <= lastRow; row++)
                {
                    var cell = sheet.Cell(row, emailColumnIndex);
                    var email = cell.GetString().Trim();
                    if (!string.IsNullOrEmpty(email))
                        emails.Add(email);
                }
            }

            return Ok(emails);
        }

        public class SheetRequest
        {
            public string FileName { get; set; }
            public string SheetName { get; set; }
        }
    }
}
