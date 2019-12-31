function all_back_button(){
  location.reload();
}

function page_1_open(){
  document.getElementsByClassName('page_0')[0].style.display='none';
  document.getElementsByClassName('page_1')[0].style.display='block';
}
function page_1_submit(){

  var formData = new FormData();

  formData.append("attachImg",document.getElementById('page_1_attachImg').files[0]);
  formData.append("title",document.getElementById('page_1_title').value);
  formData.append("content",document.getElementById('page_1_content').value);
  formData.append("classDate",document.getElementById('page_1_classDate').value);




  let status = sendAjax_page_1_submit('http://localhost:6011/classstories',formData);

  if(status == 200){
    alert('성공!');
    location.reload();
  }
  else {
    alert('실패!');
  }

}
function sendAjax_page_1_submit(url,formData){
  let status=-1;
  $.ajax({
    type:"POST",
    contentType: false,
    processData: false,
    url : url,
    data :formData,
    async: false,
    success : (result)=>{
      console.log(result);
      status = 200;
    }
  })

  return status;
}

var attachsArray = new Array();

function page_2_open(){



  document.getElementsByClassName('page_0')[0].style.display='none';
  document.getElementsByClassName('page_2')[0].style.display='block';
  var select_box = document.getElementById('page_2_attach_list');

  attaches_search();

  var length = attachsArray.length;

  if(length != 0){

    var final =`<option value="">수업자료를 선택해주세요</option>`;

    for (var i=length-1; i>=0; i--){
      content =`
        <option value=${attachsArray[i].id}>${attachsArray[i].title}</option>
      `
      final = final+content;
    }
    select_box.innerHTML=final;
  }
  else{
    select_box.innerHTML=`<option value="">아직 등록된 수업자료가 없습니다</option>`;
  }
}

function page_2_submit(){

  var title = document.getElementById('page_2_title').value;
  var content = document.getElementById('page_2_content').value;
  var location = document.getElementById('page_2_location').value;

  var s = document.getElementById("page_2_classId");
  var classId = s.options[s.selectedIndex].value;

  var classDate = document.getElementById('page_2_classDate').value;

  var a = document.getElementById("page_2_attach_list");
  var attachId = a.options[a.selectedIndex].value;

  console.log(classId);
  console.log(attachId);


  let status = sendAjax_page_2_submit('http://localhost:6011/schedules',title,content,location,classId,classDate,attachId);

  if(status == 200){
    alert('수업일정 등록이 완료되었습니다');
    location.reload();
  }
  else {
    alert('수업일정 등록에 실패하였습니다');
  }

}
function sendAjax_page_2_submit(url,title,content,location,classId,classDate,attachId){
  let status=-1;
  $.ajax({
    type:"POST",
    url : url,
    data :{
      "title": title,
      "content": content,
      "location": location,
      "classId": classId,
      "classDate": classDate,
      "attachId": attachId
    },
    async: false,
    success : (result)=>{
      status = 200;
    }
  })

  return status;
}

function attaches_search(){
  let status = sendAjax_attaches_search('http://localhost:6011/attaches');

  if(status != 200){
    alert('수업자료를 불러오기에 실패하였습니다')
  }

}

function sendAjax_attaches_search(url){

  let status=-1;

  $.ajax({
    type:"GET",
    url : url,
    async: false,
    success : (result)=>{
      attachsArray=result;
      status = 200;
    }
  })
  return status;

}

function page_3_open(){
  document.getElementsByClassName('page_0')[0].style.display='none';
  document.getElementsByClassName('page_3')[0].style.display='block';
}

function page_3_submit(){

  var formData = new FormData();

  formData.append("attachFile",document.getElementById('page_3_attachfile').files[0]);
  formData.append("title",document.getElementById('page_3_title').value);
  formData.append("content",document.getElementById('page_3_content').value);

  let status = sendAjax_page_3_submit('http://localhost:6011/attaches',formData);

  if(status == 200){
    alert('성공!');
    location.reload();
  }
  else {
    alert('실패!');
  }

}
function sendAjax_page_3_submit(url,formData){
  let status=-1;
  $.ajax({
    type:"POST",
    contentType: false,
    processData: false,
    url : url,
    data :formData,
    async: false,
    success : (result)=>{
      status = 200;
    }
  })
  return status;
}

function page_4_open(){
  users_open();
  document.getElementsByClassName('page_0')[0].style.display='none';
  document.getElementsByClassName('page_4')[0].style.display='block';
}

var usersArray = new Array();

function users_open(){


  users_search();


  var content_area = document.getElementsByClassName('list_user_content_area')[0];

  var length = usersArray.length;

  if(length != 0){

    var final ="";

    for (var i=length-1; i>=0; i--){

      var date = usersArray[i].createdAt.substring(0,10);
      content =`

          <div class="list_content">
            <div class="content_title" id="list_user_index_1">${usersArray[i].id}</div>
            <div class="content_contents" id="list_user_index_2">${usersArray[i].name}</div>
            <div class="content_name" id="list_user_index_3">${usersArray[i].classId}</div>
            <div class="content_name" id="list_user_index_4">${usersArray[i].email}</div>
            <div class="content_date" id="list_user_index_5">${date}</div>
          </div>

      `
      final = final+content;
    }

    content_area.innerHTML=final;

  }
}

function users_search(){
  let status = sendAjax_users_search('http://localhost:6011/users/admin');

  if(status != 200){
    alert('회원목록을 불러오기에 실패하였습니다')
  }

}

function sendAjax_users_search(url){

  let status=-1;

  $.ajax({
    type:"GET",
    url : url,
    async: false,
    success : (result)=>{
      console.log("hi");
      usersArray=result;
      status = 200;
    }
  })
  return status;

}

function page_5_open(){
  qna_open();
  document.getElementsByClassName('page_0')[0].style.display='none';
  document.getElementsByClassName('page_5')[0].style.display='block';
}

var qnaArray = new Array();

function qna_open(){


  qna_search();

  var content_area = document.getElementsByClassName('list_content_area')[0];

  var length = qnaArray.length;

  if(length != 0){

    var final ="";

    for (var i=length-1; i>=0; i--){

      var date = qnaArray[i].createdAt.substring(0,10);
      content =`
        <a id="content_link" href="javascript:void(0);onclick=qna_detail_open('${qnaArray[i].title}','${qnaArray[i].email}','${qnaArray[i].content}')">
          <div class="list_content">
            <div class="content_title" id="list_index_1">${qnaArray[i].id}</div>
            <div class="content_contents" id="list_index_2">${qnaArray[i].title}</div>
            <div class="content_name" id="list_index_3">${qnaArray[i].email}</div>
            <div class="content_date" id="list_index_4">${date}</div>
          </div>
        </a>
      `
      final = final+content;
    }

    content_area.innerHTML=final;

  }
}

function qna_search(){
  let status = sendAjax_qna_search('http://localhost:6011/qnas');

  if(status != 200){
    alert('질문목록을 불러오기에 실패하였습니다')
  }

}

function sendAjax_qna_search(url){

  let status=-1;

  $.ajax({
    type:"GET",
    url : url,
    async: false,
    success : (result)=>{
      qnaArray=result;
      status = 200;
    }
  })
  return status;

}

function qna_submit(){

  var title = document.getElementById('answer_title').value;
  var content = document.getElementById('answer_content').value;
  var email = document.getElementById('answer_email').value;

  let status = sendAjax_qna_submit('http://localhost:6011/qnas/answer',title,content,email);

  if(status == 200){
    alert('질문답변이 완료되었습니다');
    location.reload();
  }
  else {
    alert('질문답변에 실패하였습니다');
  }

}
function sendAjax_qna_submit(url,title,content,email){
  let status=-1;
  $.ajax({
    type:"POST",
    url : url,
    data :{
      "title": title,
      "content": content,
      "email": email
    },
    async: false,
    success : (result)=>{
      status = 200;
    }
  })

  return status;
}
function qna_detail_open(title,email,content){


  document.getElementsByClassName('list_detail_title')[0].innerHTML=title;
  document.getElementsByClassName('list_detail_content')[0].innerHTML=content;
  document.getElementsByClassName('list_detail_email')[0].innerHTML=`작성자 : ${email}`;
  document.getElementById('answer_email').value = email;
  document.getElementsByClassName('list_all')[0].style.display='none';
  document.getElementsByClassName('list_answer')[0].style.display='block';
  document.getElementsByClassName('list_detail')[0].style.display='block';
}
function qna_detail_close(){
  document.getElementsByClassName('list_all')[0].style.display='block';
  document.getElementsByClassName('list_answer')[0].style.display='none';
  document.getElementsByClassName('list_detail')[0].style.display='none';
  document.getElementById('answer_title').value ='';
  document.getElementById('answer_content').value ='';
}


function page_6_open(){
  new_open();
  document.getElementsByClassName('page_0')[0].style.display='none';
  document.getElementsByClassName('page_6')[0].style.display='block';
}

var newArray = new Array();

function new_open(){

  new_search();

  var content_area = document.getElementsByClassName('page_6_main')[0];

  var length = newArray.length;

  if(length != 0){

    var final ="";

    for (var i=length-1; i>=0; i--){

      var date = newArray[i].createdAt.substring(0,10);
      content =`
        <div class="new_list">
          <div class="new_list_date">
            등록시간 : ${date}
          </div>

          <div class="new_list_title">
            나이 : ${newArray[i].age}세
          </div>

          <div class="new_list_phone">
            전화번호 : ${newArray[i].phoneNum}
          </div>

          <div class="new_list_content_title">
            메모
          </div>
          <div class="new_list_content">
            ${newArray[i].content}
          </div>
        </div>
      `
      final = final+content;
    }

    content_area.innerHTML=final;

  }
}

function new_search(){
  let status = sendAjax_new_search('http://localhost:6011/news');

  if(status != 200){
    alert('신규회원목 신청목록을 불러오기에 실패하였습니다')
  }

}

function sendAjax_new_search(url){

  let status=-1;

  $.ajax({
    type:"GET",
    url : url,
    async: false,
    success : (result)=>{
      newArray=result;
      status = 200;
    }
  })
  return status;

}
