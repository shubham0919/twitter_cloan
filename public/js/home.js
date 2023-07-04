$(document).ready(() => {
    $.get('/api/post',result => {
        outputPost(result,$('.postcontainer'));
    })

})



function outputPost(result, container) {
    container.html('')

    if (!Array.isArray(result)) {
        result = [result]
      }

    result.forEach(result => {
        let html = createPostHtml(result)
        container.append(html)
    });

    if (result.length == 0) {
        container.append('<span>Nopthing to show</span>')
    }
}

