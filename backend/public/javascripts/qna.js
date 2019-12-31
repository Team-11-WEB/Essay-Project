function button(){
  var email=document.getElementById('qna_email').value;
  var title=document.getElementById('qna_title').value;
  var content=document.getElementById('qna_content').value;

  // console.log(email,title,content);
  var status = sendAjax_button('http://localhost:6011/qnas',email,title,content);

  if(status == 200){
    alert('질문작성이 완료되었습니다.');
  }
  else{
    alert('오류가 발생했습니다. 다시 등록해주세요.');
  }

  document.getElementById('qna_email').value='';
  document.getElementById('qna_title').value='';
  document.getElementById('qna_content').value='';
  // return status;
}

function sendAjax_button(url,email,title,content){
  var status=-1;
  $.ajax({
    type:"POST",
    url : url,
    data : {
      'email' : email,
      'title' : title,
      'content': content
    },
    async: false,
    success : (result)=>{
      console.log(result);
      status = 200;
    }
  })
  return status;
}
