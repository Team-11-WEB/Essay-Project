function button(){
  var email=document.getElementById('email').value;
  var pw=document.getElementById('pw').value;
  var name=document.getElementById('name').value;

  var s = document.getElementById("classId");
  var classId = s.options[s.selectedIndex].value;




  // console.log(email,pw,name,classId);


  var status = sendAjax_button('http://localhost:6011/auth/register',email,pw,classId,name);

  if(status == 200){
    alert('회원가입이 완료되었습니다.');
    location.href="/users";
  }
  else{
    alert('오류가 발생했습니다. 다시 등록해주세요.');
  }

  document.getElementById('email').value='';
  document.getElementById('name').value='';
  document.getElementById('pw').value='';
  document.getElementById('classId').value='';

  // return status;
}

function sendAjax_button(url,email,pw,classId,name){
  var status=-1;
  $.ajax({
    type:"POST",
    url : url,
    data : {
      'email' : email,
      'password' : pw,
      'classId': classId,
      'name':name
    },
    async: false,
    success : (result)=>{
      console.log(result);
      status = 200;
    }
  })
  return status;
}
