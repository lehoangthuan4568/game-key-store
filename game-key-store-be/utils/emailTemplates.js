
const generateEmailTemplate = (title, message, code) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #111827; /* gray-900 */
            color: #e5e7eb; /* gray-200 */
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #1f2937; /* gray-800 */
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            margin-top: 40px;
            margin-bottom: 40px;
            border: 1px solid #374151; /* gray-700 */
        }
        .header {
            background: linear-gradient(to right, #06b6d4, #2563eb); /* cyan-500 to blue-600 */
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            color: #ffffff;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .content {
            padding: 40px 30px;
            text-align: center;
        }
        .message {
            font-size: 16px;
            color: #d1d5db; /* gray-300 */
            margin-bottom: 30px;
        }
        .code-box {
            background-color: #111827; /* gray-900 */
            border: 2px dashed #06b6d4; /* cyan-500 */
            border-radius: 12px;
            padding: 20px;
            margin: 20px 0;
            display: inline-block;
        }
        .code {
            font-family: 'Courier New', Courier, monospace;
            font-size: 32px;
            font-weight: bold;
            color: #22d3ee; /* cyan-400 */
            letter-spacing: 4px;
            margin: 0;
        }
        .footer {
            background-color: #111827; /* gray-900 */
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #9ca3af; /* gray-400 */
            border-top: 1px solid #374151; /* gray-700 */
        }
        .footer p {
            margin: 5px 0;
        }
        .highlight {
            color: #22d3ee; /* cyan-400 */
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>GameKey Store</h1>
        </div>
        <div class="content">
            <h2 style="color: #ffffff; margin-top: 0;">${title}</h2>
            <div class="message">
                ${message}
            </div>
            
            ${code ? `
            <div class="code-box">
                <p class="code">${code}</p>
            </div>
            <p style="font-size: 14px; color: #9ca3af;">Mã này sẽ hết hạn sau 10 phút.</p>
            ` : ''}
            
            <p style="margin-top: 30px; font-size: 14px; color: #9ca3af;">
                Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
            </p>
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} GameKey Store. All rights reserved.</p>
            <p>Đây là email tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = generateEmailTemplate;
