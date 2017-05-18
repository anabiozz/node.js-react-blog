
const 

function renderPage(appHtml) {
  return `<!DOCTYPE html>
    <html>
    <head>
      <!-- Latest compiled and minified CSS -->
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
      <!-- Optional theme -->
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap-theme.min.css">
      <link rel="stylesheet" href="${process.env.CORE_URL}css/style.css">
      <link rel="icon" href="${process.env.CORE_URL}favicon.ico" type="image/x-icon" />
      <title>POLYCOM AQUA</title>
    </head>
    <body>
    <div id="app">${appHtml}</div>
    <script src="${process.env.CORE_URL}dist/bundle.js"></script>
    </body>
    </html>`
}
