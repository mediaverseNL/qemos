    //SADASD
    var url = "/staff/product";

    var successMsg =  '<div class="alert alert-success">';
        successMsg += ' <strong>Gelukt!</strong> Het is opgeslagen.';
        successMsg += '</div>';

    function createAutoClosingAlert(selector, delay) {
        var alert = $(selector).alert();
        window.setTimeout(function() { alert.alert('close') }, delay);
    }

    // $('input[type=checkbox]').attr('checked', false);

    //display modal form for task editing
    $('#tasks-list').on("click", ".open-modal", function(){
        // console.log('asda');
        $('div.has-error').removeClass('has-error');

        var row_id = $(this).val();

        // reset all checkboxes on form

        $.get(url + '/' + row_id, function (data) {
            //success data
            // console.log(data.bezonderheden);
            $('.ingredients').find('input[type=checkbox]').prop('checked', false);
            $('.peculiarity').find('input[type=checkbox]').prop('checked', false);

            $('#row_id').val(data.id);
            $('#bereidingsduur').val(data.bereidingsduur);
            $('#naam').val(data.naam).toString();
            $('#id').val(data.id);
            $('#status').val(data.status);
            $('#prijs').val(data.prijs);
            $('#beschrijving').val(data.beschrijving);
            $('#bezonderheden').val(data.bezonderheden);
            $('#menu').val(data.menu.id);
            // console.log(data.menu);

            $.each(data.product_ingredient, function(k, v) {
                $('.ingredienten' + v.ingredient_id).prop('checked', true);
            });

            $.each(data.product_peculiarity, function(k, v) {
                $('.peculiarity' + v.peculiarity_id).prop('checked', true);
            });

            $('#btn-save').val("update");

            $('#myModal').modal('show');
        })
    });

    //display modal form for creating new task
    $(document).on('click', '#btn-add', function(){
        $('div.has-error').removeClass('has-error');
        $('.error').html('');
        $('#btn-save').val("add");
        $('#frmTasks').trigger("reset");
        $('#myModal').modal('show');
    });

    //delete task and remove it from list
    $('#tasks-list').on('click', '.delete-task',function(){
        var row_id = $(this).val();
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });
        $.ajax({
            type: "DELETE",
            url: url + '/' + row_id,
            success: function (data) {
                $("#successMsg").html( successMsg ); //appending to a <div id="form-errors"></div> inside form
                // console.log(successMsg);
                $("#task" + row_id).remove();

                createAutoClosingAlert('.alert', 1500);

            },
            error: function (data) {
                //show them somewhere in the markup
                //e.g

                // var errors = $.parseJSON(data.responseText);

                // console.log(errors);

                // console.log('Error:', data);
            }
        });
    });

    //create new task / update existing task
    $("#btn-save").on('click', function (e) {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
            }
        });

        e.preventDefault();

        var ingredients = [];
        $('.ingre:checked').each(function(i){
            ingredients[i] = $(this).val();
        });

        var peculiarity = [];
        $('.pecu:checked').each(function(i){
            peculiarity[i] = $(this).val();
        });

        var formData = {
            bereidingsduur: parseInt($('#bereidingsduur').val()),
            naam : $('#naam').val(),
            status : $('#status').val(),
            id : parseInt($('#id').val()),
            prijs : $('#prijs').val(),
            beschrijving : $('#beschrijving').val(),
            // bezonderheden : $('#bezonderheden').val(),
            ingredients : ingredients,
            peculiarity : peculiarity,
            menu : parseInt($('#menu').val())
            // image : $('#image')[0].files[0]
        };

        console.log(formData);

        //used to determine the http verb to use [add=POST], [update=PUT]
        var state = $('#btn-save').val();

        var type = "POST"; //for creating new resource
        var row_id = $('#row_id').val();
        var my_url = url;

        if (state == "update"){
            type = "PATCH"; //for updating existing resource
            my_url += '/' + row_id;
        }
        $.ajax({
            type: type,
            url: my_url,
            data: formData,
            dataType: 'json',
            cache : false,
            success: function (data, textStatus, jqXHR) {
                console.log(data, textStatus, jqXHR);
                $("#successMsg").html( successMsg );

                var task = '<tr id="task' + data.id + '">' +
                    // '<td>' + data.id + '</td>' +
                    '<td>' + data.naam + '</td>' +
                    '<td>' + data.bereidingsduur + ' min</td>' +
                    '<td>' + data.menu.naam + '</td>' +
                    '<td>€ ' + data.prijs + '</td>' +
                    '<td id="task-controls">' +
                        '<button class="btn btn-warning btn-xs btn-detail open-modal" value="' + data.id + '" style="margin-right: 4px;">' +
                            '<i class="fa fa-pencil" aria-hidden="true" title="wijzigen"></i>' +
                        '</button>' +
                        '<button class="btn btn-danger btn-xs btn-delete delete-task" value="' + data.id + '">' +
                            '<i class="fa fa-trash" aria-hidden="true" title="verwijderen"></i>' +
                        '</button>' +
                    '</td>' +
                '</tr>';

                if (state == "add"){ //if user added a new record
                    $('#tasks-list').append(task);
                }else{ //if user updated an existing record
                    $("#task" + row_id).replaceWith( task );
                }
                // $('#frmTasks').trigger("reset");
                $('#myModal').modal('hide');

                createAutoClosingAlert('.alert', 1500);
            },
            error: function (data, textStatus, jqXHR) {
                $('.error').html('');
                $('div.has-error').removeClass('has-error');
                $.each( data.responseJSON, function( key, value ) {
                    errorsHtml = '<li>' + value[0] + '</li>'; //showing only the first error.
                    inputErrorsHtml = '<small class="text-muted">' + errorsHtml + '</small>'; //showing only the first error.

                    $('div.error-' + key).addClass('has-error');
                    $('#error-' + key).html(inputErrorsHtml);
                    console.log(key, value);
                });
                // console.log('Error:', data);
            }
            // cache: false,
        });
    });
// });
// </script>