window.onload = () =>{
  me();
}
const login_open = () =>{
  $('.login_background').css('display','block');
  $('.login_box').animate({left: '70%'}, 500,"swing");
}
const login_close = () =>{
  $('.login_box').animate({left: '100%'}, 500,"swing");
  setTimeout(()=>{
    $('.login_background').css('display','none');
  },450);
}
function login(){

  var email=document.getElementById('email').value;
  var pw=document.getElementById('pw').value;
  var status = sendAjax_login('http://localhost:6011/auth/login',email,pw);

  if(status == 200){
    location.reload();
  }
  else{
    alert('아이디 혹은 비밀번호를 다시 확인해주세요.');
  }

  document.getElementById('email').value='';
  document.getElementById('pw').value='';
  // return status;
}

function sendAjax_login(url,email,pw){
  var status=-1;
  $.ajax({
    type:"POST",
    url : url,
    data : {
      'email' : email,
      'password' : pw
    },
    async: false,
    success : (result)=>{
      status = 200;
    }
  })
  return status;
}

function logout(){

  var status = sendAjax_logout('http://localhost:6011/auth/logout');

  if(status == 200){
    location.reload();
  }
}

function sendAjax_logout(url){
  var status=-1;
  $.ajax({
    type:"GET",
    url : url,
    async: false,
    success : (result)=>{
      status = 200;
    }
  })
  return status;
}

function me(){
  var inputbox = document.getElementsByClassName('login_area')[0];
  var status = sendAjax_me('http://localhost:6011/users/me');

  if(status == 200){
    inputbox.innerHTML=`
    <a id="login_icon" href="javascript:void(0);onclick=logout()">
      <div class="login_icon">로그아웃</div>
    </a>
    `;
  }
  else if(status == 202){
    inputbox.innerHTML=`
    <a id="login_icon" href="/admin">
      <div class="login_icon">관리자페이지</div>
    </a>&nbsp;
    <a id="login_icon" href="javascript:void(0);onclick=logout()">
      <div class="login_icon">로그아웃</div>
    </a>
    `;
  }
  else{
    inputbox.innerHTML=`
    <a id="login_icon" href="javascript:void(0);onclick=login_open()">
      <div class="login_icon">로그인</div>
    </a>
    `;
  }
}
function sendAjax_me(url){
  var status=-1;
  $.ajax({
    type:"GET",
    url : url,
    async: false,
    success : (result)=>{
      if(result.name == 'admin'){
        status = 202;
      }
      else{
        status = 200;
      }
    }
  })
  return status;
}
