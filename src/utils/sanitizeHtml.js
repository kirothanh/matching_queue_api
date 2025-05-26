const sanitizeHtml = require("sanitize-html");

module.exports = {
  sanitizeHtml: (contentHTML) => {
    const cleanHTML = sanitizeHtml(contentHTML, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure']),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ['src', 'width', 'height', 'alt', 'style'],
        figure: ['class'],
        '*': ['style'], // Nếu bạn cho phép dùng inline style
      },
      allowedSchemes: ['http', 'https', 'data'],
      allowedSchemesByTag: {
        img: ['http', 'https'],
      },
    });

    console.log('hih: ', cleanHTML)

    return cleanHTML
  }
}