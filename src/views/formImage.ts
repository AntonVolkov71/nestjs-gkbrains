export const formImageTemplate = (): string => {
  let html = '<form method="post" enctype="multipart/form-data';
  html += `
            action="localhost:3333/news/upload">
            <input type="file" name="file"/><br>
            <input type=submit value="Отправить">
            `;

  html += '</form>';
  return html;
};
