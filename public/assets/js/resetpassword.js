$("#resetPasswordForm").on('submit', (e) => {
  e.preventDefault()
  $("#reset").attr('disabled', true).append("<i class=\"fa fa-spinner fa-spin loading\"></i>");
  let current = $("#current_password").val().trim()
  let confirm_password = $("#confirm_password").val().trim()
  let password = $("#password").val().trim()

  if (password !== confirm_password) {
    $("#formError").text('Password does not match with confirm password').css('color', 'red')
    $("#reset").attr('disabled', false)
    $(".loading").remove();
    return
  }
  fetch('/auth/reset_password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({current, password})
  }).then(r => {
    if (r.status === 404 || r.status === 200) {
      return r.json()
    }
  }).then(function (data) {
    if (data.type === 'error') {
      throw new Error(data.message)
    } else {
      $("#formError").text('Password updated successfully, you will redirected to home page').css('color', 'green')
      setTimeout((window.location.href = '/auth/logout'), 5000 * 6)
    }
  }).catch(e => {
    $("#formError").text(e.message).css('color', 'red')
    $("#reset").attr('disabled', false)
    $(".loading").remove();
  })
})