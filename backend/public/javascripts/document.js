window.onload = function(){
  open();
  me();
}

var attachsArray = new Array();

function open(){


  attaches_search();

  var content_area = document.getElementsByClassName('list_content_area')[0];

  var length = attachsArray.length;

  if(length != 0){

    var final ="";

    for (var i=length-1; i>=0; i--){

      var date = attachsArray[i].createAt.substring(0,10);
      content =`
        <a id="content_link" href="javascript:void(0);onclick=detail('${attachsArray[i].title}','${date}','${attachsArray[i].key}','${attachsArray[i].url}','${attachsArray[i].content}')">
          <div class="list_content">
            <div class="content_title" id="list_index_1">${attachsArray[i].id}</div>
            <div class="content_contents" id="list_index_2">${attachsArray[i].title}</div>
            <div class="content_name" id="list_index_3">관리자</div>
            <div class="content_date" id="list_index_4">${date}</div>
            <div class="content_file_status" id="list_index_5">O</div>
          </div>
        </a>
      `
      final = final+content;
    }

    content_area.innerHTML=final;

  }
}

function detail(title,createAt,fileName,fileLink,content) {

  document.getElementsByClassName('detail_title')[0].innerHTML=`${title}`;
  document.getElementsByClassName('detail_date')[0].innerHTML=`작성시간 : ${createAt}`;
  document.getElementsByClassName('detail_file')[0].innerHTML=`첨부파일 :
    <a id="file_link" href=${fileLink} download>
      ${fileName}
    </a>
  `;
  document.getElementsByClassName('detail_content')[0].innerHTML=`${content}`;

  document.getElementsByClassName('main')[0].style.display='none';
  document.getElementsByClassName('main_detail')[0].style.display='block';

}

function detail_back(){
  document.getElementsByClassName('main')[0].style.display='block';
  document.getElementsByClassName('main_detail')[0].style.display='none';
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
