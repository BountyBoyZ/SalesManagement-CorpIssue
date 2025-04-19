function RunAjax(url, method, data, onsuccess) {
    debugger
    $.ajax(
        {
            url: url, // the endpoint
            type: method, // http method
            data: data, // data sent with the get request

            // handle a successful response
            success: function (json) {
                debugger
                // j = $.parseJSON(json)
                //     $("#PersonId").val(j.PersonId)
                if (json.success) {
                    console.log(json)
                    console.log("success"); // another sanity check
                    if (typeof onsuccess == 'function') {
                        onsuccess(json)
                    }
                    // $.alert({
                    //     title: 'موفقیت آمیز',
                    //     content: "اطلاعات به روزرسانی شد",
                    //     type: 'green',
                    //     typeAnimated: true,
                    //     buttons: {
                    //         close: {
                    //             text: 'بستن',
                    //             btnClass: 'btn-success',
                    //         },
                    //     }
                    // });
                } else {
                    let message = "به روزرساني اطلاعات با خطا مواجه شد"
                    if (json.message)
                        message = json.message
                    $.alert({
                        title: 'خطا',
                        content: message,
                        type: 'red',
                        typeAnimated: true,
                        buttons: {
                            close: {
                                text: 'بستن',
                                btnClass: 'btn-success',
                            },
                        }
                    });
                }

            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                //debugger
                //alert(xhr.status + ' ' + xhr.responseText)
                console.log(xhr.status + ": " + xhr.responseText); // provide a bit more info about the error to the console
                //extract error info
                let rt = xhr.responseText
                let ErrorText = ""
                let ErrorPlace = ""
                $(rt).find('tr th').each(
                    function (index, item) {
                        if ($(item).text() == 'Exception Value:')
                            ErrorText = $(item).next().text()
                        if ($(item).text() == 'Exception Location:')
                            ErrorPlace = $(item).next().text()
                    }
                )
                let msg = ""
                msg = "متاسفانه عملیات با خطا مواجه شد"
                msg += "<br/>" + ErrorText + "<br/>" + ErrorPlace
                $.alert({
                    title: 'خطا',
                    content: msg,
                    type: 'red',
                    typeAnimated: true,
                    buttons: {
                        close: {
                            text: 'بستن',
                            btnClass: 'btn-red',
                        },
                    }
                });
            }
        });
}
// برای جابه جا شدن بین صفحه ارتباط با مشتری و صورتحساب
// $('.toggle .menu').click(
//     function () {
//         debugger
//         $(this).toggleClass('selected')
//         if($(this).hasClass('selected')){
//             // you can just select one button
//             $(this).parent().find('.menu').removeClass('selected')
//             $(this).addClass('selected')
//             // if selected button is for invoice show version selector
//             if($(this).hasClass('invoice')){ //درخواست های مربوط به صورت حساب و فیلد هایی که باید فعال باشند:
//                 let version_loc = $(this).parents('.main').find('form .container-1 .version') //version
//                 //برای درخواست صورت حساب فورینت و اهمیت و ردخواست به غیر فعال شود
//                  $(this).parents('.main').find('form .general-request-fields').hide() // importance,priority,request_for
//                  $(this).parents('.main').find('.input-container .new-request-reason').show()  //reason
//                  $(this).parents('.main').find('.input-container .new-work-hour').show() //work hour
//                  version_loc .show()
//
//             }
//             else {
//                 $(this).parents('.main').find('form .container-1 .version').hide()
//                 $(this).parents('.main').find('.input-container .new-request-reason').hide()  //reason
//                  $(this).parents('.main').find('.input-container .new-work-hour').hide() //work hour
//                 $(this).parents('.main').find('form .general-request-fields').show()
//             }
//
//         }
//
//     }
// )

$('.version-num').click(
    function () {
        if ($(this).parent().hasClass("no-edit")) return
        $(this).toggleClass('selected')
        if($(this).hasClass('selected')){
            $(this).parent().find('.version-num').removeClass('selected')
            $(this).addClass('selected')
            let version_num = $(this).attr('data-key')
            $(this).parents('.version').find('.version_value').val(version_num)
        }
    }
)
function AddJsonItem(data, name, value) {
    let json = {'name':name,'value':value}
    data.push(json)
    return data

}
function validateForm() {
    let message = ''
    let form = $('form[name="new-corp-item"]')
    let version = form.find('input[name="version_value"]').val()
    let corp_code = form.find('input[name="corp-code"]').val()
    // let request_for = form.find('input[name="request-for"]').val()
    // let importance = form.find('input[name="importance"]').val()
    // let priority = form.find('input[name="urgency"]').val()

    if(corp_code==='')//  برای ساخت corp issue هم در فرم صورت حساب هم ارنباط با مشتری باید شرکت بیمه را انتخاب کند
                message +='لطفا شرکت بیمه مورد نظر را انتخاب کنید . '+'<br/>'
     if(version==='')
                    message +='لطفا نسخه صورت حساب را انتخاب کنید . '+'<br/>' // انسخه باید حتما انتخاب شود

    // if(form.parents('.main').find('.toggle .invoice').hasClass('selected')){ // اگر فرم در حالت صورت حساب است
    //      if(version==='')
    //                 message +='لطفا نسخه صورت حساب را انتخاب کنید . '+'<br/>' // انسخه باید حتما انتخاب شود
    // }
    // else{ //اگر فرم در حالت ارتباط با مشتری است
    //      if(request_for==='')
    //     message +='لطفا مشخص کنید درخواست شما مربوط به چه قسمتی است!  '+'<br/>'
    //     if(importance==='')
    //         message +='لطفا اهمیت درخواست خود را مشخص کنید . '+'<br/>'
    //     if(priority==='')
    //         message +='لطفا میزان فوریت درخواست خود را مشخص کنید . '+'<br/>'
    // }


    if(message){
        $.alert({
                    title:'خطا',
                    content:message,
                    rtl: true,
                    closeIcon: true,
                    buttons: {
                        confirm: {
                            text: 'بستن',
                            btnClass: 'btn-blue',

                        },

                    }
            });
        return false
    }
    else{
        return true
    }

    
}
function validation(form,validation_type) {
    let message = ''
    function corp_item() {
        debugger
        // get form data
        let corp_issue_id = form.find('input[name="corp_issue_id"]').val()
        let description = form.find('textarea[name="description"]').val()
        let title = form.find('input[name="request_title"]').val()
        let team_code = form.find('select option:selected').val()
        let work_hour = form.find('input[name="work_hour"]').val()
        let task_number = form.find('input[name="task_number"]').val()
        let reason= form.find('select[name="reasons"] option:selected').val()
        let version = form.find('input[name="version_value"]').val()
        let corp_code = form.find('input[name="corp-code"]').val()
        let request_date = form.find('input[name="RequestDate"]').val()
        let request_for = form.find('input[name="request-for"]').val()
        let importance = form.find('input[name="importance"]').val()
        let priority = form.find('input[name="urgency"]').val()
        // فیلد هایی که برای ساخت corp issue باید چک شود
        // if(corp_issue_id===''){
        //     if(corp_code==='')//  برای ساخت corp issue هم در فرم صورت حساب هم ارنباط با مشتری باید شرکت بیمه را انتخاب کند
        //         message +='لطفا شرکت بیمه مورد نظر را انتخاب کنید . '+'<br/>'
        //     if(form.parents('.main').find('.toggle .invoice').hasClass('selected')){ // اگر فرم در حالت صورت حساب است
        //         if(version==='')
        //             message +='لطفا نسخه صورت حساب را انتخاب کنید . '+'<br/>' // انسخه باید حتما انتخاب شود
        //
        //
        //     }
        //     else{ // اگر فرم در حالت ارتباط با مشتری برای ساخت corp issue است
        //      if(request_for==='')
        //         message +='لطفا مشخص کنید درخواست شما مربوط به چه قسمتی است!  '+'<br/>'
        //      if(importance==='')
        //         message +='لطفا اهمیت درخواست خود را مشخص کنید . '+'<br/>'
        //      if(priority==='')
        //         message +='لطفا میزان فوریت درخواست خود را مشخص کنید . '+'<br/>'
        //     }
        // }

         // فیلد هایی که در برای ساخت detail برای یک corp issue که وجود دارد باید چک شود
            if(title.trim()==='')
            message +='لطفا عنوان مناسبی برای درخواست خود وارد کنید'+'<br/>'
            if(description<10)
                 message +='لطفا شرح درخواست را به درستی وارد کنید'+'<br/>'
            if(team_code==='-1')
                message +='لطفا تیم مورد نظر خود را مشخص کنید'+'<br/>'

            if(reason=== '-1')
                message +='لطفا دلیل مورد نظر خود را مشخص کنید'+'<br/>'
            if(work_hour==='')
                 message +='لطفا کار کرد را مشخص کنید'+'<br/>'
            if(task_number==='')
                 message +='لطفا شماره تسک را وارد کنید'+'<br/>'
            if(parseInt(work_hour)<0)
                message +='کارکرد نمی تواند منفی باشد'+'<br/>'
           if(parseInt(task_number)<0)
                message +='شناسه تسک نمی تواند منفی باشد'+'<br/>'


        return message == '';
    }

    function new_chat() {
        let description = form.find('.chat-description').val()
        let current_user_type = form.find('input[name="user_type"]').val()
        let issue_detail_state = form.find('input[name="issue_detail_state"]').val()
        if (current_user_type!==issue_detail_state)
             message += 'شما مجاز به اضافه کردن مکالمه نیستید!'+'<br/>'
        if (description.trim() === '')
            message = 'متنی برای ارسال نوشته نشده است'

        return message == '';
    }
    function chat_editable() {
        debugger
        let chat_owner = form.find('#chat-owner').val() // ما موقع فراخوانی validation بر روی ایکون ادیت چت به جای پاس دادن form, به تابع text-box دادیم یعنی اینجا منظور از form دیو کوچکتری به نام text-box است
        let is_lock = form.find('.is-lock').val()
        let current_user = form.parents('.main').find('input[name="user_name"]').val()
        let current_user_type = form.parents('.main').find('input[name="user_type"]').val()
        let issue_detail_state = form.parents('.main').find('input[name="issue_detail_state"]').val()
        if(is_lock=='True')
            message += 'بعد از ارسال امکان ویرایش مکالمات وجود ندارد !'+'<br/>'
        // if(chat_owner!==current_user)
        //     message += 'هر شخص فقط مجوز ویرایش مکالمات مربوط به خود را دارد !'+'<br/>'
        if (current_user_type!==issue_detail_state)
            message += 'شما پیام ها را ارسال کرده ایید و امکان ویرایش آن وجود ندارد !'+'<br/>'
        return message === '';
    }
    function chat_deletable() {
        // ما موقع فراخوانی validation بر روی ایکون ادیت چت به جای پاس دادن form, به تابع text-box دادیم یعنی اینجا منظور از form دیو کوچکتری به نام text-box است
        let chat_owner = form.find('#chat-owner').val()
        let is_lock = form.find('.is-lock').val()
        let current_user = form.parents('.main').find('input[name="user_name"]').val()
        let current_user_type = form.parents('.main').find('input[name="user_type"]').val()
        let issue_detail_state = form.parents('.main').find('input[name="issue_detail_state"]').val()
        if(is_lock=='True')
            message += 'بعد از ارسال امکان حذف مکالمات وجود ندارد !'+'<br/>'
        // if(chat_owner!==current_user)
        //     message += 'هر شخص فقط مجوز حذف مکالمات مربوط به خود را دارد !'+'<br/>'
        if (current_user_type!==issue_detail_state)
            message += 'شما پیام ها را ارسال کرده ایید و امکان حذف آن وجود ندارد !'+'<br/>'
        return message === '';
    }
    function finish() {
        debugger
         let current_user_type = form.find('input[name="user_type"]').val()
        let issue_detail_state = form.find('input[name="issue_detail_state"]').val()
        if(current_user_type!=='1'){
              message += 'شما مجاز به انجام این عملیات نیستید !'+'<br/>'
        }

    }

    switch (validation_type){
        case 'corp_item':
            corp_item()
            break
        case 'new_chat':
            new_chat()
            break
        case 'Editable':  // کنترل برای اینکه هر شخص نتواند هر پیامی را ویرایش کند بلکه فقط پیام های خود را بتواند
            chat_editable()
            break
        case 'Deletable':
            chat_deletable()
            break
        case 'finish':
            finish()
            break
    }

       if (message !=='')
            $.alert({
                    title:'خطا',
                    content:message,
                    rtl: true,
                    closeIcon: true,
                    buttons: {
                        confirm: {
                            text: 'بستن',
                            btnClass: 'btn-blue',

                        },

                    }
            });
       return message === ''
}
// add new row as new CorpIssue object
function add_request_row(form, issue_detail_id) {
    debugger

    let reason_combo = $('.cloner-select .main-reason').clone()
    let task_number = form.find('input[name="task_number"]').val()
    let description = form.find('textarea[name="description"]').val()
    let title = form.find('input[name="request_title"]').val()
    let team = form.find('select[name="teams"] option:selected').text()
    let team_code = form.find('select option:selected').val()
    let work_hour = form.find('input[name="work_hour"]').val()
    let reason= form.find('select[name="reasons"] option:selected').val()
    let container = form.find('.request-row')
    let new_row =''
    let div_team = '<div class="team col-1">'+'<img class="new-row-img" alt="'+team+'" title="'+team+'" src="/static/CorpIssue/images/team/'+team_code+'.png">'+'</div>'
    let div_task_number = '<div class="box request-task-number col-1" >'+'<input class="text-box hidden" type="number" name="edit_task_number" placeholder="123" id="">'+'<div class="text-box show-task-number">'+task_number+'</div>'+'</div>'
    let div_title = '<div class="box request-title col-2">'+'<input class="text-box hidden" type="text" name="edit_request_title" placeholder="عنوان" id="">'+'<div class="text-box show-title">'+title+'</div>'+'</div>'
    let div_description = '<div class="box description col-3 ">'+' <textarea class="text-box hidden edit-description" type="text" name="edit_description" rows="2" cols="40" placeholder="شرح...." id="">'+'</textarea>'+'<div class="text-box show-description">'+description+'</div>'+'</div>'
    let div_work_hour = '<div class="box work-hour col-1">'+'<input class="text-box hidden" type="text" name="edit_work_hour" placeholder="کارکرد" id="">'+'<div class="text-box show-hour-work">'+work_hour+'</div>'+'</div>'
    let div_reason = '<div class="box request-reason col-2">'+'<div class="text-box show-reason">'+reason+'</div>'+'</div>'
    let div_edit = '<div class="edit-issue" >'+' <i title="ویرایش" class="fa-sharp fa-solid fa-pen-to-square">'+'</i>'+'</div>'
    let div_delete = '<div class="delete-issue" >'+' <i  title="حذف" class=" fa-solid fa-trash-can trash" >'+'</i>'+'</div>'
    let div_submit_edit = '<div class="save-edit hidden" >'+'<i title=" ذخیره تغییرات" class="fa-sharp fa-solid fa-circle-check">'+'</i>'+'</div>'
    let div_cancel_edit = '<div class="cancel-edit hidden" >'+'<i title="لغو تغییرات" class="fa-sharp fa-solid fa-circle-xmark">'+'</i>'+'</div>'
    new_row = '<div class="container-4 col-12" data-detail-id="'+issue_detail_id+'" >'+div_team +div_task_number+ div_title + div_reason + div_work_hour + div_description+div_edit+div_delete+div_cancel_edit+div_submit_edit+'</div>'
    container.append(new_row) //

    $('.container-4[data-detail-id="'+issue_detail_id+'"] .request-reason').append(reason_combo) // برای اضافه کردن combo دلایل برای ویرایش

    $('.container-4[data-detail-id="' + issue_detail_id + '"]').find('.edit-issue i').click(
        function () {
            let issue_detail = $(this).parents('.container-4').data('detail-id')
            hide_show_items(issue_detail)
        }
    )
    $('.container-4[data-detail-id="' + issue_detail_id + '"]').find('.delete-issue i').click(
        function () {
            let issue_id = $(this).parents('.container-4').data('detail-id')
            let selected_row = $(this).parents('.container-4').remove()
            delete_corp_issue(issue_id)
        }
    )
    $('.container-4[data-detail-id="' + issue_detail_id + '"] .save-edit i').click(
    function () {
        debugger
            let edit_div =$(this).parents('.container-4')
            let corp_issue_detail_id = $(this).parents('.container-4').data('detail-id')
            // let team_code = $('.container-4 select[name=teams] option:selected').val()
            let title = $(this).parents('.container-4 ').find('input[name="edit_request_title"]').val()
            let reason = $(this).parents('.container-4 ').find('select[name="edit_reason"] option:selected').val()
            let work_hour =  $(this).parents('.container-4 ').find('input[name="edit_work_hour"]').val()
            let description = $(this).parents('.container-4 ').find('.edit-description').val()
            update_corp_issue(corp_issue_detail_id,title,reason,work_hour,description,edit_div)
            // now you should hide inputs and show texts

    }
)
    //cancel editing
    $('.container-4[data-detail-id="' + issue_detail_id + '"]  .cancel-edit i').click(
        function () {
            let edit_div =$(this).parents('.container-4')
            hide_show_after_edit(edit_div)
        }
    )

}
// attach file
  $( function() {
    $( "#dialog" ).dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 200
      },
      hide: {
        effect: "explode",
        duration: 200
      }
    });

$('.input-container .attach i').on( "click", function() {
      $( "#dialog" ).dialog( "open" );
    });
  } );

// creat new object from CorpIssueDetail for corp issue that there is
$('form[name="new-corp-item"] .submit-new-row i').click(
    function () {
        debugger


        let form=$(this).parents('form')
        let corp_issue_id = $(this).parents('form').find('#corp-issue-id').val()

        if(validation(form,'corp_item')){
            debugger
            let data = form.serializeArray()
            //ما اسم تیم را لازم داریم تا به data اضافه کنیم برای فرستاده شدن به view
            let name = 'team'
            let value = $(this).parents('form').find('select[name="teams"] option:selected').val()
            let reason_name = 'reason'
            let reason_value = $(this).parents('form').find('select[name="reasons"] option:selected').val()
            data = AddJsonItem(data, name, value)
            data = AddJsonItem(data, reason_name, reason_value)
            let url = '/SalesManagement/CorpIssue/insert-corp-issue-detail/'+corp_issue_id
             RunAjax(url, 'POST', data,
                 function (data) {
                            debugger
                     $.alert({
                            title:'',
                            content:"درخواست شما با موفقیت ثبت شد",
                            rtl: true,
                            closeIcon: true,
                            buttons: {
                                confirm: {
                                    text: 'بستن',
                                    btnClass: 'btn-blue',

                                },

                            }
                    });

                     issue_detail_id = data.issue_detail_id
                     issue_detail_objects = data.issue_detail_objects
                     add_request_row(form,issue_detail_id)
                     form.find('.input-container input').val('')  // after any save record should empty inputs
                     form.find('.input-container textarea').val('')  //  empty textarea
                     // after any save new record selector of team and reason should change to unselected state
                     form.find('select[name="teams"]').val('-1')
                     form.find('select[name="reasons"]').val('-1')


                 })

        }
    }
)
// create a new corp issue
$('#save-corp-issue').click(
    function () {
        debugger
        let form =$(this).parents('form[name="new-corp-item"]')
        let corp_issue_id = $('#corp-issue-id').val()
        if(corp_issue_id!==''){
            $('form[name="new-corp-item"]').attr('action','/SalesManagement/CorpIssue/'+corp_issue_id+'/')
        }
   
    }
)
// delete an object of CorpIssue
function delete_corp_issue(issue_detail_id) {
    debugger
    let data={}
    let url = "/SalesManagement/CorpIssue/delete/"+issue_detail_id+"/"
    RunAjax(url, "POST", data,
        function () {
                            $.alert({
                            title:'',
                            content:"درخواست شما حذف شد ",
                            rtl: true,
                            closeIcon: true,
                            buttons: {
                                confirm: {
                                    text: 'بستن',
                                    btnClass: 'btn-red',

                                },

                            }
                    });

        }
    )

}

// delete a row ----> detail of a corp issue
$('form[name="new-corp-item"] .container-4 .delete-issue .trash').click(
    function () {
        debugger
        let issue_id = $(this).parents('.container-4').data('detail-id')
        let selected_row =$(this).parents('.container-4').remove()
        delete_corp_issue(issue_id)

    }
)
// for edit records we need hide some items and show inputs for edit text
function hide_show_items(issue_detail){
    debugger
    // get content of div for put them in input box and hide them
    // let team_img= $('.container-4 .team-combo img').hide()

    let current_title = $('.container-4[data-detail-id='+issue_detail+'] .show-title')
    let current_reason =$('.container-4[data-detail-id='+issue_detail+'] .show-reason')
    let current_work_hour =$('.container-4[data-detail-id='+issue_detail+'] .show-hour-work')
    let current_description = $('.container-4[data-detail-id='+issue_detail+'] .show-description')
    // hide this icons
    current_title.hide()
    current_description.hide()
    current_reason.hide()
    current_work_hour.hide()
    $('.container-4[data-detail-id='+issue_detail+'] .edit-issue i').hide()//edit icon
    $('.container-4[data-detail-id='+issue_detail+'] .delete-issue i').hide()//delete icon
    //show this icons
    let input_title =$('.container-4[data-detail-id='+issue_detail+'] input[name="edit_request_title"]').removeClass('hidden')
    let input_description = $('.container-4[data-detail-id='+issue_detail+'] .edit-description').removeClass('hidden')
    let input_reason = $('.container-4[data-detail-id='+issue_detail+'] select[name="edit_reason"]').removeClass('hidden')
    let input_work_hour = $('.container-4[data-detail-id='+issue_detail+'] input[name="edit_work_hour"]').removeClass('hidden')
    $('.container-4[data-detail-id='+issue_detail+'] .cancel-edit').removeClass('hidden') //cancel changes icon
    $('.container-4[data-detail-id='+issue_detail+'] .save-edit ').removeClass('hidden') //submit changes icon
    // set current values  in inputs
    input_title.val(current_title.text())
    input_description.val(current_description.text())
    input_reason.val(current_reason.text())
    input_work_hour.val(current_work_hour.text())



}
// some items should hide or show after edited
function hide_show_after_edit(edit_div) {
    debugger

    edit_div.find('select[name="edit_reason"]').addClass('hidden')
    edit_div.find('input[name="edit_work_hour"]').addClass('hidden')
    edit_div.find('.show-reason').show()
    edit_div.find('.show-hour-work').show()

    edit_div.find('input[name="edit_request_title"]').addClass('hidden')
    edit_div.find('.edit-description').addClass('hidden')

    edit_div.find('.cancel-edit').addClass('hidden')
    edit_div.find('.save-edit').addClass('hidden')
    //show this items
    edit_div.find('.show-title').show()
    edit_div.find('.show-description').show()

    edit_div.find('.edit-issue i').show()
    edit_div.find('.delete-issue i').show()





}
// set new value after edited
function set_edited_value(edit_div,title,reason,work_hour,description) {
    edit_div.find('.show-title').text(title)
    edit_div.find('.show-description').text(description)
    edit_div.find('.show-reason').text(reason)
    edit_div.find('.show-hour-work').text(work_hour)
    hide_show_after_edit(edit_div)
}

// by press edit icon
$('form[name="new-corp-item"] .container-4 .edit-issue .edit').click(
    function () {
        debugger
        let issue_detail = $(this).parents('.container-4').data('detail-id')
        hide_show_items(issue_detail)


    }
)
function update_corp_issue(corp_issue_detail_id,title,reason,work_hour,description,edit_div){
    debugger
    let data={'title':title,'reason':reason,'work_hour':work_hour,'description':description}
    let url = "/SalesManagement/CorpIssue/update/"+corp_issue_detail_id+"/"
    RunAjax(url, "POST", data,
            function () {
                set_edited_value(edit_div,title,reason,work_hour,description)
            }
        )
}
//submit all edited
$('form[name="new-corp-item"] .container-4 .save-edit i').click(
    function () {
        debugger
            let edit_div =$(this).parents('.container-4')
            let corp_issue_detail_id = $(this).parents('.container-4').data('detail-id')
            // let team_code = $('.container-4 select[name=teams] option:selected').val()
            let title = $(this).parents('.container-4 ').find('input[name="edit_request_title"]').val()
            let reason = $(this).parents('.container-4 ').find('select[name="edit_reason"] option:selected').val()
            let work_hour =  $(this).parents('.container-4 ').find('input[name="edit_work_hour"]').val()
            let description = $(this).parents('.container-4 ').find('.edit-description').val()
            update_corp_issue(corp_issue_detail_id,title,reason,work_hour,description,edit_div)
            // now you should hide inputs and show texts

    }
)
//cancel editing
$('form[name="new-corp-item"] .container-4 .cancel-edit i').click(
    function () {
        let edit_div =$(this).parents('.container-4')
        hide_show_after_edit(edit_div)
    }
)


// this function is for convert grey picture to color and color to grey
function active_icon(icon, active_inactive)
{
    let src_current = ''
    let src_new = ''
    if (active_inactive == 'I')
    {
        if (icon.hasClass('selected'))
        {
            icon.removeClass('selected')
            src_current = icon.attr('src')
            src_new = src_current.replace('.png','-Gray.png')
        }
    }
    else {
        icon.addClass('selected')
        src_current = icon.attr('src')
        src_new = src_current.replace('-Gray.png','.png')
    }
    if (src_new !== '')
        icon.attr('src',src_new)
}
function ChangeImage(icon, old_name, new_name)
{
    src = $(icon).attr('src');
    //to find part of src before name, we must find length of src
    l = src.length
    //get file extention
    e = src.substring(l-4)
    //and length of current name
    n = old_name.length  + 4 //for file extention
    //now set new name
    src = src.substring(0, l-n) + new_name + e
    //change image
    $(icon).attr('src', src)
}

// make active or inactive team icon --> you can select many team
// $('.team .up').click(
//     function (){
//         debugger
//         $(this).toggleClass('selected')
//         let team_code = $(this).find('.logo').attr('data-key')
//         let list=$(this).parents('.icons').find('.code').data('list')
//         if ($(this).hasClass('selected')){
//                 if (list===undefined||list.length===0|| list===[])// every team selected you should add to list
//                     list=[]
//                     list.push(team_code)
//                     $(this).parents('.icons').find('.code').data('list',list)
//
//         }
//         else {
//                 // if a team unselected  should remove it from list
//                 if(list.length>0){
//                     // list.pop(team_code)
//                     let index = list.indexOf(team_code)
//                      list.splice(index,1);
//
//
//
//                 }
//         }
//     }
// )


// select a team from select bar
// $(".team-combo select[name='teams'] option[name='team_name']").click(
//    function () {
//        debugger
//         $(this).toggleClass('selected')
//        if ($(this).hasClass('selected')){
//            let team_code = $(this).val()
//            $(this).parents('.team-combo').find('.team-value').val(team_code)
//        }
//    }
//
// )

// make active or inactive corp icon
$('.corp .logo').click(
    function () {
        let corp_code = $(this).attr('data-key')
        let corp_name = $(this).attr('alt')
        // let corp_name = $(this).parents('.company-name').find('.down').attr('data-key')
        if ($(this).hasClass('selected')) // if is active should make inactive it
        {
            active_icon($(this),'I')
            $(this).parents('.icons').find('.code').val('')
            $(this).parents('.icons').find('.corp-nam').val('')
        }
        else {
             $(this).parents('.icons').find('img').each(
                 function () {
                      active_icon($(this),'I')
                 })
            active_icon($(this),'A')
            $(this).parents('.icons').find('.code').val(corp_code)
            $(this).parents('.icons').find('.corp-nam').val(corp_name)

        }
    }

)
// make active or inactive request for icon
$('.request-for-icon img').click(
    function (){
        let request_for = $(this).attr('data-val')
        if ($(this).hasClass('selected')) // if is active should make inactive it
        {
            active_icon($(this),'I')
            $(this).parent().find('.request-value').val('')
        }
        else {
             $(this).parent().find('img').each(
                 function () {
                      active_icon($(this),'I')
                 })
            active_icon($(this),'A')
            $(this).parent().find('.request-value').val(request_for)


    }

    }
)
// make active or inactive urgency icon
$('.urgency-icon img').click(
    function () {
        let urgency_number = $(this).attr('data-val')
        if ($(this).hasClass('selected'))
        {
            active_icon($(this),'I')
            $(this).parent().find('.urgency-value').val('')
        }
        else {
             $(this).parent().find('img').each(
                 function () {
                      active_icon($(this),'I')
                 })
            active_icon($(this),'A')
            $(this).parent().find('.urgency-value').val(urgency_number)

        }
    }
)



// search corp
$('.container-3 .search .search-input').on('keyup',
    function (){
            let input_val = $(this).val()
            let corp_name = $(this).parents('.container-3').find('.left .icons .company-name')
            if(input_val.length>0){
                corp_name.hide()
                corp_name.parent().find('[data-key*="' + input_val + '"]').show()
            }
            else{
                corp_name.show()
            }
    }

)


function scroll(item, value)
{
    debugger
    let scroll = item.scrollLeft()

    if (scroll == 0)
    {
        item.find('i').addClass('inactive')

    }
    else
    {
        item.find('i').removeClass('inactive')
    }
    scroll -= value
    item.scrollLeft(scroll)
}

$('.arrow-left').click(
    function ()
    {
        debugger
        let panel = $(this).parent().find('.icons')
        scroll(panel, 200)
    }
)

$('.arrow-right').click(
    function ()
    {
        let panel = $(this).parent().find('.icons')
        scroll(panel, -200)
    }
)



// for use jalali date
 $(document).ready(function() {
           $(' .first-row  .date input').persianDatepicker({format: 'YYYY-MM-DD'})

          });


// change color of stars
function active_star(star, active_inactive) {

    if (active_inactive == 'A') {
        $(star).addClass('active')
        $(star).removeClass('inactive')
        ChangeImage(star, 'star-inactive', 'star-active')

    } else {
        $(star).addClass('inactive')
        $(star).removeClass('active')
        ChangeImage(star, 'star-active', 'star-inactive')
    }
}
$('.importance .star-icons img').click(
    function (){
                let star_level = $(this).attr('data-val')
                    let star2 = '.star[data-val="2"]'
                    let star3 = '.star[data-val="3"]'


                    //if this feature is active, we must inactivate it
                    if ($(this).hasClass('active')) {

                        //we can not inactivate level 1
                        if (star_level == 1)
                            return


                        // now inactive this item
                        active_star(this, 'I')


                        // if we inactivate star 2, star 3 must inactivate too
                        if (star_level == 2 && $(star3).hasClass('active'))
                            active_star(star3, 'I')

                        //now update value in database
                        star_level -= 1
                    } else {

                        // now active this item
                        active_star(this, 'A')
                        // if we inactivate star 3, star 2 must inactivate too
                        if (star_level == 3 && !$(star2).hasClass('active'))
                            active_star(star2, 'A')
                    }
                    $(this).parent().find('.importance-value').val(star_level)


    }
)
// دکمه برای فرستادن درخواست به کارتابل افراد
$('#start-process').click(
    function () {
        debugger
        // این دکمه زمانی باید کار کند که برای corp issue مورد نظر حداقل یک detail ثبت شده باشد در غیر این صورت پیغام خطا دهد که درخواستی ثبت نشده است
        if ($('.container-4').length>=1){
            let corp_issue_id = $('#corp-issue-id').val() //get id of corp issue
            let username = $('#username').val()
            let data = {'corp_issue_id': corp_issue_id,'username':username} // set it as data for sending to view(backend)
            let url = '/SalesManagement/CorpIssue/register-doc/'
            RunAjax(url, 'POST', data,
                function () {
                    $.alert({
                            title:'موفقیت آمیز',
                            content:"درخواست ها به کارتابل افراد ارسال شد! ",
                            rtl: true,
                            closeIcon: true,
                            buttons: {
                                confirm: {
                                    text: 'بستن',
                                    btnClass: 'btn-blue',

                                },

                            },
                            onClose: function(){
                                window.location.href = "/SalesManagement/CorpIssue/"
                            }
                    });
                }
                )

        }
        else {
             $.alert({
                            title:'خطا',
                            content:"شما هنوز درخواستی برای شرکت مورد نظر ثبت نکرده ایید! ",
                            rtl: true,
                            closeIcon: true,
                            buttons: {
                                confirm: {
                                    text: 'بستن',
                                    btnClass: 'btn-red',
                                },

                            }
                    });
        }
    }
)
// by press cancel button all detail will delete
$(".cancel-detail").click(
    function () {
        debugger
        $('.container-4').each(function (key, value) {
            debugger
            let detail_id = $(value).data('detail-id')
            // delete_corp_issue(detail_id)
            let data = {}
            let url = "/SalesManagement/CorpIssue/delete/" + detail_id + "/"
            RunAjax(url, "POST", data,
                function () {
                    $(value).remove()
                }
            )
        })
        window.location.href = "/SalesManagement/CorpIssue/"
    }
)
$(".link_new_issue").click(
    function () {
        event.preventDefault()
        $.alert({
            title:'درخواست جدید',
            content:"با ایجاد درخواست جدید اطلاعات درخواست فعلی پاک می شود.آیا مایل به ایجاد درخواست جدید هستید؟",
            rtl: true,
            closeIcon: true,
            buttons: {
                confirm: {
                    text: 'بله',
                    btnClass: 'btn-green',
                    action: function() {
                        window.location.href = "/SalesManagement/CorpIssue/"
                    }
                },
                cancel: {
                    text: 'خیر',
                    btnClass: 'btn-red',
                },

            },
            
    });
        
    }
)

/******************************************** CorpIssue js end ****************************************/
/******************************************** CorpIssueConversation js start ********************************/
//*********************************************** Edit & Delete Chat **********************************
//Chat Delete Part
function delete_chat(chat_id) {
    debugger
    let data={}
    let url = "/SalesManagement/CorpIssue/delete/chat/"+chat_id+"/"
    RunAjax(url, "POST", data,
        function () {
                            $('.text-box[data-key="'+chat_id+'"]').remove() // درصورت موفق بودن حذف پیام از دیتا بیس بالافصله آن را از بین چت های موجود نیز پاک کن
                            $.alert({
                            title:'',
                            content:"پیام شما حذف شد ",
                            rtl: true,
                            closeIcon: true,
                            buttons: {
                                confirm: {
                                    text: 'بستن',
                                    btnClass: 'btn-red',

                                },

                            }
                    });

        }
    )

}
// delete icon
$('.temp .delete-icon i').click(
    function () {
        debugger
        let chat_id = $(this).parents('.temp').attr('data-key')
         let text_box = $(this).parents('.text-box[data-key="'+chat_id+'"]')
        if(validation(text_box,'Deletable')){
            delete_chat(chat_id)
        }

    }
)
// Chat Edit Part
//after press edit icon we need to hide some things and show another things
function hide_show_icons(chat_id) {
    debugger
    let text_box = $('.text-box[data-key="'+chat_id+'"]')
    text_box.find('.edit-icon').addClass('hidden')
    text_box.find('.delete-icon').addClass('hidden')
    text_box.find('.cancel-edit-icon').removeClass('hidden')
    text_box.find('.save-edit-icon').removeClass('hidden')
    let current_chat = text_box.find('.iner').addClass('hidden')
    let edit_input = text_box.find('.edit-chat').removeClass('hidden')
    edit_input.text(current_chat.text())
}
// after submit editing or cancel editing It is necessary to return the icons to normal
function hide_show_icons_after(chat_id){
    let text_box = $('.text-box[data-key="'+chat_id+'"]')
    text_box.find('.edit-icon').removeClass('hidden')
    text_box.find('.delete-icon').removeClass('hidden')
    text_box.find('.cancel-edit-icon').addClass('hidden')
    text_box.find('.save-edit-icon').addClass('hidden')
    text_box.find('.iner').removeClass('hidden')
    text_box.find('.edit-chat').addClass('hidden')

}
// connect to backend  for update data base
function update_chat(chat_id,new_chat_text) {
    debugger
    let data={'command':new_chat_text,}
    let url = "/SalesManagement/CorpIssue/update/chat/"+chat_id+"/"
    RunAjax(url, "POST", data,
            function () {
                $('.text-box[data-key="'+chat_id+'"] .text .iner').text(new_chat_text)
                hide_show_icons_after(chat_id)

            }
        )
}
// edit icon
$('.temp .edit-icon i').click(
    function () {
        debugger
        let chat_id = $(this).parents('.temp').attr('data-key')
        let text_box = $(this).parents('.text-box[data-key="'+chat_id+'"]')
        // before show edit input same validation should check
        if(validation(text_box,'Editable')){
            hide_show_icons(chat_id)
        }


    }
)
// submit editing icon
$('.temp .save-edit-icon i').click(
    function () {
        debugger
        let chat_id = $(this).parents('.temp').attr('data-key')
        let new_chat_text = $(this).parents('.text-box').find('.edit-chat').val()
        update_chat(chat_id,new_chat_text)


    }
)
// cancel editing icon
$('.temp .cancel-edit-icon i').click(
    function () {
        let chat_id = $(this).parents('.temp').attr('data-key')
        hide_show_icons_after(chat_id)

    }
)
// after creat anew object of CorpIssueConversation class for new chat add new row to html for show new chat without refresh
//********************************************* add new chat row (start) ******************************************
function add_row(form,chat_id,chat_date) {
    debugger
    let comment = form.find('textarea[name="chat_description"]').val()
    let user_name = form.find('input[name="user_name"]').val()
    let user_photo = form.find('input[name="user_photo"]').val()
    let user_fullname = form.find('input[name="user_fullname"]').val()
    let user_type = form.find('input[name="user_type"]').val()
    let position_class = form.find('input[name="position_class"]').val()
    let chat_box = form.find('.chat-box')
    let new_row =''
    let icons ='<div class="temp" data-key="'+chat_id+'">'+
                    '<div class="edit-icon">'+'<i title="ویرایش مکالمه" class="fa-sharp fa-solid fa-pen-to-square edit">'+'</i>'+'</div>'+
                    '<div class="delete-icon">'+'<i title="حذف مکالمه" class=" fa-solid fa-trash-can trash">'+'</i>'+'</div>'+
                    '<div class="cancel-edit-icon hidden">'+'<i title="لغو تغییرات" class="fa-sharp fa-solid fa-circle-xmark">'+'</i>'+'</div>'+
                    '<div class="save-edit-icon hidden">'+'<i title=" ذخیره تغییرات" class="fa-sharp fa-solid fa-circle-check">'+'</i>'+'</div>'+
                 '</div>'
    let div_text = '<div class="text">'+
                        '<div class="iner">' + comment + '</div>'+
                        '<textarea class="edit-chat hidden" rows="2" cols="80">'+'</textarea>'+
                    '</div>'
    let div_pic = '<div class="pic-person"><img src="' + user_photo + '" alt="' + user_fullname + '" title="' + user_fullname + '"></div>'
    let div_date_left = '<div class="chat-date-time-left">'+ '<span>'+chat_date+'</span>'+ '</div>'
    let div_date_right = '<div class="chat-date-time">'+ '<span>'+chat_date+'</span>'+ '</div>'
    //  باتوجه به اینکه یوزر ما از چه نوعی لست چیدمان سطر جدید متفاوت خواهد بود
    if (position_class==='right'){
        new_row = '<div class="text-box right-box " data-key="'+chat_id+'">' + div_pic + div_text + icons +div_date_right+'</div>'
    }
    else{
        new_row = '<div class="text-box left-box " data-key="'+chat_id+'">'+div_date_left+icons + div_text + div_pic + '</div>'
    }
    chat_box.append(new_row)
    // assign edite function for new chat
    //edit
    $('.temp[data-key="'+chat_id+'"] .edit-icon i').click(
    function () {
        debugger
        let chat_id = $(this).parents('.temp').attr('data-key')
        let text_box = $(this).parents('.text-box[data-key="'+chat_id+'"]')
         if(validation(text_box,'Editable')){
            hide_show_icons(chat_id)
        }

    }
)
    //delete
    //assign delete function for new chat row
    $('.temp[data-key="'+chat_id+'"] .delete-icon i').click(
    function () {
        debugger
        let chat_id = $(this).parents('.temp').attr('data-key')
        let text_box = $(this).parents('.text-box[data-key="'+chat_id+'"]')
         if(validation(text_box,'Deletable')){
            delete_chat(chat_id)
        }


    }
)
    //submit edit ---> assign it for new chat
    $('.temp[data-key="'+chat_id+'"] .save-edit-icon i').click(
    function () {
        debugger
        let chat_id = $(this).parents('.temp').attr('data-key')
        let new_chat_text = $(this).parents('.text-box').find('.edit-chat').val()
        update_chat(chat_id,new_chat_text)


    }
)
    //cancel edit ---> assign it for new chat
    $('.temp[data-key="'+chat_id+'"]  .cancel-edit-icon i').click(
    function () {
        let chat_id = $(this).parents('.temp').attr('data-key')
        hide_show_icons_after(chat_id)

    }
)



}
//********************************************* add new chat row (end) ********************************************
$(document).ready(function () {

    $('.part .chat-date').persianDatepicker({format: 'YYYY-MM-DD'})
    let text_count = $('.chat-box .text-box').length
    $('.chat-box').animate({scrollTop: text_count * 80}, text_count * 160, "linear")
});

function scroll_height(page) {
    let y = page.scrollHeight()



}
// for create new chat
 $('form[name="add_new_chat"] .save').click(
     function () {
         debugger
        let form=$(this).parents('form')
        if(validation(form,'new_chat')){
            let data = form.serializeArray()
            let url = '/SalesManagement/CorpIssue/insert-chat/'
            RunAjax(url, 'POST', data,
                function (data) {
                            debugger
                            // we need some actions after create new object successfully
                            let chat_id = data.new_chat_id
                            let chat_date = data.chat_date
                            form.find('button[type="rest"]').click() // rest input boxs
                             add_row(form,chat_id,chat_date) // add new row without refresh page
                            let text_count = $('.chat-box .text-box').length
                            $('.chat-box').scrollTop(text_count*80) // scroll to the end of page
                            form.find('.chat-description').val('') // empty input to ready new chat text


                })

        }
    }
 )

// send button in conversation page
$('#send-all-new-chats').click(
    function () {
        debugger
        let current_state = $(this).parents('form').find('input[name="issue_detail_state"]').val()
        let current_user =$(this).parents('form').find('input[name="user_name"]').val()
        let corp_issue_id =  $(this).parents('form').find('input[name="corp_item_id"]').val()
        let issue_detail_id = $(this).parents('form').find('input[name="corp_item_detail_id"]').val()
        let data={'current_state':current_state,'current_user':current_user,'corp_issue_id':corp_issue_id}
        let url = "/SalesManagement/CorpIssue/send-chat/"+issue_detail_id+"/"
        RunAjax(url, "POST", data,
            function (data) {
                debugger
                // after any send should update sate value
                let new_state = data.new_state
                $('form').find('input[name="issue_detail_state"]').val(new_state)
                alert("با موفقیت ارسال شد ")
            })
    }
)

// finish button in conversation page
$(".finish button").click(
    function () {
        debugger
        let form = $(this).parents('form')
        let current_state = $(this).parents('form').find('input[name="issue_detail_state"]').val()
        let current_user_type = $(this).parents('form').find('input[name="user_type"]').val()
        let current_user = $(this).parents('form').find('input[name="user_name"]').val()
        let corp_issue_id = $(this).parents('form').find('input[name="corp_item_id"]').val()
        let issue_detail_id = $(this).parents('form').find('input[name="corp_item_detail_id"]').val()
        let data={'current_state':current_state,'current_user_type':current_user_type,'current_user':current_user,'corp_issue_id':corp_issue_id}
        let url = "/SalesManagement/CorpIssue/finish/"+issue_detail_id+"/"
        if(validation(form,'finish')){
            RunAjax(url, "POST", data,
                function() {
                    $.alert({
                        title:'خاتمه موفقیت آمیز',
                        content:"فرایند با موفقیت خاتمه یافت",
                        rtl: true,
                        closeIcon: true,
                        buttons: {
                            confirm: {
                                text: 'بستن',
                                btnClass: 'btn-blue',
                                action: function() {
                                    window.location.href = "/SalesManagement/CorpIssue/"
                                }
                            },
                        },
                });
                }
            )

        }


    }
)
// close button in conversation page
$('.cancel-chat button').click(
   function () {
       debugger
        window.close()
   }
)

/******************************************** CorpIssueConversation js end *********************************/
