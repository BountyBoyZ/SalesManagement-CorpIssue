function add_row(form, form_type, data)
{
    let detail_table = form.parent().find('.detail-table')
    let user_name =$('input[name="current_user"]').val()
    let new_row = ''
    switch (form_type)
    {
        case 'conversation':
            let text = form.find('[name="conversation_text"]').val()
            new_row = '<div class="conversation-row col-12 detail-row">' +
                '                    <div class="photo col-1">' +
                '                        <img src="http://192.168.20.81:23000/media_hr/HR/PersonalPhoto/'+user_name+'.jpg" ' +
                'alt="'+user_name+'" class="person-photo">' +
                '                    </div>' +
                '                    <div class="text col-9">' +
                                      text  +
                '                    </div>' +
                '                    <div class="operation col-2">' +
                '                        <i class="fa edit fa-pencil-alt icon" title="ویرایش" ></i>' +
                '                        <i class="fa delete fa-trash-alt icon" title="حذف"></i>' +
                '                    </div>' +
                '                </div>'
            break
        case 'worktime':
            break

    }
    detail_table.append(new_row)
}