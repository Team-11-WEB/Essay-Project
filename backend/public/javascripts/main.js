window.onload = () =>{
  document.getElementsByClassName('page_icon')[0].style.backgroundColor="rgba(107,142,35,0.4)";
  me();
  classstories_open();
  book_open();
}

$(()=>{
  $(".main_1").on('mousewheel DOMMouseScroll',(e)=>{
    var E = e.originalEvent;
    delta = 0;
    if (E.detail) {
        delta = E.detail * -40;
    }else{
      delta = E.wheelDelta;
    };
    if(delta < 0){
      $('.main_1').slideUp(1200);
      $('.main_1_all').slideUp(1200);
      $('.main_2').css('bottom','0');
      $('.main_2').slideDown(1200);
      $('.main_2_all').slideDown(1200);
      $('.main_3').css('display','none');
      $('.scroll_box').slideUp(1000);
      setTimeout(()=>{
        document.getElementsByClassName('page_icon')[0].style.backgroundColor="";
        document.getElementsByClassName('page_icon')[1].style.backgroundColor="rgba(107,142,35,0.4)";
        document.getElementsByClassName('page_icon')[2].style.backgroundColor="";
      },500);
    }
  });
});

$(()=>{
  $(".main_2").on('mousewheel DOMMouseScroll',(e)=>{
    var E = e.originalEvent;
    delta = 0;
    if (E.detail) {
        delta = E.detail * -40;
    }else{
      delta = E.wheelDelta;
    };
    if(delta < 0){
      $('.main_1').css('display','none');
      $('.main_2').css('bottom','');
      $('.main_2').slideUp(1200);
      $('.main_2_all').slideUp(1200);
      $('.main_3').css('bottom','0');
      $('.main_3').slideDown(1200);
      $('.main_3_all').slideDown(1200);
      setTimeout(()=>{
        document.getElementsByClassName('page_icon')[0].style.backgroundColor="";
        document.getElementsByClassName('page_icon')[1].style.backgroundColor="";
        document.getElementsByClassName('page_icon')[2].style.backgroundColor="rgba(107,142,35,0.4)";
      },500);
    }
    else{
      $('.main_3').css('display','none');
      $('.main_2').css('bottom','0');
      $('.main_2').slideUp(1200);
      $('.main_2_all').slideUp(1200);
      $('.main_1').css('top','');
      $('.main_1').slideDown(1200);
      $('.main_1_all').slideDown(1200);
      $('.scroll_box').slideDown(1200);
      setTimeout(()=>{
        document.getElementsByClassName('page_icon')[2].style.backgroundColor="";
        document.getElementsByClassName('page_icon')[1].style.backgroundColor="";
        document.getElementsByClassName('page_icon')[0].style.backgroundColor="rgba(107,142,35,0.4)";
      },500);
    }
  });
});

$(()=>{
  $(".main_3").on('mousewheel DOMMouseScroll',(e)=>{
    var E = e.originalEvent;
    delta = 0;
    if (E.detail) {
        delta = E.detail * -40;
    }else{
      delta = E.wheelDelta;
    };
    if(delta > 0){
      $('.main_1').css('display','none');
      $('.main_3').css('bottom','0');
      $('.main_3').slideUp(1200);
      $('.main_3_all').slideUp(1200);
      $('.main_2').css('top','');
      $('.main_2').slideDown(1200);
      $('.main_2_all').slideDown(1200);
      setTimeout(()=>{
        document.getElementsByClassName('page_icon')[2].style.backgroundColor="";
        document.getElementsByClassName('page_icon')[1].style.backgroundColor="rgba(107,142,35,0.4)";
      },500);
    }
  });
});

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

const new_open = () =>{
  $('.new_background').css('display','block');
}
const new_cancel = () =>{
  $('.new_background').css('display','none');
}


//////////////////

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


var classstoriesArray = new Array();

function classstories_open(){

  classstories_search();

  var content_area = document.getElementsByClassName('sub_middle_2')[0];

  var length = classstoriesArray.length;

  if(length != 0){

    var final ="";

    for (var i=length-1; i>=0; i--){

      var month = classstoriesArray[i].classDate.substring(5,7);
      var date = classstoriesArray[i].classDate.substring(8,10);

      content =`
        <div class="main_2_box">
          <div class="main_2_box_content">

            <img id="main_2_box_img" src="${classstoriesArray[i].classImg}">
            <div id="main_2_box_img_sub">
              <div class="main_2_box_title">${classstoriesArray[i].title}</div>
              <div class="main_2_box_con">${classstoriesArray[i].content}</div>
            </div>
            <div class="main_2_box_date">${month}/${date}</div>

          </div>
        </div>
      `
      final = final+content;
    }

    content_area.innerHTML=final;

  }
}

function classstories_search(){
  let status = sendAjax_classstories_search('http://localhost:6011/classstories');
}

function sendAjax_classstories_search(url){

  let status=-1;

  $.ajax({
    type:"GET",
    url : url,
    async: false,
    success : (result)=>{
      classstoriesArray=result;
      status = 200;
    }
  })
  return status;

}



var bookArray = new Array();

function book_open(){

  book_search();

  console.log(bookArray);

  var content_area = document.getElementsByClassName('sub_all_3')[0];

  content_area.innerHTML=`
    <div class="sub_left_3">

      <div class="main_3_img_box">

        <img id="main_3_box_img" src="${bookArray[0].image}">

      </div>

      <div class="main_3_content_box">
        <div class="main_3_book_title">${bookArray[0].title}</div>
        <div class="main_3_book_author">${bookArray[0].author}</div>
        <div class="main_3_book_desc">${bookArray[0].description}</div>
      </div>

    </div>

    <div class="sub_right_3">

      <div class="main_3_img_box">

        <img id="main_3_box_img" src="${bookArray[1].image}">

      </div>

      <div class="main_3_content_box">
        <div class="main_3_book_title">${bookArray[1].title}</div>
        <div class="main_3_book_author">${bookArray[1].author}</div>
        <div class="main_3_book_desc">${bookArray[1].description}</div>
      </div>

    </div>

  </div>
  `

}

function book_search(){
  let status = sendAjax_book_search('http://localhost:6011/books');
}

function sendAjax_book_search(url){

  let status=-1;

  $.ajax({
    type:"GET",
    url : url,
    async: false,
    success : (result)=>{
      bookArray=result;
      status = 200;
    }
  })
  return status;

}

function new_submit(){

  var phone = document.getElementById('new_phone').value;
  var age = document.getElementById('new_age').value;
  var content = document.getElementById('new_content').value;

  let status = sendAjax_new_submit('http://localhost:6011/news',phone,age,content);

  if(status == 200){
    alert('상담/가입신청이 완료되었습니다');
    location.reload();
  }
  else {
    alert('상담/가입신청에 실패하였습니다');
  }

}
function sendAjax_new_submit(url,phone,age,content){
  let status=-1;
  $.ajax({
    type:"POST",
    url : url,
    data :{
      "phoneNum": phone,
      "age": age,
      "content": content
    },
    async: false,
    success : (result)=>{
      status = 200;
    }
  })

  return status;
}
