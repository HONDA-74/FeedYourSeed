export function generateHTML(status, message, subMessage) {
  const color = status === 'success' ? '#2e7d32' : '#d32f2f';

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Email Verification</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f0fdf4;
        font-family: Arial, sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        text-align: center;
      }
      img {
        width: 300px;
        height: 300px;
        border-radius: 1rem;
        object-fit: cover;
        margin-bottom: 1.5rem;
      }
      .message {
        font-size: 1.8rem;
        font-weight: bold;
        color: ${color};
      }
      .sub-message {
        font-size: 1rem;
        color: #555;
        margin-top: 0.5rem;
        margin-bottom: 1.5rem;
      }
      .login-button {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        color: white;
        background-color: ${color};
        border: none;
        border-radius: 5px;
        text-decoration: none;
        transition: background-color 0.3s ease;
      }
      .login-button:hover {
        background-color: ${status === 'success' ? '#27642a' : '#b52a2a'};
      }
    </style>
  </head>
  <body>
    <img src="http://localhost:3000/istockphoto-1139085470-612x612-removebg-preview.png" alt="Email Verification" />
    <div class="message">${message}</div>
    <div class="sub-message">${subMessage}</div>
    <a href="http://localhost:3001/login" class="login-button">Go to Login</a>
  </body>
  </html>
  `;
}
